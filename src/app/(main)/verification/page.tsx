'use client';

import { VerificationDashboard } from '@/components/verification/VerificationDashboardNew';
import { useVerificationSummary } from '@/client/hooks/useVerification';
import { useRouter } from 'next/navigation';
import { CheckCircle, Shield, TrendingUp, Users, ArrowRight } from 'lucide-react';

export default function VerificationPage() {
  const router = useRouter();
  const { summary, loading } = useVerificationSummary();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has started verification (has any identity or role verification)
  const hasStartedVerification = summary?.identity || summary?.role;

  // Show "Get Verified" page if user hasn't started verification
  if (!hasStartedVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get Verified</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Build trust and unlock premium features by completing our multi-stage verification
              process
            </p>
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Get Verified?</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Build Trust</h3>
                  <p className="text-sm text-gray-600">
                    Verified accounts are trusted 3x more by other users
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Unlock Features</h3>
                  <p className="text-sm text-gray-600">
                    Access premium features and higher transaction limits
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Connect Better</h3>
                  <p className="text-sm text-gray-600">
                    Verified users receive priority in matching algorithms
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Badge of Honor</h3>
                  <p className="text-sm text-gray-600">
                    Display your verified badge across the platform
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Stages */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Verification Stages</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
                    1
                  </div>
                  <span className="text-gray-700">
                    <span className="font-semibold">Identity Verification</span> - Submit ID
                    documents
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
                    2
                  </div>
                  <span className="text-gray-700">
                    <span className="font-semibold">Role Verification</span> - Verify as Investor or
                    Startup
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
                    3
                  </div>
                  <span className="text-gray-700">
                    <span className="font-semibold">Activity Badge</span> - Earn through platform
                    engagement
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
                    4
                  </div>
                  <span className="text-gray-700">
                    <span className="font-semibold">Community Trust</span> - Build reputation with
                    reviews
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                onClick={() => router.push('/verification/submit')}
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Verification Process
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Takes approximately 5-10 minutes to complete initial verification
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show verification dashboard if user has started verification
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Account Verification
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Complete all verification stages to unlock full platform access and build trust with the
            community
          </p>
        </div>
        <VerificationDashboard />
      </div>
    </div>
  );
}
