'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronRight, ChevronDown } from 'lucide-react';
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

export function StockSimulationSection({ symbol, currentPrice }: StockSimulationSectionProps) {
  const txt = useText();
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState('60');
  const [confidence, setConfidence] = useState('0.95');
  const [method, setMethod] = useState('gbm');
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
        method,
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
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-medium text-zinc-700">{txt(t.simulation.title)}</span>
        {open
          ? <ChevronDown className="h-4 w-4 text-zinc-400" />
          : <ChevronRight className="h-4 w-4 text-zinc-400" />
        }
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          <div className="flex gap-3 flex-wrap">
            <Select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              options={[
                { value: '30', label: '30' },
                { value: '60', label: '60' },
                { value: '120', label: '120' },
                { value: '252', label: '252' },
              ]}
              className="w-20"
            />
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
            <Select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              options={[
                { value: 'gbm', label: 'GBM' },
                { value: 'bootstrap', label: 'Bootstrap' },
              ]}
              className="w-28"
            />
          </div>

          <Button variant="primary" size="sm" onClick={handleRun} disabled={loading}>
            {loading ? txt(t.common.loading) : txt(t.simulation.run)}
          </Button>

          {error && <p className="text-sm text-warning">{error}</p>}

          {result && (
            <>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t.simulation.expectedReturn, value: result.expected_return },
                  { label: t.simulation.var, value: result.var },
                  { label: t.simulation.cvar, value: result.cvar },
                ].map((item) => (
                  <div key={txt(item.label)} className="rounded-xl border border-zinc-100 p-3 text-center">
                    <p className="text-xs text-zinc-500">{txt(item.label)}</p>
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

              <Disclaimer text={t.disclaimer.simulation} variant="inline" />
            </>
          )}
        </div>
      )}
    </Card>
  );
}
