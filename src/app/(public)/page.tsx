'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { t } from '@/lib/i18n/translations';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { OAuthButtons } from '@/features/auth/components/OAuthButtons';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { SignupForm } from '@/features/auth/components/SignupForm';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { BrowserCarousel } from '@/features/auth/components/BrowserCarousel';

type AuthView = 'main' | 'login' | 'signup' | 'forgot-password';

const FEATURE_KEYS = ['feature1', 'feature2', 'feature3'] as const;

export default function LandingPage() {
  const txt = useText();
  const { language } = useLanguage();
  const router = useRouter();
  const [view, setView] = useState<AuthView>('main');
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    userApi.me().then(() => router.replace('/screener')).catch(() => {});
  }, [router]);

  const handleSlideChange = useCallback((i: number) => {
    setActiveSlide(i);
  }, []);

  return (
    <div className="min-h-dvh bg-zinc-50 lg:h-dvh lg:overflow-hidden">
      <div className="flex min-h-dvh flex-col lg:h-dvh lg:flex-row">
        {/* Hero */}
        <div className="relative flex flex-1 flex-col px-6 py-8 sm:px-12 lg:px-12 xl:px-16 lg:py-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold-wash/20 via-transparent to-transparent" />

          <div className="relative w-full max-w-4xl animate-fade-in lg:my-auto">
            <p className={`mb-3 text-zinc-400 ${language === 'ko' ? 'text-[12px] font-light tracking-[0.15em]' : 'text-[11px] uppercase tracking-widest'}`}>
              {language === 'ko' ? '사람퀀트' : 'SaramQuant'}
            </p>

            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
              {txt(t.landing.headline)}
            </h1>

            <div className="mt-6 lg:mt-7 lg:w-[90%]">
              <BrowserCarousel activeIndex={activeSlide} onIndexChange={handleSlideChange} />
            </div>

            <div className="mt-4 flex flex-col gap-0.5 sm:mt-5 lg:flex-row lg:items-start lg:gap-4">
              {FEATURE_KEYS.map((key, i) => (
                <button
                  key={key}
                  onClick={() => handleSlideChange(i)}
                  className={`group flex items-start gap-1.5 rounded-md px-2 py-1.5 text-left transition-all duration-300 lg:flex-1 lg:rounded-none lg:px-0 lg:py-1 ${
                    i === activeSlide
                      ? 'bg-zinc-100 lg:bg-transparent'
                      : 'hover:bg-zinc-100/60 lg:hover:bg-transparent'
                  }`}
                >
                  <span
                    className={`mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold transition-colors duration-300 ${
                      i === activeSlide
                        ? 'bg-gold text-white'
                        : 'bg-zinc-200 text-zinc-400'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`text-xs leading-snug transition-colors duration-300 ${
                      i === activeSlide
                        ? 'font-medium text-zinc-700'
                        : 'text-zinc-400'
                    }`}
                  >
                    {txt(t.landing[key])}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Auth */}
        <div className="relative flex items-center justify-center border-t border-zinc-100 bg-white px-6 py-12 sm:px-12 lg:w-[440px] lg:shrink-0 lg:border-l lg:border-t-0 lg:py-0">
          <div className="absolute right-4 top-4 z-10">
            <LanguageToggle />
          </div>

          <div className="w-full max-w-sm animate-slide-up">
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">
              {txt(t.landing.getStarted)}
            </h2>
            <p className="mb-8 text-sm text-zinc-500">
              {txt(t.landing.getStartedDesc)}
            </p>

            {view === 'main' && (
              <div className="flex flex-col gap-4">
                <OAuthButtons />
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-zinc-200" />
                  <span className="text-xs text-zinc-400">or</span>
                  <div className="h-px flex-1 bg-zinc-200" />
                </div>
                <button
                  onClick={() => setView('login')}
                  className="flex h-11 items-center justify-center rounded-lg border border-zinc-200 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  {txt(t.common.login)}
                </button>
              </div>
            )}

            {view === 'login' && (
              <LoginForm
                onSwitchToSignup={() => setView('signup')}
                onSwitchToForgotPassword={() => setView('forgot-password')}
                onBack={() => setView('main')}
              />
            )}

            {view === 'forgot-password' && (
              <ForgotPasswordForm onBack={() => setView('login')} />
            )}

            {view === 'signup' && (
              <SignupForm
                onSwitchToLogin={() => setView('login')}
                onSuccess={() => setView('login')}
              />
            )}


            <Link
              href="/screener"
              className="mt-6 block w-full text-center text-sm text-zinc-400 underline underline-offset-2 transition-colors hover:text-zinc-600"
            >
              {txt(t.landing.exploreFirst)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
