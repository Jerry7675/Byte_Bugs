/**
 * Funding Agreement Service
 *
 * Handles all funding agreement operations including:
 * - Creating funding agreements
 * - Calculating platform commission
 * - Accepting/rejecting agreements
 * - Finalizing agreements into successful funding records
 *
 * IMPORTANT: All financial calculations are server-side only.
 * Funding records are immutable once completed.
 */

import { getContext } from '@/context/context-store';
import { PrismaEnums } from '@/enumWrapper';
import type { FundingCategory, FundingAgreementStatus } from '@/lib/prisma.type';

// Platform configuration - should eventually come from env or DB
const PLATFORM_COMMISSION_RATE = 5.0; // 5% commission
const CURRENT_TERMS_VERSION = 'v1.0.0';

// Minimum verification level required for funding agreements
const REQUIRED_VERIFICATION_TYPES = ['IDENTITY', 'ROLE'] as const;

export class FundingService {
  /**
   * Calculate platform commission and net amount
   * @private - internal use only, never expose raw calculation to client
   */
  private static calculateCommission(fundingAmount: number) {
    // Use precise calculations to avoid floating point errors
    const commission = Math.round(fundingAmount * PLATFORM_COMMISSION_RATE) / 100;
    const netAmount = fundingAmount - commission;

    return {
      platformCommission: commission,
      netAmount,
      platformCommissionRate: PLATFORM_COMMISSION_RATE,
    };
  }

