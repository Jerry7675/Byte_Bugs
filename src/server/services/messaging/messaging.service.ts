import { getContext } from '@/context/context-store';
import { addHours, startOfDay, isAfter } from 'date-fns';
import { PointsTxType } from '@/lib/prisma.type';

const DAILY_FREE_LIMIT = 20;
const POINTS_PER_MESSAGE = 10;
const MIN_EXPIRATION_HOURS = 1;

export class MessagingService {
  /**
   * Send a message with optional expiration
   * - Validates daily quota
   * - Deducts points if needed
   * - Stores message in DB
   *
   * @returns Message object or error
   */
  async sendMessage(params: {
    senderId: string;
    conversationId: string;
    content: string;
    expirationHours?: number; // Optional: hours until message expires (min 1)
  }) {
    const { senderId, conversationId, content, expirationHours } = params;
    const { prisma } = getContext();

    // Validate content
    if (!content || content.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    if (content.length > 5000) {
      throw new Error('Message content too long (max 5000 characters)');
    }

    // Validate conversation exists and user is participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        requester: true,
        receiver: true,
      },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (conversation.requesterId !== senderId && conversation.receiverId !== senderId) {
      throw new Error('User is not a participant in this conversation');
    }

    // Validate expiration hours if provided
    let expiresAt: Date | null = null;
    if (expirationHours !== undefined) {
      if (expirationHours < MIN_EXPIRATION_HOURS) {
        throw new Error(`Expiration must be at least ${MIN_EXPIRATION_HOURS} hour(s)`);
      }
      expiresAt = addHours(new Date(), expirationHours);
    }

    // Check daily quota and points
    const quotaCheck = await this.checkAndUpdateQuota(senderId);

    if (!quotaCheck.canSend) {
      throw new Error(quotaCheck.reason || 'Cannot send message');
    }

    // Start transaction: create message + deduct points if needed
    const result = await prisma.$transaction(async (tx) => {
      // Create message
      const message = await tx.message.create({
        data: {
          conversationId,
          senderId,
          content,
          expiresAt,
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      });

      // Deduct points if quota exceeded
      if (quotaCheck.requiresPoints) {
        const wallet = await tx.pointsWallet.findUnique({
          where: { userId: senderId },
        });

        if (!wallet) {
          throw new Error('Wallet not found');
        }

        const balanceBefore = wallet.balance;
        const balanceAfter = wallet.balance - POINTS_PER_MESSAGE;

        await tx.pointsWallet.update({
          where: { id: wallet.id },
          data: { balance: balanceAfter },
        });

        await tx.pointsTransaction.create({
          data: {
            walletId: wallet.id,
            amount: -POINTS_PER_MESSAGE,
            type: PointsTxType.SPEND,
            reference: `MESSAGE_${message.id}`,
            note: `Message sent in conversation ${conversationId}`,
            status: 'success',
            balanceBefore,
            balanceAfter,
          },
        });
      }

      // Update conversation timestamp
      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return message;
    });

    return result;
  }

  /**
   * Check if user can send a message and update their quota
   * Returns whether sending is allowed and if points are required
   */
  private async checkAndUpdateQuota(userId: string): Promise<{
    canSend: boolean;
    requiresPoints: boolean;
    reason?: string;
  }> {
    const { prisma } = getContext();
    const today = startOfDay(new Date());

    // Find or create quota record
    let quota = await prisma.messageQuota.findUnique({
      where: { userId },
    });

    if (!quota) {
      // First time sending - create quota record
      quota = await prisma.messageQuota.create({
        data: {
          userId,
          messagesSentToday: 0,
          quotaDate: today,
        },
      });
    }

    // Reset quota if it's a new day
    const quotaDate = startOfDay(quota.quotaDate);
    if (quotaDate < today) {
      quota = await prisma.messageQuota.update({
        where: { userId },
        data: {
          messagesSentToday: 0,
          quotaDate: today,
        },
      });
    }

    // Check if within free limit
    if (quota.messagesSentToday < DAILY_FREE_LIMIT) {
      // Within free limit - increment and allow
      await prisma.messageQuota.update({
        where: { userId },
        data: {
          messagesSentToday: quota.messagesSentToday + 1,
        },
      });

      return {
        canSend: true,
        requiresPoints: false,
      };
    }

    // Exceeded free limit - check points balance
    const wallet = await prisma.pointsWallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.balance < POINTS_PER_MESSAGE) {
      return {
        canSend: false,
        requiresPoints: true,
        reason: `Insufficient points. Need ${POINTS_PER_MESSAGE} points (balance: ${wallet?.balance || 0})`,
      };
    }

    // Increment quota (points will be deducted in transaction)
    await prisma.messageQuota.update({
      where: { userId },
      data: {
        messagesSentToday: quota.messagesSentToday + 1,
      },
    });

    return {
      canSend: true,
      requiresPoints: true,
    };
  }

