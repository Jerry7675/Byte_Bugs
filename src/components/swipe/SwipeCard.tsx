import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  Heart,
  X,
  SkipForward,
  MapPin,
  Briefcase,
  Building2,
  TrendingUp,
  User,
  MessageCircle,
  DollarSign,
} from 'lucide-react';
import Image from 'next/image';
import type { Profile } from '@/client/hooks/useSwipe';
import { MessageUserButton } from '@/components/messaging/MessageUserButton';
import { CreateFundingButton } from '@/components/funding';

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (action: 'LIKE' | 'DISLIKE' | 'SKIP') => void;
  style?: React.CSSProperties;
}

export function SwipeCard({ profile, onSwipe, style }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const [imageError, setImageError] = useState(false);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        onSwipe('LIKE');
      } else {
        onSwipe('DISLIKE');
      }
    }
  };

  const profileData = profile.role === 'INVESTOR' ? profile.investor : profile.startup;
  const profilePhoto = profileData?.photo;
  const hasValidPhoto = profilePhoto && !imageError;
  const categories = profileData?.categories || [];
  const matchScore = profile.matchScore || 0;

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        ...style,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
    >
      <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Profile Image */}
        <div className="relative h-[60%] bg-gradient-to-br from-green-500 to-green-800">
          <div className="relative w-full h-full">
            {hasValidPhoto ? (
              <Image
                src={profilePhoto}
                alt={`${profile.firstName} ${profile.lastName}`}
                fill
                className="object-cover select-none pointer-events-none"
                onError={() => setImageError(true)}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center select-none">
                {profile.role === 'STARTUP' ? (
                  <Building2 className="w-32 h-32 text-white/80" strokeWidth={1.5} />
                ) : (
                  <User className="w-32 h-32 text-white/80" strokeWidth={1.5} />
                )}
              </div>
            )}
          </div>

          {/* Verification Badge */}
          {profile.isVerified && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              ✓ Verified
            </div>
          )}

          {/* Match Score */}
          {matchScore > 0 && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-gray-800">
                  {matchScore} Match{matchScore > 1 ? 'es' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Swipe Indicators */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1/2 left-8 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-2xl border-4 border-red-600 rotate-[-30deg]"
              style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
            >
              NOPE
            </motion.div>
            <motion.div
              className="absolute top-1/2 right-8 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-2xl border-4 border-green-600 rotate-30"
              style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
            >
              LIKE
            </motion.div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="h-[40%] p-6 overflow-y-auto">
          <div className="space-y-3">
            {/* Name and Role */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-gray-600 font-medium mt-1">
                {profile.role === 'INVESTOR' ? (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    Investor {profileData?.firmName && `• ${profileData.firmName}`}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    Startup {profileData?.name && `• ${profileData.name}`}
                  </span>
                )}
              </p>
            </div>

            {/* Bio */}
            {profileData?.bio && (
              <p className="text-gray-700 text-sm leading-relaxed">{profileData.bio}</p>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 5).map((cat: string, idx: number) => {
                  const isMatching = profile.matchingCategories?.includes(cat);
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isMatching
                          ? 'bg-green-100 text-green-700 border-2 border-green-400'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {cat}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Investment Range (for investors) */}
            {profile.role === 'INVESTOR' && profileData?.minTicket && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Investment Range:</span> ₹
                {(profileData.minTicket / 100000).toFixed(1)}L - ₹
                {profileData.maxTicket ? (profileData.maxTicket / 100000).toFixed(1) : '∞'}L
              </div>
            )}

            {/* Website */}
            {profileData?.website && (
              <a
                href={profileData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:underline flex items-center gap-1"
              >
                🌐 Visit Website
              </a>
            )}

            {/* Activity Score */}
            {profile.activityMetrics && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span>Activity Score: {profile.activityMetrics.activityScore}/100</span>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-200 mt-3">
              <MessageUserButton
                userId={profile.id}
                userName={`${profile.firstName} ${profile.lastName}`}
                variant="secondary"
                className="flex-1 text-sm"
              />
              <CreateFundingButton
                userId={profile.id}
                userName={`${profile.firstName} ${profile.lastName}`}
                userRole={profile.role as 'INVESTOR' | 'STARTUP'}
                variant="secondary"
                className="flex-1 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface SwipeButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  onSkip: () => void;
  disabled?: boolean;
}

export function SwipeButtons({ onLike, onDislike, onSkip, disabled }: SwipeButtonsProps) {
  return (
    <div className="flex justify-center items-center gap-4">
      <button
        onClick={onDislike}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group hover:bg-red-50"
      >
        <X className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={onSkip}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group hover:bg-yellow-50"
      >
        <SkipForward className="w-6 h-6 text-yellow-600 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={onLike}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group hover:bg-green-50"
      >
        <Heart className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
