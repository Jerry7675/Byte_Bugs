import React from 'react';
import { Zap, Coins, RotateCcw } from 'lucide-react';

interface SwipeQuotaDisplayProps {
  quota: {
    swipesToday: number;
    remainingFree: number;
    dailyFreeLimit: number;
    requiresPoints: boolean;
    pointsPerSwipe: number;
    pointsPerUndo: number;
    canUndo: boolean;
    lastSkipTime?: Date | null;
  };
  onUndo?: () => void;
  undoLoading?: boolean;
}

export function SwipeQuotaDisplay({ quota, onUndo, undoLoading }: SwipeQuotaDisplayProps) {
  const percentageUsed = (quota.swipesToday / quota.dailyFreeLimit) * 100;

  // Check if undo window has expired (5 minutes)
  const isUndoExpired = quota.lastSkipTime
    ? new Date().getTime() - new Date(quota.lastSkipTime).getTime() > 5 * 60 * 1000
    : true;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Daily Swipes</p>
            <p className="text-xs text-gray-500">
              {quota.remainingFree} free swipes remaining today
            </p>
          </div>
        </div>

        {quota.canUndo && onUndo && !isUndoExpired && (
          <button
            onClick={onUndo}
            disabled={undoLoading}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={`Undo last skip (costs ${quota.pointsPerUndo} points)`}
          >
            <RotateCcw className="w-4 h-4" />
            Undo ({quota.pointsPerUndo}
            <Coins className="w-3 h-3 inline" />)
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all ${
            percentageUsed >= 100 ? 'bg-red-500' : 'bg-green-600'
          }`}
          style={{ width: `${Math.min(percentageUsed, 100)}%` }}
        />
      </div>

      {/* Points Info */}
      {quota.requiresPoints && (
        <div className="flex items-center gap-1 text-sm text-amber-600 mt-2">
          <Coins className="w-4 h-4" />
          <span>{quota.pointsPerSwipe} points per swipe after free limit</span>
        </div>
      )}
    </div>
  );
}
