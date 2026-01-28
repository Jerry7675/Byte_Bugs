/**
 * API Route: Accept Funding Agreement
 *
 * POST /api/funding-agreements/[id]/accept - Accept a funding agreement
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
      const { acceptTerms } = body;

      if (acceptTerms !== true) {
        return NextResponse.json(
          { error: 'You must accept the terms and policies to proceed' },
          { status: 400 },
        );
      }

      const resolvedParams = await Promise.resolve(params);
      const result = await FundingService.acceptFundingAgreement({
        agreementId: resolvedParams.id,
        acceptTerms,
      });

      return NextResponse.json({
        success: true,
        data: result,
        message: result.successfulFunding
          ? 'Funding agreement completed successfully!'
          : 'Agreement accepted. Waiting for other party.',
      });
    } catch (error: any) {
      console.error('Error accepting funding agreement:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to accept funding agreement' },
        { status: 400 },
      );
    }
  });
}
