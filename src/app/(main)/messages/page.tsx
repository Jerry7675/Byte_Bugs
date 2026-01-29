/**
 * Messages Page - Messenger Style
 * Full-screen messaging interface with sidebar
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useConversations, useQuotaStatus } from '@/client/hooks/useMessaging';
import { ChatInterface } from '@/components/messaging/ChatInterface';
import { QuotaDisplay } from '@/components/messaging/QuotaDisplay';
import { MessageCircle, User, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/authContext';

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { conversations, loading } = useConversations();
  const { quota, refetch: refetchQuota } = useQuotaStatus();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) {
    return <div>Loading...</div>;
  }

  // Handle conversation query param (from Message button clicks)
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId) {
      setSelectedConversationId(conversationId);
    } else if (!selectedConversationId && conversations.length > 0) {
      // Auto-select first conversation if no specific one requested
      setSelectedConversationId(conversations[0].id);
    }
  }, [searchParams, conversations, selectedConversationId]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);
  const otherUser = selectedConversation
    ? selectedConversation.requesterId === user.id
      ? selectedConversation.receiver
      : selectedConversation.requester
    : null;

  const filteredConversations = conversations.filter((conv) => {
    const other = conv.requesterId === user.id ? conv.receiver : conv.requester;
    const fullName = `${other.firstName} ${other.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-screen flex flex-col bg-gray-50 border border-gray-200 rounded-lg">
      {/* Top Bar */}
      <div className="border-b border-gray-200 p-4 shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          </div>
          <QuotaDisplay quotaStatus={quota} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden bg-white rounded-lg">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-white shrink-0">
          {/* Search */}
          <div className="p-3 border-b border-green-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading && conversations.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredConversations.map((conversation) => {
                  const other =
                    conversation.requesterId === user.id
                      ? conversation.receiver
                      : conversation.requester;

                  const lastMessage = conversation.messages[0];
                  const isSelected = conversation.id === selectedConversationId;
                  const hasUnread =
                    lastMessage && !lastMessage.isRead && lastMessage.senderId !== user.id;

                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversationId(conversation.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-green-50 border-l-4 border-green-600' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2 mb-1">
                            <h3
                              className={`text-sm font-semibold truncate ${
                                hasUnread ? 'text-gray-900' : 'text-gray-700'
                              }`}
                            >
                              {other.firstName} {other.lastName}
                            </h3>
                            {lastMessage && (
                              <span className="text-xs text-gray-500 shrink-0">
                                {format(new Date(lastMessage.createdAt), 'MMM d')}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-1">{other.role}</p>
                          {lastMessage && (
                            <div className="flex items-center justify-between gap-2">
                              <p
                                className={`text-sm truncate ${
                                  hasUnread ? 'font-semibold text-gray-900' : 'text-gray-600'
                                }`}
                              >
                                {lastMessage.content}
                              </p>
                              {hasUnread && (
                                <div className="w-2 h-2 rounded-full bg-green-600 shrink-0"></div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedConversation && otherUser ? (
            <ChatInterface
              conversationId={selectedConversation.id}
              currentUserId={user.id}
              otherUser={otherUser}
              onMessageSent={refetchQuota}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 rounded-lg">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
