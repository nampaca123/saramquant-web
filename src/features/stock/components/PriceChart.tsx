'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, type IChartApi, type CandlestickData, type Time } from 'lightweight-charts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';
import { stockApi } from '@/lib/api';
import { useLanguage } from '@/providers/LanguageProvider';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import type { PricePeriod } from '@/types';

interface PriceChartProps {
  symbol: string;
  market: string;
}

const PERIODS: { value: PricePeriod; label: string }[] = [
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
];

export function PriceChart({ symbol, market }: PriceChartProps) {
  const txt = useText();
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [period, setPeriod] = useState<PricePeriod>('1Y');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: { background: { color: 'transparent' }, textColor: '#a1a1aa', fontFamily: 'var(--font-mono)', attributionLogo: false },
      grid: { vertLines: { color: '#f4f4f5' }, horzLines: { color: '#f4f4f5' } },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
      localization: { locale: language === 'ko' ? 'ko-KR' : 'en-US' },
    });
    chartRef.current = chart;

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#059669',
      downColor: '#E11D48',
      borderUpColor: '#059669',
      borderDownColor: '#E11D48',
      wickUpColor: '#059669',
      wickDownColor: '#E11D48',
    });

    setLoading(true);
    stockApi.prices(symbol, market, period)
      .then((res) => {
        const data: CandlestickData<Time>[] = res.prices.map((p) => ({
          time: p.date as Time,
          open: p.open,
          high: p.high,
          low: p.low,
          close: p.close,
        }));
        series.setData(data);
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
  }, [symbol, market, period, language]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-700">{txt(t.stock.priceChart)}</h3>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <Button
              key={p.value}
              variant="ghost"
              size="sm"
              className={cn(
                'px-2 py-1 text-xs',
                period === p.value ? 'text-gold border-b-2 border-gold font-medium' : 'text-zinc-400',
              )}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="relative h-72 md:h-80">
        {loading && <Skeleton className="absolute inset-0 rounded-xl" />}
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </Card>
  );
}
