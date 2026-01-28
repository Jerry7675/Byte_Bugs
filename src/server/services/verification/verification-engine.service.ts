/**
 * Multi-Stage Verification Engine
 *
 * Provides centralized verification logic for all verification types:
 * - IDENTITY: Document-based identity verification
 * - ROLE: Role-specific verification (Investor/Startup)
 * - ACTIVITY: Automated activity-based verification
 * - COMMUNITY: Community trust-based verification
 */

import { getContext } from '@/context/context-store';
import { PrismaEnums } from '@/enumWrapper';
import type { Prisma } from '@/lib/prisma.type';

export type VerificationType = 'IDENTITY' | 'ROLE' | 'ACTIVITY' | 'COMMUNITY';
export type VerificationStageStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';

interface SubmitVerificationParams {
  type: VerificationType;
  metadata: Record<string, any>;
}

interface ReviewVerificationParams {
  stageId: string;
  status: 'APPROVED' | 'REJECTED';
  reviewNote?: string;
}

export class VerificationEngineService {
  /**
   * Submit a verification stage
   * Can be called by user (for IDENTITY, ROLE) or system (for ACTIVITY, COMMUNITY)
   */
  static async submitVerificationStage(params: SubmitVerificationParams) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    const { type, metadata } = params;

    // Validate based on type
    this.validateVerificationMetadata(type, metadata, user.role);

    // Check if there's already an approved or pending verification of this type
    const existing = await prisma.verificationStage.findFirst({
      where: {
        userId: user.id,
        type: type as any,
        status: {
          in: [
            PrismaEnums.VerificationStageStatus.PENDING,
            PrismaEnums.VerificationStageStatus.IN_REVIEW,
            PrismaEnums.VerificationStageStatus.APPROVED,
          ],
        },
      },
    });

    if (existing && existing.status === PrismaEnums.VerificationStageStatus.APPROVED) {
      throw new Error(`You already have an approved ${type} verification`);
    }

    if (
      existing &&
      (existing.status === PrismaEnums.VerificationStageStatus.PENDING ||
        existing.status === PrismaEnums.VerificationStageStatus.IN_REVIEW)
    ) {
      throw new Error(`You already have a pending ${type} verification`);
    }

    // Create the verification stage
    return prisma.verificationStage.create({
      data: {
        userId: user.id,
        type: type as any,
        status: PrismaEnums.VerificationStageStatus.PENDING,
        metadata: metadata as Prisma.InputJsonValue,
        submittedBy: PrismaEnums.VerificationActor.USER,
      },
    });
  }

  /**
   * Get all verification stages for the current user
   */
  static async getMyVerificationStages() {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    return prisma.verificationStage.findMany({
      where: { userId: user.id },
      orderBy: [{ type: 'asc' }, { createdAt: 'desc' }],
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get verification summary for the current user
   */
  static async getVerificationSummary() {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    const stages = await prisma.verificationStage.findMany({
      where: {
        userId: user.id,
        status: PrismaEnums.VerificationStageStatus.APPROVED,
      },
      select: {
        type: true,
        status: true,
        reviewedAt: true,
      },
    });

    // Get metrics
    const activityMetric = await prisma.activityMetric.findUnique({
      where: { userId: user.id },
    });

    const communityMetric = await prisma.communityMetric.findUnique({
      where: { userId: user.id },
    });

    return {
      identity: stages.find((s) => s.type === 'IDENTITY') || null,
      role: stages.find((s) => s.type === 'ROLE') || null,
      activity: stages.find((s) => s.type === 'ACTIVITY') || null,
      community: stages.find((s) => s.type === 'COMMUNITY') || null,
      activityScore: activityMetric?.activityScore || 0,
      trustScore: communityMetric?.trustScore || 0,
      isFullyVerified: stages.length === 4,
    };
  }

  /**
   * Admin: Review a verification stage
   */
  static async reviewVerificationStage(params: ReviewVerificationParams) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    // Only admins can review
    if (user.role !== PrismaEnums.UserRole.ADMIN) {
      throw new Error('Only admins can review verification stages');
    }

    const { stageId, status, reviewNote } = params;

    const stage = await prisma.verificationStage.findUnique({
      where: { id: stageId },
    });

    if (!stage) throw new Error('Verification stage not found');

    if (stage.status === PrismaEnums.VerificationStageStatus.APPROVED) {
      throw new Error('This verification has already been approved');
    }

    return prisma.verificationStage.update({
      where: { id: stageId },
      data: {
        status:
          status === 'APPROVED'
            ? PrismaEnums.VerificationStageStatus.APPROVED
            : PrismaEnums.VerificationStageStatus.REJECTED,
        reviewedBy: PrismaEnums.VerificationActor.ADMIN,
        reviewerId: user.id,
        reviewNote,
        reviewedAt: new Date(),
      },
    });
  }

  /**
   * Admin: Get all pending verification stages
   */
  static async getPendingVerifications() {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    if (user.role !== PrismaEnums.UserRole.ADMIN) {
      throw new Error('Only admins can view pending verifications');
    }

    return prisma.verificationStage.findMany({
      where: {
        status: {
          in: [
            PrismaEnums.VerificationStageStatus.PENDING,
            PrismaEnums.VerificationStageStatus.IN_REVIEW,
          ],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { submittedAt: 'asc' },
    });
  }

  /**
   * Validate metadata based on verification type and user role
   */
  private static validateVerificationMetadata(
    type: VerificationType,
    metadata: Record<string, any>,
    userRole: string,
  ) {
    switch (type) {
      case 'IDENTITY':
        if (!metadata.documentType || !metadata.documentUrls) {
          throw new Error('Identity verification requires documentType and documentUrls');
        }
        break;

      case 'ROLE':
        if (userRole === 'INVESTOR') {
          // Investor-specific validation
          if (!metadata.proofType) {
            throw new Error('Role verification for investors requires proofType');
          }
          // Could require: proof of funds, accreditation, portfolio
        } else if (userRole === 'STARTUP') {
          // Startup-specific validation
          if (!metadata.incorporationProof && !metadata.registrationProof) {
            throw new Error(
              'Role verification for startups requires incorporation or registration proof',
            );
          }
          // Could require: incorporation docs, pitch deck, business registration
        }
        break;

      case 'ACTIVITY':
        // Activity verification is system-generated, but we allow manual submission with score
        if (metadata.score === undefined) {
          throw new Error('Activity verification requires a score');
        }
        break;

      case 'COMMUNITY':
        // Community verification is system-generated
        if (metadata.trustScore === undefined) {
          throw new Error('Community verification requires a trustScore');
        }
        break;

      default:
        throw new Error(`Unknown verification type: ${type}`);
    }
  }
}
