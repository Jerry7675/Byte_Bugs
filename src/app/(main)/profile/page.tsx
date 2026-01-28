'use client';
import { useAuth } from '@/context/authContext';
import ProfileForm from '@/components/forms/ProfileForm';
import { useVerificationSummary } from '@/client/hooks/useVerification';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { summary } = useVerificationSummary();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Verification Badge */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 min-w-0 mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage your profile information and settings
            </p>
          </div>

          {/* Verification Status Badge */}
          {summary?.isFullyVerified ? (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Verified</span>
            </div>
          ) : (
            <Link
              href="/verification"
              className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg border border-yellow-200 hover:bg-yellow-200 transition-colors"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Get Verified</span>
            </Link>
          )}
        </div>

        <ProfileForm userRole={user.role} userId={user.id} />
      </div>
    </div>
  );
}
