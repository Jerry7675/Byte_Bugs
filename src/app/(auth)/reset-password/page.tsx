'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <ResetPasswordForm token={token} />
    </div>
  );
}
