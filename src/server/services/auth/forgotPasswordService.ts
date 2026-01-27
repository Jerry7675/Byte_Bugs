import { hashString } from '../../lib/hash.service';
import { User } from '@/lib/prisma.type';
import {
  forgotPasswordRequestSchema,
  otpVerifySchema,
  passwordResetSchema,
  emailSchema,
} from '../../validators';

import { getContext } from '@/context/context-store';
export class ForgotPasswordService {
  static async findUserByEmail(email: string): Promise<User | null> {
    await forgotPasswordRequestSchema.validate({ email });
    const { prisma } = getContext();
    return prisma.user.findUnique({ where: { email } });
  }
  static async saveResetToken(userId: string, token: string) {
    const { prisma } = getContext();
    await prisma.user.update({ where: { id: userId }, data: { JWtToken: token } });
  }
  static async isResetTokenValid(userId: string, token: string) {
    const { prisma } = getContext();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user?.JWtToken === token;
  }
  static async clearResetToken(userId: string) {
    const { prisma } = getContext();
    await prisma.user.update({ where: { id: userId }, data: { JWtToken: null } });
    await prisma.user.update({ where: { id: userId }, data: { JWtToken: null } });
  }

  static async createOrUpdateOTP(
    email: string,
    otp: string,
    expiresInMinutes = 10,
    attemptsOverride?: number,
  ) {
    const { prisma } = getContext();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');
    const salt = process.env.APP_SALT || '';
    const hashedOtp = hashString(otp, salt);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);
    // Check for existing OTP and preserve attempts
    const existing = await prisma.oTP.findUnique({ where: { userId: user.id } });
    let attempts = attemptsOverride ?? 0;
    if (existing) {
      attempts = attemptsOverride ?? existing.attempts;
      await prisma.oTP.delete({ where: { userId: user.id } });
    }
    return prisma.oTP.create({
      data: { userId: user.id, hashedOtp, expiresAt, attempts },
    });
  }
  // Resend OTP
  static async resendOTP(email: string, expiresInMinutes = 10) {
    const { prisma } = getContext();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');
    const existing = await prisma.oTP.findUnique({ where: { userId: user.id } });
    let attempts = 0;
    if (existing) {
      attempts = existing.attempts + 1;
      if (attempts > 5) {
        return { error: 'Too many attempts. Try again after sometime.' };
      }
      await prisma.oTP.delete({ where: { userId: user.id } });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = process.env.APP_SALT || '';
    const hashedOtp = hashString(otp, salt);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);
    await prisma.oTP.create({
      data: { userId: user.id, hashedOtp, expiresAt, attempts },
    });
    return { otp, attempts };
  }

  static async verifyOTP(email: string, otp: string) {
    const { prisma } = getContext();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return false;
    const record = await prisma.oTP.findUnique({ where: { userId: user.id } });
    if (!record) return false;
    if (record.attempts >= 5) {
      await prisma.oTP.delete({ where: { userId: user.id } });
      return false
    };
    if (record.expiresAt < new Date()) {
      await prisma.oTP.delete({ where: { userId: user.id } });
      return 'otp_expired';
    }
    const salt = process.env.APP_SALT || '';
    const hashedOtp = hashString(otp, salt);
    const isValid = record.hashedOtp === hashedOtp;
    await prisma.oTP.update({
      where: { userId: user.id },
      data: { attempts: { increment: 1 } },
    });
    if (!isValid) return false;
    const otpRecord = await prisma.oTP.findUnique({ where: { userId: user.id } });
    if (otpRecord) {
      await prisma.oTP.delete({ where: { userId: user.id } });
    }
    return true;
  }

  static async clearOTP(email: string) {
    const { prisma } = getContext();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;
    const otpRecord = await prisma.oTP.findUnique({ where: { userId: user.id } });
    if (otpRecord) {
      await prisma.oTP.delete({ where: { userId: user.id } });
    }
  }

  static async updatePassword(token: string, password: string) {
    const { prisma } = getContext();
    await passwordResetSchema.validate({ token, password });
    const userId = token;
    const salt = process.env.APP_SALT || '';
    const hashedPassword = hashString(password, salt);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
  }
}
