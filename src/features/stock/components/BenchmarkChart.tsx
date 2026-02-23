'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, LineSeries, type IChartApi, type LineData, type Time } from 'lightweight-charts';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { stockApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';

interface BenchmarkChartProps {
  symbol: string;
  market: string;
  stockName: string;
}

export function BenchmarkChart({ symbol, market, stockName }: BenchmarkChartProps) {
  const txt = useText();
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [benchmarkName, setBenchmarkName] = useState('Benchmark');

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: { background: { color: 'transparent' }, textColor: '#a1a1aa', fontFamily: 'var(--font-mono)', attributionLogo: false },
      grid: { vertLines: { color: '#f4f4f5' }, horzLines: { color: '#f4f4f5' } },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    });
    chartRef.current = chart;

    const stockSeries = chart.addSeries(LineSeries, { color: '#C8981E', lineWidth: 2 });
    const benchSeries = chart.addSeries(LineSeries, { color: '#a1a1aa', lineWidth: 1, lineStyle: 2 });

    setLoading(true);
    stockApi.benchmark(symbol, market, '1Y')
      .then((res) => {
        setBenchmarkName(res.benchmark);
        const normalize = (series: { date: string; value: number }[]): LineData<Time>[] => {
          if (!series.length) return [];
          const base = series[0].value;
          return series.map((p) => ({ time: p.date as Time, value: (p.value / base) * 100 }));
        };
        stockSeries.setData(normalize(res.stockSeries));
        benchSeries.setData(normalize(res.benchmarkSeries));
        chart.timeScale().fitContent();
      })
      .finally(() => setLoading(false));

    const onResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.remove();
    };
  }, [symbol, market]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-700">{txt(t.stock.benchmark)}</h3>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gold" /> {stockName}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-zinc-400" /> {benchmarkName}
          </span>
        </div>
      </div>
      <div className="relative h-56 md:h-64">
        {loading && <Skeleton className="absolute inset-0 rounded-xl" />}
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </Card>
  );
}
