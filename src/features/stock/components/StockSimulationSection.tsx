'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, Info, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Disclaimer } from '@/components/common/Disclaimer';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { stockApi } from '@/lib/api';
import { formatPercent } from '@/lib/utils/format-percent';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
import type { StockSimulationResponse } from '../types/stock.types';
import type { Language } from '@/types';

const SimulationFanChart = dynamic(
  () => import('@/components/ui/SimulationFanChart').then((m) => ({ default: m.SimulationFanChart })),
  { ssr: false },
);

interface StockSimulationSectionProps {
  symbol: string;
  currentPrice: number | null;
}

const PERCENTILE_LABELS: Record<string, { ko: string; en: string }> = {
  '10': { ko: '비관적 (하위 10%)', en: 'Pessimistic (P10)' },
  '25': { ko: '보수적 (하위 25%)', en: 'Conservative (P25)' },
  '50': { ko: '중간값 (예상 중심)', en: 'Median (P50)' },
  '75': { ko: '낙관적 (상위 25%)', en: 'Optimistic (P75)' },
  '90': { ko: '매우 낙관적 (상위 10%)', en: 'Very Optimistic (P90)' },
};

const RESULT_TOOLTIPS = {
  expectedReturn: {
    ko: '과거 패턴이 계속된다면 평균적으로 기대할 수 있는 수익이에요',
    en: 'Average expected return if past patterns continue',
  },
  var: {
    ko: '이 확률 범위 안에서 최악의 경우 이 정도까지 떨어질 수 있어요',
    en: 'Maximum expected loss within the selected probability range',
  },
  cvar: {
    ko: '최악의 상황들만 모았을 때 평균 손실이에요. VaR보다 보수적인 수치예요',
    en: 'Average loss in the worst-case tail. More conservative than VaR',
  },
};

export function StockSimulationSection({ symbol, currentPrice }: StockSimulationSectionProps) {
  const txt = useText();
  const { language } = useLanguage();
  const [days, setDays] = useState('60');
  const [confidence, setConfidence] = useState('0.95');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StockSimulationResponse | null>(null);
  const [error, setError] = useState('');

  const confidenceLabel = `${Math.round(Number(confidence) * 100)}%`;

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

      <p className="text-xs text-zinc-500 mb-4">
        {txt({
          ko: '이 종목의 과거 데이터를 기반으로, 앞으로 가격이 어느 범위 안에 있을지 통계적으로 추정해요.',
          en: 'Statistically estimates the likely future price range based on historical data.',
        })}
      </p>

      {/* Controls -- always visible */}
      <div className="flex items-end gap-3 flex-wrap mb-4">
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
            <span
              className="ml-1 text-zinc-400 cursor-help"
              title={txt({
                ko: '95%면 100번 중 95번은 이 범위 안에 있다는 뜻이에요',
                en: '95% means 95 out of 100 times the price falls within this range',
              })}
            >
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
        <Button variant="primary" size="sm" onClick={handleRun} disabled={loading}>
          {loading ? txt(t.common.loading) : txt(t.simulation.run)}
        </Button>
      </div>

      {/* Output area */}
      {!result ? (
        <OutputPreview confidenceLabel={confidenceLabel} txt={txt} language={language} />
      ) : (
        <SimulationResults
          result={result}
          confidenceLabel={confidenceLabel}
          currentPrice={currentPrice}
          txt={txt}
          language={language}
        />
      )}

      {error && <p className="mt-2 text-sm text-warning">{error}</p>}
    </Card>
  );
}

function OutputPreview({ confidenceLabel, txt, language }: { confidenceLabel: string; txt: (v: any) => string; language: Language }) {
  return (
    <div className="space-y-3">
      {/* Metric cards skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {[
          txt(t.simulation.expectedReturn),
          `${txt(t.simulation.var)} (${confidenceLabel})`,
          `${txt(t.simulation.cvar)} (${confidenceLabel})`,
        ].map((label) => (
          <div key={label} className="rounded-xl border border-dashed border-zinc-200 p-3 text-center">
            <p className="text-[11px] text-zinc-400">{label}</p>
            <p className="text-lg font-mono font-bold text-zinc-200 mt-1">—</p>
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-10">
        <BarChart3 className="h-8 w-8 text-zinc-200 mb-2" />
        <p className="text-xs text-zinc-400">
          {txt({ ko: '실행하면 가격 범위 차트가 여기에 표시돼요', en: 'Price range chart will appear here after running' })}
        </p>
      </div>

      {/* Percentile table skeleton */}
      <div className="rounded-xl border border-dashed border-zinc-200 p-3">
        <p className="text-[11px] text-zinc-400 mb-2 font-medium">
          {txt({ ko: '최종 예상 가격 분포', en: 'Final Price Distribution' })}
        </p>
        <div className="space-y-1.5">
          {['10', '25', '50', '75', '90'].map((pct) => (
            <div key={pct} className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">{PERCENTILE_LABELS[pct]?.[language] ?? `P${pct}`}</span>
              <span className="font-mono text-zinc-200">—</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SimulationResults({
  result,
  confidenceLabel,
  currentPrice,
  txt,
  language,
}: {
  result: StockSimulationResponse;
  confidenceLabel: string;
  currentPrice: number | null;
  txt: (v: any) => string;
  language: Language;
}) {
  const metrics = [
    { label: txt(t.simulation.expectedReturn), value: result.expected_return, tooltip: RESULT_TOOLTIPS.expectedReturn },
    { label: `${txt(t.simulation.var)} (${confidenceLabel})`, value: result.var, tooltip: RESULT_TOOLTIPS.var },
    { label: `${txt(t.simulation.cvar)} (${confidenceLabel})`, value: result.cvar, tooltip: RESULT_TOOLTIPS.cvar },
  ];

  const sortedPercentiles = Object.entries(result.final_price_percentiles).sort(
    ([a], [b]) => Number(a) - Number(b),
  );

  return (
    <div className="space-y-4">
      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((item) => (
          <div key={item.label} className="rounded-xl border border-zinc-100 p-3 text-center">
            <p className="text-[11px] text-zinc-500" title={txt(item.tooltip)}>
              {item.label} <Info className="inline h-3 w-3 text-zinc-400" />
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

      {/* Fan chart */}
      {result.path_percentiles.length > 0 && (
        <SimulationFanChart
          data={result.path_percentiles}
          referenceLine={currentPrice ?? undefined}
        />
      )}

      {/* Final price percentiles table */}
      {sortedPercentiles.length > 0 && (
        <div className="rounded-xl border border-zinc-100 p-3">
          <p className="text-[11px] font-medium text-zinc-500 mb-2">
            {txt({ ko: `${result.simulation_days}일 후 예상 가격 분포`, en: `Price distribution after ${result.simulation_days} days` })}
          </p>
          <div className="space-y-1.5">
            {sortedPercentiles.map(([pct, price]) => {
              const change = currentPrice ? ((price - currentPrice) / currentPrice) * 100 : null;
              return (
                <div key={pct} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-600">
                    {PERCENTILE_LABELS[pct]?.[language] ?? `P${pct}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-zinc-900">
                      {price.toLocaleString()}
                    </span>
                    {change != null && (
                      <span className={cn('font-mono', change > 0 ? 'text-up' : 'text-down')}>
                        {formatPercent(change)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Disclaimer text={t.disclaimer.simulation} variant="inline" />
      </div>
    </div>
  );
}
