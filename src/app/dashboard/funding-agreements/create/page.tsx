/**
 * Create Funding Agreement Page
 * Allows users to create a new funding agreement with another user
 */

'use client';

import { useAuth } from '@/context/authContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FundingRequestForm } from '@/components/funding';

export default function CreateFundingAgreementPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const counterpartyId = searchParams.get('counterpartyId');
  const [counterpartyData, setCounterpartyData] = useState<any>(null);
  const [loadingCounterparty, setLoadingCounterparty] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (counterpartyId && user) {
      fetchCounterpartyData();
    }
  }, [counterpartyId, user]);

  const fetchCounterpartyData = async () => {
    if (!counterpartyId) {
      setError('No counterparty specified');
      setLoadingCounterparty(false);
      return;
    }

    try {
      const response = await fetch(`/api/profile/${counterpartyId}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch counterparty profile');
      }

      setCounterpartyData(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch counterparty data');
    } finally {
      setLoadingCounterparty(false);
    }
  };

  if (loading || loadingCounterparty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error || !counterpartyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-sm rounded-xl p-6 md:p-8 border border-red-200">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'Invalid counterparty'}</p>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const counterpartyName = `${counterpartyData.user.firstName} ${counterpartyData.user.lastName}`;
  const counterpartyRole = counterpartyData.user.role;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <FundingRequestForm
          counterpartyId={counterpartyId!}
          counterpartyName={counterpartyName}
          counterpartyRole={counterpartyRole}
        />
      </div>
    </div>
  );
}
