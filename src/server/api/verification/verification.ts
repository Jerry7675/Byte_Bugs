/**
 * Legacy Verification API - Deprecated
 * Use verification-engine.ts instead
 */

import { submitVerificationStage, getMyVerificationStages } from './verification-engine';

// Legacy compatibility functions
export async function applyForVerification(params: {
  companyName?: string;
  domain?: string;
  documents?: string;
}) {
  // Convert to new format
  return await submitVerificationStage({
    type: 'ROLE',
    metadata: {
      proofType: 'incorporation_certificate',
      proofUrls: params.documents ? [params.documents] : [],
      incorporationNumber: params.companyName || '',
    },
  });
}

export async function getMyVerificationStatus() {
  return await getMyVerificationStages();
}
