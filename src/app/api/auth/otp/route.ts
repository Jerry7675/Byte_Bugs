import { NextRequest, NextResponse } from 'next/server';
import { ForgotPasswordService } from '@/server/services/auth/forgotPasswordService';
import jwt from 'jsonwebtoken';

const JWT_FORGOT_PASSWORD_SECRET = process.env.JWT_FORGOT_PASSWORD_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    }
    const user = await ForgotPasswordService.findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const valid = await ForgotPasswordService.verifyOTP(user.id, otp);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }
    const resetToken = jwt.sign({ userId: user.id }, JWT_FORGOT_PASSWORD_SECRET, {
      expiresIn: '15m',
    });
    await ForgotPasswordService.clearOTP(user.id);
    return NextResponse.json({ token: resetToken });
  } catch (err) {
    console.error('OTP verify error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
