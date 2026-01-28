import { NextRequest, NextResponse } from 'next/server';
import {
  submitVerificationStage,
  getMyVerificationStages,
} from '@/server/api/verification/verification-engine';

// Legacy support - redirect to new verification system
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Legacy format conversion
    const { companyName, domain, documents } = body;

    // Convert to new format - this is a role verification
    const result = await submitVerificationStage({
      type: 'ROLE',
      metadata: {
        proofType: 'incorporation_certificate',
        proofUrls: documents ? [documents] : [],
        incorporationNumber: companyName || '',
        // Add other fields as needed
      },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const result = await getMyVerificationStages();
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
