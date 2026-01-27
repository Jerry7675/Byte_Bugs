import { getContext } from '@/context/context-store';
import { UserRole } from '@/lib/prisma.type';
import {
  investorProfileSchema,
  startupProfileSchema,
  investorProfileUpdateSchema,
  startupProfileUpdateSchema,
} from '../../validators/profileValidator';

export async function createProfileService(params: { role: UserRole; data: any }) {
  const { role, data } = params;
  const { prisma } = getContext();
  const { role: _role, ...cleanData } = data;
  if (role === 'INVESTOR') {
    await investorProfileSchema.validate(cleanData);
    return prisma.investorProfile.create({ data: cleanData });
  } else if (role === 'STARTUP') {
    await startupProfileSchema.validate(cleanData);
    return prisma.startupProfile.create({ data: cleanData });
  }
  throw new Error('Invalid role');
}

export async function updateProfileService(params: { role: UserRole; id: string; data: any }) {
  const { role, id, data } = params;
  const { prisma } = getContext();
  if (role === 'INVESTOR') {
    await investorProfileUpdateSchema.validate(data, { strict: false, abortEarly: false });
    const existing = await prisma.investorProfile.findUnique({ where: { id } });
    if (!existing) throw new Error('Profile not found');
    return prisma.investorProfile.update({ where: { id }, data });
  } else if (role === 'STARTUP') {
    await startupProfileUpdateSchema.validate(data, { strict: false, abortEarly: false });
    const existing = await prisma.startupProfile.findUnique({ where: { id } });
    if (!existing) throw new Error('Profile not found');
    return prisma.startupProfile.update({ where: { id }, data });
  }
  throw new Error('Invalid role');
}

export async function deleteProfileService(params: { role: UserRole; id: string }) {
  const { role, id } = params;
  const { prisma } = getContext();
  if (role === 'INVESTOR') {
    const existing = await prisma.investorProfile.findUnique({ where: { id } });
    if (!existing) throw new Error('Profile not found');
    return prisma.investorProfile.delete({ where: { id } });
  } else if (role === 'STARTUP') {
    const existing = await prisma.startupProfile.findUnique({ where: { id } });
    if (!existing) throw new Error('Profile not found');
    return prisma.startupProfile.delete({ where: { id } });
  }
  throw new Error('Invalid role');
}

export async function findProfileByIdService(role: UserRole, id: string) {
  const { prisma } = getContext();
  if (role === 'INVESTOR') {
    return prisma.investorProfile.findUnique({ where: { id } });
  } else if (role === 'STARTUP') {
    return prisma.startupProfile.findUnique({ where: { id } });
  }
  throw new Error('Invalid role');
}

export async function findAllProfilesService(role: UserRole) {
  const { prisma } = getContext();
  if (role === 'INVESTOR') {
    return prisma.investorProfile.findMany();
  } else if (role === 'STARTUP') {
    return prisma.startupProfile.findMany();
  }
  throw new Error('Invalid role');
}
