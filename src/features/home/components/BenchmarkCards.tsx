'use client';

import { Card } from '@/components/ui/Card';
import { formatPercent } from '@/lib/utils/format-percent';
import { cn } from '@/lib/utils/cn';
import type { BenchmarkSummary } from '../types/home.types';

const BENCHMARK_LABELS: Record<string, string> = {
  KR_KOSPI: 'KOSPI',
  KR_KOSDAQ: 'KOSDAQ',
  US_SP500: 'S&P 500',
  US_NASDAQ: 'NASDAQ',
};

interface BenchmarkCardsProps {
  benchmarks: BenchmarkSummary[];
}

export function BenchmarkCards({ benchmarks }: BenchmarkCardsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
      {benchmarks.map((b) => {
        const isUp = b.changePercent > 0;
        const isDown = b.changePercent < 0;
        return (
          <Card key={b.benchmark} className="shrink-0 w-44">
            <p className="text-xs text-zinc-500 mb-1">
              {BENCHMARK_LABELS[b.benchmark] ?? b.benchmark}
            </p>
            <p className="text-lg font-semibold font-mono text-zinc-900">
              {b.latestClose.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className={cn(
              'text-sm font-mono mt-0.5',
              isUp && 'text-up',
              isDown && 'text-down',
              !isUp && !isDown && 'text-zinc-400',
            )}>
              {formatPercent(b.changePercent)}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
