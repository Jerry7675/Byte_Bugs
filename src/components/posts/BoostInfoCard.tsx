'use client';
import { useState, useEffect } from 'react';
import { getBoostInfo } from '@/client/api/post-api';
import { TrendingUp, Clock, Coins } from 'lucide-react';

export default function BoostInfoCard() {
  const [boostInfo, setBoostInfo] = useState<{ cost: number; durationHours: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBoostInfo = async () => {
      const result = await getBoostInfo();
      if (result.success && result.data) {
        setBoostInfo(result.data);
      }
      setLoading(false);
    };

    loadBoostInfo();
  }, []);

  if (loading || !boostInfo) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Boost Your Posts</h3>
      </div>

      <p className="text-sm text-gray-700 mb-3">
        Make your posts stand out! Boosted posts appear at the top of the feed and get more
        visibility.
      </p>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-600" />
          <span className="font-medium text-gray-900">{boostInfo.cost} Points</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-600" />
          <span className="font-medium text-gray-900">{boostInfo.durationHours} Hours</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-yellow-200">
        <p className="text-xs text-gray-600">
          💡 Tip: Boosted posts are prioritized based on your profile interests for better
          targeting!
        </p>
      </div>
    </div>
  );
}
