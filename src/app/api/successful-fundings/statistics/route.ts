/**
 * API Route: Funding Statistics
 *
 * GET /api/successful-fundings/statistics - Get funding statistics
 * Query params:
 *   - userId: optional, defaults to current user
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getContext } from '@/context/context-store';
import { FundingService } from '@/server/services/funding';

export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    const context = getContext();
    if (!context.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId') || undefined;

      const statistics = await FundingService.getFundingStatistics(userId);

      return NextResponse.json({
        success: true,
        data: statistics,
      });
    } catch (error: any) {
      console.error('Error fetching funding statistics:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch funding statistics' },
        { status: 500 },
      );
    }
  });
}
