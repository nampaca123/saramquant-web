'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { userApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';
import { FlagIcon } from '@/components/common/FlagIcon';
import type { Market, InvestmentExperience, Gender } from '@/types';

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

const EXPERIENCE_OPTIONS: {
  value: InvestmentExperience;
  labelKey: 'expBeginner' | 'expIntermediate' | 'expAdvanced';
  icon: typeof Sparkles;
}[] = [
  { value: 'BEGINNER', labelKey: 'expBeginner', icon: Sparkles },
  { value: 'INTERMEDIATE', labelKey: 'expIntermediate', icon: TrendingUp },
  { value: 'ADVANCED', labelKey: 'expAdvanced', icon: BarChart3 },
];

interface OnboardingFormProps {
  avatarFile: File | null;
}

export function OnboardingForm({ avatarFile }: OnboardingFormProps) {
  const txt = useText();
  const router = useRouter();
  const { refresh } = useAuth();

  const [nickname, setNickname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [experience, setExperience] = useState<InvestmentExperience>('BEGINNER');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (key: string) => setErrors((p) => ({ ...p, [key]: '' }));

  const toggleMarket = (m: Market) =>
    setMarkets((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!nickname.trim()) errs.nickname = txt(t.onboarding.required);
    if (!birthYear || Number(birthYear) < 1900 || Number(birthYear) > 2010) errs.birthYear = txt(t.onboarding.required);
    if (!gender) errs.gender = txt(t.onboarding.required);
    if (markets.length === 0) errs.markets = txt(t.onboarding.selectAtLeastOne);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (avatarFile) await userApi.uploadProfileImage(avatarFile);
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

  return (
    <div className="space-y-5">
      {/* Nickname */}
      <div id="field-nickname">
        <label className="text-sm font-medium text-zinc-700 mb-1 block">
          {txt(t.onboarding.nicknameLabel)} <span className="text-warning">*</span>
        </label>
        <Input
          value={nickname}
          onChange={(e) => { setNickname(e.target.value); clearError('nickname'); }}
          placeholder={txt(t.onboarding.nicknamePlaceholder)}
          maxLength={20}
          error={errors.nickname || undefined}
        />
      </div>

      {/* Birth year */}
      <div id="field-birthYear">
        <label className="text-sm font-medium text-zinc-700 mb-1 block">
          {txt(t.settings.birthYear)} <span className="text-warning">*</span>
        </label>
        <Input
          type="number"
          min={1900}
          max={2010}
          value={birthYear}
          onChange={(e) => { setBirthYear(e.target.value); clearError('birthYear'); }}
          placeholder="1995"
          error={errors.birthYear || undefined}
        />
      </div>

      {/* Gender */}
      <div id="field-gender">
        <label className="text-sm font-medium text-zinc-700 mb-1.5 block">
          {txt(t.settings.gender)} <span className="text-warning">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setGender(opt.value); clearError('gender'); }}
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
        {errors.gender && <p className="text-xs text-warning mt-1">{errors.gender}</p>}
      </div>

      {/* Preferred markets */}
      <div id="field-markets">
        <label className="text-sm font-medium text-zinc-700 mb-1.5 block">
          {txt(t.settings.preferredMarkets)} <span className="text-warning">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MARKET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleMarket(opt.value)}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all',
                markets.includes(opt.value)
                  ? 'border-gold bg-gold-wash text-gold'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300',
              )}
            >
              <FlagIcon market={opt.value} size={18} />
              {opt.label}
            </button>
          ))}
        </div>
        {errors.markets && <p className="text-xs text-warning mt-1">{errors.markets}</p>}
      </div>

      {/* Investment experience */}
      <div>
        <label className="text-sm font-medium text-zinc-700 mb-1.5 block">
          {txt(t.settings.experience)}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setExperience(opt.value)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all',
                experience === opt.value
                  ? 'border-gold bg-gold-wash text-gold'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300',
              )}
            >
              <opt.icon className="h-5 w-5" />
              {txt(t.settings[opt.labelKey])}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button onClick={handleSubmit} disabled={saving} size="lg" className="w-full gap-2 text-base !mt-8">
        {saving ? txt(t.common.loading) : txt(t.onboarding.start)}
        {!saving && <ChevronRight className="h-5 w-5" />}
      </Button>
    </div>
  );
}
