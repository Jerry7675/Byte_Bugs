/**
 * Client API for Messaging
 */

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  expiresAt?: string;
  isExpired: boolean;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface Conversation {
  id: string;
  requesterId: string;
  receiverId: string;
  status: string;
  pointsCost: number;
  createdAt: string;
  updatedAt: string;
  requester: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  receiver: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  messages: Message[];
}

export interface QuotaStatus {
  messagesSentToday: number;
  remainingFree: number;
  requiresPoints: boolean;
  pointsPerMessage?: number;
}

/**
 * Get user's conversations
 */
export async function getConversations(): Promise<{
  success: boolean;
  data?: Conversation[];
  error?: string;
}> {
  try {
    const response = await fetch('/api/conversations', {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Failed to fetch conversations' };
    }

    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

/**
 * Create or get conversation
 */
export async function createConversation(params: {
  receiverId: string;
  pointsCost?: number;
}): Promise<{ success: boolean; data?: Conversation; error?: string }> {
  try {
    const response = await fetch('/api/conversations/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Failed to create conversation' };
    }

    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(params: {
  conversationId: string;
  limit?: number;
  before?: string;
}): Promise<{ success: boolean; data?: Message[]; error?: string }> {
  try {
    const queryParams = new URLSearchParams({
      conversationId: params.conversationId,
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.before && { before: params.before }),
    });

    const response = await fetch(`/api/messages?${queryParams}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Failed to fetch messages' };
    }

    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

/**
 * Send a message
 */
export async function sendMessage(params: {
  conversationId: string;
  content: string;
  expirationHours?: number;
}): Promise<{ success: boolean; data?: Message; error?: string }> {
  try {
    const response = await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Failed to send message' };
    }

    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(params: {
  conversationId: string;
  messageIds?: string[];
}): Promise<{ success: boolean; data?: { messagesMarked: number }; error?: string }> {
  try {
    const response = await fetch('/api/messages/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Failed to mark messages as read' };
    }

    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

/**
 * Get message quota status
 */
export async function getQuotaStatus(): Promise<{
  success: boolean;
  data?: QuotaStatus;
  error?: string;
}> {
  try {
    const response = await fetch('/api/messages/quota', {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Failed to fetch quota' };
    }

    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}
