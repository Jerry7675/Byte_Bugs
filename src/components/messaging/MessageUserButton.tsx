/**
 * MessageUserButton - Reusable button to start a conversation with a user
 * Shows on profiles, posts, etc.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { createConversation } from '@/client/api/messaging-api';

interface MessageUserButtonProps {
  userId: string;
  userName: string;
  variant?: 'primary' | 'secondary' | 'icon';
  className?: string;
}

export function MessageUserButton({
  userId,
  userName,
  variant = 'primary',
  className = '',
}: MessageUserButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMessage = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      console.log('Creating conversation with user:', userId);
      const response = await createConversation({ receiverId: userId });
      console.log('Conversation response:', response);

      if (response.success && response.data) {
        const conversationId = response.data.id;
        console.log('Navigating to conversation:', conversationId);
        router.push(`/messages?conversation=${conversationId}`);
      } else {
        console.error('Failed to create conversation:', response.error);
        alert(response.error || 'Failed to start conversation');
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
      alert(
        `Failed to start conversation: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleMessage}
        disabled={loading}
        className={`p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors disabled:opacity-50 ${className}`}
        title={`Message ${userName}`}
      >
        <MessageCircle className="w-5 h-5" />
      </button>
    );
  }

  if (variant === 'secondary') {
    return (
      <button
        onClick={handleMessage}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 text-green-600 bg-white border border-green-600 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        <span>Message</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleMessage}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
      <span>Message</span>
    </button>
  );
}
