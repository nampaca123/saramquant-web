'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Disclaimer } from '@/components/common/Disclaimer';
import { useText } from '@/lib/i18n/use-text';
import { portfolioApi } from '@/lib/api';
import { formatPercent } from '@/lib/utils/format-percent';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
import type { PortfolioSimulationResponse } from '../types/portfolio.types';

const SimulationFanChart = dynamic(
  () => import('@/components/ui/SimulationFanChart').then((m) => ({ default: m.SimulationFanChart })),
  { ssr: false },
);

interface SimulationChartProps {
  portfolioId: number;
}

export function SimulationChart({ portfolioId }: SimulationChartProps) {
  const txt = useText();
  const [days, setDays] = useState('60');
  const [method, setMethod] = useState('gbm');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PortfolioSimulationResponse | null>(null);
  const [error, setError] = useState('');

  const handleRun = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await portfolioApi.simulation(portfolioId, { days: Number(days), method });
      setResult(res);
    } catch {
      setError(txt(t.common.error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-sm font-medium text-zinc-700 mb-3">{txt(t.simulation.title)}</h3>

      <div className="flex gap-3 flex-wrap mb-3">
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

      {error && <p className="text-sm text-warning mt-3">{error}</p>}

      {result && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t.simulation.expectedReturn, value: result.results.expected_return },
              { label: t.simulation.var, value: result.results.var },
              { label: t.simulation.cvar, value: result.results.cvar },
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

          {result.results.path_percentiles.length > 0 && (
            <SimulationFanChart
              data={result.results.path_percentiles}
              referenceLine={result.target.current_value}
            />
          )}

          {result.data_coverage === 'PARTIAL' && (
            <p className="text-xs text-caution">
              {txt(t.simulation.partialCoverage)}: {result.excluded_stocks.map((s) => s.symbol).join(', ')}
            </p>
          )}

          <Disclaimer text={t.disclaimer.simulation} variant="inline" />
        </div>
      )}
    </Card>
  );
}
