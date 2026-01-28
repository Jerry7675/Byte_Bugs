'use client';
import { useAuth } from '@/context/authContext';

export default function InvestorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900">Active Investments</h3>
          <p className="mt-2 text-2xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-sm font-semibold text-green-900">Portfolio Value</h3>
          <p className="mt-2 text-2xl font-bold text-green-600">$0</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-sm font-semibold text-purple-900">Available Deals</h3>
          <p className="mt-2 text-2xl font-bold text-purple-600">0</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
        <p className="text-gray-500">No recent activities yet</p>
      </div>
    </div>
  );
}
