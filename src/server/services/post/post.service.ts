import { getContext } from '@/context/context-store';
import { PrismaEnums } from '@/enumWrapper';

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
    category: keyof typeof PrismaEnums.PostCategory;
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
          status: PrismaEnums.VerificationStageStatus.APPROVED 
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
        category: PrismaEnums.PostCategory[category],
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
    category?: keyof typeof PrismaEnums.PostCategory;
    postType?: keyof typeof PrismaEnums.PostType;
  } = {}) {
    const { prisma } = getContext();
    
    const where: any = {};
    if (category) where.category = PrismaEnums.PostCategory[category];
    if (postType) where.postType = PrismaEnums.PostType[postType];
    
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
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
      }),
      prisma.post.count({ where }),
    ]);
    
    return {
      posts,
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
    category?: keyof typeof PrismaEnums.PostCategory;
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
    if (category) data.category = PrismaEnums.PostCategory[category];
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
}
