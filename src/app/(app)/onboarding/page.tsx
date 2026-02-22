'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Sparkles, PieChart, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { userApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import type { Market, InvestmentExperience } from '@/types';

const INTRO_CARDS = [
  { icon: Shield, titleKey: 'introTitle1' as const, descKey: 'introDesc1' as const },
  { icon: Sparkles, titleKey: 'introTitle2' as const, descKey: 'introDesc2' as const },
  { icon: PieChart, titleKey: 'introTitle3' as const, descKey: 'introDesc3' as const },
];

const MARKET_OPTIONS: { value: Market; label: string }[] = [
  { value: 'KR_KOSPI', label: 'KOSPI' },
  { value: 'KR_KOSDAQ', label: 'KOSDAQ' },
  { value: 'US_NYSE', label: 'NYSE' },
  { value: 'US_NASDAQ', label: 'NASDAQ' },
];

const EXPERIENCE_OPTIONS: { value: InvestmentExperience; labelKey: 'expBeginner' | 'expIntermediate' | 'expAdvanced' }[] = [
  { value: 'BEGINNER', labelKey: 'expBeginner' },
  { value: 'INTERMEDIATE', labelKey: 'expIntermediate' },
  { value: 'ADVANCED', labelKey: 'expAdvanced' },
];

export default function OnboardingPage() {
  const txt = useText();
  const router = useRouter();
  const { refresh } = useAuth();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [markets, setMarkets] = useState<Market[]>([]);
  const [experience, setExperience] = useState<InvestmentExperience>('BEGINNER');
  const [saving, setSaving] = useState(false);

  const totalSteps = 3;

  const toggleMarket = (m: Market) => {
    setMarkets((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const canProceed = () => {
    if (step === 1) return markets.length > 0;
    return true;
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await userApi.updateProfile({
        ...(nickname.trim() && { name: nickname.trim() }),
        preferredMarkets: markets,
        investmentExperience: experience,
      });
      await refresh();
      router.replace('/home');
    } catch {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) setStep((s) => s + 1);
    else handleFinish();
  };

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-8 flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                i <= step ? 'bg-gold' : 'bg-zinc-200',
              )}
            />
          ))}
        </div>

        {/* Step 0: Intro cards */}
        {step === 0 && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-zinc-900">
                {txt(t.onboarding.welcome)}
              </h1>
              <p className="mt-2 text-sm text-zinc-500">
                {txt(t.onboarding.tagline)}
              </p>
            </div>
            <div className="space-y-3">
              {INTRO_CARDS.map((card) => (
                <div
                  key={card.titleKey}
                  className="flex items-start gap-4 rounded-xl border border-zinc-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-wash">
                    <card.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {txt(t.onboarding[card.titleKey])}
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-500">
                      {txt(t.onboarding[card.descKey])}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Markets + Nickname */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">
                {txt(t.onboarding.stepMarkets)}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {txt(t.onboarding.stepMarketsDesc)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MARKET_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggleMarket(opt.value)}
                  className={cn(
                    'rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all',
                    markets.includes(opt.value)
                      ? 'border-gold bg-gold-wash text-gold'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {markets.length === 0 && (
              <p className="text-xs text-warning">{txt(t.onboarding.selectAtLeastOne)}</p>
            )}
            <div>
              <label className="text-sm font-medium text-zinc-700">
                {txt(t.onboarding.nicknameLabel)}
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={txt(t.onboarding.nicknamePlaceholder)}
                maxLength={20}
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>
        )}

        {/* Step 2: Experience */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">
                {txt(t.onboarding.stepExperience)}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {txt(t.onboarding.stepExperienceDesc)}
              </p>
            </div>
            <div className="space-y-3">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setExperience(opt.value)}
                  className={cn(
                    'w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all',
                    experience === opt.value
                      ? 'border-gold bg-gold-wash text-gold'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300',
                  )}
                >
                  {txt(t.settings[opt.labelKey])}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center gap-3">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              {txt(t.onboarding.prev)}
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed() || saving}
            className="ml-auto gap-1"
            size="lg"
          >
            {step === totalSteps - 1 ? txt(t.onboarding.start) : txt(t.onboarding.next)}
            {step < totalSteps - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
