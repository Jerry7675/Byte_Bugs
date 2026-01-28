/**
 * React Hooks for Messaging (HTTP Polling)
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getConversations,
  getMessages,
  sendMessage as sendMessageApi,
  markMessagesAsRead,
  getQuotaStatus,
  getUnreadCount,
  type Message,
  type Conversation,
  type QuotaStatus,
} from '@/client/api/messaging-api';

/**
 * Hook to manage conversations
 */
export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getConversations();

      if (response.success && response.data) {
        setConversations(response.data);
      } else {
        setError(response.error || 'Failed to fetch conversations');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchConversations, 5000);

    return () => clearInterval(interval);
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
  };
}

/**
 * Hook to manage messages in a conversation with HTTP polling
 */
export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const lastMessageIdRef = useRef<string | null>(null);

  // Fetch messages
  const fetchMessages = useCallback(
    async (before?: string) => {
      try {
        if (!before) {
          setLoading(true);
        }
        setError(null);

        const response = await getMessages({
          conversationId,
          limit: 50,
          before,
        });

        if (response.success && response.data) {
          if (before) {
            setMessages((prev) => [...response.data!, ...prev]);
          } else {
            setMessages(response.data);
          }

          setHasMore(response.data.length === 50);

          // Track last message ID for polling
          if (response.data.length > 0) {
            lastMessageIdRef.current = response.data[response.data.length - 1].id;
          }
        } else {
          setError(response.error || 'Failed to fetch messages');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [conversationId],
  );

  // Poll for new messages
  const pollForNewMessages = useCallback(async () => {
    try {
      const response = await getMessages({
        conversationId,
        limit: 50,
      });

      if (response.success && response.data) {
        // Check if there are new messages
        const lastKnownId = lastMessageIdRef.current;
        if (lastKnownId) {
          const newMessages = response.data.filter(
            (msg) =>
              new Date(msg.createdAt) >
              new Date(messages.find((m) => m.id === lastKnownId)?.createdAt || 0),
          );

          if (newMessages.length > 0) {
            setMessages(response.data);
            lastMessageIdRef.current = response.data[response.data.length - 1].id;
          }
        } else {
          setMessages(response.data);
          if (response.data.length > 0) {
            lastMessageIdRef.current = response.data[response.data.length - 1].id;
          }
        }
      }
    } catch (err) {
      // Silent fail for polling
      console.error('Polling error:', err);
    }
  }, [conversationId, messages]);

  // Initial fetch and polling setup
  useEffect(() => {
    if (conversationId) {
      fetchMessages();

      // Poll for new messages every 2 seconds
      const interval = setInterval(pollForNewMessages, 2000);

      return () => clearInterval(interval);
    }
  }, [conversationId, fetchMessages]);

  const sendMessage = useCallback(
    async (content: string, expirationHours?: number) => {
      try {
        const response = await sendMessageApi({
          conversationId,
          content,
          expirationHours,
        });

        if (response.success && response.data) {
          // Optimistically add message
          setMessages((prev) => [...prev, response.data!]);
          lastMessageIdRef.current = response.data.id;
          return { success: true };
        } else {
          return { success: false, error: response.error };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [conversationId],
  );

  const markAsRead = useCallback(
    async (messageIds?: string[]) => {
      try {
        await markMessagesAsRead({ conversationId, messageIds });
      } catch (err) {
        console.error('Failed to mark messages as read:', err);
      }
    },
    [conversationId],
  );

  const loadMore = useCallback(() => {
    if (hasMore && messages.length > 0 && !loading) {
      fetchMessages(messages[0].id);
    }
  }, [hasMore, messages, loading, fetchMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    loadMore,
    hasMore,
  };
}

/**
 * Hook to get message quota status
 */
export function useQuotaStatus() {
  const [quota, setQuota] = useState<QuotaStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuota = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getQuotaStatus();

      if (response.success && response.data) {
        setQuota(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch quota:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  return {
    quota,
    loading,
    refetch: fetchQuota,
  };
}

/**
 * Hook to get unread message count
 */
export function useUnreadCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();

      if (response.success && response.data) {
        setCount(response.data.count);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchCount, 5000);

    return () => clearInterval(interval);
  }, [fetchCount]);

  return {
    count,
    loading,
    refetch: fetchCount,
  };
}
