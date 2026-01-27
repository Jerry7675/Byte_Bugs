import { NextRequest, NextResponse } from 'next/server';
import { ForgotPasswordService } from '@/server/services/auth/forgotPasswordService';
import jwt from 'jsonwebtoken';

const JWT_FORGOT_PASSWORD_SECRET = process.env.JWT_FORGOT_PASSWORD_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { password, token } = await req.json();
    if (!password || !token) {
      return NextResponse.json({ error: 'Password and token required' }, { status: 400 });
    }
    let payload: string | jwt.JwtPayload;
    try {
      payload = jwt.verify(token, JWT_FORGOT_PASSWORD_SECRET) as { userId: string };
    } catch (err) {
      console.error('JWT error:', err);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
    await ForgotPasswordService.updatePassword(payload.userId, password);
    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
