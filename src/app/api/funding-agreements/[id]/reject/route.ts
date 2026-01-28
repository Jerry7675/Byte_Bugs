/**
 * API Route: Reject Funding Agreement
 *
 * POST /api/funding-agreements/[id]/reject - Reject a funding agreement
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getContext } from '@/context/context-store';
import { FundingService } from '@/server/services/funding';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return withRequestContext(req, async () => {
    const context = getContext();
    if (!context.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const body = await req.json();
      const { reason } = body;

      const agreement = await FundingService.rejectFundingAgreement({
        agreementId: params.id,
        reason,
      });

      return NextResponse.json({
        success: true,
        data: agreement,
        message: 'Funding agreement rejected',
      });
    } catch (error: any) {
      console.error('Error rejecting funding agreement:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to reject funding agreement' },
        { status: 400 },
      );
    }
  });
}
