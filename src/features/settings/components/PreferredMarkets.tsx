'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useText } from '@/lib/i18n/use-text';
import { useAuth } from '@/providers/AuthProvider';
import { userApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import type { Market } from '@/types';

const MARKETS: { value: Market; label: string }[] = [
  { value: 'KR_KOSPI', label: 'KOSPI' },
  { value: 'KR_KOSDAQ', label: 'KOSDAQ' },
  { value: 'US_NYSE', label: 'NYSE' },
  { value: 'US_NASDAQ', label: 'NASDAQ' },
];

export function PreferredMarkets() {
  const txt = useText();
  const { user, refresh } = useAuth();
  const [selected, setSelected] = useState<Market[]>(user?.profile?.preferredMarkets ?? []);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (market: Market) => {
    setSelected((prev) =>
      prev.includes(market) ? prev.filter((m) => m !== market) : [...prev, market],
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await userApi.updateProfile({ preferredMarkets: selected });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch { /* handled */ }
    setLoading(false);
  };

  return (
    <Card>
      <h3 className="text-sm font-medium text-zinc-700 mb-3">{txt(t.settings.preferredMarkets)}</h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {MARKETS.map((m) => (
          <label key={m.value} className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(m.value)}
              onChange={() => toggle(m.value)}
              className="accent-gold"
            />
            {m.label}
          </label>
        ))}
      </div>
      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={handleSave} disabled={loading}>
          {saved ? txt(t.settings.saved) : txt(t.common.save)}
        </Button>
      </div>
    </Card>
  );
}
