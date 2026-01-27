'use client';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="mb-8">
        {/* Unplugged cable SVG */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="120" height="120" rx="24" fill="#e2e8f0" />
          <rect x="35" y="60" width="50" height="12" rx="6" fill="#64748b" />
          <rect x="50" y="72" width="20" height="18" rx="6" fill="#64748b" />
          <rect x="45" y="90" width="30" height="8" rx="4" fill="#94a3b8" />
          <rect x="40" y="40" width="10" height="20" rx="5" fill="#64748b" />
          <rect x="70" y="40" width="10" height="20" rx="5" fill="#64748b" />
          <rect x="42" y="35" width="6" height="10" rx="3" fill="#cbd5e1" />
          <rect x="72" y="35" width="6" height="10" rx="3" fill="#cbd5e1" />
          <path d="M60 60 l-15 20" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 60 l15 20" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-3">Page Not Found</h1>
      <p className="text-slate-500 text-lg mb-6 text-center max-w-xs">
        Sorry, we couldn&apos;t find the page you were looking for.
      </p>
      <Link
        href="/"
        className="bg-slate-600 text-white rounded-md px-7 py-2 text-base font-medium shadow-md hover:bg-slate-700 transition inline-block"
      >
        Go Home
      </Link>
    </div>
  );
}
