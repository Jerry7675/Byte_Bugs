import { NextRequest, NextResponse } from 'next/server';
import {
  submitVerificationStage,
  getMyVerificationStages,
  getVerificationSummary,
  getMyActivityMetrics,
  getMyCommunityMetrics,
  recalculateMyActivityScore,
  recalculateMyTrustScore,
} from '@/server/api/verification/verification-engine';

/**
 * POST /api/verification/stages
 * Submit a new verification stage
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, metadata } = body;

    if (!type || !metadata) {
      return NextResponse.json(
        { success: false, error: 'Type and metadata are required' },
        { status: 400 },
      );
    }

    const result = await submitVerificationStage({ type, metadata });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('authenticated') ? 401 : 400 },
    );
  }
}

/**
 * GET /api/verification/stages
 * Get all verification stages for current user
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'summary':
        const summary = await getVerificationSummary();
        return NextResponse.json({ success: true, data: summary });

      case 'activity-metrics':
        const activityMetrics = await getMyActivityMetrics();
        return NextResponse.json({ success: true, data: activityMetrics });

      case 'community-metrics':
        const communityMetrics = await getMyCommunityMetrics();
        return NextResponse.json({ success: true, data: communityMetrics });

      case 'recalculate-activity':
        const updatedActivity = await recalculateMyActivityScore();
        return NextResponse.json({ success: true, data: updatedActivity });

      case 'recalculate-trust':
        const updatedTrust = await recalculateMyTrustScore();
        return NextResponse.json({ success: true, data: updatedTrust });

      default:
        const stages = await getMyVerificationStages();
        return NextResponse.json({ success: true, data: stages });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('authenticated') ? 401 : 400 },
    );
  }
}
