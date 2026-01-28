'use client';
import { useAuth } from '@/context/authContext';
import { useState, useEffect } from 'react';
import { Users, TrendingUp, Rocket, AlertCircle, Loader } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalInvestors: number;
  totalStartups: number;
  pendingVerifications: number;
  totalPosts: number;
  totalConversations: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalInvestors: 0,
    totalStartups: 0,
    pendingVerifications: 0,
    totalPosts: 0,
    totalConversations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Platform management, {user?.email}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-lg p-6 border border-green-200 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Total Users</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalInvestors} investors, {stats.totalStartups} startups
              </p>
            </div>

            <div className="glass-card rounded-lg p-6 border border-blue-200 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Platform Activity</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.totalPosts + stats.totalConversations}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalPosts} posts, {stats.totalConversations} conversations
              </p>
            </div>

            <div className="glass-card rounded-lg p-6 border border-orange-200 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-700" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Pending Reviews</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingVerifications}</p>
              <p className="text-xs text-gray-500 mt-1">
                Verification applications
              </p>
            </div>
          </div>

          <div className="glass-card rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Active Investors</span>
                <span className="font-semibold text-gray-900">{stats.totalInvestors}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Active Startups</span>
                <span className="font-semibold text-gray-900">{stats.totalStartups}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Posts</span>
                <span className="font-semibold text-gray-900">{stats.totalPosts}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Total Conversations</span>
                <span className="font-semibold text-gray-900">{stats.totalConversations}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
