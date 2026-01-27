import { NextRequest, NextResponse } from 'next/server';

import { withRequestContext } from '@/context/init-request-context';
import { handleForgotPasswordRequest } from '@/server/api/auth/forgotPassword';

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const body = await req.json();
      const result = await handleForgotPasswordRequest(body);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      // Remove status from result if present
      const { status, ...data } = result;
      return NextResponse.json(data);
    } catch (err) {
      console.error('Forgot password error:', err);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  });
}
