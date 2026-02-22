'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FlagIcon } from '@/components/common/FlagIcon';
import { useText } from '@/lib/i18n/use-text';
import { useAuth } from '@/providers/AuthProvider';
import { userApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
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
      <div className="grid grid-cols-2 gap-2 mb-3">
        {MARKETS.map((m) => (
          <button
            key={m.value}
            onClick={() => toggle(m.value)}
            className={cn(
              'flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all',
              selected.includes(m.value)
                ? 'border-gold bg-gold-wash text-gold'
                : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
            )}
          >
            <FlagIcon market={m.value} size={16} />
            {m.label}
          </button>
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
