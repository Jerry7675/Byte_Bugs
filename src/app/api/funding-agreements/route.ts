/**
 * API Route: Funding Agreements
 *
 * GET /api/funding-agreements - Get all funding agreements for current user
 * POST /api/funding-agreements - Create a new funding agreement
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
      const status = searchParams.get('status') as any;
      const role = searchParams.get('role') as 'initiator' | 'counterparty' | 'all' | null;

      const agreements = await FundingService.getMyFundingAgreements({
        status,
        role: role || undefined,
      });

      return NextResponse.json({
        success: true,
        data: agreements,
      });
    } catch (error: any) {
      console.error('Error fetching funding agreements:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch funding agreements' },
        { status: 500 },
      );
    }
  });
}

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    const context = getContext();
    if (!context.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const body = await req.json();
      const { counterpartyId, category, fundingAmount, acceptTerms } = body;

      // Validate required fields
      if (!counterpartyId || !category || !fundingAmount || acceptTerms !== true) {
        return NextResponse.json(
          {
            error: 'Missing required fields: counterpartyId, category, fundingAmount, acceptTerms',
          },
          { status: 400 },
        );
      }

      const agreement = await FundingService.createFundingAgreement({
        counterpartyId,
        category,
        fundingAmount: parseFloat(fundingAmount),
        acceptTerms,
      });

      return NextResponse.json(
        {
          success: true,
          data: agreement,
        },
        { status: 201 },
      );
    } catch (error: any) {
      console.error('Error creating funding agreement:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create funding agreement' },
        { status: 400 },
      );
    }
  });
}
