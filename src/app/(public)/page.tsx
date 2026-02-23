'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '@/lib/api';
import { LandingNav, HeroSection, FeaturesSection, AuthSection } from '@/features/landing';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    userApi.me().then(() => router.replace('/screener')).catch(() => {});
  }, [router]);

  return (
    <div className="min-h-dvh bg-white">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AuthSection />
      </main>
    </div>
  );
}
