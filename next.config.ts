import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.SUPABASE_PROJECT_REF}.supabase.co`,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
