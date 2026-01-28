/**
 * Funding Agreement Detail Page
 * Shows details of a specific funding agreement
 */

'use client';

import { useAuth } from '@/context/authContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { FundingAgreementDetail } from '@/components/funding';

export default function FundingAgreementDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const agreementId = params.id as string;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-24 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <FundingAgreementDetail agreementId={agreementId} currentUserId={user.id} />
      </div>
    </div>
  );
}
