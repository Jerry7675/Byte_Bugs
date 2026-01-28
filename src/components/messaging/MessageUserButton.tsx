/**
 * MessageUserButton - Reusable button to start a conversation with a user
 * Shows on profiles, posts, etc.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { createConversation } from '@/client/api/messaging-api';
import { useAuth } from '@/context/authContext';
import { toast } from 'sonner';

interface MessageUserButtonProps {
  userId: string;
  userName: string;
  userRole?: string;
  variant?: 'primary' | 'secondary' | 'icon';
  className?: string;
}

export function MessageUserButton({
  userId,
  userName,
  userRole,
  variant = 'primary',
  className = '',
}: MessageUserButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Don't show button if user has same role or user is not logged in
  if (!user || (userRole && user.role === userRole)) {
    return null;
  }

  const handleMessage = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      const response = await createConversation({ receiverId: userId });

      if (response.success && response.data) {
        const conversationId = response.data.id;
        router.push(`/messages?conversation=${conversationId}`);
      } else {
        toast.error(response.error || 'Failed to start conversation');
      }
    } catch (error) {
      toast.error(
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
