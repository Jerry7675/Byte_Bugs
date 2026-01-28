/**
 * Post History List Component
 * Displays user's posts
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, MessageSquare, Heart, ImageIcon } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  category: string;
  postType: string;
  tags: string[];
  createdAt: string | Date;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface PostHistoryListProps {
  userId: string;
}

export function PostHistoryList({ userId }: PostHistoryListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, [userId, page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/profile/${userId}/posts?page=${page}&limit=10`);
      const data = await res.json();

      if (data.success) {
        setPosts((prev) => (page === 1 ? data.data.posts : [...prev, ...data.data.posts]));
        setHasMore(data.data.pagination.page < data.data.pagination.totalPages);
      } else {
        setError(data.error || 'Failed to load posts');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  const isValidImageUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('supabase.co');
    } catch {
      return false;
    }
  };

  const handleImageError = (postId: string) => {
    setImageErrors((prev) => new Set(prev).add(postId));
  };

  if (loading && page === 1) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const hasValidImage = post.imageUrl && isValidImageUrl(post.imageUrl) && !imageErrors.has(post.id);
        
        return (
          <div
            key={post.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {post.imageUrl && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {hasValidImage ? (
                    <Image 
                      src={post.imageUrl} 
                      alt={post.title} 
                      fill 
                      className="object-cover"
                      onError={() => handleImageError(post.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    {post.postType}
                  </span>
                </div>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded bg-green-50 text-green-700"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs px-2 py-1 text-gray-500">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={loading}
          className="w-full py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
