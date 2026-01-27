'use client';
import { AuthProvider, useAuth } from '@/context/authContext';
import ProfileForm from '@/components/forms/ProfileForm';

function ProfilePageInner() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Profile
          </h2>
        </div>
      </div>
      <ProfileForm userRole={user.role} userId={user.id} />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthProvider requireAuth>
      <ProfilePageInner />
    </AuthProvider>
  );
}
