'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { useMatches } from '@/client/hooks/useSwipe';
import { ArrowLeft, Users, Briefcase, Building2, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function MatchesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { matches, loading, refetch } = useMatches();

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/swipe"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Discover
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-8 h-8 text-green-600" />
                Your Matches
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
              </p>
            </div>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading matches...</p>
            </div>
          </div>
        )}

        {/* No Matches */}
        {!loading && matches.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No matches yet</h2>
            <p className="text-gray-600 mb-6">
              Keep swiping to find potential {user.role === 'INVESTOR' ? 'startups' : 'investors'}!
            </p>
            <Link
              href="/swipe"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Swiping
            </Link>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => {
              const otherUser = match.otherUser;
              const profile =
                otherUser.role === 'INVESTOR' ? otherUser.investor : otherUser.startup;
              const profilePhoto = profile?.photo || '/default-avatar.png';

              return (
                <div
                  key={match.matchId}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Profile Header */}
                  <div className="relative h-48 bg-linear-to-br from-green-500 to-emerald-500">
                    <div className="relative w-full h-full">
                      <Image
                        src={profilePhoto}
                        alt={`${otherUser.firstName} ${otherUser.lastName}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

                    {/* Verified Badge */}
                    {otherUser.isVerified && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        ✓ Verified
                      </div>
                    )}

                    {/* Name Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-xl">
                        {otherUser.firstName} {otherUser.lastName}
                      </h3>
                      <p className="text-white/90 text-sm flex items-center gap-1 mt-1">
                        {otherUser.role === 'INVESTOR' ? (
                          <>
                            <Briefcase className="w-4 h-4" />
                            Investor
                          </>
                        ) : (
                          <>
                            <Building2 className="w-4 h-4" />
                            Startup
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-5">
                    {/* Bio */}
                    {profile?.bio && (
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{profile.bio}</p>
                    )}

                    {/* Categories */}
                    {profile?.categories && profile.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {profile.categories.slice(0, 4).map((cat: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Investment Range (for investors) */}
                    {otherUser.role === 'INVESTOR' && profile?.minTicket && (
                      <div className="text-sm text-gray-600 mb-4">
                        <span className="font-medium">Investment Range:</span> ₹
                        {(profile.minTicket / 100000).toFixed(1)}L - ₹
                        {profile.maxTicket ? (profile.maxTicket / 100000).toFixed(1) : '∞'}L
                      </div>
                    )}

                    {/* Match Date */}
                    <div className="text-xs text-gray-500 mb-4">
                      Matched {new Date(match.matchedAt).toLocaleDateString()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/profile/${otherUser.id}`}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
                      >
                        View Profile
                      </Link>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1 text-sm font-medium">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        {!loading && matches.length > 0 && (
          <div className="mt-8 text-center bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Keep Growing Your Network!</h3>
            <p className="text-gray-600 mb-4">
              Find more potential {user.role === 'INVESTOR' ? 'startups' : 'investors'} to connect
              with
            </p>
            <Link
              href="/swipe"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Swiping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
