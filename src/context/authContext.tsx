import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: { id: string; role: string; email: string } | null;
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
  const [user, setUser] = useState<{ id: string; role: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let token: string | null = null;
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
      token = match ? decodeURIComponent(match[1]) : null;
    }
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded && decoded.id && decoded.role && decoded.email) {
          setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.replace('/login');
    }
  }, [loading, requireAuth, user, router]);

  const logout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'accessToken=; Max-Age=0; path=/';
    }
    setUser(null);
    router.replace('/login');
  };

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
