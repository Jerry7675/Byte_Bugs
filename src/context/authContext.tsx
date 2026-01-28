// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  role: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

export function AuthProvider({
  children,
  requireAuth = false,
}: {
  children: ReactNode;
  requireAuth?: boolean;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔑 single source of truth for auth hydration
  const hydrateUser = () => {
    let token: string | null = null;

    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
      token = match ? decodeURIComponent(match[1]) : null;
    }

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded?.id && decoded?.role && decoded?.email) {
          setUser({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
          });
          return;
        }
      } catch {
        // invalid token
      }
    }

    setUser(null);
  };

  // initial auth load
  useEffect(() => {
    hydrateUser();
    setLoading(false);

    // Listen for custom authChanged event to re-hydrate user
    const handleAuthChanged = () => {
      hydrateUser();
    };
    window.addEventListener('authChanged', handleAuthChanged);
    return () => {
      window.removeEventListener('authChanged', handleAuthChanged);
    };
  }, []);

  // auth guard
  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.replace('/login');
    }
  }, [loading, requireAuth, user, router]);

  const logout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'accessToken=; Max-Age=0; path=/';
    }

    hydrateUser(); // 🔑 immediate state sync
    router.replace('/login');
  };

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