  /**
   * Get messages for a conversation
   * Excludes expired messages
   */
  async getMessages(params: {
    conversationId: string;
    userId: string;
    limit?: number;
    before?: string; // Message ID for pagination
  }) {
    const { conversationId, userId, limit = 50, before } = params;
    const { prisma } = getContext();

    // Verify user is participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (conversation.requesterId !== userId && conversation.receiverId !== userId) {
      throw new Error('Not authorized to view this conversation');
    }

    const now = new Date();

    // Build query
    const where: any = {
      conversationId,
      isExpired: false,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    };

    if (before) {
      const beforeMessage = await prisma.message.findUnique({
        where: { id: before },
      });

      if (beforeMessage) {
        where.createdAt = { lt: beforeMessage.createdAt };
      }
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return messages.reverse(); // Return in chronological order
  }

  /**
   * Get user's conversations
   */
  async getConversations(params: { userId: string }) {
    const { userId } = params;
    const { prisma } = getContext();

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ requesterId: userId }, { receiverId: userId }],
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        messages: {
          where: {
            isExpired: false,
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations;
  }

  /**
   * Create or get existing conversation
   */
  async createConversation(params: {
    requesterId: string;
    receiverId: string;
    pointsCost?: number;
  }) {
    const { requesterId, receiverId, pointsCost = 0 } = params;
    const { prisma } = getContext();

    // Validate users exist and have different roles
    const [requester, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: requesterId } }),
      prisma.user.findUnique({ where: { id: receiverId } }),
    ]);

    if (!requester || !receiver) {
      throw new Error('User not found');
    }

    if (requester.role === receiver.role) {
      throw new Error('Can only message users with different roles');
    }

    // Check if conversation already exists
    const existing = await prisma.conversation.findFirst({
      where: {
        OR: [
          { requesterId, receiverId },
          { requesterId: receiverId, receiverId: requesterId },
        ],
      },
    });

    if (existing) {
      return existing;
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        requesterId,
        receiverId,
        pointsCost,
        status: 'ACTIVE',
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return conversation;
  }

  /**
   * Cleanup expired messages for a user
   * Called on login
   */
  async cleanupExpiredMessages(userId: string) {
    const { prisma } = getContext();
    const now = new Date();

    // Find all expired messages in user's conversations
    const result = await prisma.message.updateMany({
      where: {
        conversation: {
          OR: [{ requesterId: userId }, { receiverId: userId }],
        },
        expiresAt: {
          lte: now,
        },
        isExpired: false,
      },
      data: {
        isExpired: true,
      },
    });

    return {
      messagesExpired: result.count,
    };
  }

  /**
   * Mark messages as read
   */
  async markAsRead(params: { conversationId: string; userId: string; messageIds?: string[] }) {
    const { conversationId, userId, messageIds } = params;
    const { prisma } = getContext();

    // Verify user is participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (conversation.requesterId !== userId && conversation.receiverId !== userId) {
      throw new Error('Not authorized');
    }

    const where: any = {
      conversationId,
      senderId: { not: userId }, // Don't mark own messages as read
      isRead: false,
    };

    if (messageIds && messageIds.length > 0) {
      where.id = { in: messageIds };
    }

    const result = await prisma.message.updateMany({
      where,
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      messagesMarked: result.count,
    };
  }

  /**
   * Get user's message quota status
   */
  async getQuotaStatus(userId: string) {
    const { prisma } = getContext();
    const today = startOfDay(new Date());

    let quota = await prisma.messageQuota.findUnique({
      where: { userId },
    });

    if (!quota) {
      return {
        messagesSentToday: 0,
        remainingFree: DAILY_FREE_LIMIT,
        requiresPoints: false,
      };
    }

    // Reset if new day
    const quotaDate = startOfDay(quota.quotaDate);
    if (quotaDate < today) {
      return {
        messagesSentToday: 0,
        remainingFree: DAILY_FREE_LIMIT,
        requiresPoints: false,
      };
    }

    const remaining = Math.max(0, DAILY_FREE_LIMIT - quota.messagesSentToday);

    return {
      messagesSentToday: quota.messagesSentToday,
      remainingFree: remaining,
      requiresPoints: remaining === 0,
      pointsPerMessage: POINTS_PER_MESSAGE,
    };
  }
}
