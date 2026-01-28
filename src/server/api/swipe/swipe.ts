// API layer for swipe endpoints
import { SwipeService } from '@/server/services/swipe/swipe.service';

const swipeService = new SwipeService();

export async function getPotentialProfilesApi(params: any) {
  return swipeService.getPotentialProfiles(params.userId, params.limit);
}

export async function performSwipeApi(params: any) {
  return swipeService.performSwipe(params);
}

export async function undoLastSkipApi(params: any) {
  return swipeService.undoLastSkip(params.userId);
}

export async function getUserMatchesApi(params: any) {
  return swipeService.getUserMatches(params.userId);
}

export async function getQuotaStatusApi(params: any) {
  return swipeService.getQuotaStatus(params.userId);
}

export async function getSwipeStatsApi(params: any) {
  return swipeService.getSwipeStats(params.userId);
}
