'use client';

import { Suspense } from 'react';
import SignupForm from '@/components/forms/signupform';

export default function SignupPage() {
  return (
    <Suspense>
      <SignupPageContent />
    </Suspense>
  );
}

function SignupPageContent() {
  return <SignupForm />;
}
