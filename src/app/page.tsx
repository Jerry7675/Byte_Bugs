'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import HeroSection from '@/components/home/Hero';
import { useAuth } from '@/context/authContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Show nothing while redirecting authenticated users
  if (user) {
    return null;
  }

  // Show HeroSection for unauthenticated users
  return <HeroSection />;
}
