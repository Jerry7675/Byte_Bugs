import { NextRequest, NextResponse } from 'next/server';
import { ForgotPasswordService } from '@/server/services/forgotPasswordService';
import { sendMail } from '@/server/lib/mailHandler';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    const user = await ForgotPasswordService.findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    await ForgotPasswordService.createOrUpdateOTP(user.id, generatedOtp);
    await sendMail({
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Dear user,\n\nDonot share this OTP with anyone.\n\nIf you did not request this, please ignore this email.\n\nYour OTP is: ${generatedOtp}`,
    });
    return NextResponse.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
