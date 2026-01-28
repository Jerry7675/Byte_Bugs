/**
 * Client API for Verification System
 */

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
  try {
    const response = await fetch('/api/verification/stages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const result = await response.json();
    return result;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get all verification stages for current user
 */
export async function getMyVerificationStages() {
  try {
    const response = await fetch('/api/verification/stages', {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    return result as { success: boolean; data: VerificationStageData[] };
  } catch {
    return { success: false, data: [] } as { success: boolean; data: VerificationStageData[] };
  }
}

/**
 * Get verification summary
 */
export async function getVerificationSummary() {
  try {
    const response = await fetch('/api/verification/stages?action=summary', {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    return result as { success: boolean; data: VerificationSummary };
  } catch {
    return { success: false, data: null } as any;
  }
}

/**
 * Get activity metrics
 */
export async function getActivityMetrics() {
  try {
    const response = await fetch('/api/verification/stages?action=activity-metrics', {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    return result as { success: boolean; data: ActivityMetrics };
  } catch {
    return { success: false, data: null } as any;
  }
}

/**
 * Get community metrics
 */
export async function getCommunityMetrics() {
  try {
    const response = await fetch('/api/verification/stages?action=community-metrics', {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    return result as { success: boolean; data: CommunityMetrics };
  } catch {
    return { success: false, data: null } as any;
  }
}

/**
 * Recalculate activity score
 */
export async function recalculateActivityScore() {
  try {
    const response = await fetch('/api/verification/stages?action=recalculate-activity', {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    return result as { success: boolean; data: ActivityMetrics };
  } catch {
    return { success: false, data: null } as any;
  }
}

/**
 * Recalculate trust score
 */
export async function recalculateTrustScore() {
  try {
    const response = await fetch('/api/verification/stages?action=recalculate-trust', {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    return result as { success: boolean; data: CommunityMetrics };
  } catch {
    return { success: false, data: null } as any;
  }
}

/**
 * Admin: Review a verification stage
 */
export async function reviewVerificationStage(data: {
  stageId: string;
  status: 'APPROVED' | 'REJECTED';
  reviewNote?: string;
}) {
  try {
    const response = await fetch('/api/verification/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const result = await response.json();
    return result;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

/**
 * Admin: Get pending verifications
 */
export async function getPendingVerifications() {
  try {
    const response = await fetch('/api/verification/admin', {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    return result as { success: boolean; data: VerificationStageData[] };
  } catch {
    return { success: false, data: [] } as { success: boolean; data: VerificationStageData[] };
  }
}
