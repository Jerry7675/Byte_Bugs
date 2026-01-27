import { prismaService } from '@/lib/prisma.service';
import { UserRole } from '@/lib/prisma.type';
import {
  investorProfileSchema,
  startupProfileSchema,
  investorProfileUpdateSchema,
  startupProfileUpdateSchema,
} from '../../validators/profileValidator';
const prisma = prismaService.getClient();

export async function createProfile(role: UserRole, data: any) {
  if (role === 'INVESTOR') {
    await investorProfileSchema.validate(data);
    return prisma.investorProfile.create({ data });
  } else if (role === 'STARTUP') {
    await startupProfileSchema.validate(data);
    return prisma.startupProfile.create({ data });
  }
  throw new Error('Invalid role');
}

export async function updateProfile(role: UserRole, id: string, data: any) {
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

export async function deleteProfile(role: UserRole, id: string) {
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

export async function getProfileById(role: UserRole, id: string) {
  if (role === 'INVESTOR') {
    return prisma.investorProfile.findUnique({ where: { id } });
  } else if (role === 'STARTUP') {
    return prisma.startupProfile.findUnique({ where: { id } });
  }
  throw new Error('Invalid role');
}

export async function getAllProfiles(role: UserRole) {
  if (role === 'INVESTOR') {
    return prisma.investorProfile.findMany();
  } else if (role === 'STARTUP') {
    return prisma.startupProfile.findMany();
  }
  throw new Error('Invalid role');
}
