import { ForgotPasswordService } from '@/server/services/auth/forgotPasswordService';
import { sendMail } from '../../lib/mailHandler';
import jwt from 'jsonwebtoken';

const JWT_FORGOT_PASSWORD_SECRET = process.env.JWT_FORGOT_PASSWORD_SECRET!;

// Handler for forgot password POST logic
export async function handleForgotPasswordRequest(body: any) {
  const { email, otp, password, token, resend } = body;

  // Request OTP or Resend OTP
  if (email && !otp && !password && !token && !resend) {
    const user = await ForgotPasswordService.findUserByEmail(email);
    if (!user) return { error: 'User not found', status: 404 };
    // Delete any expired OTP and preserve attempts
    const existing = await ForgotPasswordService.resendOTP(email);
    if (existing.error) return { error: existing.error, status: 429 };
    // send OTP via email using mailHandler
    await sendMail({
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Dear user,\n\nDonot share this OTP with anyone.\n\nIf you did not request this, please ignore this email.\n\nYour OTP is: ${existing.otp}`,
    });
    return { message: 'OTP sent to email', attempts: existing.attempts };
  }

  // Resend OTP
  if (email && resend) {
    const result = await ForgotPasswordService.resendOTP(email);
    if (result.error) return { error: result.error, status: 429 };
    await sendMail({
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Dear user,\n\nDonot share this OTP with anyone.\n\nIf you did not request this, please ignore this email.\n\nYour OTP is: ${result.otp}`,
    });
    return { message: 'OTP resent to email', attempts: result.attempts };
  }

  // Verify OTP
  if (email && otp && !password && !token) {
    const user = await ForgotPasswordService.findUserByEmail(email);
    if (!user) return { error: 'User not found', status: 404 };
    const valid = await ForgotPasswordService.verifyOTP(email, otp);
    if (valid === 'otp_expired') return { error: 'OTP expired', status: 400 };
    if (!valid) return { error: 'Invalid OTP', status: 400 };

    // Generate JWT for password reset
    const resetToken = jwt.sign({ userId: user.id }, JWT_FORGOT_PASSWORD_SECRET, {
      expiresIn: '15m',
    });
    return { token: resetToken };
  }

  // Reset Password
  if (password && token) {
    try {
      const payload = jwt.verify(token, JWT_FORGOT_PASSWORD_SECRET) as { userId: string };
      await ForgotPasswordService.updatePassword(payload.userId, password);
      return { message: 'Password updated successfully' };
    } catch {
      return { error: 'Invalid or expired token', status: 400 };
    }
  }

  return { error: 'Invalid request', status: 400 };
}
