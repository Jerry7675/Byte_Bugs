/**
 * Client API for Verification System
 */

import axiosClient from '@/app/api/axiosClient';

export interface VerificationStageData {
  id: string;
  userId: string;
  type: 'IDENTITY' | 'ROLE' | 'ACTIVITY' | 'COMMUNITY';
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  metadata: Record<string, any>;
  submittedBy: string;
  reviewedBy?: string;
  reviewNote?: string;
  submittedAt: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationSummary {
  identity: VerificationStageData | null;
  role: VerificationStageData | null;
  activity: VerificationStageData | null;
  community: VerificationStageData | null;
  activityScore: number;
  trustScore: number;
  isFullyVerified: boolean;
}

export interface ActivityMetrics {
  id: string;
  userId: string;
  conversationsStarted: number;
  conversationsReceived: number;
  messagesExchanged: number;
  postsCreated: number;
  reviewsGiven: number;
  reviewsReceived: number;
  dealsInitiated: number;
  dealsCompleted: number;
  activityScore: number;
  lastCalculatedAt: string;
}

export interface CommunityMetrics {
  id: string;
  userId: string;
  averageRating: number;
  totalReviews: number;
  verifiedReviews: number;
  endorsementCount: number;
  endorsedByVerified: number;
  responseRate: number;
  averageResponseTime: number | null;
  trustScore: number;
  lastCalculatedAt: string;
}

/**
 * Submit a verification stage
 */
export async function submitVerificationStage(data: {
  type: 'IDENTITY' | 'ROLE' | 'ACTIVITY' | 'COMMUNITY';
  metadata: Record<string, any>;
}) {
  const response = await axiosClient.post('/api/verification/stages', data);
  return response.data;
}

/**
 * Get all verification stages for current user
 */
export async function getMyVerificationStages() {
  const response = await axiosClient.get('/api/verification/stages');
  return response.data as { success: boolean; data: VerificationStageData[] };
}

/**
 * Get verification summary
 */
export async function getVerificationSummary() {
  const response = await axiosClient.get('/api/verification/stages?action=summary');
  return response.data as { success: boolean; data: VerificationSummary };
}

/**
 * Get activity metrics
 */
export async function getActivityMetrics() {
  const response = await axiosClient.get('/api/verification/stages?action=activity-metrics');
  return response.data as { success: boolean; data: ActivityMetrics };
}

/**
 * Get community metrics
 */
export async function getCommunityMetrics() {
  const response = await axiosClient.get('/api/verification/stages?action=community-metrics');
  return response.data as { success: boolean; data: CommunityMetrics };
}

/**
 * Recalculate activity score
 */
export async function recalculateActivityScore() {
  const response = await axiosClient.get('/api/verification/stages?action=recalculate-activity');
  return response.data as { success: boolean; data: ActivityMetrics };
}

/**
 * Recalculate trust score
 */
export async function recalculateTrustScore() {
  const response = await axiosClient.get('/api/verification/stages?action=recalculate-trust');
  return response.data as { success: boolean; data: CommunityMetrics };
}

/**
 * Admin: Review a verification stage
 */
export async function reviewVerificationStage(data: {
  stageId: string;
  status: 'APPROVED' | 'REJECTED';
  reviewNote?: string;
}) {
  const response = await axiosClient.post('/api/verification/admin', data);
  return response.data;
}

/**
 * Admin: Get pending verifications
 */
export async function getPendingVerifications() {
  const response = await axiosClient.get('/api/verification/admin');
  return response.data as { success: boolean; data: VerificationStageData[] };
}
