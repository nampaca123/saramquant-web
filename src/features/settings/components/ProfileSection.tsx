'use client';

import { useState } from 'react';
import { Pencil, X, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FlagIcon } from '@/components/common/FlagIcon';
import { useText } from '@/lib/i18n/use-text';
import { useAuth } from '@/providers/AuthProvider';
import { userApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
import type { Gender, InvestmentExperience, Market } from '@/types';

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

const MARKET_OPTIONS: { value: Market; label: string }[] = [
  { value: 'KR_KOSPI', label: 'KOSPI' },
  { value: 'KR_KOSDAQ', label: 'KOSDAQ' },
  { value: 'US_NYSE', label: 'NYSE' },
  { value: 'US_NASDAQ', label: 'NASDAQ' },
];

export function ProfileSection() {
  const txt = useText();
  const { user, refresh } = useAuth();
  const profile = user?.profile;

  const initial = {
    nickname: profile?.nickname ?? user?.name ?? '',
    gender: profile?.gender ?? ('UNSPECIFIED' as Gender),
    birthYear: profile?.birthYear?.toString() ?? '',
    experience: profile?.investmentExperience ?? ('BEGINNER' as InvestmentExperience),
    markets: profile?.preferredMarkets ?? ([] as Market[]),
  };

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const genderLabel = (g: Gender) => txt(t.settings[GENDER_OPTIONS.find((o) => o.value === g)!.labelKey]);
  const expLabel = (e: InvestmentExperience) => txt(t.settings[EXPERIENCE_OPTIONS.find((o) => o.value === e)!.labelKey]);

  const marketLabel = (markets: Market[]) =>
    markets.length > 0
      ? markets.map((m) => MARKET_OPTIONS.find((o) => o.value === m)!.label).join(', ')
      : '—';

  const handleCancel = () => {
    setForm(initial);
    setEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await userApi.updateProfile({
        nickname: form.nickname || undefined,
        gender: form.gender,
        birthYear: form.birthYear ? Number(form.birthYear) : undefined,
        investmentExperience: form.experience,
        preferredMarkets: form.markets,
      });
      await refresh();
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 1500);
    } catch { /* handled */ }
    setLoading(false);
  };

  const toggleMarket = (m: Market) =>
    setForm((prev) => ({
      ...prev,
      markets: prev.markets.includes(m) ? prev.markets.filter((x) => x !== m) : [...prev.markets, m],
    }));

  /* ───── View mode ───── */
  if (!editing) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-zinc-700">{txt(t.settings.profile)}</h3>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            {saved ? <Check className="h-3.5 w-3.5 text-stable" /> : <Pencil className="h-3.5 w-3.5" />}
            {saved ? txt(t.settings.saved) : txt(t.settings.edit)}
          </button>
        </div>

        <dl className="space-y-4 text-sm">
          <ViewRow label={txt(t.onboarding.nicknameLabel)} value={initial.nickname} />
          <ViewRow label={txt(t.settings.birthYear)} value={initial.birthYear || '—'} />
          <ViewRow label={txt(t.settings.gender)} value={genderLabel(initial.gender)} />
          <ViewRow label={txt(t.settings.experience)} value={expLabel(initial.experience)} />
          <ViewRow label={txt(t.settings.preferredMarkets)} value={marketLabel(initial.markets)} />
        </dl>
      </Card>
    );
  }

  /* ───── Edit mode ───── */
  return (
    <Card className="p-6 ring-1 ring-gold/30">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-zinc-700">{txt(t.settings.profile)}</h3>
        <button
          onClick={handleCancel}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
        >
          <X className="h-3.5 w-3.5" />
          {txt(t.common.cancel)}
        </button>
      </div>

      <div className="space-y-5">
        <Field label={txt(t.onboarding.nicknameLabel)}>
          <Input
            value={form.nickname}
            onChange={(e) => setForm((p) => ({ ...p, nickname: e.target.value }))}
            maxLength={20}
          />
        </Field>

        <Field label={txt(t.settings.birthYear)}>
          <Input
            type="number"
            min={1900}
            max={2010}
            value={form.birthYear}
            onChange={(e) => setForm((p) => ({ ...p, birthYear: e.target.value }))}
            placeholder="1995"
          />
        </Field>

        <Field label={txt(t.settings.gender)}>
          <div className="grid grid-cols-3 gap-2">
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, gender: opt.value }))}
                className={cn(
                  'rounded-lg border-2 py-2.5 text-sm font-medium transition-all',
                  form.gender === opt.value
                    ? 'border-gold bg-gold-wash text-gold'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
                )}
              >
                {txt(t.settings[opt.labelKey])}
              </button>
            ))}
          </div>
        </Field>

        <Field label={txt(t.settings.experience)}>
          <div className="grid grid-cols-3 gap-2">
            {EXPERIENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, experience: opt.value }))}
                className={cn(
                  'rounded-lg border-2 py-2.5 text-sm font-medium transition-all',
                  form.experience === opt.value
                    ? 'border-gold bg-gold-wash text-gold'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
                )}
              >
                {txt(t.settings[opt.labelKey])}
              </button>
            ))}
          </div>
        </Field>

        <Field label={txt(t.settings.preferredMarkets)}>
          <div className="grid grid-cols-2 gap-2">
            {MARKET_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleMarket(opt.value)}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg border-2 py-2.5 text-sm font-medium transition-all',
                  form.markets.includes(opt.value)
                    ? 'border-gold bg-gold-wash text-gold'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
                )}
              >
                <FlagIcon market={opt.value} size={16} />
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={handleSave} disabled={loading}>
            {loading ? txt(t.common.loading) : txt(t.common.save)}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ViewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline">
      <dt className="text-zinc-400 w-24 shrink-0">{label}</dt>
      <dd className="text-zinc-700">{value}</dd>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-zinc-500 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
