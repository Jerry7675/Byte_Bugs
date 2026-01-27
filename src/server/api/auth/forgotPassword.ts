import { NextRequest, NextResponse } from 'next/server';
import { ForgotPasswordService } from '../../services/auth/forgotPasswordService';
import { sendMail } from '../../lib/mailHandler';
import jwt from 'jsonwebtoken';

const JWT_FORGOT_PASSWORD_SECRET = process.env.JWT_FORGOT_PASSWORD_SECRET!;

export async function POST(req: NextRequest) {
  const { email, otp, password, token } = await req.json();

  //Request OTP
  if (email && !otp && !password && !token) {
    const user = await ForgotPasswordService.findUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    await ForgotPasswordService.createOrUpdateOTP(user.id, generatedOtp);
    //send OTP via email using mailHandler
    await sendMail({
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Dear user,\n\nDonot share this OTP with anyone.\n\nIf you did not request this, please ignore this email.\n\nYour OTP is: ${generatedOtp}`,
    });
    return NextResponse.json({ message: 'OTP sent to email' });
  }

  //Verify OTP
  if (email && otp && !password && !token) {
    const user = await ForgotPasswordService.findUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const valid = await ForgotPasswordService.verifyOTP(user.id, otp);
    if (!valid) return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    //Generate JWT for password reset
    const resetToken = jwt.sign({ userId: user.id }, JWT_FORGOT_PASSWORD_SECRET, {
      expiresIn: '15m',
    });
    await ForgotPasswordService.clearOTP(user.id);
    return NextResponse.json({ token: resetToken });
  }

  //Reset Password
  if (password && token) {
    try {
      const payload = jwt.verify(token, JWT_FORGOT_PASSWORD_SECRET) as { userId: string };
      await ForgotPasswordService.updatePassword(payload.userId, password);
      return NextResponse.json({ message: 'Password updated successfully' });
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
