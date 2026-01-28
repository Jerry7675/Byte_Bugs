/**
 * Funding Agreements List Component
 *
 * Shows all funding agreements for the current user
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FundingAgreementsList() {
  const router = useRouter();
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    try {
      const response = await fetch('/api/funding-agreements');
      const data = await response.json();

      if (response.ok) {
        setAgreements(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching agreements:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      PENDING_INVESTOR: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      PENDING_STARTUP: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      ACCEPTED: { color: 'bg-blue-100 text-blue-800', text: 'Accepted' },
      REJECTED: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      CANCELLED: { color: 'bg-gray-100 text-gray-800', text: 'Cancelled' },
      COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Completed' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
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
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredAgreements = agreements.filter((agreement) => {
    if (filter === 'pending') {
      return ['PENDING_INVESTOR', 'PENDING_STARTUP', 'ACCEPTED'].includes(agreement.status);
    }
    if (filter === 'completed') {
      return agreement.status === 'COMPLETED';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 md:p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">Funding Agreements</h3>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'pending'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredAgreements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No funding agreements found</p>
          <p className="text-sm text-gray-400">
            {filter === 'all'
              ? 'Create a funding agreement to get started'
              : `No ${filter} agreements`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAgreements.map((agreement) => (
            <button
              key={agreement.id}
              onClick={() => router.push(`/dashboard/funding-agreements/${agreement.id}`)}
              className="w-full px-4 py-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-gray-50 transition text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {agreement.category.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {agreement.category.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      with {agreement.initiator.firstName} {agreement.initiator.lastName} &{' '}
                      {agreement.counterparty.firstName} {agreement.counterparty.lastName}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {getStatusBadge(agreement.status)}
                  <p className="text-sm text-gray-500 mt-1">{formatDate(agreement.createdAt)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(agreement.fundingAmount)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
