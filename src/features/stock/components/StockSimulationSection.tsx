'use client';

import { useCallback } from 'react';
import { SimulationSection } from '@/components/common/SimulationSection';
import { stockApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import type { SimulationParams, SimulationResult } from '@/components/common/SimulationSection';

interface StockSimulationSectionProps {
  symbol: string;
  market: string;
  currentPrice: number | null;
}

export function StockSimulationSection({ symbol, market, currentPrice }: StockSimulationSectionProps) {
  const handleRun = useCallback(async (params: SimulationParams): Promise<SimulationResult> => {
    const res = await stockApi.simulation(symbol, {
      days: params.days,
      confidence: params.confidence,
      method: params.method,
      market,
    });
    return {
      expectedReturn: res.expected_return,
      var: res.var,
      cvar: res.cvar,
      pathPercentiles: res.path_percentiles,
      finalPercentiles: res.final_price_percentiles,
      simulationDays: res.simulation_days,
    };
  }, [symbol, market]);

  return (
    <SimulationSection
      onRun={handleRun}
      referenceLine={currentPrice ?? undefined}
      title={t.simulation.title}
      description={t.simulation.desc}
      howItWorksDetail={t.simulation.howItWorksDetail}
    />
  );
}
