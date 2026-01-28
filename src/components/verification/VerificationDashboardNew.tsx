/**
 * Enhanced Verification Dashboard Component
 */

'use client';

import {
  useVerificationSummary,
  useActivityMetrics,
  useCommunityMetrics,
} from '@/client/hooks/useVerification';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';

export function VerificationDashboard() {
  const router = useRouter();
  const { summary, loading: summaryLoading, error: summaryError } = useVerificationSummary();
  const {
    metrics: activityMetrics,
    recalculate: recalculateActivity,
    recalculating: recalcActivityLoading,
  } = useActivityMetrics();
  const {
    metrics: communityMetrics,
    recalculate: recalculateTrust,
    recalculating: recalcTrustLoading,
  } = useCommunityMetrics();

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (summaryError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">Error: {summaryError}</p>
      </div>
    );
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING':
      case 'IN_REVIEW':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
      case 'IN_REVIEW':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-0">Verification Status</h2>
          {!summary?.identity && !summary?.role && (
            <button
              onClick={() => router.push('/verification/submit')}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
              Get Verified
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {summary?.isFullyVerified ? (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Fully Verified</p>
              <p className="text-sm text-green-700">You have completed all verification stages!</p>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-xl flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Verification in Progress</p>
              <p className="text-sm text-yellow-700">
                Complete all stages to unlock premium features
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Identity Verification */}
          <button
            onClick={() => router.push('/verification/submit?tab=identity')}
            className={`border-2 rounded-xl p-5 transition-all hover:shadow-md cursor-pointer text-left ${getStatusColor(summary?.identity?.status)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Identity</h3>
              {getStatusIcon(summary?.identity?.status)}
            </div>
            <div className="text-xs font-medium mb-2">
              {summary?.identity?.status || 'Not Started'}
            </div>
            {!summary?.identity && <p className="text-xs opacity-75 mt-2">Submit ID documents</p>}
            {summary?.identity && summary?.identity.status !== 'APPROVED' && (
              <p className="text-xs opacity-75 mt-2">Click to view/update</p>
            )}
          </button>

          {/* Role Verification */}
          <button
            onClick={() => router.push('/verification/submit?tab=role')}
            className={`border-2 rounded-xl p-5 transition-all hover:shadow-md cursor-pointer text-left ${getStatusColor(summary?.role?.status)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Role</h3>
              {getStatusIcon(summary?.role?.status)}
            </div>
            <div className="text-xs font-medium mb-2">{summary?.role?.status || 'Not Started'}</div>
            {!summary?.role && <p className="text-xs opacity-75 mt-2">Verify Investor/Startup</p>}
            {summary?.role && summary?.role.status !== 'APPROVED' && (
              <p className="text-xs opacity-75 mt-2">Click to view/update</p>
            )}
          </button>

          {/* Activity Verification */}
          <div
            className={`border-2 rounded-xl p-5 transition-all ${summary?.activity ? 'hover:shadow-md' : 'opacity-75'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Activity</h3>
              {getStatusIcon(summary?.activity?.status)}
            </div>
            <div className="text-xs font-medium mb-2">
              {summary?.activity?.status || 'Not Earned'}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="opacity-75">Score</span>
                <span className="font-semibold">
                  {(summary?.activityScore ?? 0).toFixed(0)}/100
                </span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${summary?.activityScore ?? 0}%` }}
                />
              </div>
            </div>
            {!summary?.activity && <p className="text-xs opacity-75 mt-2">Earned through engagement</p>}
          </div>

          {/* Community Verification */}
          <div
            className={`border-2 rounded-xl p-5 transition-all ${summary?.community ? 'hover:shadow-md' : 'opacity-75'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Community</h3>
              {getStatusIcon(summary?.community?.status)}
            </div>
            <div className="text-xs font-medium mb-2">
              {summary?.community?.status || 'Not Earned'}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="opacity-75">Trust</span>
                <span className="font-semibold">{(summary?.trustScore ?? 0).toFixed(0)}/100</span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-1.5">
                <div
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${summary?.trustScore ?? 0}%` }}
                />
              </div>
            </div>
            {!summary?.community && <p className="text-xs opacity-75 mt-2">Built through reviews</p>}
          </div>
        </div>
      </div>

      {/* Activity Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Activity Metrics</h2>
          </div>
          <button
            onClick={recalculateActivity}
            disabled={recalcActivityLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${recalcActivityLoading ? 'animate-spin' : ''}`} />
            {recalcActivityLoading ? 'Updating...' : 'Recalculate'}
          </button>
        </div>

        {activityMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">
                {activityMetrics.conversationsStarted}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Conversations</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">
                {activityMetrics.messagesExchanged}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Messages</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">
                {activityMetrics.postsCreated}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Posts</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">
                {activityMetrics.reviewsGiven}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Reviews</div>
            </div>
          </div>
        )}
      </div>

      {/* Community Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <Users className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Community Metrics</h2>
          </div>
          <button
            onClick={recalculateTrust}
            disabled={recalcTrustLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${recalcTrustLoading ? 'animate-spin' : ''}`} />
            {recalcTrustLoading ? 'Updating...' : 'Recalculate'}
          </button>
        </div>

        {communityMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">
                {communityMetrics.averageRating.toFixed(1)}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Avg Rating</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">
                {communityMetrics.totalReviews}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Reviews</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">
                {communityMetrics.responseRate.toFixed(0)}%
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Response Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">
                {communityMetrics.endorsementCount}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Endorsements</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
