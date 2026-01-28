/**
 * Funding Agreement Detail View
 *
 * Shows full details of a funding agreement and allows acceptance/rejection
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FundingAgreementDetailProps {
  agreementId: string;
  currentUserId: string;
}

export default function FundingAgreementDetail({
  agreementId,
  currentUserId,
}: FundingAgreementDetailProps) {
  const router = useRouter();
  const [agreement, setAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    fetchAgreement();
  }, [agreementId]);

  const fetchAgreement = async () => {
    try {
      const response = await fetch(`/api/funding-agreements/${agreementId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch agreement');
      }

      setAgreement(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch agreement');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!acceptTerms) {
      setError('You must accept the terms and policies to proceed');
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/funding-agreements/${agreementId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ acceptTerms: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept agreement');
      }

      // Refresh the agreement
      await fetchAgreement();
      setAcceptTerms(false);

      // Show success message
      alert(data.message || 'Agreement accepted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to accept agreement');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/funding-agreements/${agreementId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject agreement');
      }

      // Refresh the agreement
      await fetchAgreement();
      setShowRejectForm(false);
      setRejectionReason('');
    } catch (err: any) {
      setError(err.message || 'Failed to reject agreement');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this agreement?')) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/funding-agreements/${agreementId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Cancelled by initiator' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel agreement');
      }

      // Refresh the agreement
      await fetchAgreement();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel agreement');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error && !agreement) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-6 md:p-8 border border-red-200">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!agreement) {
    return null;
  }

  const isInitiator = agreement.initiatorId === currentUserId;
  const isCounterparty = agreement.counterpartyId === currentUserId;
  const canAccept =
    isCounterparty &&
    (agreement.status === 'PENDING_INVESTOR' || agreement.status === 'PENDING_STARTUP');
  const canReject =
    (isInitiator || isCounterparty) &&
    (agreement.status === 'PENDING_INVESTOR' ||
      agreement.status === 'PENDING_STARTUP' ||
      agreement.status === 'ACCEPTED');
  const canCancel =
    isInitiator &&
    (agreement.status === 'PENDING_INVESTOR' || agreement.status === 'PENDING_STARTUP');

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      PENDING_INVESTOR: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Investor' },
      PENDING_STARTUP: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Startup' },
      ACCEPTED: { color: 'bg-blue-100 text-blue-800', text: 'Accepted' },
      REJECTED: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      CANCELLED: { color: 'bg-gray-100 text-gray-800', text: 'Cancelled' },
      COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Completed' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 md:p-8 border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Funding Agreement</h2>
          <p className="text-sm text-gray-500">Agreement ID: {agreement.id}</p>
        </div>
        {getStatusBadge(agreement.status)}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {agreement.status === 'COMPLETED' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ This agreement has been successfully completed and a funding record has been created!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Initiator</h3>
          <p className="text-lg font-medium text-gray-900">
            {agreement.initiator.firstName} {agreement.initiator.lastName}
          </p>
          <p className="text-sm text-gray-600">{agreement.initiator.role}</p>
          {agreement.termsAcceptedByInitiator && (
            <p className="text-xs text-green-600 mt-2">
              ✓ Accepted on {formatDate(agreement.initiatorAcceptedAt)}
            </p>
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Counterparty</h3>
          <p className="text-lg font-medium text-gray-900">
            {agreement.counterparty.firstName} {agreement.counterparty.lastName}
          </p>
          <p className="text-sm text-gray-600">{agreement.counterparty.role}</p>
          {agreement.termsAcceptedByCounterparty && (
            <p className="text-xs text-green-600 mt-2">
              ✓ Accepted on {formatDate(agreement.counterpartyAcceptedAt)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Category</span>
          <span className="font-medium text-gray-900">{agreement.category.replace(/_/g, ' ')}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Funding Amount</span>
          <span className="font-bold text-xl text-gray-900">
            {formatCurrency(agreement.fundingAmount)}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Platform Commission (5%)</span>
          <span className="font-medium text-red-600">
            -{formatCurrency(agreement.platformCommission)}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Net Amount</span>
          <span className="font-bold text-xl text-green-600">
            {formatCurrency(agreement.netAmount)}
          </span>
        </div>

        <div className="flex justify-between items-center py-3">
          <span className="text-gray-600">Created</span>
          <span className="text-gray-900">{formatDate(agreement.createdAt)}</span>
        </div>

        {agreement.completedAt && (
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">Completed</span>
            <span className="text-gray-900">{formatDate(agreement.completedAt)}</span>
          </div>
        )}
      </div>

      {canAccept && !showRejectForm && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Accept Agreement</h3>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4 max-h-48 overflow-y-auto">
            <p className="text-sm text-gray-700 mb-3">
              <strong>Platform Terms & Conditions ({agreement.termsVersion})</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>All funding agreements are legally binding between parties</li>
              <li>A 5% platform commission will be deducted from the funding amount</li>
              <li>Both parties must explicitly accept these terms to finalize the agreement</li>
              <li>Successful funding records are immutable and permanent</li>
            </ul>
          </div>

          <div className="flex items-start space-x-3 mb-6">
            <input
              type="checkbox"
              id="acceptTermsCheckbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="acceptTermsCheckbox" className="text-sm text-gray-700">
              I have read and agree to the platform terms and policies
            </label>
          </div>

          <button
            onClick={handleAccept}
            disabled={!acceptTerms || actionLoading}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading ? 'Processing...' : 'Accept Agreement'}
          </button>
        </div>
      )}

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Back
        </button>

        <div className="flex space-x-4">
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
            >
              Cancel Agreement
            </button>
          )}

          {canReject && !showRejectForm && (
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={actionLoading}
              className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
            >
              Reject
            </button>
          )}
        </div>
      </div>

      {showRejectForm && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-red-900">Reject Agreement</h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Reason for rejection (optional)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowRejectForm(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
