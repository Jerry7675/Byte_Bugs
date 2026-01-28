/**
 * Unified Profile Service
 * Handles profile operations for both Startup and Investor users
 */

import { getContext } from '@/context/context-store';
import { PrismaEnums } from '@/enumWrapper';

export interface ProfileData {
  user: {
    id: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    verifiedAt: Date | null;
    createdAt: Date;
  };
  profile: {
    id: string;
    bio?: string | null;
    description?: string | null;
    photo?: string | null;
    website?: string | null;
    // Investor specific
    firmName?: string | null;
    minTicket?: number | null;
    maxTicket?: number | null;
    // Startup specific
    name?: string | null;
    stage?: string | null;
  };
  categories: string[];
  stats: {
    postsCount: number;
    activeHours: number;
    joinedDays: number;
  };
  verificationStages?: {
    identity?: { status: string; reviewedAt?: Date | null };
    role?: { status: string; reviewedAt?: Date | null };
    activity?: { status: string };
    community?: { status: string };
  };
}

export interface UpdateProfileInput {
  bio?: string;
  description?: string;
  website?: string;
  photo?: string;
  // Investor specific
  firmName?: string;
  minTicket?: number;
  maxTicket?: number;
  // Startup specific
  name?: string;
  stage?: string;
  // Categories
  categories?: string[];
}

export class ProfileService {
  /**
   * Get public profile by user ID
   */
  static async getPublicProfile(userId: string): Promise<ProfileData> {
    const { prisma } = getContext();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true,
        verifiedAt: true,
        createdAt: true,
        investor: true,
        startup: true,
        verificationStages: {
          where: {
            status: PrismaEnums.VerificationStageStatus.APPROVED,
          },
          select: {
            type: true,
            status: true,
            reviewedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get posts count
    const postsCount = await prisma.post.count({
      where: { authorId: userId },
    });

    // Calculate active hours from sessions
    const activeHours = await this.calculateActiveHours(userId);

    // Calculate days since joined
    const joinedDays = Math.floor(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Build profile based on role
    const profile = user.role === 'INVESTOR' ? user.investor : user.startup;
    const categories = profile?.categories || [];

    // Build verification stages object
    const verificationStages = {
      identity: user.verificationStages.find(
        (s) => s.type === PrismaEnums.VerificationType.IDENTITY
      ),
      role: user.verificationStages.find((s) => s.type === PrismaEnums.VerificationType.ROLE),
      activity: user.verificationStages.find(
        (s) => s.type === PrismaEnums.VerificationType.ACTIVITY
      ),
      community: user.verificationStages.find(
        (s) => s.type === PrismaEnums.VerificationType.COMMUNITY
      ),
    };

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        verifiedAt: user.verifiedAt,
        createdAt: user.createdAt,
      },
      profile: profile ? {
        id: profile.id,
        bio: profile.bio,
        description: 'description' in profile ? profile.description : null,
        photo: profile.photo,
        website: profile.website,
        firmName: 'firmName' in profile ? profile.firmName : null,
        minTicket: 'minTicket' in profile ? profile.minTicket : null,
        maxTicket: 'maxTicket' in profile ? profile.maxTicket : null,
        name: 'name' in profile ? profile.name : null,
        stage: 'stage' in profile ? profile.stage : null,
      } : {
        id: '',
        bio: null,
        description: null,
        photo: null,
        website: null,
        firmName: null,
        minTicket: null,
        maxTicket: null,
        name: null,
        stage: null,
      },
      categories,
      stats: {
        postsCount,
        activeHours,
        joinedDays,
      },
      verificationStages,
    };
  }

  /**
   * Get current user's profile
   */
  static async getMyProfile(): Promise<ProfileData> {
    const { user } = getContext();
    if (!user) throw new Error('Not authenticated');

    return this.getPublicProfile(user.id);
  }

  /**
   * Get user's posts
   */
  static async getUserPosts(userId: string, page = 1, limit = 10) {
    const { prisma } = getContext();

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      }),
      prisma.post.count({ where: { authorId: userId } }),
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

  /**
   * Update current user's profile
   */
  static async updateMyProfile(input: UpdateProfileInput) {
    const { prisma, user } = getContext();
    if (!user) throw new Error('Not authenticated');

    // Separate categories from other fields
    const { categories, ...profileData } = input;

    // Update based on role
    if (user.role === PrismaEnums.UserRole.INVESTOR) {
      const updateData: any = {};
      if (profileData.bio !== undefined) updateData.bio = profileData.bio;
      if (profileData.website !== undefined) updateData.website = profileData.website;
      if (profileData.photo !== undefined) updateData.photo = profileData.photo;
      if (profileData.firmName !== undefined) updateData.firmName = profileData.firmName;
      if (profileData.minTicket !== undefined) updateData.minTicket = profileData.minTicket;
      if (profileData.maxTicket !== undefined) updateData.maxTicket = profileData.maxTicket;

      const createData: any = { ...updateData, userId: user.id };

      // Handle categories as enum array
      if (categories !== undefined) {
        updateData.categories = categories;
        createData.categories = categories;
      }

      await prisma.investorProfile.upsert({
        where: { userId: user.id },
        create: createData,
        update: updateData,
      });
    } else if (user.role === PrismaEnums.UserRole.STARTUP) {
      const updateData: any = {};
      if (profileData.bio !== undefined) updateData.bio = profileData.bio;
      if (profileData.description !== undefined) updateData.description = profileData.description;
      if (profileData.website !== undefined) updateData.website = profileData.website;
      if (profileData.photo !== undefined) updateData.photo = profileData.photo;
      if (profileData.name !== undefined) updateData.name = profileData.name;
      if (profileData.stage !== undefined) updateData.stage = profileData.stage;

      // Get user for default name
      const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
      const createData: any = {
        ...updateData,
        userId: user.id,
        name: profileData.name || `${fullUser?.firstName || 'User'} ${fullUser?.lastName || ''}'s Startup`.trim(),
      };

      // Handle categories as enum array
      if (categories !== undefined) {
        updateData.categories = categories;
        createData.categories = categories;
      }

      await prisma.startupProfile.upsert({
        where: { userId: user.id },
        create: createData,
        update: updateData,
      });
    }

    return this.getMyProfile();
  }

  /**
   * Calculate active hours from user sessions
   */
  private static async calculateActiveHours(userId: string): Promise<number> {
    const { prisma } = getContext();

    const sessions = await prisma.session.findMany({
      where: { userId },
      select: {
        createdAt: true,
        expiresAt: true,
        revokedAt: true,
      },
    });

    let totalHours = 0;

    sessions.forEach((session) => {
      const endTime = session.revokedAt || session.expiresAt || new Date();
      const startTime = session.createdAt;
      const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      totalHours += Math.max(0, Math.min(hours, 24)); // Cap at 24 hours per session
    });

    return Math.round(totalHours);
  }

  /**
   * Get all available categories
   */
  static getCategories() {
    return [
      { id: 'FUNDING', name: 'Funding' },
      { id: 'TECHNOLOGY', name: 'Technology' },
      { id: 'MARKETING', name: 'Marketing' },
      { id: 'OPERATIONS', name: 'Operations' },
      { id: 'GENERAL', name: 'General' },
    ];
  }
}
