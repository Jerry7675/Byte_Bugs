'use client';
import { AuthProvider } from '@/context/authContext';

export default function DashboardPage() {
  return (
    <AuthProvider requireAuth>
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to InvestLink! Select "Profile" to update your details.</p>
      </div>
    </AuthProvider>
  );
}
