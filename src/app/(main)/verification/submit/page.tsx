'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import {
  IdentityVerificationForm,
  InvestorRoleVerificationForm,
  StartupRoleVerificationForm,
} from '@/components/verification/VerificationForms';
import { useVerificationStages } from '@/client/hooks/useVerification';

export default function VerificationSubmitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'identity' | 'role'>('identity');
  const { stages, loading, refetch } = useVerificationStages();
  const [isIdentityExpanded, setIsIdentityExpanded] = useState(true);
  const [isRoleExpanded, setIsRoleExpanded] = useState(true);
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);

  // Set active tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'identity' || tab === 'role') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSuccess = () => {
    setIsEditingIdentity(false);
    setIsEditingRole(false);
    refetch();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading verification status...</p>
        </div>
      </div>
    );
  }

  // Check if user already has verification stages
  const identityStage = stages.find(s => s.type === 'IDENTITY');
  const roleStage = stages.find(s => s.type === 'ROLE');

  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
      IN_REVIEW: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Review' },
      APPROVED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

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
              {identityStage && !isEditingIdentity ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50"
                    onClick={() => setIsIdentityExpanded(!isIdentityExpanded)}
                  >
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold">Identity Verification Status</h2>
                      {getStatusBadge(identityStage.status)}
                    </div>
                    <svg 
                      className={`w-6 h-6 text-gray-500 transition-transform ${isIdentityExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {isIdentityExpanded && (
                    <div className="px-6 pb-6 space-y-4 border-t border-gray-200 pt-4">
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          <span className="font-medium">Submitted:</span>{' '}
                          {new Date(identityStage.submittedAt).toLocaleDateString()}
                        </p>
                        {identityStage.reviewedAt && (
                          <p className="text-gray-700">
                            <span className="font-medium">Reviewed:</span>{' '}
                            {new Date(identityStage.reviewedAt).toLocaleDateString()}
                          </p>
                        )}
                        
                        {/* Display submitted metadata */}
                        <div className="mt-4 p-4 bg-gray-50 rounded">
                          <p className="font-medium text-gray-700 mb-2">Submitted Information:</p>
                          <div className="space-y-2 text-sm text-gray-600">
                            {identityStage.metadata && typeof identityStage.metadata === 'object' && (
                              <>
                                {(identityStage.metadata as any).documentType && (
                                  <p><span className="font-medium">Document Type:</span> {(identityStage.metadata as any).documentType}</p>
                                )}
                                {(identityStage.metadata as any).documentNumber && (
                                  <p><span className="font-medium">Document Number:</span> {(identityStage.metadata as any).documentNumber}</p>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        
                        {identityStage.reviewNote && (
                          <div className="mt-4 p-4 bg-gray-50 rounded">
                            <p className="font-medium text-gray-700 mb-2">Review Note:</p>
                            <p className="text-gray-600">{identityStage.reviewNote}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingIdentity(true);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Edit & Resubmit
                        </button>
                        {identityStage.status === 'REJECTED' && (
                          <span className="text-sm text-red-600 self-center">
                            Your verification was rejected. Please update and resubmit.
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : isEditingIdentity ? (
                <IdentityVerificationForm 
                  onSuccess={handleSuccess}
                  initialData={identityStage.metadata}
                />
              ) : (
                <IdentityVerificationForm 
                  onSuccess={handleSuccess} 
                  initialData={undefined}
                />
              )}
            </div>
          )}

          {activeTab === 'role' && (
            <div className="animate-fadeIn">
              {roleStage && !isEditingRole ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50"
                    onClick={() => setIsRoleExpanded(!isRoleExpanded)}
                  >
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold">Role Verification Status</h2>
                      {getStatusBadge(roleStage.status)}
                    </div>
                    <svg 
                      className={`w-6 h-6 text-gray-500 transition-transform ${isRoleExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {isRoleExpanded && (
                    <div className="px-6 pb-6 space-y-4 border-t border-gray-200 pt-4">
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          <span className="font-medium">Submitted:</span>{' '}
                          {new Date(roleStage.submittedAt).toLocaleDateString()}
                        </p>
                        {roleStage.reviewedAt && (
                          <p className="text-gray-700">
                            <span className="font-medium">Reviewed:</span>{' '}
                            {new Date(roleStage.reviewedAt).toLocaleDateString()}
                          </p>
                        )}
                        
                        {/* Display submitted metadata */}
                        <div className="mt-4 p-4 bg-gray-50 rounded">
                          <p className="font-medium text-gray-700 mb-2">Submitted Information:</p>
                          <div className="space-y-2 text-sm text-gray-600">
                            {roleStage.metadata && typeof roleStage.metadata === 'object' && (
                              <>
                                {(roleStage.metadata as any).proofType && (
                                  <p><span className="font-medium">Proof Type:</span> {(roleStage.metadata as any).proofType}</p>
                                )}
                                {(roleStage.metadata as any).incorporationNumber && (
                                  <p><span className="font-medium">Incorporation Number:</span> {(roleStage.metadata as any).incorporationNumber}</p>
                                )}
                                {(roleStage.metadata as any).firmName && (
                                  <p><span className="font-medium">Firm Name:</span> {(roleStage.metadata as any).firmName}</p>
                                )}
                                {(roleStage.metadata as any).companyName && (
                                  <p><span className="font-medium">Company Name:</span> {(roleStage.metadata as any).companyName}</p>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        
                        {roleStage.reviewNote && (
                          <div className="mt-4 p-4 bg-gray-50 rounded">
                            <p className="font-medium text-gray-700 mb-2">Review Note:</p>
                            <p className="text-gray-600">{roleStage.reviewNote}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingRole(true);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Edit & Resubmit
                        </button>
                        {roleStage.status === 'REJECTED' && (
                          <span className="text-sm text-red-600 self-center">
                            Your verification was rejected. Please update and resubmit.
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : isEditingRole && user.role === 'INVESTOR' ? (
                <InvestorRoleVerificationForm 
                  onSuccess={handleSuccess}
                  initialData={roleStage?.metadata}
                />
              ) : isEditingRole && user.role === 'STARTUP' ? (
                <StartupRoleVerificationForm 
                  onSuccess={handleSuccess}
                  initialData={roleStage?.metadata}
                />
              ) : user.role === 'INVESTOR' ? (
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
