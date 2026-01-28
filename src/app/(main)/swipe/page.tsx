'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { SwipeCard, SwipeButtons } from '@/components/swipe/SwipeCard';
import { SwipeQuotaDisplay } from '@/components/swipe/SwipeQuotaDisplay';
import {
  useSwipeProfiles,
  useSwipeAction,
  useSwipeQuota,
  useUndoSkip,
  useSwipeStats,
  Profile,
} from '@/client/hooks/useSwipe';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SwipePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profiles, loading: profilesLoading, error, refetch } = useSwipeProfiles();
  const { performSwipe, loading: swipeLoading } = useSwipeAction();
  const { quota, refetch: refetchQuota } = useSwipeQuota();
  const { undoSkip, loading: undoLoading } = useUndoSkip();
  const { stats, refetch: refetchStats } = useSwipeStats();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<any>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  const handleSwipe = async (action: 'LIKE' | 'DISLIKE' | 'SKIP') => {
    if (!currentProfile || swipeLoading) return;

    try {
      const result = await performSwipe(currentProfile.id, action);

      // Show feedback
      setActionFeedback(action);
      setTimeout(() => setActionFeedback(null), 500);

      // Check for match
      if (result.match) {
        setMatchedProfile(result.match);
        setShowMatch(true);
      }

      // Move to next profile
      setCurrentIndex((prev) => prev + 1);

      // Refetch quota and stats
      refetchQuota();
      refetchStats();

      // If running low on profiles, fetch more
      if (currentIndex >= profiles.length - 3) {
        refetch();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to perform swipe');
    }
  };

  const handleUndo = async () => {
    try {
      const result = await undoSkip();
      alert(`Undo successful! ${result.pointsSpent} points spent.`);

      // Refetch data first to get updated profiles
      await refetch();

      // Then go back one profile if possible
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else {
        setCurrentIndex(0);
      }

      refetchQuota();
      refetchStats();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to undo';

      // Handle specific error cases gracefully
      if (errorMessage.includes('Undo window expired')) {
        // Just refresh quota to hide the undo button, don't show alert
        refetchQuota();
        console.log('Undo window expired');
      } else if (errorMessage.includes('No recent skip')) {
        refetchQuota();
        console.log('No recent skip to undo');
      } else if (errorMessage.includes('Insufficient points')) {
        alert('You need more points to undo. Please add points to your wallet.');
      } else {
        alert(errorMessage);
      }
    }
  };

  const closeMatchModal = () => {
    setShowMatch(false);
    setMatchedProfile(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-lime-50 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-green-600" />
                Discover
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {user.role === 'INVESTOR' ? 'Find promising startups' : 'Connect with investors'}
              </p>
            </div>
            <Link
              href="/swipe/matches"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Users className="w-5 h-5" />
              Matches
              {stats && stats.matchesCount > 0 && (
                <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {stats.matchesCount}
                </span>
              )}
            </Link>
          </div>

          {/* Quota Display */}
          {quota && (
            <SwipeQuotaDisplay
              quota={quota}
              onUndo={quota.canUndo ? handleUndo : undefined}
              undoLoading={undoLoading}
            />
          )}

          {/* Stats */}
          {stats && (
            <div className="mt-4 bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-900">{stats.totalSwipes}</span> swipes
                  </span>
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold text-green-600">{stats.likes}</span> likes
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold text-green-600">{stats.matchesCount}</span> matches
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {profilesLoading && (
          <div className="flex items-center justify-center h-150">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading profiles...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error loading profiles</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={refetch}
                className="mt-2 text-red-700 hover:text-red-800 text-sm font-medium underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* No More Profiles */}
        {!profilesLoading && !error && profiles.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all caught up!</h2>
            <p className="text-gray-600 mb-6">
              No more profiles to show right now. Check back later!
            </p>
            <button
              onClick={refetch}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Swipe Cards */}
        {!profilesLoading && !error && currentIndex < profiles.length && (
          <div className="relative">
            {/* Card Stack */}
            <div className="relative h-150">
              <AnimatePresence>
                {profiles.slice(currentIndex, currentIndex + 3).map((profile, idx) => (
                  <motion.div
                    key={profile.id}
                    initial={{ scale: 1 - idx * 0.05, y: idx * 10 }}
                    animate={{ scale: 1 - idx * 0.05, y: idx * 10 }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.2 },
                    }}
                    style={{
                      zIndex: 10 - idx,
                    }}
                    className="absolute inset-0"
                  >
                    {idx === 0 ? (
                      <SwipeCard profile={profile} onSwipe={handleSwipe} />
                    ) : (
                      <div className="w-full h-full bg-white rounded-2xl shadow-lg" />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="mt-6">
              <SwipeButtons
                onLike={() => handleSwipe('LIKE')}
                onDislike={() => handleSwipe('DISLIKE')}
                onSkip={() => handleSwipe('SKIP')}
                disabled={swipeLoading}
              />
            </div>
          </div>
        )}

        {/* Match Modal */}
        <AnimatePresence>
          {showMatch && matchedProfile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closeMatchModal}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">It's a Match!</h2>
                <p className="text-gray-600 mb-6">
                  You and{' '}
                  {matchedProfile.user1Id === user.id
                    ? `${matchedProfile.user2.firstName} ${matchedProfile.user2.lastName}`
                    : `${matchedProfile.user1.firstName} ${matchedProfile.user1.lastName}`}{' '}
                  liked each other
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={closeMatchModal}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Keep Swiping
                  </button>
                  <Link
                    href="/swipe/matches"
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Matches
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
