'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { OAuthButtons } from '@/features/auth/components/OAuthButtons';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { SignupForm } from '@/features/auth/components/SignupForm';

type AuthView = 'main' | 'login' | 'signup';

export default function OnboardingPage() {
  const txt = useText();
  const [view, setView] = useState<AuthView>('main');

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      {/* Logo + branding */}
      <div className="mb-12 flex flex-col items-center gap-4 animate-fade-in">
        <div className="animate-float">
          <Image
            src="/image/logo/saramquant-logo.jpg"
            alt="SaramQuant"
            width={80}
            height={80}
            className="rounded-2xl shadow-md"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 animate-slide-up">
          SaramQuant
        </h1>
        <p className="text-sm text-zinc-500 animate-slide-up animation-delay-200">
          {txt(t.onboarding.tagline)}
        </p>
      </div>

      {/* Auth panel */}
      <div className="w-full max-w-sm animate-slide-up animation-delay-400">
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
      </div>
    </div>
  );
}
