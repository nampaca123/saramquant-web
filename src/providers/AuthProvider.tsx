'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
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
const REVALIDATE_THROTTLE_MS = 30_000;

function isProfileComplete(user: UserResponse): boolean {
  const p = user.profile;
  if (!p) return false;
  return (
    !!p.nickname &&
    p.birthYear != null &&
    p.gender != null &&
    p.preferredMarkets.length > 0 &&
    p.investmentExperience != null
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const lastFetchAtRef = useRef(0);
  const fetchInFlightRef = useRef(false);
  const loggedOutRef = useRef(true);

  const fetchUser = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && (fetchInFlightRef.current || now - lastFetchAtRef.current < REVALIDATE_THROTTLE_MS)) return;
    fetchInFlightRef.current = true;
    lastFetchAtRef.current = now;
    try {
      const me = await userApi.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
      fetchInFlightRef.current = false;
    }
  }, []);

  const clear = useCallback(() => {
    if (loggedOutRef.current) return;
    loggedOutRef.current = true;
    setUser(null);
    if (pathname !== '/') router.push('/');
  }, [pathname, router]);

  useEffect(() => {
    loggedOutRef.current = user == null;
  }, [user]);

  useEffect(() => {
    fetchUser(true);
  }, [fetchUser]);

  useEffect(() => {
    const handler = () => clear();
    window.addEventListener('sq:auth-expired', handler);
    return () => window.removeEventListener('sq:auth-expired', handler);
  }, [clear]);

  useEffect(() => {
    const revalidate = () => {
      if (document.visibilityState === 'visible') void fetchUser();
    };
    const onFocus = () => { void fetchUser(); };
    document.addEventListener('visibilitychange', revalidate);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', revalidate);
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchUser]);

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
