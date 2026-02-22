'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/providers/LanguageProvider';
import { formatPercent } from '@/lib/utils/format-percent';
import { formatNull } from '@/lib/utils/format-null';
import { cn } from '@/lib/utils/cn';
import type { DashboardStockItem } from '../types/screener.types';

interface StockListItemProps {
  item: DashboardStockItem;
}

export function StockListItem({ item }: StockListItemProps) {
  const { language } = useLanguage();
  const changeStr = formatPercent(item.priceChangePercent);
  const isUp = item.priceChangePercent != null && item.priceChangePercent > 0;
  const isDown = item.priceChangePercent != null && item.priceChangePercent < 0;

  return (
    <Link
      href={`/stocks/${item.market}/${item.symbol}`}
      className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-zinc-50"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-zinc-900">{item.name}</span>
          {item.summaryTier && <Badge tier={item.summaryTier} language={language} />}
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
          <span className="font-mono">{item.symbol}</span>
          {item.sector && <span>· {item.sector}</span>}
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="text-sm font-mono text-zinc-900">
          {item.latestClose != null ? item.latestClose.toLocaleString() : '—'}
        </div>
        <div className={cn('text-xs font-mono', isUp && 'text-up', isDown && 'text-down', !isUp && !isDown && 'text-zinc-400')}>
          {changeStr}
        </div>
      </div>

      <div className="hidden gap-3 text-xs text-zinc-500 font-mono sm:flex">
        <span title="Beta">{formatNull(item.beta != null ? item.beta.toFixed(2) : null)}</span>
        <span title="RSI">{formatNull(item.rsi14 != null ? item.rsi14.toFixed(1) : null)}</span>
      </div>
    </Link>
  );
}
