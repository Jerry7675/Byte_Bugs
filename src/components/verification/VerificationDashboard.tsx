/**
 * Example Verification Dashboard Component
 *
 * This demonstrates how to use the verification system in your UI
 */

'use client';

import {
  useVerificationSummary,
  useActivityMetrics,
  useCommunityMetrics,
} from '@/client/hooks/useVerification';
import { useRouter } from 'next/navigation';
import { CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';

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
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Get Verified
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {summary?.isFullyVerified ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✓ Fully Verified - You have completed all verification stages!
          </div>
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Verification in progress - Complete all stages to get fully verified
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Identity Verification */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Identity Verification</h3>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                summary?.identity?.status === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : summary?.identity?.status === 'PENDING' ||
                      summary?.identity?.status === 'IN_REVIEW'
                    ? 'bg-yellow-100 text-yellow-800'
                    : summary?.identity?.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
              }`}
            >
              {summary?.identity?.status || 'Not Started'}
            </div>
            {!summary?.identity && (
              <p className="text-sm text-gray-600 mt-2">
                Submit your identity documents to get verified
              </p>
            )}
          </div>

          {/* Role Verification */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Role Verification</h3>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                summary?.role?.status === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : summary?.role?.status === 'PENDING' || summary?.role?.status === 'IN_REVIEW'
                    ? 'bg-yellow-100 text-yellow-800'
                    : summary?.role?.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
              }`}
            >
              {summary?.role?.status || 'Not Started'}
            </div>
            {!summary?.role && (
              <p className="text-sm text-gray-600 mt-2">
                Submit role-specific documents to get verified
              </p>
            )}
          </div>

          {/* Activity Verification */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Activity Verification</h3>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                summary?.activity?.status === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {summary?.activity?.status || 'Not Earned'}
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Activity Score</span>
                <span className="font-semibold">
                  {(summary?.activityScore ?? 0).toFixed(0)}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${summary?.activityScore ?? 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {(summary?.activityScore ?? 0) >= 50
                  ? 'Keep up the great work!'
                  : `${(50 - (summary?.activityScore ?? 0)).toFixed(0)} points to unlock`}
              </p>
            </div>
          </div>

          {/* Community Verification */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Community Verification</h3>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                summary?.community?.status === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {summary?.community?.status || 'Not Earned'}
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Trust Score</span>
                <span className="font-semibold">{(summary?.trustScore ?? 0).toFixed(0)}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${summary?.trustScore ?? 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {(summary?.trustScore ?? 0) >= 60
                  ? 'Excellent community trust!'
                  : `${(60 - (summary?.trustScore ?? 0)).toFixed(0)} points to unlock`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Activity Metrics</h2>
          <button
            onClick={recalculateActivity}
            disabled={recalcActivityLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {recalcActivityLoading ? 'Recalculating...' : 'Recalculate'}
          </button>
        </div>

        {activityMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {activityMetrics.conversationsStarted}
              </div>
              <div className="text-sm text-gray-600">Conversations Started</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {activityMetrics.messagesExchanged}
              </div>
              <div className="text-sm text-gray-600">Messages Sent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {activityMetrics.postsCreated}
              </div>
              <div className="text-sm text-gray-600">Posts Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {activityMetrics.reviewsGiven}
              </div>
              <div className="text-sm text-gray-600">Reviews Given</div>
            </div>
          </div>
        )}
      </div>

      {/* Community Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Community Metrics</h2>
          <button
            onClick={recalculateTrust}
            disabled={recalcTrustLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {recalcTrustLoading ? 'Recalculating...' : 'Recalculate'}
          </button>
        </div>

        {communityMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {communityMetrics.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {communityMetrics.totalReviews}
              </div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {communityMetrics.responseRate.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {communityMetrics.endorsementCount}
              </div>
              <div className="text-sm text-gray-600">Endorsements</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
