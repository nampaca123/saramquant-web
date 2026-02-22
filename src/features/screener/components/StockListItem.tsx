'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/providers/LanguageProvider';
import { formatPercent } from '@/lib/utils/format-percent';
import { cn } from '@/lib/utils/cn';
import { RISK_DIMENSION_LABELS } from '@/constants/indicator-tooltips.constants';
import type { DashboardStockItem } from '../types/screener.types';

const DIMENSION_ORDER = ['price_heat', 'volatility', 'trend', 'company_health', 'valuation'] as const;

const TIER_COLORS: Record<string, { dot: string; text: string }> = {
  STABLE: { dot: 'bg-stable', text: 'text-stable' },
  CAUTION: { dot: 'bg-caution', text: 'text-caution' },
  WARNING: { dot: 'bg-warning', text: 'text-warning' },
};

export function StockListItem({ item }: { item: DashboardStockItem }) {
  const { language } = useLanguage();
  const changeStr = formatPercent(item.priceChangePercent);
  const isUp = item.priceChangePercent != null && item.priceChangePercent > 0;
  const isDown = item.priceChangePercent != null && item.priceChangePercent < 0;

  return (
    <Link
      href={`/stocks/${item.market}/${item.symbol}`}
      className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 rounded-lg border border-zinc-100 bg-white px-4 py-3 transition-colors hover:border-zinc-200 hover:bg-zinc-50 sm:grid-cols-[minmax(180px,1.2fr)_minmax(240px,1.5fr)_minmax(100px,0.8fr)]"
    >
      {/* Col 1: Stock identity -- fixed width, truncated */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-zinc-900">{item.name}</span>
            {item.summaryTier && <Badge tier={item.summaryTier} language={language} className="shrink-0" />}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs font-mono text-zinc-400">{item.symbol}</span>
            {item.sector && <span className="text-xs text-zinc-400 truncate">· {item.sector}</span>}
          </div>
        </div>
      </div>

      {/* Col 2: 5-dimension risk indicators */}
      <div className="hidden sm:flex items-center gap-1">
        {DIMENSION_ORDER.map((dim) => {
          const tier = item.dimensionTiers?.[dim];
          const colors = tier ? TIER_COLORS[tier] : null;
          const dimLabel = RISK_DIMENSION_LABELS[dim];
          return (
            <div
              key={dim}
              className="flex items-center gap-1 rounded-md bg-zinc-50 px-1.5 py-1"
              title={dimLabel ? dimLabel.question[language] : dim}
            >
              <div className={cn('h-2 w-2 shrink-0 rounded-full', colors?.dot ?? 'bg-zinc-200')} />
              <span className="text-[10px] leading-tight text-zinc-500 whitespace-nowrap">
                {dimLabel ? dimLabel.label[language] : dim}
              </span>
            </div>
          );
        })}
      </div>

      {/* Col 3: Price info */}
      <div className="flex items-center justify-end gap-3">
        <div className="text-right">
          <div className="text-sm font-mono font-medium text-zinc-900">
            {item.latestClose != null ? item.latestClose.toLocaleString() : '—'}
          </div>
          <div className={cn(
            'text-xs font-mono',
            isUp && 'text-up',
            isDown && 'text-down',
            !isUp && !isDown && 'text-zinc-400',
          )}>
            {changeStr}
          </div>
        </div>
      </div>

      {/* Mobile: 5-dimension row (shown below on small screens) */}
      <div className="col-span-full flex flex-wrap gap-1 sm:hidden">
        {DIMENSION_ORDER.map((dim) => {
          const tier = item.dimensionTiers?.[dim];
          const colors = tier ? TIER_COLORS[tier] : null;
          const dimLabel = RISK_DIMENSION_LABELS[dim];
          return (
            <div
              key={dim}
              className="flex items-center gap-1 rounded bg-zinc-50 px-1.5 py-0.5"
            >
              <div className={cn('h-1.5 w-1.5 shrink-0 rounded-full', colors?.dot ?? 'bg-zinc-200')} />
              <span className="text-[10px] text-zinc-500">
                {dimLabel ? dimLabel.label[language] : dim}
              </span>
            </div>
          );
        })}
      </div>
    </Link>
  );
}
