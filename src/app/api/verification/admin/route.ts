import { NextRequest, NextResponse } from 'next/server';
import {
  reviewVerificationStage,
  getPendingVerifications,
} from '@/server/api/verification/verification-engine';

/**
 * POST /api/verification/admin/review
 * Admin: Review a verification stage
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { stageId, status, reviewNote } = body;

    if (!stageId || !status) {
      return NextResponse.json(
        { success: false, error: 'stageId and status are required' },
        { status: 400 },
      );
    }

    const result = await reviewVerificationStage({ stageId, status, reviewNote });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('authenticated') ? 401 : 403 },
    );
  }
}

/**
 * GET /api/verification/admin/pending
 * Admin: Get all pending verification stages
 */
export async function GET() {
  try {
    const result = await getPendingVerifications();
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('authenticated') ? 401 : 403 },
    );
  }
}