  /**
   * Verify that a user has required verification stages approved
   * @private
   */
  private static async verifyUserEligibility(
    userId: string,
  ): Promise<{ eligible: boolean; reason?: string }> {
    const { prisma } = getContext();

    // Get user with role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        verificationStages: {
          where: {
            status: PrismaEnums.VerificationStageStatus.APPROVED,
          },
          select: {
            type: true,
          },
        },
      },
    });

    if (!user) {
      return { eligible: false, reason: 'User not found' };
    }

    // User must be either INVESTOR or STARTUP
    if (user.role !== PrismaEnums.UserRole.INVESTOR && user.role !== PrismaEnums.UserRole.STARTUP) {
      return {
        eligible: false,
        reason: 'Only investors and startups can participate in funding agreements',
      };
    }

    // Check if user has required verification stages
    const approvedTypes = user.verificationStages.map((stage) => stage.type);
    const hasIdentity = approvedTypes.includes(PrismaEnums.VerificationType.IDENTITY);
    const hasRole = approvedTypes.includes(PrismaEnums.VerificationType.ROLE);

    if (!hasIdentity || !hasRole) {
      return {
        eligible: false,
        reason:
          'User must have IDENTITY and ROLE verification approved to participate in funding agreements',
      };
    }

    return { eligible: true };
  }

  /**
   * Create a new funding agreement request
   *
   * @param params.counterpartyId - ID of the other party (investor or startup)
   * @param params.category - Type of funding (SEED, SERIES_A, etc.)
   * @param params.fundingAmount - Total funding amount (validated server-side)
   * @param params.acceptTerms - Must be true to proceed
   */
  static async createFundingAgreement(params: {
    counterpartyId: string;
    category: FundingCategory;
    fundingAmount: number;
    acceptTerms: boolean;
  }) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    const { counterpartyId, category, fundingAmount, acceptTerms } = params;

    // Validate terms acceptance
    if (!acceptTerms) {
      throw new Error('You must accept platform terms and policies to create a funding agreement');
    }

    // Validate funding amount
    if (!fundingAmount || fundingAmount <= 0) {
      throw new Error('Funding amount must be greater than 0');
    }

    // Prevent self-agreements
    if (user.id === counterpartyId) {
      throw new Error('Cannot create funding agreement with yourself');
    }

    // Verify initiator eligibility
    const initiatorEligibility = await this.verifyUserEligibility(user.id);
    if (!initiatorEligibility.eligible) {
      throw new Error(initiatorEligibility.reason || 'Initiator not eligible');
    }

    // Verify counterparty exists and eligibility
    const counterparty = await prisma.user.findUnique({
      where: { id: counterpartyId },
      select: { id: true, role: true },
    });

    if (!counterparty) {
      throw new Error('Counterparty not found');
    }

    const counterpartyEligibility = await this.verifyUserEligibility(counterpartyId);
    if (!counterpartyEligibility.eligible) {
      throw new Error(`Counterparty not eligible: ${counterpartyEligibility.reason}`);
    }

    // Ensure one is investor and one is startup
    if (user.role === counterparty.role) {
      throw new Error('Funding agreements must be between an investor and a startup');
    }

    // Calculate commission (server-side only)
    const { platformCommission, netAmount, platformCommissionRate } =
      this.calculateCommission(fundingAmount);

    // Determine initial status based on who initiates
    const isInitiatorInvestor = user.role === PrismaEnums.UserRole.INVESTOR;
    const initialStatus = isInitiatorInvestor
      ? PrismaEnums.FundingAgreementStatus.PENDING_STARTUP
      : PrismaEnums.FundingAgreementStatus.PENDING_INVESTOR;

    // Create agreement
    const agreement = await prisma.fundingAgreement.create({
      data: {
        initiatorId: user.id,
        counterpartyId,
        category: category as any,
        fundingAmount,
        platformCommissionRate,
        platformCommission,
        netAmount,
        termsVersion: CURRENT_TERMS_VERSION,
        termsAcceptedByInitiator: true,
        initiatorAcceptedAt: new Date(),
        status: initialStatus as any,
      },
      include: {
        initiator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        counterparty: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return agreement;
  }

  /**
   * Get all funding agreements for the current user
   */
  static async getMyFundingAgreements(filters?: {
    status?: FundingAgreementStatus;
    role?: 'initiator' | 'counterparty' | 'all';
  }) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    const { status, role = 'all' } = filters || {};

    const whereConditions: any = {
      AND: [],
    };

    // Filter by status if provided
    if (status) {
      whereConditions.AND.push({ status });
    }

    // Filter by role
    if (role === 'initiator') {
      whereConditions.AND.push({ initiatorId: user.id });
    } else if (role === 'counterparty') {
      whereConditions.AND.push({ counterpartyId: user.id });
    } else {
      // All agreements where user is involved
      whereConditions.OR = [{ initiatorId: user.id }, { counterpartyId: user.id }];
      delete whereConditions.AND;
    }

    const agreements = await prisma.fundingAgreement.findMany({
      where: whereConditions,
      include: {
        initiator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        counterparty: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return agreements;
  }

  /**
   * Get a specific funding agreement by ID
   */
  static async getFundingAgreement(agreementId: string) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    const agreement = await prisma.fundingAgreement.findUnique({
      where: { id: agreementId },
      include: {
        initiator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            email: true,
          },
        },
        counterparty: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            email: true,
          },
        },
      },
    });

    if (!agreement) {
      throw new Error('Funding agreement not found');
    }

    // Ensure user is a party to this agreement
    if (agreement.initiatorId !== user.id && agreement.counterpartyId !== user.id) {
      throw new Error('You are not authorized to view this agreement');
    }

    return agreement;
  }

  /**
   * Accept a funding agreement
   *
   * @param agreementId - ID of the agreement to accept
   * @param acceptTerms - Must be true to proceed
   */
  static async acceptFundingAgreement(params: { agreementId: string; acceptTerms: boolean }) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    const { agreementId, acceptTerms } = params;

    // Validate terms acceptance
    if (!acceptTerms) {
      throw new Error('You must accept platform terms and policies to proceed');
    }

    const agreement = await prisma.fundingAgreement.findUnique({
      where: { id: agreementId },
      include: {
        initiator: { select: { id: true, role: true } },
        counterparty: { select: { id: true, role: true } },
      },
    });

    if (!agreement) {
      throw new Error('Funding agreement not found');
    }

    // Verify user is the counterparty (not the initiator)
    if (agreement.counterpartyId !== user.id) {
      throw new Error('Only the counterparty can accept this agreement');
    }

    // Check if already accepted or in wrong status
    if (
      agreement.status === PrismaEnums.FundingAgreementStatus.ACCEPTED ||
      agreement.status === PrismaEnums.FundingAgreementStatus.COMPLETED
    ) {
      throw new Error('Agreement already accepted or completed');
    }

    if (
      agreement.status === PrismaEnums.FundingAgreementStatus.REJECTED ||
      agreement.status === PrismaEnums.FundingAgreementStatus.CANCELLED
    ) {
      throw new Error('Agreement has been rejected or cancelled');
    }

    // Use transaction to update agreement and create successful funding
    const result = await prisma.$transaction(async (tx) => {
      // Update agreement
      const updatedAgreement = await tx.fundingAgreement.update({
        where: { id: agreementId },
        data: {
          termsAcceptedByCounterparty: true,
          counterpartyAcceptedAt: new Date(),
          status: PrismaEnums.FundingAgreementStatus.ACCEPTED as any,
        },
      });

      // Check if both parties have accepted
      if (
        updatedAgreement.termsAcceptedByInitiator &&
        updatedAgreement.termsAcceptedByCounterparty
      ) {
        // Mark as completed
        const completedAgreement = await tx.fundingAgreement.update({
          where: { id: agreementId },
          data: {
            status: PrismaEnums.FundingAgreementStatus.COMPLETED as any,
            completedAt: new Date(),
          },
          include: {
            initiator: { select: { id: true, role: true } },
            counterparty: { select: { id: true, role: true } },
          },
        });

        // Determine who is investor and who is startup
        const investorId =
          completedAgreement.initiator.role === PrismaEnums.UserRole.INVESTOR
            ? completedAgreement.initiatorId
            : completedAgreement.counterpartyId;

        const startupId =
          completedAgreement.initiator.role === PrismaEnums.UserRole.STARTUP
            ? completedAgreement.initiatorId
            : completedAgreement.counterpartyId;

        // Create immutable successful funding record
        const successfulFunding = await tx.successfulFunding.create({
          data: {
            agreementId: completedAgreement.id,
            investorId,
            startupId,
            category: completedAgreement.category,
            fundingAmount: completedAgreement.fundingAmount,
            platformCommission: completedAgreement.platformCommission,
            netAmount: completedAgreement.netAmount,
            termsVersion: completedAgreement.termsVersion,
          },
        });

        return { agreement: completedAgreement, successfulFunding };
      }

      return { agreement: updatedAgreement, successfulFunding: null };
    });

    return result;
  }

  /**
   * Reject a funding agreement
   *
   * @param agreementId - ID of the agreement to reject
   * @param reason - Reason for rejection
   */
  static async rejectFundingAgreement(params: { agreementId: string; reason?: string }) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    const { agreementId, reason } = params;

    const agreement = await prisma.fundingAgreement.findUnique({
      where: { id: agreementId },
    });

    if (!agreement) {
      throw new Error('Funding agreement not found');
    }

    // Verify user is a party to this agreement
    if (agreement.initiatorId !== user.id && agreement.counterpartyId !== user.id) {
      throw new Error('You are not authorized to reject this agreement');
    }

    // Check if already in terminal state
    if (agreement.status === PrismaEnums.FundingAgreementStatus.COMPLETED) {
      throw new Error('Cannot reject a completed agreement');
    }

    if (agreement.status === PrismaEnums.FundingAgreementStatus.REJECTED) {
      throw new Error('Agreement already rejected');
    }

    if (agreement.status === PrismaEnums.FundingAgreementStatus.CANCELLED) {
      throw new Error('Agreement already cancelled');
    }

    // Update agreement
    const updatedAgreement = await prisma.fundingAgreement.update({
      where: { id: agreementId },
      data: {
        status: PrismaEnums.FundingAgreementStatus.REJECTED as any,
        rejectedBy: user.id,
        rejectionReason: reason || 'No reason provided',
      },
      include: {
        initiator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        counterparty: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return updatedAgreement;
  }

  /**
   * Cancel a funding agreement (initiator only, before counterparty accepts)
   *
   * @param agreementId - ID of the agreement to cancel
   * @param reason - Reason for cancellation
   */
  static async cancelFundingAgreement(params: { agreementId: string; reason?: string }) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    const { agreementId, reason } = params;

    const agreement = await prisma.fundingAgreement.findUnique({
      where: { id: agreementId },
    });

    if (!agreement) {
      throw new Error('Funding agreement not found');
    }

    // Only initiator can cancel
    if (agreement.initiatorId !== user.id) {
      throw new Error('Only the initiator can cancel this agreement');
    }

    // Check if already in terminal state
    if (
      agreement.status === PrismaEnums.FundingAgreementStatus.COMPLETED ||
      agreement.status === PrismaEnums.FundingAgreementStatus.ACCEPTED
    ) {
      throw new Error('Cannot cancel an accepted or completed agreement');
    }

    if (agreement.status === PrismaEnums.FundingAgreementStatus.REJECTED) {
      throw new Error('Agreement already rejected');
    }

    if (agreement.status === PrismaEnums.FundingAgreementStatus.CANCELLED) {
      throw new Error('Agreement already cancelled');
    }

    // Update agreement
    const updatedAgreement = await prisma.fundingAgreement.update({
      where: { id: agreementId },
      data: {
        status: PrismaEnums.FundingAgreementStatus.CANCELLED as any,
        cancelledBy: user.id,
        cancellationReason: reason || 'No reason provided',
      },
      include: {
        initiator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        counterparty: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return updatedAgreement;
  }

  /**
   * Get successful funding history for a user
   *
   * @param userId - ID of the user (optional, defaults to current user)
   */
  static async getSuccessfulFundings(userId?: string) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    const targetUserId = userId || user.id;

    // If requesting another user's data, ensure they have permission
    // For now, anyone can view funding history (public info)
    // Add additional checks here if needed

    const fundings = await prisma.successfulFunding.findMany({
      where: {
        OR: [{ investorId: targetUserId }, { startupId: targetUserId }],
      },
      include: {
        investor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        startup: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        agreement: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    return fundings;
  }

  /**
   * Get funding statistics for a user
   */
  static async getFundingStatistics(userId?: string) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    const targetUserId = userId || user.id;

    // Get user to determine role
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { role: true },
    });

    if (!targetUser) {
      throw new Error('User not found');
    }

    const isInvestor = targetUser.role === PrismaEnums.UserRole.INVESTOR;

    // Get successful fundings
    const successfulFundings = await prisma.successfulFunding.findMany({
      where: isInvestor ? { investorId: targetUserId } : { startupId: targetUserId },
    });

    // Calculate statistics
    const totalFundings = successfulFundings.length;
    const totalAmount = successfulFundings.reduce(
      (sum, funding) => sum + parseFloat(funding.fundingAmount.toString()),
      0,
    );
    const totalCommission = successfulFundings.reduce(
      (sum, funding) => sum + parseFloat(funding.platformCommission.toString()),
      0,
    );
    const totalNetAmount = successfulFundings.reduce(
      (sum, funding) => sum + parseFloat(funding.netAmount.toString()),
      0,
    );

    // Get pending agreements
    const pendingAgreements = await prisma.fundingAgreement.findMany({
      where: {
        OR: [{ initiatorId: targetUserId }, { counterpartyId: targetUserId }],
        status: {
          in: [
            PrismaEnums.FundingAgreementStatus.PENDING_INVESTOR,
            PrismaEnums.FundingAgreementStatus.PENDING_STARTUP,
            PrismaEnums.FundingAgreementStatus.ACCEPTED,
          ] as any[],
        },
      },
    });

    return {
      totalFundings,
      totalAmount,
      totalCommission,
      totalNetAmount,
      pendingAgreementsCount: pendingAgreements.length,
      averageFundingAmount: totalFundings > 0 ? totalAmount / totalFundings : 0,
    };
  }
}
