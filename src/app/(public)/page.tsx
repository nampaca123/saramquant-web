'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Sparkles, PieChart } from 'lucide-react';
import { userApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { OAuthButtons } from '@/features/auth/components/OAuthButtons';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { SignupForm } from '@/features/auth/components/SignupForm';

type AuthView = 'main' | 'login' | 'signup';

const FEATURES = [
  { icon: Shield, titleKey: 'featureSignalTitle' as const, descKey: 'featureSignalDesc' as const },
  { icon: Sparkles, titleKey: 'featureAiTitle' as const, descKey: 'featureAiDesc' as const },
  { icon: PieChart, titleKey: 'featurePortfolioTitle' as const, descKey: 'featurePortfolioDesc' as const },
];

export default function LandingPage() {
  const txt = useText();
  const router = useRouter();
  const [view, setView] = useState<AuthView>('main');

  useEffect(() => {
    userApi.me().then(() => router.replace('/screener')).catch(() => {});
  }, [router]);

  return (
    <div className="min-h-dvh bg-white">
      <div className="absolute right-4 top-4 z-10">
        <LanguageToggle />
      </div>

      <div className="flex min-h-dvh flex-col lg:flex-row">
        {/* Hero */}
        <div className="relative flex flex-1 flex-col justify-center overflow-hidden px-6 py-10 sm:px-12 lg:px-20 lg:py-0">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold-wash/60 via-transparent to-white" />
          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-gold-wash/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-[300px] w-[300px] rounded-full bg-gold-light/20 blur-3xl" />

          <div className="relative mx-auto max-w-xl animate-fade-in lg:mx-0">
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="/image/logo/saramquant-logo.jpg"
                alt="SaramQuant"
                width={56}
                height={56}
                className="rounded-2xl shadow-lg ring-1 ring-black/5"
                priority
              />
              <span className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                SaramQuant
              </span>
            </div>

            <h1 className="text-3xl font-extrabold leading-snug tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              {txt(t.landing.headlinePrimary)}
              <br />
              <span className="bg-gradient-to-r from-gold to-amber-500 bg-clip-text text-transparent">
                {txt(t.landing.headlineAccent)}
              </span>
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-500 sm:text-lg">
              {txt(t.landing.subheading)}
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {FEATURES.map((f, i) => (
                <div
                  key={f.titleKey}
                  className={`animate-slide-up rounded-2xl border border-zinc-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm${
                    i === 1 ? ' animation-delay-200' : i === 2 ? ' animation-delay-400' : ''
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-wash">
                    <f.icon className="h-5 w-5 text-gold" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-zinc-900">{txt(t.landing[f.titleKey])}</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">{txt(t.landing[f.descKey])}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Auth */}
        <div className="flex items-center justify-center border-t border-zinc-100 bg-zinc-50/50 px-6 py-12 sm:px-12 lg:w-[440px] lg:shrink-0 lg:border-l lg:border-t-0 lg:py-0">
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
              <LoginForm onSwitchToSignup={() => setView('signup')} />
            )}

            {view === 'signup' && (
              <SignupForm
                onSwitchToLogin={() => setView('login')}
                onSuccess={() => setView('login')}
              />
            )}

            {view !== 'main' && (
              <button
                onClick={() => setView('main')}
                className="mt-4 w-full text-center text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                ← {txt(t.common.cancel)}
              </button>
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
