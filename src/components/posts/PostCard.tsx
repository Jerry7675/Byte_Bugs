'use client';
import { type Post } from '@/client/api/post-api';
import { useAuth } from '@/context/authContext';
import Image from 'next/image';
import { MessageUserButton } from '@/components/messaging/MessageUserButton';
import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const categoryColors = {
  FUNDING: 'bg-blue-100 text-blue-800',
  TECHNOLOGY: 'bg-purple-100 text-purple-800',
  MARKETING: 'bg-pink-100 text-pink-800',
  OPERATIONS: 'bg-orange-100 text-orange-800',
  GENERAL: 'bg-gray-100 text-gray-800',
};

const postTypeColors = {
  FUNDING_REQUEST: 'bg-orange-100 text-orange-800',
  INVESTMENT_OFFER: 'bg-emerald-100 text-emerald-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  ANNOUNCEMENT: 'bg-yellow-100 text-yellow-800',
  MILESTONE: 'bg-pink-100 text-pink-800',
  OTHER: 'bg-gray-100 text-gray-800',
};

const roleColors = {
  INVESTOR: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  STARTUP: 'bg-orange-100 text-orange-800 border-orange-200',
  ADMIN: 'bg-red-100 text-red-800 border-red-200',
};

const roleLabels = {
  INVESTOR: 'Investor',
  STARTUP: 'Startup',
  ADMIN: 'Admin',
};

export default function PostCard({ post, onDelete, showActions = false }: PostCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === post.authorId;
  const [imageError, setImageError] = useState(false);

  const isValidImageUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('supabase.co');
    } catch {
      return false;
    }
  };

  const hasValidImage = post.imageUrl && isValidImageUrl(post.imageUrl) && !imageError;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPostType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      {post.imageUrl && (
        <div className="relative w-full h-64 bg-gray-100">
          {hasValidImage ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <ImageIcon className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Header with badges */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                roleColors[post.author.role as keyof typeof roleColors]
              }`}
            >
              {roleLabels[post.author.role as keyof typeof roleLabels]}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                categoryColors[post.category as keyof typeof categoryColors] || categoryColors.GENERAL
              }`}
            >
              {post.category}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                postTypeColors[post.postType as keyof typeof postTypeColors] || postTypeColors.OTHER
              }`}
            >
              {formatPostType(post.postType)}
            </span>
            {post.author.isVerified && (
              <span className="text-green-600 text-xs font-medium">✓ Verified</span>
            )}
          </div>
          {showActions && isOwner && onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>

        {/* Content */}
        <p className="text-gray-700 mb-4 whitespace-pre-wrap line-clamp-4">{post.content}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author and Date */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-semibold text-xs">
                {post.author.firstName.charAt(0)}
                {post.author.lastName.charAt(0)}
              </span>
            </div>
            <span className="font-medium text-gray-900">
              {post.author.firstName} {post.author.lastName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>{formatDate(post.createdAt)}</span>
            {!isOwner && (
              <MessageUserButton
                userId={post.authorId}
                userName={`${post.author.firstName} ${post.author.lastName}`}
                variant="icon"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
