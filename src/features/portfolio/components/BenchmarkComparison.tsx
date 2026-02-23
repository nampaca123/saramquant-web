'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, LineSeries, type IChartApi, type LineData, type Time } from 'lightweight-charts';
import { HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Popover } from '@/components/ui/Popover';
import { Skeleton } from '@/components/ui/Skeleton';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
import { isError } from '@/lib/utils/is-error';
import type { BenchmarkComparisonResult, BenchmarkChartData } from '../types/portfolio.types';

interface BenchmarkComparisonProps {
  data: BenchmarkComparisonResult | { error: string } | null;
  chartData: BenchmarkChartData | { error: string } | null;
}

export function BenchmarkComparison({ data, chartData }: BenchmarkComparisonProps) {
  const txt = useText();
  const [infoOpen, setInfoOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const hasChart = chartData && !isError(chartData);
  const chart = hasChart ? (chartData as BenchmarkChartData) : null;
  const hasData = data && !isError(data);
  const d = hasData ? (data as BenchmarkComparisonResult) : null;

  useEffect(() => {
    if (!containerRef.current || !chart) return;

    const c = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: { background: { color: 'transparent' }, textColor: '#a1a1aa', fontFamily: 'var(--font-mono)' },
      grid: { vertLines: { color: '#f4f4f5' }, horzLines: { color: '#f4f4f5' } },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    });
    chartRef.current = c;

    const portfolioSeries = c.addSeries(LineSeries, { color: '#C8981E', lineWidth: 2 });
    const benchSeries = c.addSeries(LineSeries, { color: '#a1a1aa', lineWidth: 1, lineStyle: 2 });

    const toLineData = (series: Array<{ date: string; value: number }>): LineData<Time>[] =>
      series.map((p) => ({ time: p.date as Time, value: p.value }));

    portfolioSeries.setData(toLineData(chart.portfolio_series));
    benchSeries.setData(toLineData(chart.benchmark_series));
    c.timeScale().fitContent();

    const onResize = () => {
      if (containerRef.current) c.applyOptions({ width: containerRef.current.clientWidth });
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); c.remove(); };
  }, [chart]);

  if (!hasChart && !hasData) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-700">{txt(t.portfolio.benchmarkReturn)}</h3>
        <div className="flex items-center gap-3">
          {chart && (
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-gold" /> {txt(t.portfolio.portfolioReturn)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-zinc-400" /> {chart.benchmark_name}
              </span>
            </div>
          )}
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
      </div>

      {/* Chart */}
      {chart ? (
        <div className="relative h-48">
          <div ref={containerRef} className="h-full w-full" />
        </div>
      ) : (
        <Skeleton className="h-48 rounded-xl" />
      )}

      {/* Numeric summary row */}
      {d && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
          {[
            { label: txt(t.portfolio.portfolioReturn), value: d.portfolio_return },
            { label: d.benchmark_name, value: d.benchmark_return },
            { label: txt(t.portfolio.excess), value: d.excess_return, bold: true },
          ].map((row) => (
            <div key={row.label} className="text-center">
              <p className="text-[11px] text-zinc-400">{row.label}</p>
              <p className={cn(
                'text-sm font-mono',
                row.bold ? 'font-bold' : 'font-medium',
                row.value > 0 ? 'text-stable' : row.value < 0 ? 'text-warning' : 'text-zinc-600',
              )}>
                {row.value > 0 ? '+' : ''}{row.value.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
