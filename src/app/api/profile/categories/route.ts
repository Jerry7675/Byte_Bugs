import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '@/server/services/profile/profile.service';
import { withRequestContext } from '@/context/init-request-context';

/**
 * GET /api/profile/categories
 * Get all available categories
 */
export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const categories = await ProfileService.getCategories();
      return NextResponse.json({ success: true, data: categories });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
  });
}
