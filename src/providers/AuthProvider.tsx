'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { userApi } from '@/lib/api';
import type { UserResponse } from '@/types';

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  refresh: () => Promise<void>;
  clear: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isProfileComplete(user: UserResponse): boolean {
  return (user.profile?.preferredMarkets?.length ?? 0) > 0;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const me = await userApi.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setUser(null);
    router.push('/');
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const handler = () => clear();
    window.addEventListener('sq:auth-expired', handler);
    return () => window.removeEventListener('sq:auth-expired', handler);
  }, [clear]);

  useEffect(() => {
    if (loading || !user) return;
    if (!isProfileComplete(user) && pathname !== '/onboarding') {
      router.replace('/onboarding');
    }
  }, [loading, user, pathname, router]);

  return (
    <AuthContext value={{ user, loading, refresh: fetchUser, clear }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
