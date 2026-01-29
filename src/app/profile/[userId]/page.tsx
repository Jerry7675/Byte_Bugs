/**
 * Unified Profile Page
 * Displays profile for both Startup and Investor users
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Globe,
  Briefcase,
  Building2,
  Edit,
  Mail,
  Calendar,
  ArrowLeft,
  TrendingUp,
  User,
} from 'lucide-react';
import { VerificationBadge, VerificationStagesBadge } from '@/components/profile/VerificationBadge';
import { CategoryTags } from '@/components/profile/CategoryTags';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { PostHistoryList } from '@/components/profile/PostHistoryList';
import { FundingHistory, CreateFundingButton } from '@/components/funding';
import { MessageUserButton } from '@/components/messaging/MessageUserButton';

interface ProfileData {
  user: {
    id: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    verifiedAt: Date | null;
    createdAt: Date;
  };
  profile: {
    id: string;
    bio?: string | null;
    description?: string | null;
    photo?: string | null;
    website?: string | null;
    firmName?: string | null;
    minTicket?: number | null;
    maxTicket?: number | null;
    name?: string | null;
    stage?: string | null;
  };
  categories: Array<{ id: string; name: string }>;
  stats: {
    postsCount: number;
    activeHours: number;
    joinedDays: number;
  };
  verificationStages?: {
    identity?: { status: string; reviewedAt?: Date | null };
    role?: { status: string; reviewedAt?: Date | null };
    activity?: { status: string };
    community?: { status: string };
  };
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'funding'>('posts');

  const isOwner = currentUser?.id === userId;

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/profile/${userId}`);
      const data = await res.json();

      if (data.success) {
        setProfile(data.data);
      } else {
        setError(data.error || 'Failed to load profile');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-white rounded-xl"></div>
            <div className="h-48 bg-white rounded-xl"></div>
            <div className="h-96 bg-white rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md">
          <p className="text-red-700 text-lg font-medium mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${profile.user.firstName} ${profile.user.middleName ? profile.user.middleName + ' ' : ''}${profile.user.lastName}`;
  const isStartup = profile.user.role === 'STARTUP';
  const isInvestor = profile.user.role === 'INVESTOR';

  // Check if photo is from allowed domain (Supabase)
  const isValidImageUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('supabase.co');
    } catch {
      return false;
    }
  };

  const hasValidPhoto =
    profile.profile.photo && isValidImageUrl(profile.profile.photo) && !imageError;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cover Photo Placeholder */}
          <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-500"></div>

          <div className="px-6 md:px-8 pb-6">
            {/* Profile Photo & Basic Info */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 -mt-16 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                {/* Profile Photo */}
                <div className="relative w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex-shrink-0">
                  {hasValidPhoto ? (
                    <Image
                      src={profile.profile.photo!}
                      alt={fullName}
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                      {profile.user.firstName[0] && profile.user.lastName[0] ? (
                        <span className="text-4xl font-bold text-white">
                          {profile.user.firstName[0]}
                          {profile.user.lastName[0]}
                        </span>
                      ) : (
                        <User className="w-16 h-16 text-white" />
                      )}
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {isStartup && profile.profile.name ? profile.profile.name : fullName}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      {profile.user.role}
                    </span>
                    <VerificationBadge
                      isVerified={profile.user.isVerified}
                      verifiedAt={profile.user.verifiedAt}
                      stages={profile.verificationStages}
                    />
                    <VerificationStagesBadge stages={profile.verificationStages} />
                  </div>
                  {profile.profile.bio && (
                    <p className="text-gray-600 max-w-2xl">{profile.profile.bio}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {!isOwner && currentUser && (
                <div className="flex items-center gap-3">
                  <MessageUserButton userId={userId} userName={fullName} variant="secondary" />
                  {(isInvestor || isStartup) && (
                    <CreateFundingButton
                      userId={userId}
                      userName={fullName}
                      userRole={profile.user.role as 'INVESTOR' | 'STARTUP'}
                      variant="primary"
                    />
                  )}
                </div>
              )}

              {/* Edit Button */}
              {isOwner && (
                <Link
                  href="/profile/edit"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Additional Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {isInvestor && profile.profile.firmName && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Firm:</span>
                  <span>{profile.profile.firmName}</span>
                </div>
              )}

              {isInvestor && (profile.profile.minTicket || profile.profile.maxTicket) && (
                <div className="flex items-center gap-2 text-gray-700">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Ticket Size:</span>
                  <span>
                    ${profile.profile.minTicket?.toLocaleString() || '0'} - $
                    {profile.profile.maxTicket?.toLocaleString() || '0'}
                  </span>
                </div>
              )}

              {isStartup && profile.profile.stage && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Building2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Stage:</span>
                  <span className="capitalize">{profile.profile.stage}</span>
                </div>
              )}

              {profile.profile.website && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Globe className="w-5 h-5 text-green-600" />
                  <a
                    href={profile.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-medium">Joined:</span>
                <span>{new Date(profile.user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Categories */}
            {profile.categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                <CategoryTags categories={profile.categories.map((c) => c.name)} />
              </div>
            )}

            {/* Description (for startups) */}
            {isStartup && profile.profile.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">About</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{profile.profile.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <ProfileStats
          postsCount={profile.stats.postsCount}
          activeHours={profile.stats.activeHours}
          joinedDays={profile.stats.joinedDays}
        />

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'posts'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Posts
              </button>
              {(isInvestor || isStartup) && (
                <button
                  onClick={() => setActiveTab('funding')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'funding'
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Funding History
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'posts' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts</h2>
                <PostHistoryList userId={userId} />
              </div>
            )}

            {activeTab === 'funding' && (isInvestor || isStartup) && (
              <div>
                <FundingHistory userId={userId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
