/**
 * Message Quota Display Component
 * Shows daily quota status
 */

'use client';

import { useQuotaStatus } from '@/client/hooks/useMessaging';
import { MessageCircle, Coins } from 'lucide-react';
import { type QuotaStatus } from '@/client/api/messaging-api';

interface QuotaDisplayProps {
  quotaStatus?: QuotaStatus | null;
}

export function QuotaDisplay({ quotaStatus: externalQuota }: QuotaDisplayProps) {
  const { quota: internalQuota, loading } = useQuotaStatus();

  const quota = externalQuota || internalQuota;

  if (loading || !quota) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Daily Messages</p>
            <p className="text-xs text-gray-500">
              {quota.remainingFree} free messages remaining today
            </p>
          </div>
        </div>

        {quota.requiresPoints && (
          <div className="flex items-center gap-1 text-sm text-amber-600">
            <Coins className="w-4 h-4" />
            <span>{quota.pointsPerMessage} points/msg</span>
          </div>
        )}
      </div>

      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(quota.remainingFree / 20) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
