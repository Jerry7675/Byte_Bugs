'use client';
import { useState } from 'react';
import { useAuth } from '@/context/authContext';
import CreatePostForm from '@/components/posts/CreatePostForm';
import PostsFeed from '@/components/posts/PostsFeed';
import { Button } from '@/components/ui/button';

export default function StartupDashboard() {
  const { user } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    setShowCreatePost(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Startup Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your startup, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900">Profile Views</h3>
          <p className="mt-2 text-2xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-sm font-semibold text-green-900">Funding Requests</h3>
          <p className="mt-2 text-2xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h3 className="text-sm font-semibold text-orange-900">Messages</h3>
          <p className="mt-2 text-2xl font-bold text-orange-600">0</p>
        </div>
      </div>

      {/* Posting System */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Community Feed</h2>
          <Button
            onClick={() => setShowCreatePost(!showCreatePost)}
            variant={showCreatePost ? 'outline' : 'default'}
          >
            {showCreatePost ? 'Cancel' : '+ Create Post'}
          </Button>
        </div>

        {showCreatePost && (
          <CreatePostForm
            onSuccess={handlePostCreated}
            onCancel={() => setShowCreatePost(false)}
          />
        )}

        <PostsFeed refreshTrigger={refreshTrigger} showActions={true} />
      </div>
    </div>
  );
}
