'use client';

import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import type { MarketOverview as MarketOverviewType } from '../types/home.types';

const TIER_COLORS: Record<string, string> = {
  STABLE: 'bg-stable',
  CAUTION: 'bg-caution',
  WARNING: 'bg-warning',
};

const TIER_LABELS: Record<string, { ko: string; en: string }> = {
  STABLE: { ko: '안정', en: 'Stable' },
  CAUTION: { ko: '주의', en: 'Caution' },
  WARNING: { ko: '경고', en: 'Warning' },
};

interface MarketOverviewProps {
  data: MarketOverviewType;
}

export function MarketOverview({ data }: MarketOverviewProps) {
  const txt = useText();

  const tiers = ['STABLE', 'CAUTION', 'WARNING'];
  const counts = Object.fromEntries(
    tiers.map((tier) => [
      tier,
      data.tierDistribution
        .filter((d) => d.tier === tier)
        .reduce((sum, d) => sum + d.count, 0),
    ]),
  );
  const total = data.totalStocks || 1;

  return (
    <Card>
      <h2 className="text-sm font-semibold text-zinc-900 mb-3">
        {txt(t.home.marketOverview)}
      </h2>

      {/* Stacked bar */}
      <div className="flex h-3 overflow-hidden rounded-full bg-zinc-100">
        {tiers.map((tier) => {
          const pct = (counts[tier] / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={tier}
              className={cn('transition-all', TIER_COLORS[tier])}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4">
        {tiers.map((tier) => (
          <div key={tier} className="flex items-center gap-1.5 text-xs text-zinc-600">
            <span className={cn('h-2.5 w-2.5 rounded-full', TIER_COLORS[tier])} />
            {txt(TIER_LABELS[tier])} {counts[tier]}
          </div>
        ))}
      </div>
    </Card>
  );
}
