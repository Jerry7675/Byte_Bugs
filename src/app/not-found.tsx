'use client';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="relative w-full max-w-[400px] h-[38vw] max-h-[220px] min-h-[120px] flex items-center justify-center mx-auto">
        {/* 404 Numbers */}
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 text-[22vw] max-text-[160px] font-black text-gray-300 select-none"
          style={{ fontFamily: 'monospace', fontSize: 'clamp(64px,22vw,160px)' }}
        >
          4
        </span>
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[22vw] max-text-[160px] font-black text-gray-300 select-none"
          style={{ fontFamily: 'monospace', fontSize: 'clamp(64px,22vw,160px)' }}
        >
          4
        </span>
        {/* Animated Paper on 0 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] max-w-[140px] min-w-[80px] h-auto flex items-center justify-center">
          <svg
            className="w-full h-auto animate-bounce"
            viewBox="0 0 140 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 0 */}
            <ellipse
              cx="70"
              cy="120"
              rx="60"
              ry="60"
              fill="#f3f4f6"
              stroke="#bdbdbd"
              strokeWidth="4"
            />
            {/* Paper */}
            <g className="animate-sad-paper">
              <rect
                x="45"
                y="50"
                width="50"
                height="60"
                rx="10"
                fill="#fff"
                stroke="#bdbdbd"
                strokeWidth="3"
              />
              {/* Folded corner */}
              <polyline
                points="95,50 105,60 95,60"
                fill="#f3f4f6"
                stroke="#bdbdbd"
                strokeWidth="2"
              />
              {/* Face */}
              <circle cx="65" cy="75" r="3" fill="#444" />
              <circle cx="85" cy="75" r="3" fill="#444" />
              <path d="M70 90 Q75 95 80 90" stroke="#444" strokeWidth="2" fill="none" />
              {/* Sad eyebrows */}
              <path d="M62 70 Q65 68 68 70" stroke="#444" strokeWidth="1.5" fill="none" />
              <path d="M82 70 Q85 68 88 70" stroke="#444" strokeWidth="1.5" fill="none" />
              {/* Arms */}
              <path d="M45 80 Q35 100 60 110" stroke="#444" strokeWidth="3" fill="none" />
              <path d="M95 80 Q105 100 80 110" stroke="#444" strokeWidth="3" fill="none" />
              {/* Hands */}
              <circle cx="60" cy="110" r="4" fill="#444" />
              <circle cx="80" cy="110" r="4" fill="#444" />
            </g>
          </svg>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-700 mt-6 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-500 text-lg mb-6 text-center max-w-xs">
        Sorry, we couldn&apos;t find the page you were looking for.
      </p>
      <Link
        href="/"
        className="bg-green-600 text-white rounded-md px-7 py-2 text-base font-medium shadow-md hover:bg-gray-800 transition inline-block"
      >
        Go Home
      </Link>
      <style jsx>{`
        .animate-bounce {
          animation: bounce 1.5s infinite;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-18px);
          }
        }
        @media (max-width: 600px) {
          .max-text-\[160px\] {
            font-size: 18vw !important;
          }
        }
      `}</style>
    </div>
  );
}
