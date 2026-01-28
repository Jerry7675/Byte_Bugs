/**
 * API Route: Cancel Funding Agreement
 *
 * POST /api/funding-agreements/[id]/cancel - Cancel a funding agreement (initiator only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getContext } from '@/context/context-store';
import { FundingService } from '@/server/services/funding';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  return withRequestContext(req, async () => {
    const context = getContext();
    if (!context.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const body = await req.json();
      const { reason } = body;

      const resolvedParams = await Promise.resolve(params);
      const agreement = await FundingService.cancelFundingAgreement({
        agreementId: resolvedParams.id,
        reason,
      });

      return NextResponse.json({
        success: true,
        data: agreement,
        message: 'Funding agreement cancelled',
      });
    } catch (error: any) {
      console.error('Error cancelling funding agreement:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to cancel funding agreement' },
        { status: 400 },
      );
    }
  });
}
