'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Shield, Sparkles, PieChart } from 'lucide-react';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { OAuthButtons } from '@/features/auth/components/OAuthButtons';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { SignupForm } from '@/features/auth/components/SignupForm';
import type { LocalizedText } from '@/types';

type AuthView = 'main' | 'login' | 'signup';

const FEATURES: { icon: typeof Shield; title: LocalizedText; desc: LocalizedText }[] = [
  {
    icon: Shield,
    title: { ko: '5차원 리스크 신호', en: '5-Dimension Risk Signals' },
    desc: { ko: '복잡한 지표를 안정/주의/경고 세 단계로 번역', en: 'Complex indicators translated into 3 simple signals' },
  },
  {
    icon: Sparkles,
    title: { ko: 'AI 쉬운 말 분석', en: 'AI Plain-Language Analysis' },
    desc: { ko: '전문 용어 없이 누구나 이해할 수 있는 분석', en: 'Analysis anyone can understand, no jargon' },
  },
  {
    icon: PieChart,
    title: { ko: '포트폴리오 리스크 진단', en: 'Portfolio Risk Diagnosis' },
    desc: { ko: '보유 종목의 전체 리스크를 한눈에 파악', en: 'See your total portfolio risk at a glance' },
  },
];

export default function LandingPage() {
  const txt = useText();
  const [view, setView] = useState<AuthView>('main');

  return (
    <div className="min-h-dvh">
      {/* Language toggle */}
      <div className="absolute right-4 top-4 z-10">
        <LanguageToggle />
      </div>

      <div className="flex min-h-dvh flex-col lg:flex-row">
        {/* Left: Hero */}
        <div className="flex flex-1 flex-col justify-center px-8 py-16 lg:px-16 bg-gradient-to-br from-white via-gold-wash/30 to-white">
          <div className="max-w-lg mx-auto lg:mx-0 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/image/logo/saramquant-logo.jpg"
                alt="SaramQuant"
                width={48}
                height={48}
                className="rounded-xl shadow-md"
                priority
              />
              <span className="text-2xl font-bold text-zinc-900">SaramQuant</span>
            </div>

            <h1 className="text-3xl font-bold text-zinc-900 leading-tight lg:text-4xl">
              {txt({ ko: '리스크를 숫자가 아닌\n신호로 번역해드려요', en: 'Translating risk\ninto signals, not numbers' })}
            </h1>

            <p className="mt-4 text-base text-zinc-500 leading-relaxed">
              {txt(t.onboarding.tagline)}
            </p>

            <div className="mt-10 space-y-4">
              {FEATURES.map((f) => (
                <div key={txt(f.title)} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-wash">
                    <f.icon className="h-4 w-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">{txt(f.title)}</p>
                    <p className="text-xs text-zinc-500">{txt(f.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Auth */}
        <div className="flex items-center justify-center px-8 py-16 lg:w-[420px] lg:shrink-0 lg:border-l lg:border-zinc-100">
          <div className="w-full max-w-sm animate-slide-up">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">
              {txt({ ko: '시작하기', en: 'Get Started' })}
            </h2>

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
      </div>
    </div>
  );
}
