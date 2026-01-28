/**
 * Funding History Component
 *
 * Displays successful funding records in an expandable format
 */

'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FundingHistoryProps {
  userId?: string;
}

export default function FundingHistory({ userId }: FundingHistoryProps) {
  const [fundings, setFundings] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchFundingData();
  }, [userId]);

  const fetchFundingData = async () => {
    try {
      const queryParam = userId ? `?userId=${userId}` : '';

      const [fundingsRes, statsRes] = await Promise.all([
        fetch(`/api/successful-fundings${queryParam}`),
        fetch(`/api/successful-fundings/statistics${queryParam}`),
      ]);

      const fundingsData = await fundingsRes.json();
      const statsData = await statsRes.json();

      if (fundingsRes.ok) {
        setFundings(fundingsData.data || []);
      }

      if (statsRes.ok) {
        setStatistics(statsData.data);
      }
    } catch (err) {
      console.error('Error fetching funding data:', err);
    } finally {
      setLoading(false);
    }
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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Funding History</h2>

      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Deals</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.totalFundings}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(statistics.totalAmount)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Avg Deal Size</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(statistics.averageFundingAmount)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {statistics.pendingAgreementsCount}
            </p>
          </div>
        </div>
      )}

      {fundings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No funding history yet</p>
          <p className="text-sm text-gray-400">Completed funding agreements will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fundings.map((funding) => (
            <div
              key={funding.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-green-300 transition"
            >
              {/* Collapsed View */}
              <button
                onClick={() => toggleExpand(funding.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {funding.category.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      {funding.category.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(funding.completedAt)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatCurrency(funding.fundingAmount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Net: {formatCurrency(funding.netAmount)}
                    </p>
                  </div>
                  {expandedId === funding.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded View */}
              {expandedId === funding.id && (
                <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Investor</p>
                      <p className="font-medium text-gray-900">
                        {funding.investor.firstName} {funding.investor.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Startup</p>
                      <p className="font-medium text-gray-900">
                        {funding.startup.firstName} {funding.startup.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Funding Amount:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(funding.fundingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platform Commission:</span>
                      <span className="font-semibold text-red-600">
                        -{formatCurrency(funding.platformCommission)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Net Amount:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(funding.netAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Agreement ID: {funding.agreementId}</p>
                    <p className="text-xs text-gray-500">Terms Version: {funding.termsVersion}</p>
                    <p className="text-xs text-gray-500">
                      Completed: {new Date(funding.completedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
