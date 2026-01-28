// Swipe service for matching system
import { getContext } from '@/context/context-store';
import { SwipeAction, PointsTxType, UserRole } from '@/lib/prisma.type';

const DAILY_FREE_SWIPES = 10;
const POINTS_PER_SWIPE = 5;
const POINTS_PER_UNDO = 10;

export class SwipeService {
  /**
   * Get potential profiles for a user to swipe on
   * - Returns profiles of opposite role (investors for startups, vice versa)
   * - Excludes already swiped profiles
   * - Prioritizes profiles based on matching categories
   */
  async getPotentialProfiles(userId: string, limit: number = 20) {
    const { prisma } = getContext();

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        investor: true,
        startup: true,
      },
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    // Determine opposite role
    const oppositeRole =
      currentUser.role === UserRole.INVESTOR ? UserRole.STARTUP : UserRole.INVESTOR;

    // Get IDs of profiles already swiped on
    const swipedProfileIds = await prisma.swipeInteraction.findMany({
      where: { swiperId: userId },
      select: { swipedProfileId: true },
    });

    const excludeIds = swipedProfileIds.map((s) => s.swipedProfileId);
    excludeIds.push(userId); // Exclude self

    // Get user's categories for matching
    const userCategories =
      currentUser.role === UserRole.INVESTOR
        ? currentUser.investor?.categories || []
        : currentUser.startup?.categories || [];

    // Get potential profiles
    const potentialProfiles = await prisma.user.findMany({
      where: {
        id: { notIn: excludeIds },
        role: oppositeRole,
      },
      include: {
        investor: true,
        startup: true,
        activityMetrics: true,
        communityMetrics: true,
      },
      take: limit,
    });

    // Score and sort profiles based on category match
    const scoredProfiles = potentialProfiles.map((profile) => {
      const profileCategories =
        profile.role === UserRole.INVESTOR
          ? profile.investor?.categories || []
          : profile.startup?.categories || [];

      // Calculate match score (number of matching categories)
      const matchingCategories = userCategories.filter((cat) => profileCategories.includes(cat));
      const matchScore = matchingCategories.length;

      return {
        ...profile,
        matchScore,
        matchingCategories,
      };
    });

