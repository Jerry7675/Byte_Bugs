'use client';
import ForgotPasswordForm from '@/components/forms/forgotPasswordForm';
import HomeIcon from '@/components/common/HomeIcon';
import Link from 'next/dist/client/link';

export default function ForgotPasswordPage() {
  return (
    <main className="flex items-center justify-center w-full min-h-screen bg-white px-2 md:px-4">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link href="/" title="Go to Home" className="flex items-center gap-2 group">
          <HomeIcon className="w-9 h-9 md:w-12 md:h-12 transition-transform group-hover:scale-105 z-10" />
          <span className="sr-only">Home</span>
        </Link>
      </div>
      <ForgotPasswordForm />
    </main>
  );
}
