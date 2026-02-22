'use client';

import { Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { getAllComparisons } from '@/lib/utils/format-comparison';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
import type { SectorComparison, StockFundamentals } from '../types/stock.types';

interface SectorComparisonCardProps {
  comparison: SectorComparison;
  fundamentals: StockFundamentals | null;
}

export function SectorComparisonCard({ comparison, fundamentals }: SectorComparisonCardProps) {
  const txt = useText();
  const { language } = useLanguage();

  const data: Record<string, { value: number | null; median: number | null }> = {
    per: { value: fundamentals?.per ?? null, median: comparison.medianPer },
    pbr: { value: fundamentals?.pbr ?? null, median: comparison.medianPbr },
    roe: { value: fundamentals?.roe ?? null, median: comparison.medianRoe },
    operatingMargin: { value: fundamentals?.operatingMargin ?? null, median: comparison.medianOperatingMargin },
    debtRatio: { value: fundamentals?.debtRatio ?? null, median: comparison.medianDebtRatio },
  };

  const results = getAllComparisons(data, language);

  if (results.length === 0) return null;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-4 w-4 text-gold" />
        <h3 className="text-sm font-bold text-zinc-900">
          {txt({ ko: `같은 업종(${comparison.sector}) 비교`, en: `Sector Comparison (${comparison.sector})` })}
        </h3>
        <span className="text-xs text-zinc-400">
          {comparison.stockCount}{txt(t.stock.sectorStockCount)}
        </span>
      </div>

      <div className="space-y-3">
        {results.map((r) => (
          <div key={r.key} className="rounded-lg border border-zinc-100 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-zinc-600">{txt(r.label)}</span>
              <span className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                r.isGood ? 'bg-stable-bg text-stable' : 'bg-zinc-100 text-zinc-500',
              )}>
                {txt(r.sentiment)}
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">{r.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
