import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '@/server/services/profile/profile.service';
import { withRequestContext } from '@/context/init-request-context';

/**
 * GET /api/profile/[userId]
 * Get public profile by user ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  return withRequestContext(req, async () => {
    try {
      const { userId } = await params;
      const profile = await ProfileService.getPublicProfile(userId);
      return NextResponse.json({ success: true, data: profile });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.message === 'User not found' ? 404 : 400 }
      );
    }
  });
}
