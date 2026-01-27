import { VerificationService } from '@/server/services/userVerification/verification.service';

export async function applyForVerification(params: {
  companyName?: string;
  domain?: string;
  documents?: string;
}) {
  return await VerificationService.applyForVerification(params);
}

export async function getMyVerificationStatus() {
  return await VerificationService.getMyVerificationStatus();
}
