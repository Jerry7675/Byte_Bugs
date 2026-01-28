'use client';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Profile Page - Redirects to user's own profile
 */
export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(`/profile/${user.id}`);
    } else if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
}

