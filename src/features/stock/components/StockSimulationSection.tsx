'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Disclaimer } from '@/components/common/Disclaimer';
import { useText } from '@/lib/i18n/use-text';
import { stockApi } from '@/lib/api';
import { formatPercent } from '@/lib/utils/format-percent';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
import type { StockSimulationResponse } from '../types/stock.types';

const SimulationFanChart = dynamic(
  () => import('@/components/ui/SimulationFanChart').then((m) => ({ default: m.SimulationFanChart })),
  { ssr: false },
);

interface StockSimulationSectionProps {
  symbol: string;
  currentPrice: number | null;
}

const RESULT_TOOLTIPS = {
  expectedReturn: {
    ko: '과거 패턴이 계속된다면 평균적으로 기대할 수 있는 수익이에요',
    en: 'Average expected return if past patterns continue',
  },
  var: {
    ko: '최악의 경우 이 정도까지 떨어질 수 있어요 (설정한 확률 범위 기준)',
    en: 'Maximum expected loss within the probability range',
  },
  cvar: {
    ko: '최악의 상황들만 모았을 때 평균 손실이에요',
    en: 'Average loss in extreme scenarios',
  },
};

export function StockSimulationSection({ symbol, currentPrice }: StockSimulationSectionProps) {
  const txt = useText();
  const [days, setDays] = useState('60');
  const [confidence, setConfidence] = useState('0.95');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StockSimulationResponse | null>(null);
  const [error, setError] = useState('');

  const handleRun = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await stockApi.simulation(symbol, {
        days: Number(days),
        confidence: Number(confidence),
        method: 'gbm',
      });
      setResult(res);
    } catch {
      setError(txt(t.common.error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-4 w-4 text-gold" />
        <h3 className="text-sm font-bold text-zinc-900">{txt(t.simulation.title)}</h3>
      </div>

      {!result ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-zinc-50 p-4 text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-zinc-300 mb-2" />
            <p className="text-sm text-zinc-600">
              {txt({ ko: '이 종목의 과거 데이터를 기반으로, 앞으로 가격이 어느 범위 안에 있을지 보여드려요', en: 'Based on historical data, we show the likely price range going forward' })}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">{txt(t.simulation.days)}</label>
              <Select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                options={[
                  { value: '30', label: txt({ ko: '30일', en: '30 days' }) },
                  { value: '60', label: txt({ ko: '60일', en: '60 days' }) },
                  { value: '120', label: txt({ ko: '120일', en: '120 days' }) },
                  { value: '252', label: txt({ ko: '1년', en: '1 year' }) },
                ]}
                className="w-24"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">
                {txt(t.simulation.confidence)}
                <span className="ml-1 text-zinc-400" title={txt({ ko: '95%면 100번 중 95번은 이 범위 안에 있다는 뜻이에요', en: '95% means 95 out of 100 times the price falls within this range' })}>
                  <Info className="inline h-3 w-3" />
                </span>
              </label>
              <Select
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                options={[
                  { value: '0.90', label: '90%' },
                  { value: '0.95', label: '95%' },
                  { value: '0.99', label: '99%' },
                ]}
                className="w-20"
              />
            </div>
            <div className="self-end">
              <Button variant="primary" size="sm" onClick={handleRun} disabled={loading}>
                {loading ? txt(t.common.loading) : txt(t.simulation.run)}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {([
              { label: t.simulation.expectedReturn, value: result.expected_return, tooltip: RESULT_TOOLTIPS.expectedReturn },
              { label: t.simulation.var, value: result.var, tooltip: RESULT_TOOLTIPS.var },
              { label: t.simulation.cvar, value: result.cvar, tooltip: RESULT_TOOLTIPS.cvar },
            ] as const).map((item) => (
              <div key={txt(item.label)} className="rounded-xl border border-zinc-100 p-3 text-center">
                <p className="text-xs text-zinc-500" title={txt(item.tooltip)}>
                  {txt(item.label)} <Info className="inline h-3 w-3 text-zinc-400" />
                </p>
                <p className={cn(
                  'text-lg font-mono font-bold mt-1',
                  item.value > 0 ? 'text-up' : 'text-down',
                )}>
                  {formatPercent(item.value * 100)}
                </p>
              </div>
            ))}
          </div>

          {result.path_percentiles.length > 0 && (
            <SimulationFanChart
              data={result.path_percentiles}
              referenceLine={currentPrice ?? undefined}
            />
          )}

          <div className="flex items-center justify-between">
            <Disclaimer text={t.disclaimer.simulation} variant="inline" />
            <Button variant="ghost" size="sm" onClick={() => setResult(null)}>
              {txt({ ko: '다시 실행', en: 'Run again' })}
            </Button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-warning">{error}</p>}
    </Card>
  );
}
