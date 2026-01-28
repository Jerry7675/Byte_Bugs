/**
 * API Route: Funding Agreement by ID
 *
 * GET /api/funding-agreements/[id] - Get a specific funding agreement
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getContext } from '@/context/context-store';
import { FundingService } from '@/server/services/funding';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  return withRequestContext(req, async () => {
    const context = getContext();
    if (!context.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Handle both Promise and direct params for Next.js compatibility
      const resolvedParams = await Promise.resolve(params);
      const agreement = await FundingService.getFundingAgreement(resolvedParams.id);

      return NextResponse.json({
        success: true,
        data: agreement,
      });
    } catch (error: any) {
      console.error('Error fetching funding agreement:', error);

      if (error.message.includes('not found')) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      if (error.message.includes('not authorized')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }

      return NextResponse.json(
        { error: error.message || 'Failed to fetch funding agreement' },
        { status: 500 },
      );
    }
  });
}
