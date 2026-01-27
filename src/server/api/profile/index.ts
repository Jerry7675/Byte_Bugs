import {
  createProfile,
  updateProfile,
  deleteProfile,
  getProfileById,
  getAllProfiles,
} from '../../services/profile/profile.service';
import { UserRole } from '@/lib/prisma.type';

function toUserRole(role: string): UserRole {
  if (role === 'INVESTOR' || role === 'STARTUP') return role as UserRole;
  throw new Error('Invalid role');
}

export async function create(role: string, data: any) {
  return createProfile(toUserRole(role), data);
}

export async function update(role: string, id: string, data: any) {
  return updateProfile(toUserRole(role), id, data);
}

export async function remove(role: string, id: string) {
  return deleteProfile(toUserRole(role), id);
}

export async function findById(role: string, id: string) {
  return getProfileById(toUserRole(role), id);
}

export async function findAll(role: string) {
  return getAllProfiles(toUserRole(role));
}
