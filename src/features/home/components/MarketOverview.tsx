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

const MARKET_LABELS: Record<string, string> = {
  KR_KOSPI: 'KOSPI',
  KR_KOSDAQ: 'KOSDAQ',
  US_NYSE: 'NYSE',
  US_NASDAQ: 'NASDAQ',
};

const TIERS = ['STABLE', 'CAUTION', 'WARNING'] as const;

interface MarketOverviewProps {
  data: MarketOverviewType;
}

export function MarketOverview({ data }: MarketOverviewProps) {
  const txt = useText();

  const markets = [...new Set(data.tierDistribution.map((d) => d.market))];

  return (
    <Card>
      <h2 className="text-sm font-semibold text-zinc-900 mb-3">
        {txt(t.home.marketOverview)}
      </h2>

      <div className="space-y-3">
        {markets.map((market) => {
          const items = data.tierDistribution.filter((d) => d.market === market);
          const total = items.reduce((s, d) => s + d.count, 0) || 1;
          const counts = Object.fromEntries(
            TIERS.map((tier) => [
              tier,
              items.filter((d) => d.tier === tier).reduce((s, d) => s + d.count, 0),
            ]),
          );

          return (
            <div key={market}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-zinc-700">
                  {MARKET_LABELS[market] ?? market}
                </span>
                <span className="text-xs text-zinc-400">
                  {items.reduce((s, d) => s + d.count, 0)}
                </span>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-zinc-100">
                {TIERS.map((tier) => {
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
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4">
        {TIERS.map((tier) => (
          <div key={tier} className="flex items-center gap-1.5 text-xs text-zinc-600">
            <span className={cn('h-2 w-2 rounded-full', TIER_COLORS[tier])} />
            {txt(TIER_LABELS[tier])}
          </div>
        ))}
      </div>
    </Card>
  );
}
