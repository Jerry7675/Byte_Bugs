/**
 * Verification Engine API
 *
 * Server actions for multi-stage verification
 */

import { VerificationEngineService } from '@/server/services/verification/verification-engine.service';
import { ActivityMetricsService } from '@/server/services/verification/activity-metrics.service';
import { CommunityMetricsService } from '@/server/services/verification/community-metrics.service';

/**
 * Submit a verification stage
 */
export async function submitVerificationStage(params: {
  type: 'IDENTITY' | 'ROLE' | 'ACTIVITY' | 'COMMUNITY';
  metadata: Record<string, any>;
}) {
  return await VerificationEngineService.submitVerificationStage(params);
}

/**
 * Get all verification stages for current user
 */
export async function getMyVerificationStages() {
  return await VerificationEngineService.getMyVerificationStages();
}

/**
 * Get verification summary for current user
 */
export async function getVerificationSummary() {
  return await VerificationEngineService.getVerificationSummary();
}

/**
 * Admin: Review a verification stage
 */
export async function reviewVerificationStage(params: {
  stageId: string;
  status: 'APPROVED' | 'REJECTED';
  reviewNote?: string;
}) {
  return await VerificationEngineService.reviewVerificationStage(params);
}

/**
 * Admin: Get all pending verification stages
 */
export async function getPendingVerifications() {
  return await VerificationEngineService.getPendingVerifications();
}

/**
 * Get activity metrics for current user
 */
export async function getMyActivityMetrics() {
  const { prisma, user } = await import('@/context/context-store').then((m) => m.getContext());
  if (!user) throw new Error('Not authenticated');
  return await ActivityMetricsService.getMetrics(user.id);
}

/**
 * Get community metrics for current user
 */
export async function getMyCommunityMetrics() {
  const { prisma, user } = await import('@/context/context-store').then((m) => m.getContext());
  if (!user) throw new Error('Not authenticated');
  return await CommunityMetricsService.getMetrics(user.id);
}

/**
 * Recalculate activity score for current user
 */
export async function recalculateMyActivityScore() {
  const { prisma, user } = await import('@/context/context-store').then((m) => m.getContext());
  if (!user) throw new Error('Not authenticated');
  return await ActivityMetricsService.recalculateActivityScore(user.id);
}

/**
 * Recalculate trust score for current user
 */
export async function recalculateMyTrustScore() {
  const { prisma, user } = await import('@/context/context-store').then((m) => m.getContext());
  if (!user) throw new Error('Not authenticated');
  return await CommunityMetricsService.recalculateTrustScore(user.id);
}
