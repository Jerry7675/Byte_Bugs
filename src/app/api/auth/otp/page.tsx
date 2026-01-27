'use client';
import OTPForm from '@/components/forms/OTPForm';
import HomeIcon from '@/components/common/HomeIcon';
import Link from 'next/dist/client/link';

export default function OTPPage() {
  return (
    <main className="flex items-center justify-center w-full min-h-screen bg-white px-2 md:px-4">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link href="/" title="Go to Home" className="flex items-center gap-2 group">
          <HomeIcon className="w-9 h-9 md:w-12 md:h-12 transition-transform group-hover:scale-105" />
          <span className="sr-only">Home</span>
        </Link>
      </div>
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-4 border border-green-100">
        <h2 className="text-3xl font-medium text-green-900 text-center">Enter OTP</h2>
        <p className="mt-2 text-base text-green-700/90 text-center">
          Please enter the OTP sent to your email.
        </p>
        <OTPForm />
      </div>
    </main>
  );
}
