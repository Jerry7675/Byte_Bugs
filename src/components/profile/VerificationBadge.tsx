/**
 * Verification Badge Component
 * Shows verification status with visual indicator
 */

import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified: boolean;
  verifiedAt?: Date | null;
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({ isVerified, verifiedAt, size = 'md' }: VerificationBadgeProps) {
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

  if (!isVerified) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-700 font-medium ${sizeClasses[size]}`}
      >
        <Clock className={iconSizes[size]} />
        Unverified
      </span>
    );
  }

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

  const approvedStages = Object.values(stages).filter((s) => s?.status === 'APPROVED').length;
  const totalStages = 4;

  const getColor = () => {
    if (approvedStages === totalStages) return 'bg-green-100 text-green-800';
    if (approvedStages >= 2) return 'bg-blue-100 text-blue-800';
    if (approvedStages >= 1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${getColor()}`}>
        {approvedStages === totalStages ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Fully Verified
          </>
        ) : (
          <>
            {approvedStages}/{totalStages} Stages Complete
          </>
        )}
      </span>
    </div>
  );
}
