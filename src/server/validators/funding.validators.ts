/**
 * Funding Agreement Validators
 *
 * Server-side validation schemas for funding agreements
 */

import * as yup from 'yup';

// Funding categories enum values
const FUNDING_CATEGORIES = [
  'SEED',
  'SERIES_A',
  'SERIES_B',
  'SERIES_C',
  'BRIDGE',
  'VENTURE_DEBT',
  'ANGEL',
  'STRATEGIC',
  'OTHER',
] as const;

// Create funding agreement request
export const CreateFundingAgreementSchema = yup.object({
  counterpartyId: yup
    .string()
    .required('Counterparty ID is required')
    .uuid('Invalid counterparty ID'),
  category: yup
    .string()
    .required('Category is required')
    .oneOf(FUNDING_CATEGORIES, 'Invalid funding category'),
  fundingAmount: yup
    .number()
    .required('Funding amount is required')
    .positive('Funding amount must be greater than 0')
    .max(1000000000, 'Funding amount exceeds maximum limit'),
  acceptTerms: yup
    .boolean()
    .required('You must accept the terms and policies')
    .oneOf([true], 'You must accept the terms and policies'),
});

// Accept funding agreement request
export const AcceptFundingAgreementSchema = yup.object({
  agreementId: yup.string().required('Agreement ID is required').uuid('Invalid agreement ID'),
  acceptTerms: yup
    .boolean()
    .required('You must accept the terms and policies')
    .oneOf([true], 'You must accept the terms and policies'),
});

// Reject funding agreement request
export const RejectFundingAgreementSchema = yup.object({
  agreementId: yup.string().required('Agreement ID is required').uuid('Invalid agreement ID'),
  reason: yup.string().max(500, 'Reason must be less than 500 characters').optional(),
});

// Cancel funding agreement request
export const CancelFundingAgreementSchema = yup.object({
  agreementId: yup.string().required('Agreement ID is required').uuid('Invalid agreement ID'),
  reason: yup.string().max(500, 'Reason must be less than 500 characters').optional(),
});

// Export types
export type CreateFundingAgreementInput = yup.InferType<typeof CreateFundingAgreementSchema>;
export type AcceptFundingAgreementInput = yup.InferType<typeof AcceptFundingAgreementSchema>;
export type RejectFundingAgreementInput = yup.InferType<typeof RejectFundingAgreementSchema>;
export type CancelFundingAgreementInput = yup.InferType<typeof CancelFundingAgreementSchema>;
