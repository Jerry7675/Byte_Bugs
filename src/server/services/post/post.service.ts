import { getContext } from '@/context/context-store';
import { PrismaEnums } from '@/enumWrapper';
import { WalletService } from '@/server/services/wallet/wallet.service';

// Cost in points to boost a post
const BOOST_COST = 100;
// Boost duration in hours
const BOOST_DURATION_HOURS = 24;

export class PostService {
  static async createPost({
    title,
    content,
    category,
    postType,
    imageUrl,
    tags,
  }: {
    title: string;
    content: string;
    category: keyof typeof PrismaEnums.CategoryType;
    postType?: keyof typeof PrismaEnums.PostType;
    imageUrl?: string;
    tags?: string[];
  }) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    // Only verified startup/investor can post
    if (user.role === 'STARTUP' || user.role === 'INVESTOR') {
      // Check if user has at least IDENTITY verification approved
      const identityVerification = await prisma.verificationStage.findFirst({
        where: {
          userId: user.id,
          type: PrismaEnums.VerificationType.IDENTITY,
          status: PrismaEnums.VerificationStageStatus.APPROVED,
        },
      });
      if (!identityVerification) {
        throw new Error('You must complete identity verification before creating posts');
      }
    } else if (user.role !== 'ADMIN') {
      throw new Error('Only startups, investors, or admins can create posts');
    }

    return prisma.post.create({
      data: {
        authorId: user.id,
        title,
        content,
        category: PrismaEnums.CategoryType[category],
        postType: postType ? PrismaEnums.PostType[postType] : PrismaEnums.PostType.UPDATE,
        imageUrl,
        tags: tags || [],
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });
  }

  static async getAllPosts({
    page = 1,
    limit = 20,
    category,
    postType,
  }: {
    page?: number;
    limit?: number;
    category?: keyof typeof PrismaEnums.CategoryType;
    postType?: keyof typeof PrismaEnums.PostType;
  } = {}) {
    const { prisma, user } = getContext();

    const where: any = {};
    if (category) where.category = PrismaEnums.CategoryType[category];
    if (postType) where.postType = PrismaEnums.PostType[postType];

    const skip = (page - 1) * limit;

    // Get current timestamp
    const now = new Date();

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          // First, prioritize active boosted posts
          { isBoosted: 'desc' },
          // Then by creation date
          { createdAt: 'desc' },
        ],
        include: {
          author: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              isVerified: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // Filter and mark expired boosts (cleanup)
    const processedPosts = await Promise.all(
      posts.map(async (post) => {
        // Check if boost has expired
        if (post.isBoosted && post.boostExpiresAt && post.boostExpiresAt < now) {
          // Mark as not boosted
          const updated = await prisma.post.update({
            where: { id: post.id },
            data: { isBoosted: false },
            include: {
              author: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                  isVerified: true,
                },
              },
            },
          });
          return updated;
        }
        return post;
      }),
    );

    // Further prioritize boosted posts based on user preferences (if user is logged in)
    let sortedPosts = processedPosts;
    if (user) {
      // Get user's profile to match categories
      const userProfile =
        user.role === 'STARTUP'
          ? await prisma.startupProfile.findUnique({ where: { userId: user.id } })
          : user.role === 'INVESTOR'
            ? await prisma.investorProfile.findUnique({ where: { userId: user.id } })
            : null;

      if (userProfile && userProfile.categories) {
        // Separate boosted and non-boosted posts
        const boostedPosts = processedPosts.filter((p) => p.isBoosted);
        const nonBoostedPosts = processedPosts.filter((p) => !p.isBoosted);

        // Sort boosted posts: matching categories first
        const sortedBoosted = boostedPosts.sort((a, b) => {
          const aMatches = userProfile.categories.includes(a.category);
          const bMatches = userProfile.categories.includes(b.category);

          if (aMatches && !bMatches) return -1;
          if (!aMatches && bMatches) return 1;

          // If both match or both don't match, sort by boostedAt (most recent first)
          return (b.boostedAt?.getTime() || 0) - (a.boostedAt?.getTime() || 0);
        });

        sortedPosts = [...sortedBoosted, ...nonBoostedPosts];
      }
    }

    return {
      posts: sortedPosts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getPostsByAuthor(authorId: string) {
    const { prisma } = getContext();
    return prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });
  }

  static async getPostById(id: string) {
    const { prisma } = getContext();
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });
  }

  static async deletePost(id: string) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error('Post not found');

    // Only the author can delete their post
    if (post.authorId !== user.id) {
      throw new Error('Not authorized to delete this post');
    }

    return prisma.post.delete({ where: { id } });
  }

  static async updatePost({
    id,
    title,
    content,
    category,
    postType,
    imageUrl,
    tags,
  }: {
    id: string;
    title?: string;
    content?: string;
    category?: keyof typeof PrismaEnums.CategoryType;
    postType?: keyof typeof PrismaEnums.PostType;
    imageUrl?: string;
    tags?: string[];
  }) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error('Post not found');

    // Only the author can update their post
    if (post.authorId !== user.id) {
      throw new Error('Not authorized to update this post');
    }

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (category) data.category = PrismaEnums.CategoryType[category];
    if (postType) data.postType = PrismaEnums.PostType[postType];
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (tags !== undefined) data.tags = tags;

    return prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });
  }

  static async boostPost(postId: string) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    // Get the post
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Post not found');

    // Only the author can boost their own post
    if (post.authorId !== user.id) {
      throw new Error('You can only boost your own posts');
    }

    // Check if post is already boosted and not expired
    const now = new Date();
    if (post.isBoosted && post.boostExpiresAt && post.boostExpiresAt > now) {
      throw new Error('Post is already boosted. Wait for current boost to expire.');
    }

    // Check wallet balance
    const walletService = new WalletService();
    const { balance } = await walletService.getWalletBalance({ userId: user.id });

    if (balance < BOOST_COST) {
      throw new Error(
        `Insufficient balance. Boost costs ${BOOST_COST} points. You have ${balance} points.`,
      );
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Deduct points
      await walletService.usePoints({
        userId: user.id,
        amount: BOOST_COST,
        usageContext: `Post boost: ${post.title.substring(0, 50)}`,
      });

      // Calculate expiration
      const boostedAt = new Date();
      const boostExpiresAt = new Date(boostedAt.getTime() + BOOST_DURATION_HOURS * 60 * 60 * 1000);

      // Update post
      const boostedPost = await tx.post.update({
        where: { id: postId },
        data: {
          isBoosted: true,
          boostedAt,
          boostExpiresAt,
          boostCost: BOOST_COST,
        },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              isVerified: true,
            },
          },
        },
      });

      return boostedPost;
    });

    return result;
  }

  static async getBoostInfo() {
    return {
      cost: BOOST_COST,
      durationHours: BOOST_DURATION_HOURS,
    };
  }
}
