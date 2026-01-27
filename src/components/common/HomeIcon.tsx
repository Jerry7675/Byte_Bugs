'use client';
export default function HomeIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="12" fill="#e9f5ee" />
      <path
        d="M12 22V18L20 13L28 18V22"
        stroke="#27ae60"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="16" y="22" width="8" height="5" rx="2" fill="#27ae60" />
    </svg>
  );
}
