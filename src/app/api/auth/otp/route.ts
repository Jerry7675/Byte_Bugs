import { NextRequest, NextResponse } from 'next/server';
import { ForgotPasswordService } from '@/server/services/auth/forgotPasswordService';
import jwt from 'jsonwebtoken';
import { withRequestContext } from '@/context/init-request-context';
import { getContext } from '@/context/context-store';

const JWT_FORGOT_PASSWORD_SECRET = process.env.JWT_FORGOT_PASSWORD_SECRET!;

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    const { email, otp, resend } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Handle resend OTP logic
    if (resend) {
      const user = await ForgotPasswordService.findUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      const result = await ForgotPasswordService.resendOTP(email);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 429 });
      }
      // You may want to send the OTP via email here if needed
      return NextResponse.json({ message: 'OTP resent to email', attempts: result.attempts });
    }

    // Normal OTP verification
    if (!otp) {
      return NextResponse.json({ error: 'OTP required' }, { status: 400 });
    }
    const user = await ForgotPasswordService.findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const valid = await ForgotPasswordService.verifyOTP(email, otp);
    if (valid === 'otp_expired') {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }
    if (!valid) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }
    const resetToken = jwt.sign({ userId: user.id }, JWT_FORGOT_PASSWORD_SECRET, {
      expiresIn: '15m',
    });
    // Save token in user table
    await ForgotPasswordService.saveResetToken(user.id, resetToken);
    await ForgotPasswordService.clearOTP(email);
    return NextResponse.json({ token: resetToken });
  });
}
