'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Popover } from '@/components/ui/Popover';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
import { isError } from '@/lib/utils/is-error';
import type { BenchmarkComparisonResult } from '../types/portfolio.types';

interface BenchmarkComparisonProps {
  data: BenchmarkComparisonResult | { error: string } | null;
}

export function BenchmarkComparison({ data }: BenchmarkComparisonProps) {
  const txt = useText();
  const [infoOpen, setInfoOpen] = useState(false);

  if (!data || isError(data)) return null;
  const d = data as BenchmarkComparisonResult;

  const rows = [
    { label: txt(t.portfolio.portfolioReturn), value: d.portfolio_return },
    { label: `${txt(t.portfolio.benchmark)} (${d.benchmark_name})`, value: d.benchmark_return },
    { label: txt(t.portfolio.excess), value: d.excess_return, bold: true },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-700">{txt(t.portfolio.benchmarkReturn)}</h3>
        <div className="relative">
          <button onClick={() => setInfoOpen(!infoOpen)}>
            <HelpCircle className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-600" />
          </button>
          <Popover open={infoOpen} onClose={() => setInfoOpen(false)} className="top-6 right-0 w-72">
            <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line pr-4">
              {txt(t.portfolio.benchmarkReturnInfo)}
            </p>
          </Popover>
        </div>
      </div>

      <div className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className={cn(
            'flex items-center justify-between',
            row.bold && 'pt-2 border-t border-zinc-100',
          )}>
            <span className={cn('text-sm', row.bold ? 'font-medium text-zinc-900' : 'text-zinc-500')}>
              {row.label}
            </span>
            <span className={cn(
              'font-mono text-sm',
              row.bold ? 'font-bold' : 'font-medium',
              row.value > 0 ? 'text-stable' : row.value < 0 ? 'text-warning' : 'text-zinc-600',
            )}>
              {row.value > 0 ? '+' : ''}{row.value.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-zinc-400 mt-3">
        {d.lookback_days}d lookback
      </p>
    </Card>
  );
}
