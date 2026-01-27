import { getContext } from '@/context/context-store';
import { PrismaEnums } from '@/enumWrapper';

export class VerificationService {
  static async applyForVerification({
    companyName,
    domain,
    documents,
  }: {
    companyName?: string;
    domain?: string;
    documents?: string;
  }) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');
    // Only allow startup or investor
    if (user.role !== 'STARTUP' && user.role !== 'INVESTOR') {
      throw new Error('Only startups or investors can apply for verification');
    }
    // Only one pending application at a time
    const existing = await prisma.verificationApplication.findFirst({
      where: {
        userId: user.id,
        status: {
          in: [PrismaEnums.VerificationStatus.PENDING, PrismaEnums.VerificationStatus.VERIFIED],
        },
      },
    });
    if (existing) throw new Error('You already have a pending or verified application');
    return prisma.verificationApplication.create({
      data: {
        userId: user.id,
        companyName,
        domain,
        documents,
        status: PrismaEnums.VerificationStatus.PENDING,
      },
    });
  }

  static async getMyVerificationStatus() {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');
    return prisma.verificationApplication.findMany({
      where: { userId: user.id },
      orderBy: { appliedAt: 'desc' },
    });
  }
}
