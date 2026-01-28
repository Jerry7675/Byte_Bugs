/**
 * Messaging API - Server-side functions
 */

import { MessagingService } from '@/server/services/messaging';

const messagingService = new MessagingService();

/**
 * Send a message
 */
export async function sendMessageApi(params: {
  userId: string;
  conversationId: string;
  content: string;
  expirationHours?: number;
}) {
  try {
    const message = await messagingService.sendMessage({
      senderId: params.userId,
      conversationId: params.conversationId,
      content: params.content,
      expirationHours: params.expirationHours,
    });

    return {
      success: true,
      data: message,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to send message',
    };
  }
}

/**
 * Get messages for a conversation
 */
export async function getMessagesApi(params: {
  userId: string;
  conversationId: string;
  limit?: number;
  before?: string;
}) {
  try {
    const messages = await messagingService.getMessages(params);

    return {
      success: true,
      data: messages,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch messages',
    };
  }
}

/**
 * Get user's conversations
 */
export async function getConversationsApi(params: { userId: string }) {
  try {
    const conversations = await messagingService.getConversations(params);

    return {
      success: true,
      data: conversations,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch conversations',
    };
  }
}

/**
 * Create or get conversation
 */
export async function createConversationApi(params: {
  requesterId: string;
  receiverId: string;
  pointsCost?: number;
}) {
  try {
    const conversation = await messagingService.createConversation(params);

    return {
      success: true,
      data: conversation,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create conversation',
    };
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsReadApi(params: {
  userId: string;
  conversationId: string;
  messageIds?: string[];
}) {
  try {
    const result = await messagingService.markAsRead(params);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to mark messages as read',
    };
  }
}

/**
 * Get user's message quota status
 */
export async function getQuotaStatusApi(params: { userId: string }) {
  try {
    const status = await messagingService.getQuotaStatus(params.userId);

    return {
      success: true,
      data: status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch quota status',
    };
  }
}

/**
 * Cleanup expired messages (called on login)
 */
export async function cleanupExpiredMessagesApi(params: { userId: string }) {
  try {
    const result = await messagingService.cleanupExpiredMessages(params.userId);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to cleanup messages',
    };
  }
}
