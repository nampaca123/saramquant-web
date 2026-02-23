'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, Info, BarChart3, HelpCircle, X } from 'lucide-react';
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
import type { Language, LocalizedText } from '@/types';

const SimulationFanChart = dynamic(
  () => import('@/components/ui/SimulationFanChart').then((m) => ({ default: m.SimulationFanChart })),
  { ssr: false },
);

interface StockSimulationSectionProps {
  symbol: string;
  market: string;
  currentPrice: number | null;
}

const PERCENTILE_LABELS: Record<string, typeof t.simulation.pctPessimistic> = {
  '10': t.simulation.pctPessimistic,
  '25': t.simulation.pctConservative,
  '50': t.simulation.pctMedian,
  '75': t.simulation.pctOptimistic,
  '90': t.simulation.pctVeryOptimistic,
};

const RESULT_TOOLTIPS = {
  expectedReturn: t.simulation.tooltipReturn,
  var: t.simulation.tooltipVar,
  cvar: t.simulation.tooltipCvar,
};

export function StockSimulationSection({ symbol, market, currentPrice }: StockSimulationSectionProps) {
  const txt = useText();
  const { language } = useLanguage();
  const [days, setDays] = useState('60');
  const [confidence, setConfidence] = useState('0.95');
  const [method, setMethod] = useState<'gbm' | 'bootstrap'>('gbm');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StockSimulationResponse | null>(null);
  const [error, setError] = useState('');
  const [openTip, setOpenTip] = useState<string | null>(null);

  const confidenceLabel = `${Math.round(Number(confidence) * 100)}%`;

  const toggleTip = (key: string) => setOpenTip(openTip === key ? null : key);
  const closeTip = () => setOpenTip(null);

  const handleRun = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await stockApi.simulation(symbol, {
        days: Number(days),
        confidence: Number(confidence),
        method,
        market,
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
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-bold text-zinc-900">{txt(t.simulation.title)}</h3>
        </div>
        <div className="relative">
          <button
            onClick={() => toggleTip('howItWorks')}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {txt(t.simulation.howItWorks)}
          </button>
          {openTip === 'howItWorks' && (
            <InfoPopover onClose={closeTip}>
              <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">
                {txt(t.simulation.howItWorksDetail)}
              </p>
            </InfoPopover>
          )}
        </div>
      </div>

      <p className="text-xs text-zinc-500 mb-4">
        {txt(t.simulation.desc)}
      </p>

      {/* Controls */}
      <div className="space-y-3 mb-4">
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">{txt(t.simulation.days)}</label>
            <Select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              options={[
                { value: '30', label: txt(t.simulation.days30) },
                { value: '60', label: txt(t.simulation.days60) },
                { value: '120', label: txt(t.simulation.days120) },
                { value: '252', label: txt(t.simulation.days252) },
              ]}
              className="w-24"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">
              {txt(t.simulation.confidence)}
              <span className="relative ml-1 inline-block">
                <button onClick={() => toggleTip('confidence')} className="text-zinc-400 hover:text-zinc-600">
                  <Info className="inline h-3 w-3" />
                </button>
                {openTip === 'confidence' && (
                  <InfoPopover onClose={closeTip} className="left-0 top-5">
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {txt(t.simulation.confidenceTooltip)}
                    </p>
                  </InfoPopover>
                )}
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
        </div>

        {/* Method selector */}
        <div>
          <label className="text-xs text-zinc-500 mb-1.5 flex items-center gap-1">
            {txt(t.simulation.method)}
            <span className="relative inline-block">
              <button onClick={() => toggleTip('method')} className="text-zinc-400 hover:text-zinc-600">
                <Info className="inline h-3 w-3" />
              </button>
              {openTip === 'method' && (
                <InfoPopover onClose={closeTip} className="left-0 top-5">
                  <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">
                    {txt(t.simulation.methodTooltip)}
                  </p>
                </InfoPopover>
              )}
            </span>
          </label>
          <div className="flex gap-2">
            {([
              { value: 'gbm' as const, label: t.simulation.methodGbm },
              { value: 'bootstrap' as const, label: t.simulation.methodBootstrap },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMethod(opt.value)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                  method === opt.value
                    ? 'border-gold bg-gold-wash text-gold'
                    : 'border-zinc-100 text-zinc-500 hover:border-zinc-200',
                )}
              >
                {txt(opt.label)}
              </button>
            ))}
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={handleRun} disabled={loading} className="w-full">
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

function InfoPopover({ onClose, children, className }: { onClose: () => void; children: React.ReactNode; className?: string }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'absolute z-50 w-64 rounded-xl bg-white p-3 shadow-lg border border-zinc-100 animate-fade-in',
        className ?? 'right-0 top-7',
      )}
    >
      <button onClick={onClose} className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-600">
        <X className="h-3 w-3" />
      </button>
      {children}
    </div>
  );
}

function MetricCard({ label, value, tooltip, txt }: {
  label: string;
  value: number;
  tooltip: LocalizedText;
  txt: (v: any) => string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative rounded-xl border border-zinc-100 p-3 text-center">
      <p className="text-[11px] text-zinc-500">
        {label}
        <button onClick={() => setOpen(!open)} className="ml-1 text-zinc-400 hover:text-zinc-600 align-middle">
          <Info className="inline h-3 w-3" />
        </button>
      </p>
      <p className={cn(
        'text-lg font-mono font-bold mt-1',
        value > 0 ? 'text-up' : 'text-down',
      )}>
        {formatPercent(value * 100)}
      </p>
      {open && (
        <InfoPopover onClose={() => setOpen(false)} className="left-1/2 -translate-x-1/2 top-full mt-1">
          <p className="text-xs text-zinc-600 leading-relaxed">{txt(tooltip)}</p>
        </InfoPopover>
      )}
    </div>
  );
}

function OutputPreview({ confidenceLabel, txt, language }: { confidenceLabel: string; txt: (v: any) => string; language: Language }) {
  return (
    <div className="space-y-3">
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

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-10">
        <BarChart3 className="h-8 w-8 text-zinc-200 mb-2" />
        <p className="text-xs text-zinc-400">
          {txt(t.simulation.chartPreview)}
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-zinc-200 p-3">
        <p className="text-[11px] text-zinc-400 mb-2 font-medium">
          {txt(t.simulation.finalDistribution)}
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
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((item) => (
          <MetricCard key={item.label} label={item.label} value={item.value} tooltip={item.tooltip} txt={txt} />
        ))}
      </div>

      {result.path_percentiles.length > 0 && (
        <SimulationFanChart
          data={result.path_percentiles}
          referenceLine={currentPrice ?? undefined}
        />
      )}

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
