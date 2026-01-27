import { NextRequest, NextResponse } from 'next/server';
import {
  applyForVerification,
  getMyVerificationStatus,
} from '@/server/api/verification/verification';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, domain, documents } = body;
    const result = await applyForVerification({ companyName, domain, documents });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const result = await getMyVerificationStatus();
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
