import * as yup from 'yup';

export const investorProfileSchema = yup
  .object()
  .shape({
    userId: yup.string().uuid().required(),
    bio: yup.string().nullable(),
    firmName: yup.string().nullable(),
    website: yup.string().url().nullable(),
    minTicket: yup.number().integer().nullable(),
    maxTicket: yup.number().integer().nullable(),
    photo: yup.string().url().nullable(),
    kycDocumentType: yup.string().nullable(),
    kycDocumentNumber: yup.string().nullable(),
    kycDocumentUrl: yup.string().url().nullable(),
    categories: yup.array().of(yup.string()).nullable(),
  })
  .noUnknown(true);

export const investorProfileUpdateSchema = investorProfileSchema
  .shape({
    userId: yup.string().uuid().optional(),
    bio: yup.string().nullable().optional(),
    firmName: yup.string().nullable().optional(),
    website: yup.string().url().nullable().optional(),
    minTicket: yup.number().integer().nullable().optional(),
    maxTicket: yup.number().integer().nullable().optional(),
    photo: yup.string().url().nullable().optional(),
    kycDocumentType: yup.string().nullable().optional(),
    kycDocumentNumber: yup.string().nullable().optional(),
    kycDocumentUrl: yup.string().url().nullable().optional(),
    categories: yup.array().of(yup.string()).nullable().optional(),
  })
  .noUnknown(false);

export const startupProfileSchema = yup
  .object()
  .shape({
    userId: yup.string().uuid().required(),
    name: yup.string().required(),
    description: yup.string().nullable(),
    website: yup.string().url().nullable(),
    stage: yup.string().nullable(),
    photo: yup.string().url().nullable(),
    kycDocumentType: yup.string().nullable(),
    kycDocumentNumber: yup.string().nullable(),
    kycDocumentUrl: yup.string().url().nullable(),
    categories: yup.array().of(yup.string()).nullable(),
  })
  .noUnknown(true);

export const startupProfileUpdateSchema = startupProfileSchema
  .shape({
    userId: yup.string().uuid().optional(),
    name: yup.string().optional(),
    description: yup.string().nullable().optional(),
    website: yup.string().url().nullable().optional(),
    stage: yup.string().nullable().optional(),
    photo: yup.string().url().nullable().optional(),
    kycDocumentType: yup.string().nullable().optional(),
    kycDocumentNumber: yup.string().nullable().optional(),
    kycDocumentUrl: yup.string().url().nullable().optional(),
    categories: yup.array().of(yup.string()).nullable().optional(),
  })
  .noUnknown(false);
