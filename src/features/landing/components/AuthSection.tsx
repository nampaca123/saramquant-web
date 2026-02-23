'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { OAuthButtons } from '@/features/auth/components/OAuthButtons';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { SignupForm } from '@/features/auth/components/SignupForm';

type AuthView = 'main' | 'login' | 'signup';

export function AuthSection() {
  const txt = useText();
  const [view, setView] = useState<AuthView>('main');

  return (
    <section className="relative py-20 sm:py-28">
      {/* Subtle top glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-gold-wash/50 blur-[100px]" />

      <div className="relative mx-auto max-w-md px-6 sm:px-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl text-balance">
            {txt(t.landing.getStarted)}
          </h2>
          <p className="mt-2 text-sm text-zinc-500 sm:text-base">
            {txt(t.landing.getStartedDesc)}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-6 sm:p-8 shadow-lg shadow-zinc-900/5">
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
              {'\u2190'} {txt(t.common.cancel)}
            </button>
          )}
        </div>

        <Link
          href="/screener"
          className="mt-6 block w-full text-center text-sm text-zinc-400 underline underline-offset-2 transition-colors hover:text-zinc-600"
        >
          {txt(t.landing.exploreFirst)}
        </Link>
      </div>
    </section>
  );
}
