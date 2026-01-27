'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { useEffect } from 'react';

function RoleAdaptiveLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    return null;
  }

  // Dynamic nav and dashboard sections
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', show: true },
    { href: '/profile', label: 'Profile', show: true },
    // Add more links per role if needed
    user.role === 'ADMIN' && { href: '/admin', label: 'Admin Panel', show: true },
    user.role === 'INVESTOR' && { href: '/investments', label: 'My Investments', show: true },
    user.role === 'STARTUP' && { href: '/startup', label: 'Startup Tools', show: true },
  ].filter((link): link is { href: string; label: string; show: true } => Boolean(link));

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/"
                className="flex-shrink-0 flex items-center text-green-600 font-bold text-xl"
              >
                InvestLink
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === link.href
                        ? 'border-green-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-green-700 font-semibold capitalize">
                {user.role.toLowerCase()}
              </span>
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Role-based dashboard content example */}
        {pathname === '/dashboard' || pathname === '/' ? (
          <div className="mb-8">
            {user.role === 'ADMIN' && (
              <div className="p-4 bg-blue-100 rounded mb-4">
                Welcome, Admin! Here you can manage users, startups, and investors.
              </div>
            )}
            {user.role === 'INVESTOR' && (
              <div className="p-4 bg-yellow-100 rounded mb-4">
                Welcome, Investor! Track your investments and discover new startups.
              </div>
            )}
            {user.role === 'STARTUP' && (
              <div className="p-4 bg-green-100 rounded mb-4">
                Welcome, Startup! Manage your profile, funding, and connect with investors.
              </div>
            )}
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <RoleAdaptiveLayout>{children}</RoleAdaptiveLayout>;
}
