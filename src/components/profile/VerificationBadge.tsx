/**
 * Verification Badge Component
 * Shows verification status with visual indicator
 */

import { CheckCircle, Clock, XCircle, Shield, Award, TrendingUp, Users } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified: boolean;
  verifiedAt?: Date | null;
  size?: 'sm' | 'md' | 'lg';
  stages?: {
    identity?: { status: string; reviewedAt?: Date | null };
    role?: { status: string; reviewedAt?: Date | null };
    activity?: { status: string };
    community?: { status: string };
  };
}

export function VerificationBadge({
  isVerified,
  verifiedAt,
  size = 'md',
  stages,
}: VerificationBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Check if main two verifications (identity and role) are approved
  const identityApproved = stages?.identity?.status === 'APPROVED';
  const roleApproved = stages?.role?.status === 'APPROVED';
  const mainVerificationsComplete = identityApproved && roleApproved;

  // Don't show unverified badge if main verifications are complete
  if (!isVerified && !mainVerificationsComplete) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-700 font-medium ${sizeClasses[size]}`}
      >
        <Clock className={iconSizes[size]} />
        Unverified
      </span>
    );
  }

  // If main verifications are complete or user is verified, show verified badge
  if (isVerified || mainVerificationsComplete) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-green-100 text-green-800 font-medium ${sizeClasses[size]}`}
        title={verifiedAt ? `Verified on ${new Date(verifiedAt).toLocaleDateString()}` : 'Verified'}
      >
        <CheckCircle className={iconSizes[size]} />
        Verified
      </span>
    );
  }

  return null;
}

interface VerificationStagesBadgeProps {
  stages?: {
    identity?: { status: string; reviewedAt?: Date | null };
    role?: { status: string; reviewedAt?: Date | null };
    activity?: { status: string };
    community?: { status: string };
  };
}

export function VerificationStagesBadge({ stages }: VerificationStagesBadgeProps) {
  if (!stages) return null;

  const identityApproved = stages.identity?.status === 'APPROVED';
  const roleApproved = stages.role?.status === 'APPROVED';
  const activityApproved = stages.activity?.status === 'APPROVED';
  const communityApproved = stages.community?.status === 'APPROVED';

  // Don't show if main verifications aren't complete
  if (!identityApproved || !roleApproved) {
    return null;
  }

  const extraBadges = [];

  if (activityApproved) {
    extraBadges.push({
      key: 'activity',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      label: 'Active Member',
      color: 'bg-blue-100 text-blue-800',
      tooltip: 'Verified for consistent activity',
    });
  }

  if (communityApproved) {
    extraBadges.push({
      key: 'community',
      icon: <Users className="w-3.5 h-3.5" />,
      label: 'Community Champion',
      color: 'bg-purple-100 text-purple-800',
      tooltip: 'Verified for community contributions',
    });
  }

  // If no extra badges, don't show anything
  if (extraBadges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {extraBadges.map((badge) => (
        <span
          key={badge.key}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${badge.color}`}
          title={badge.tooltip}
        >
          {badge.icon}
          {badge.label}
        </span>
      ))}
    </div>
  );
}
