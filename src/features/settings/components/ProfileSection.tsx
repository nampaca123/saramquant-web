'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useText } from '@/lib/i18n/use-text';
import { useAuth } from '@/providers/AuthProvider';
import { userApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import type { Gender, InvestmentExperience } from '@/types';

export function ProfileSection() {
  const txt = useText();
  const { user, refresh } = useAuth();
  const profile = user?.profile;

  const [name, setName] = useState(user?.name ?? '');
  const [gender, setGender] = useState<Gender>(profile?.gender ?? 'UNSPECIFIED');
  const [birthYear, setBirthYear] = useState(profile?.birthYear?.toString() ?? '');
  const [experience, setExperience] = useState<InvestmentExperience>(profile?.investmentExperience ?? 'BEGINNER');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await userApi.updateProfile({
        name: name || undefined,
        gender,
        birthYear: birthYear ? Number(birthYear) : undefined,
        investmentExperience: experience,
      });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch { /* handled */ }
    setLoading(false);
  };

  const genderOptions = [
    { value: 'UNSPECIFIED', label: txt(t.settings.genderNone) },
    { value: 'MALE', label: txt(t.settings.genderMale) },
    { value: 'FEMALE', label: txt(t.settings.genderFemale) },
  ];

  const experienceOptions = [
    { value: 'BEGINNER', label: txt(t.settings.expBeginner) },
    { value: 'INTERMEDIATE', label: txt(t.settings.expIntermediate) },
    { value: 'ADVANCED', label: txt(t.settings.expAdvanced) },
  ];

  return (
    <Card>
      <h3 className="text-sm font-medium text-zinc-700 mb-3">{txt(t.settings.profile)}</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-zinc-700 mb-1 block">{txt(t.settings.name)}</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 mb-1 block">{txt(t.settings.gender)}</label>
          <Select value={gender} onChange={(e) => setGender(e.target.value as Gender)} options={genderOptions} />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 mb-1 block">{txt(t.settings.birthYear)}</label>
          <Input type="number" min="1900" max="2010" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="1995" />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 mb-1 block">{txt(t.settings.experience)}</label>
          <Select value={experience} onChange={(e) => setExperience(e.target.value as InvestmentExperience)} options={experienceOptions} />
        </div>
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={handleSave} disabled={loading}>
            {saved ? txt(t.settings.saved) : loading ? txt(t.common.loading) : txt(t.common.save)}
          </Button>
        </div>
      </div>
    </Card>
  );
}
