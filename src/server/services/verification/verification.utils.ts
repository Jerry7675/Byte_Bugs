/**
 * Verification utilities and helpers
 */

import { PrismaEnums } from '@/enumWrapper';

export const VERIFICATION_THRESHOLDS = {
  ACTIVITY: {
    MIN_SCORE: 50,
    AUTO_APPROVE: 70,
  },
  COMMUNITY: {
    MIN_SCORE: 60,
    MIN_REVIEWS: 3,
    AUTO_APPROVE: 80,
  },
} as const;

export const VERIFICATION_TYPE_LABELS = {
  IDENTITY: 'Identity Verification',
  ROLE: 'Role Verification',
  ACTIVITY: 'Activity Verification',
  COMMUNITY: 'Community Verification',
} as const;

export const VERIFICATION_TYPE_DESCRIPTIONS = {
  IDENTITY: 'Verify your identity with official documents',
  ROLE: 'Verify your role as an Investor or Startup with supporting documents',
  ACTIVITY: 'Automatically earned through platform activity',
  COMMUNITY: 'Automatically earned through community trust and reviews',
} as const;

export const INVESTOR_ROLE_REQUIREMENTS = {
  proofTypes: ['proof_of_funds', 'accreditation', 'portfolio', 'tax_documents'],
  description: 'Investors must provide proof of funds, accreditation, or portfolio',
} as const;

export const STARTUP_ROLE_REQUIREMENTS = {
  proofTypes: [
    'incorporation_certificate',
    'business_registration',
    'pitch_deck',
    'gst_certificate',
  ],
  description: 'Startups must provide incorporation documents or business registration',
} as const;

/**
 * Check if a user has a specific verification type approved
 */
export function hasVerification(
  stages: Array<{ type: string; status: string }>,
  type: keyof typeof VERIFICATION_TYPE_LABELS,
): boolean {
  return stages.some((s) => s.type === type && s.status === 'APPROVED');
}

/**
 * Get verification progress percentage
 */
export function getVerificationProgress(stages: Array<{ type: string; status: string }>): number {
  const approved = stages.filter((s) => s.status === 'APPROVED').length;
  return (approved / 4) * 100;
}

/**
 * Get verification badge level based on approved stages
 */
export function getVerificationBadge(
  stages: Array<{ type: string; status: string }>,
): 'none' | 'basic' | 'verified' | 'trusted' | 'elite' {
  const approved = stages.filter((s) => s.status === 'APPROVED');

  if (approved.length === 0) return 'none';
  if (approved.length === 1) return 'basic';
  if (approved.length === 2) return 'verified';
  if (approved.length === 3) return 'trusted';
  return 'elite'; // All 4 verified
}

/**
 * Check if user can access a feature based on verification level
 */
export function canAccessFeature(
  requiredVerifications: Array<keyof typeof VERIFICATION_TYPE_LABELS>,
  userStages: Array<{ type: string; status: string }>,
): boolean {
  return requiredVerifications.every((required) => hasVerification(userStages, required));
}
