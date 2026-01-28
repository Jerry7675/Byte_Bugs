import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '@/server/services/profile/profile.service';
import { withRequestContext } from '@/context/init-request-context';

/**
 * GET /api/profile/me
 * Get current user's profile
 */
export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const profile = await ProfileService.getMyProfile();
      return NextResponse.json({ success: true, data: profile });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.message === 'Not authenticated' ? 401 : 400 }
      );
    }
  });
}

/**
 * PATCH /api/profile/me
 * Update current user's profile
 */
export async function PATCH(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const body = await req.json();
      const profile = await ProfileService.updateMyProfile(body);
      return NextResponse.json({ success: true, data: profile });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.message === 'Not authenticated' ? 401 : 400 }
      );
    }
  });
}
