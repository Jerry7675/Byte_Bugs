/**
 * Chat Interface Component
 * Main conversation view with message list and input
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useMessages } from '@/client/hooks/useMessaging';
import { format, isToday, isYesterday } from 'date-fns';
import { Send, Clock, CheckCheck } from 'lucide-react';
import { CreateFundingButton } from '@/components/funding';

interface ChatInterfaceProps {
  conversationId: string;
  currentUserId: string;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  onMessageSent?: () => void;
}

export function ChatInterface({
  conversationId,
  currentUserId,
  otherUser,
  onMessageSent,
}: ChatInterfaceProps) {
  const { messages, loading, sendMessage, markAsRead, loadMore, hasMore } =
    useMessages(conversationId);
  const [messageInput, setMessageInput] = useState('');
  const [expirationHours, setExpirationHours] = useState<number | undefined>();
  const [sending, setSending] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  // Auto-scroll to bottom only when user hasn't manually scrolled
  useEffect(() => {
    // Only auto-scroll if new messages arrived and user hasn't manually scrolled
    if (messages.length > prevMessagesLengthRef.current && !userScrolled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, userScrolled]);

  // Handle scroll events
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

      // Update user scrolled state
      setUserScrolled(!isAtBottom);

      // Load more messages when scrolling to top
      if (scrollTop < 100 && hasMore && !loading) {
        loadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, loadMore]);

  // Mark messages as read when conversation opens
  useEffect(() => {
    if (messages.length > 0) {
      const unreadIds = messages
        .filter((m) => !m.isRead && m.senderId !== currentUserId)
        .map((m) => m.id);

      if (unreadIds.length > 0) {
        markAsRead(unreadIds);
      }
    }
  }, [messages, currentUserId, markAsRead]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || sending) return;

    setSending(true);
    const result = await sendMessage(messageInput, expirationHours);

    if (result.success) {
      setMessageInput('');
      setExpirationHours(undefined);
      setUserScrolled(false); // Reset scroll state to allow auto-scroll

      // Trigger quota refresh in parent
      if (onMessageSent) {
        onMessageSent();
      }

      // Scroll to bottom after sending
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Gracefully handle error without alert
      console.error('Failed to send message:', result.error);
    }

    setSending(false);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM d, HH:mm');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {otherUser.firstName} {otherUser.lastName}
            </h2>
            <p className="text-sm text-gray-500">{otherUser.role}</p>
          </div>
          {(otherUser.role === 'INVESTOR' || otherUser.role === 'STARTUP') && (
            <CreateFundingButton
              userId={otherUser.id}
              userName={`${otherUser.firstName} ${otherUser.lastName}`}
              userRole={otherUser.role as 'INVESTOR' | 'STARTUP'}
              variant="secondary"
              className="text-sm"
            />
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwn = message.senderId === currentUserId;
              const expiresAt = message.expiresAt ? new Date(message.expiresAt) : null;

              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                      isOwn
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <div
                      className={`flex items-center gap-2 mt-1 text-xs ${
                        isOwn ? 'text-green-100' : 'text-gray-500'
                      }`}
                    >
                      <span>{formatMessageTime(message.createdAt)}</span>
                      {expiresAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expires {format(expiresAt, 'MMM d, HH:mm')}
                        </span>
                      )}
                      {isOwn && message.isRead && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm text-gray-600">Auto-delete after:</label>
          <select
            value={expirationHours || ''}
            onChange={(e) =>
              setExpirationHours(e.target.value ? parseInt(e.target.value, 10) : undefined)
            }
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="">Never</option>
            <option value="1">1 hour</option>
            <option value="24">24 hours</option>
            <option value="168">7 days</option>
          </select>
        </div>

        <div className="flex gap-2">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={3}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sending}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
