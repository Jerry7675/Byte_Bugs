import {
  createProfileService,
  updateProfileService,
  deleteProfileService,
  findProfileByIdService,
  findAllProfilesService,
} from '@/server/services/proflie/profile.service';
import { UserRole } from '@/lib/prisma.type';

export function toUserRole(role: string): UserRole {
  if (role === 'INVESTOR' || role === 'STARTUP') return role as UserRole;
  throw new Error('Invalid role');
}
export async function createProfileApi(role: string, data: any) {
  return createProfileService({ role: toUserRole(role), data });
}
export async function updateProfileApi(role: string, id: string, data: any) {
  return updateProfileService({ role: toUserRole(role), id, data });
}
export async function deleteProfileApi(role: string, id: string) {
  return deleteProfileService({ role: toUserRole(role), id });
}
export async function getAllProfilesApi(role: string) {
  return findAllProfilesService(toUserRole(role));
}
export async function getProfileByIdApi(role: string, id: string) {
  return findProfileByIdService(toUserRole(role), id);
}
