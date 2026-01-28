'use client';
import { useState, useEffect } from 'react';
import { getPosts, deletePost, type Post } from '@/client/api/post-api';
import PostCard from './PostCard';
import { toast } from 'sonner';

interface PostsFeedProps {
  refreshTrigger?: number;
  showActions?: boolean;
}

export default function PostsFeed({ refreshTrigger, showActions = false }: PostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [postTypeFilter, setPostTypeFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPosts = async (pageNum: number = 1, append: boolean = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError('');

    const result = await getPosts({
      page: pageNum,
      limit: 20,
      category: categoryFilter || undefined,
      postType: postTypeFilter || undefined,
    });

    if (result.success && result.data) {
      if (append) {
        setPosts((prev) => [...prev, ...result.data!.posts]);
      } else {
        setPosts(result.data.posts);
      }
      setTotalPages(result.data.pagination.totalPages);
      setPage(pageNum);
    } else {
      setError(result.error || 'Failed to load posts');
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    loadPosts(1, false);
  }, [categoryFilter, postTypeFilter, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const result = await deletePost(id);
    if (result.success) {
      setPosts(posts.filter((p) => p.id !== id));
      toast.success('Post deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete post');
    }
  };

  const handleBoost = async (id: string) => {
    // Reload posts after boosting to reflect changes
    await loadPosts(1, false);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      loadPosts(page + 1, true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="category-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="">All Categories</option>
              <option value="FUNDING">Funding</option>
              <option value="TECHNOLOGY">Technology</option>
              <option value="MARKETING">Marketing</option>
              <option value="OPERATIONS">Operations</option>
              <option value="GENERAL">General</option>
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Post Type
            </label>
            <select
              id="type-filter"
              value={postTypeFilter}
              onChange={(e) => setPostTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="">All Types</option>
              <option value="UPDATE">Update</option>
              <option value="FUNDING_REQUEST">Funding Request</option>
              <option value="INVESTMENT_OFFER">Investment Offer</option>
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="MILESTONE">Milestone</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-500">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {categoryFilter || postTypeFilter
              ? 'Try changing your filters'
              : 'Be the first to create a post!'}
          </p>
        </div>
      ) : (
        <>
          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={showActions ? handleDelete : undefined}
                onBoost={showActions ? handleBoost : undefined}
                showActions={showActions}
              />
            ))}
          </div>

          {/* Load More */}
          {page < totalPages && (
            <div className="text-center py-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}

          {/* Pagination Info */}
          {/* <div className="text-center text-sm text-gray-500">
            Showing {posts.length} of {totalPages * 20} posts
          </div> */}
        </>
      )}
    </div>
  );
}
