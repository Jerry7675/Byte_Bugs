'use client';

import { useConversations } from '@/client/hooks/useMessaging';
import { format } from 'date-fns';
import { MessageCircle, User } from 'lucide-react';

interface ConversationsListProps {
  currentUserId: string;
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId?: string;
}

export function ConversationsList({
  currentUserId,
  onSelectConversation,
  selectedConversationId,
}: ConversationsListProps) {
  const { conversations, loading, error } = useConversations();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">No conversations yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Start a conversation to connect with investors or startups
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => {
        const otherUser =
          conversation.requesterId === currentUserId
            ? conversation.receiver
            : conversation.requester;

        const lastMessage = conversation.messages[0];
        const isSelected = conversation.id === selectedConversationId;

        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              isSelected ? 'bg-green-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {otherUser.firstName} {otherUser.lastName}
                  </h3>
                  {lastMessage && (
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {format(new Date(lastMessage.createdAt), 'MMM d')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-1">{otherUser.role}</p>
                {lastMessage && (
                  <p className="text-sm text-gray-600 truncate">{lastMessage.content}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
