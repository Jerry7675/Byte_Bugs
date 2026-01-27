import { prismaService } from '@/lib/prisma.service';
import { hashString } from '../../lib/hash.service';
import { User } from '@/lib/prisma.type';
import {
  forgotPasswordRequestSchema,
  otpVerifySchema,
  passwordResetSchema,
  emailSchema,
} from '@/server/validators';

const prisma = prismaService.getClient();

export class ForgotPasswordService {
  static async findUserByEmail(email: string): Promise<User | null> {
    await forgotPasswordRequestSchema.validate({ email });
    return prisma.user.findUnique({ where: { email } });
  }

  static async createOrUpdateOTP(email: string, otp: string, expiresInMinutes = 10) {
    await otpVerifySchema.validate({ email, otp });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');
    const salt = process.env.APP_SALT || '';
    const hashedOtp = hashString(otp, salt);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);
    return prisma.oTP.upsert({
      where: { userId: user.id },
      update: { hashedOtp, attempts: 0, expiresAt },
      create: { userId: user.id, hashedOtp, expiresAt },
    });
  }

  static async verifyOTP(email: string, otp: string) {
    await otpVerifySchema.validate({ email, otp });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return false;
    const record = await prisma.oTP.findUnique({ where: { userId: user.id } });
    if (!record) return false;
    if (record.attempts >= 5 || record.expiresAt < new Date()) return false;
    const salt = process.env.APP_SALT || '';
    const hashedOtp = hashString(otp, salt);
    const isValid = record.hashedOtp === hashedOtp;
    await prisma.oTP.update({
      where: { userId: user.id },
      data: { attempts: { increment: 1 } },
    });
    return isValid;
  }

  static async clearOTP(email: string) {
    await emailSchema.validate({ email });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;
    await prisma.oTP.delete({ where: { userId: user.id } });
  }

  static async updatePassword(token: string, password: string) {
    await passwordResetSchema.validate({ token, password });
    // Find user by token (implement your token logic here)
    // For demo, assume token is userId
    const userId = token; // Replace with actual token lookup
    const salt = process.env.APP_SALT || '';
    const hashedPassword = hashString(password, salt);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
  }
}
