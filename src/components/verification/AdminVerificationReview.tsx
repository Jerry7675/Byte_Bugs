'use client';

import { useState, useEffect } from 'react';
import { getPendingVerifications, reviewVerificationStage, type VerificationStageData } from '@/client/api/verification-api';
import { toast } from 'sonner';

export function AdminVerificationReview() {
  const [pendingVerifications, setPendingVerifications] = useState<VerificationStageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<VerificationStageData | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPendingVerifications = async () => {
    setLoading(true);
    try {
      const response = await getPendingVerifications();
      if (response.success) {
        setPendingVerifications(response.data);
      } else {
        toast.error('Failed to fetch pending verifications');
      }
    } catch (error) {
      toast.error('Error loading verifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const handleReview = async (stageId: string, status: 'APPROVED' | 'REJECTED') => {
    if (!reviewNote.trim() && status === 'REJECTED') {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setSubmitting(true);
    try {
      const response = await reviewVerificationStage({
        stageId,
        status,
        reviewNote: reviewNote.trim() || undefined,
      });

      if (response.success) {
        toast.success(`Verification ${status.toLowerCase()} successfully`);
        setSelectedVerification(null);
        setReviewNote('');
        fetchPendingVerifications();
      } else {
        toast.error(response.error || 'Failed to review verification');
      }
    } catch (error) {
      toast.error('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      IN_REVIEW: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Review' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      IDENTITY: { bg: 'bg-purple-100', text: 'text-purple-800' },
      ROLE: { bg: 'bg-blue-100', text: 'text-blue-800' },
      ACTIVITY: { bg: 'bg-green-100', text: 'text-green-800' },
      COMMUNITY: { bg: 'bg-orange-100', text: 'text-orange-800' },
    };
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.IDENTITY;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {type}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pending Verifications</h2>
        <p className="text-gray-600 mb-6">Review and approve/reject user verification requests</p>

        {pendingVerifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">No pending verifications</p>
            <button
              onClick={fetchPendingVerifications}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingVerifications.map((verification) => (
              <div
                key={verification.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getTypeBadge(verification.type)}
                    {getStatusBadge(verification.status)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(verification.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">User ID:</span> {verification.userId}
                  </p>
                </div>

                {/* Metadata Display */}
                <div className="bg-gray-50 rounded p-3 mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Submitted Information:</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    {verification.metadata && typeof verification.metadata === 'object' && (
                      <>
                        {Object.entries(verification.metadata).map(([key, value]) => {
                          if (Array.isArray(value)) {
                            return (
                              <div key={key}>
                                <span className="font-medium">{key}:</span>
                                <ul className="ml-4 list-disc">
                                  {value.map((item, idx) => (
                                    <li key={idx}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
                                  ))}
                                </ul>
                              </div>
                            );
                          }
                          return (
                            <div key={key}>
                              <span className="font-medium">{key}:</span> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>

                {selectedVerification?.id === verification.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review Note {verification.type === 'ROLE' && '(Required for rejection)'}
                      </label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder="Enter your review comments..."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReview(verification.id, 'APPROVED')}
                        disabled={submitting}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {submitting ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReview(verification.id, 'REJECTED')}
                        disabled={submitting}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {submitting ? 'Processing...' : 'Reject'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVerification(null);
                          setReviewNote('');
                        }}
                        disabled={submitting}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedVerification(verification)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Review This Verification
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
