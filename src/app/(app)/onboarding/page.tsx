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
import type { Market, InvestmentExperience, Gender } from '@/types';

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

const GENDER_OPTIONS: { value: Gender; labelKey: 'genderMale' | 'genderFemale' | 'genderNone' }[] = [
  { value: 'MALE', labelKey: 'genderMale' },
  { value: 'FEMALE', labelKey: 'genderFemale' },
  { value: 'UNSPECIFIED', labelKey: 'genderNone' },
];

const EXPERIENCE_OPTIONS: { value: InvestmentExperience; labelKey: 'expBeginner' | 'expIntermediate' | 'expAdvanced' }[] = [
  { value: 'BEGINNER', labelKey: 'expBeginner' },
  { value: 'INTERMEDIATE', labelKey: 'expIntermediate' },
  { value: 'ADVANCED', labelKey: 'expAdvanced' },
];

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const txt = useText();
  const router = useRouter();
  const { refresh } = useAuth();
  const [step, setStep] = useState(0);

  const [nickname, setNickname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [experience, setExperience] = useState<InvestmentExperience>('BEGINNER');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const toggleMarket = (m: Market) => {
    setMarkets((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const validateStep = (): boolean => {
    const errs: Record<string, boolean> = {};

    if (step === 1) {
      if (!nickname.trim()) errs.nickname = true;
      if (!birthYear || Number(birthYear) < 1900 || Number(birthYear) > 2010) errs.birthYear = true;
      if (!gender) errs.gender = true;
    }
    if (step === 2) {
      if (markets.length === 0) errs.markets = true;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await userApi.updateProfile({
        nickname: nickname.trim(),
        birthYear: Number(birthYear),
        gender: gender!,
        preferredMarkets: markets,
        investmentExperience: experience,
      });
      await refresh();
      router.replace('/screener');
    } catch {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else handleFinish();
  };

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8 flex gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                i <= step ? 'bg-gold' : 'bg-zinc-200',
              )}
            />
          ))}
        </div>

        {/* Step 0: Intro */}
        {step === 0 && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-zinc-900">{txt(t.onboarding.welcome)}</h1>
              <p className="mt-2 text-sm text-zinc-500">{txt(t.onboarding.tagline)}</p>
            </div>
            <div className="space-y-3">
              {INTRO_CARDS.map((card) => (
                <div key={card.titleKey} className="flex items-start gap-4 rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-wash">
                    <card.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">{txt(t.onboarding[card.titleKey])}</p>
                    <p className="mt-0.5 text-sm text-zinc-500">{txt(t.onboarding[card.descKey])}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Personal info (birthYear, gender, nickname) */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">{txt(t.onboarding.stepPersonal)}</h2>
              <p className="mt-1 text-sm text-zinc-500">{txt(t.onboarding.stepPersonalDesc)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700 mb-1 block">
                  {txt(t.settings.birthYear)} <span className="text-warning">*</span>
                </label>
                <input
                  type="number"
                  min="1900"
                  max="2010"
                  value={birthYear}
                  onChange={(e) => { setBirthYear(e.target.value); setErrors((p) => ({ ...p, birthYear: false })); }}
                  placeholder="1995"
                  className={cn(
                    'w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1',
                    errors.birthYear
                      ? 'border-warning focus:border-warning focus:ring-warning'
                      : 'border-zinc-200 focus:border-gold focus:ring-gold',
                  )}
                />
                {errors.birthYear && (
                  <p className="text-xs text-warning mt-1">{txt(t.onboarding.required)}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 mb-1 block">
                  {txt(t.settings.gender)} <span className="text-warning">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {GENDER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setGender(opt.value); setErrors((p) => ({ ...p, gender: false })); }}
                      className={cn(
                        'rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all',
                        gender === opt.value
                          ? 'border-gold bg-gold-wash text-gold'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300',
                        errors.gender && !gender && 'border-warning/50',
                      )}
                    >
                      {txt(t.settings[opt.labelKey])}
                    </button>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-xs text-warning mt-1">{txt(t.onboarding.required)}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 mb-1 block">
                  {txt(t.onboarding.nicknameLabel)} <span className="text-warning">*</span>
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => { setNickname(e.target.value); setErrors((p) => ({ ...p, nickname: false })); }}
                  placeholder={txt(t.onboarding.nicknamePlaceholder)}
                  maxLength={20}
                  className={cn(
                    'w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1',
                    errors.nickname
                      ? 'border-warning focus:border-warning focus:ring-warning'
                      : 'border-zinc-200 focus:border-gold focus:ring-gold',
                  )}
                />
                {errors.nickname && (
                  <p className="text-xs text-warning mt-1">{txt(t.onboarding.required)}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Markets */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">{txt(t.onboarding.stepMarkets)}</h2>
              <p className="mt-1 text-sm text-zinc-500">{txt(t.onboarding.stepMarketsDesc)}</p>
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
            {errors.markets && (
              <p className="text-xs text-warning">{txt(t.onboarding.selectAtLeastOne)}</p>
            )}
          </div>
        )}

        {/* Step 3: Experience */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">{txt(t.onboarding.stepExperience)}</h2>
              <p className="mt-1 text-sm text-zinc-500">{txt(t.onboarding.stepExperienceDesc)}</p>
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
            disabled={saving}
            className="ml-auto gap-1"
            size="lg"
          >
            {saving
              ? txt(t.common.loading)
              : step === TOTAL_STEPS - 1
                ? txt(t.onboarding.start)
                : txt(t.onboarding.next)}
            {step < TOTAL_STEPS - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