    // Sort by match score (higher first), then by activity score
    scoredProfiles.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return (b.activityMetrics?.activityScore || 0) - (a.activityMetrics?.activityScore || 0);
    });

    return scoredProfiles;
  }

  /**
   * Perform a swipe action (like, dislike, or skip)
   * - Checks daily quota
   * - Deducts points if quota exceeded
   * - Creates swipe interaction record
   * - Creates match if both users liked each other
   */
  async performSwipe(params: { userId: string; profileId: string; action: SwipeAction }) {
    const { userId, profileId, action } = params;
    const { prisma } = getContext();

    // Check if already swiped on this profile
    const existingSwipe = await prisma.swipeInteraction.findUnique({
      where: {
        swiperId_swipedProfileId: {
          swiperId: userId,
          swipedProfileId: profileId,
        },
      },
    });

    if (existingSwipe) {
      throw new Error('You have already swiped on this profile');
    }

    // Check quota and points
    const quotaCheck = await this.checkAndUpdateQuota(userId, action);

    if (!quotaCheck.canSwipe) {
      throw new Error(quotaCheck.reason || 'Cannot perform swipe');
    }

    // Perform swipe in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create swipe interaction
      const swipe = await tx.swipeInteraction.create({
        data: {
          swiperId: userId,
          swipedProfileId: profileId,
          action,
        },
      });

      // Update last skipped profile if action is SKIP
      if (action === SwipeAction.SKIP) {
        await tx.swipeQuota.update({
          where: { userId },
          data: {
            lastSkippedProfileId: profileId,
            lastSkipTime: new Date(),
          },
        });
      }

      // Deduct points if quota exceeded
      if (quotaCheck.requiresPoints) {
        let wallet = await tx.pointsWallet.findUnique({
          where: { userId },
        });

        if (!wallet) {
          // Create wallet if doesn't exist
          wallet = await tx.pointsWallet.create({
            data: {
              userId,
              balance: 0, // Give initial balance for testing
            },
          });
        }

        if (wallet.balance < POINTS_PER_SWIPE) {
          throw new Error(
            `Insufficient points. Need ${POINTS_PER_SWIPE} points (balance: ${wallet.balance})`,
          );
        }

        const balanceBefore = wallet.balance;
        const balanceAfter = wallet.balance - POINTS_PER_SWIPE;

        await tx.pointsWallet.update({
          where: { id: wallet.id },
          data: { balance: balanceAfter },
        });

        await tx.pointsTransaction.create({
          data: {
            walletId: wallet.id,
            amount: -POINTS_PER_SWIPE,
            type: PointsTxType.SPEND,
            reference: `SWIPE_${swipe.id}`,
            note: `Swipe action: ${action}`,
            status: 'success',
            balanceBefore,
            balanceAfter,
          },
        });
      }

      // Check for mutual like (match)
      let match = null;
      if (action === SwipeAction.LIKE) {
        const reciprocalLike = await tx.swipeInteraction.findFirst({
          where: {
            swiperId: profileId,
            swipedProfileId: userId,
            action: SwipeAction.LIKE,
          },
        });

        if (reciprocalLike) {
          // Create match
          const [user1Id, user2Id] = [userId, profileId].sort(); // Ensure consistent ordering
          match = await tx.profileMatch.create({
            data: {
              user1Id,
              user2Id,
            },
            include: {
              user1: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                  investor: true,
                  startup: true,
                },
              },
              user2: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                  investor: true,
                  startup: true,
                },
              },
            },
          });
        }
      }

      return { swipe, match };
    });

    return result;
  }

  /**
   * Undo last skip action
   * - Costs points
   * - Only works for the last skipped profile
   * - Removes the skip interaction
   */
  async undoLastSkip(userId: string) {
    const { prisma } = getContext();

    // Get quota to find last skipped profile
    const quota = await prisma.swipeQuota.findUnique({
      where: { userId },
    });

    if (!quota || !quota.lastSkippedProfileId) {
      throw new Error('No recent skip to undo');
    }

    // Check if undo is recent (within last 5 minutes)
    const now = new Date();
    const skipTime = quota.lastSkipTime;
    if (!skipTime || now.getTime() - skipTime.getTime() > 5 * 60 * 1000) {
      throw new Error('Undo window expired (5 minutes)');
    }

    // Check wallet balance
    let wallet = await prisma.pointsWallet.findUnique({
      where: { userId },
    });

    // Create wallet if doesn't exist with initial balance
    if (!wallet) {
      wallet = await prisma.pointsWallet.create({
        data: {
          userId,
          balance: 100, // Give initial balance for testing
        },
      });
    }

    if (wallet.balance < POINTS_PER_UNDO) {
      throw new Error(
        `Insufficient points. Need ${POINTS_PER_UNDO} points (balance: ${wallet?.balance || 0})`,
      );
    }

    // Perform undo in transaction
    const result = await prisma.$transaction(async (tx) => {
      const lastSkippedProfileId = quota.lastSkippedProfileId!;

      // Delete the skip interaction
      await tx.swipeInteraction.delete({
        where: {
          swiperId_swipedProfileId: {
            swiperId: userId,
            swipedProfileId: lastSkippedProfileId,
          },
        },
      });

      // Clear last skipped profile
      await tx.swipeQuota.update({
        where: { userId },
        data: {
          lastSkippedProfileId: null,
          lastSkipTime: null,
        },
      });

      // Deduct points
      const balanceBefore = wallet.balance;
      const balanceAfter = wallet.balance - POINTS_PER_UNDO;

      await tx.pointsWallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter },
      });

      await tx.pointsTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -POINTS_PER_UNDO,
          type: PointsTxType.SPEND,
          reference: `UNDO_SKIP_${userId}`,
          note: `Undo skip action`,
          status: 'success',
          balanceBefore,
          balanceAfter,
        },
      });

      // Get the profile that was skipped
      const unskippedProfile = await tx.user.findUnique({
        where: { id: lastSkippedProfileId },
        include: {
          investor: true,
          startup: true,
        },
      });

      return { unskippedProfile, pointsSpent: POINTS_PER_UNDO };
    });

    return result;
  }

  /**
   * Get user's matches
   */
  async getUserMatches(userId: string) {
    const { prisma } = getContext();

    const matches = await prisma.profileMatch.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        isActive: true,
      },
      include: {
        user1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            investor: true,
            startup: true,
          },
        },
        user2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            investor: true,
            startup: true,
          },
        },
      },
      orderBy: {
        matchedAt: 'desc',
      },
    });

    // Format matches to show the other user
    const formattedMatches = matches.map((match) => {
      const otherUser = match.user1Id === userId ? match.user2 : match.user1;
      return {
        matchId: match.id,
        matchedAt: match.matchedAt,
        otherUser,
      };
    });

    return formattedMatches;
  }

  /**
   * Get swipe quota status
   */
  async getQuotaStatus(userId: string) {
    const { prisma } = getContext();

    let quota = await prisma.swipeQuota.findUnique({
      where: { userId },
    });

    // Create quota if doesn't exist
    if (!quota) {
      quota = await prisma.swipeQuota.create({
        data: { userId },
      });
    }

    // Check if quota needs reset (new day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const quotaDate = new Date(quota.quotaDate);
    quotaDate.setHours(0, 0, 0, 0);

    if (quotaDate < today) {
      quota = await prisma.swipeQuota.update({
        where: { userId },
        data: {
          swipesToday: 0,
          quotaDate: new Date(),
        },
      });
    }

    const remainingFree = Math.max(0, quota.dailyFreeLimit - quota.swipesToday);
    const requiresPoints = quota.swipesToday >= quota.dailyFreeLimit;

    return {
      swipesToday: quota.swipesToday,
      remainingFree,
      dailyFreeLimit: quota.dailyFreeLimit,
      requiresPoints,
      pointsPerSwipe: quota.pointsPerSwipe,
      pointsPerUndo: quota.pointsPerUndo,
      canUndo: !!quota.lastSkippedProfileId,
      lastSkipTime: quota.lastSkipTime,
    };
  }

  /**
   * Check and update swipe quota
   * - Resets quota if new day
   * - Checks if user has free swipes left
   * - Checks wallet balance if quota exceeded
   */
  private async checkAndUpdateQuota(
    userId: string,
    action: SwipeAction,
  ): Promise<{
    canSwipe: boolean;
    requiresPoints: boolean;
    reason?: string;
  }> {
    const { prisma } = getContext();

    // Get or create quota
    let quota = await prisma.swipeQuota.findUnique({
      where: { userId },
    });

    if (!quota) {
      quota = await prisma.swipeQuota.create({
        data: { userId },
      });
    }

    // Check if quota needs reset (new day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const quotaDate = new Date(quota.quotaDate);
    quotaDate.setHours(0, 0, 0, 0);

    if (quotaDate < today) {
      quota = await prisma.swipeQuota.update({
        where: { userId },
        data: {
          swipesToday: 0,
          quotaDate: new Date(),
        },
      });
    }

    // Check if user has free swipes left
    if (quota.swipesToday < quota.dailyFreeLimit) {
      // Increment quota
      await prisma.swipeQuota.update({
        where: { userId },
        data: {
          swipesToday: quota.swipesToday + 1,
        },
      });

      return {
        canSwipe: true,
        requiresPoints: false,
      };
    }

    // Check wallet balance for paid swipe
    const wallet = await prisma.pointsWallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.balance < POINTS_PER_SWIPE) {
      return {
        canSwipe: false,
        requiresPoints: true,
        reason: `Insufficient points. Need ${POINTS_PER_SWIPE} points (balance: ${wallet?.balance || 0})`,
      };
    }

    // Increment quota (points will be deducted in transaction)
    await prisma.swipeQuota.update({
      where: { userId },
      data: {
        swipesToday: quota.swipesToday + 1,
      },
    });

    return {
      canSwipe: true,
      requiresPoints: true,
    };
  }

  /**
   * Get swipe statistics for a user
   */
  async getSwipeStats(userId: string) {
    const { prisma } = getContext();

    const [totalSwipes, likes, dislikes, skips, matchesCount] = await Promise.all([
      prisma.swipeInteraction.count({
        where: { swiperId: userId },
      }),
      prisma.swipeInteraction.count({
        where: { swiperId: userId, action: SwipeAction.LIKE },
      }),
      prisma.swipeInteraction.count({
        where: { swiperId: userId, action: SwipeAction.DISLIKE },
      }),
      prisma.swipeInteraction.count({
        where: { swiperId: userId, action: SwipeAction.SKIP },
      }),
      prisma.profileMatch.count({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
          isActive: true,
        },
      }),
    ]);

    return {
      totalSwipes,
      likes,
      dislikes,
      skips,
      matchesCount,
      likeRate: totalSwipes > 0 ? ((likes / totalSwipes) * 100).toFixed(1) : '0',
    };
  }
}
