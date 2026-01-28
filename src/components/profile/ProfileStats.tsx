/**
 * Profile Stats Component
 * Displays user statistics
 */

import { Calendar, Clock, FileText, TrendingUp } from 'lucide-react';

interface ProfileStatsProps {
  postsCount: number;
  activeHours: number;
  joinedDays: number;
}

export function ProfileStats({ postsCount, activeHours, joinedDays }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Posts</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{postsCount}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Active Hours</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{activeHours}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 col-span-2 md:col-span-1">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Days on Platform</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{joinedDays}</p>
      </div>
    </div>
  );
}
