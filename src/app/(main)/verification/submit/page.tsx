'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import {
  IdentityVerificationForm,
  InvestorRoleVerificationForm,
  StartupRoleVerificationForm,
} from '@/components/verification/VerificationForms';

export default function VerificationSubmitPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'identity' | 'role'>('identity');

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/verification');
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please log in to submit verification</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/verification')}
            className="text-green-600 hover:text-green-700 mb-4 flex items-center gap-2"
          >
            ← Back to Verification Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Submit Verification</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Complete your verification to unlock full platform features
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('identity')}
              className={`${
                activeTab === 'identity'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm md:text-base`}
            >
              Identity Verification
            </button>
            <button
              onClick={() => setActiveTab('role')}
              className={`${
                activeTab === 'role'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm md:text-base`}
            >
              Role Verification
            </button>
          </nav>
        </div>

        {/* Forms */}
        <div className="space-y-6">
          {activeTab === 'identity' && (
            <div className="animate-fadeIn">
              <IdentityVerificationForm onSuccess={handleSuccess} />
            </div>
          )}

          {activeTab === 'role' && (
            <div className="animate-fadeIn">
              {user.role === 'INVESTOR' ? (
                <InvestorRoleVerificationForm onSuccess={handleSuccess} />
              ) : user.role === 'STARTUP' ? (
                <StartupRoleVerificationForm onSuccess={handleSuccess} />
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <p className="text-yellow-800">
                    Role verification is only available for Investors and Startups
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
