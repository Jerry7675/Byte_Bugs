import { getContext } from '@/context/context-store';
import { PrismaEnums } from '@/enumWrapper';

export class PostService {
  static async createPost({
    title,
    content,
    category,
  }: {
    title: string;
    content: string;
    category: keyof typeof PrismaEnums.PostCategory;
  }) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');
    // Only verified startup/investor can post
    if (user.role === 'STARTUP' || user.role === 'INVESTOR') {
      const latestVerification = await prisma.verificationApplication.findFirst({
        where: { userId: user.id, status: PrismaEnums.VerificationStatus.VERIFIED },
        orderBy: { appliedAt: 'desc' },
      });
      if (!latestVerification) throw new Error('User not verified');
    } else {
      throw new Error('Only startups or investors can create posts');
    }
    return prisma.post.create({
      data: {
        authorId: user.id,
        title,
        content,
        category: PrismaEnums.PostCategory[category],
      },
    });
  }

  static async getAllPosts() {
    const { prisma } = getContext();
    return prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  }
}
