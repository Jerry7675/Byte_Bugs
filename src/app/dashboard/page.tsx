'use client';
import { useAuth } from '@/context/authContext';
import InvestorDashboard from '@/components/dashboards/InvestorDashboard';
import StartupDashboard from '@/components/dashboards/StartupDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'INVESTOR':
      return <InvestorDashboard />;
    case 'STARTUP':
      return <StartupDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return <div>Unknown role</div>;
  }
}
