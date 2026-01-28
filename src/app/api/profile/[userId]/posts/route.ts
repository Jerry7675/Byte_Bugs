import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '@/server/services/profile/profile.service';
import { withRequestContext } from '@/context/init-request-context';

/**
 * GET /api/profile/[userId]/posts
 * Get user's posts with pagination
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  return withRequestContext(req, async () => {
    try {
      const { userId } = await params;
      const searchParams = req.nextUrl.searchParams;
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');

      const result = await ProfileService.getUserPosts(userId, page, limit);
      return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
  });
}
