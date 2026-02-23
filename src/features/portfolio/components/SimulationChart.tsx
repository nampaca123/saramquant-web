'use client';

import { useCallback, useState } from 'react';
import { SimulationSection } from '@/components/common/SimulationSection';
import { portfolioApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import type { SimulationParams, SimulationResult } from '@/components/common/SimulationSection';

interface SimulationChartProps {
  portfolioId: number;
}

export function SimulationChart({ portfolioId }: SimulationChartProps) {
  const [partialCoverage, setPartialCoverage] = useState<{ symbols: string[] } | null>(null);

  const handleRun = useCallback(async (params: SimulationParams): Promise<SimulationResult> => {
    const res = await portfolioApi.simulation(portfolioId, {
      days: params.days,
      confidence: params.confidence,
      method: params.method,
    });
    if (res.data_coverage === 'PARTIAL') {
      setPartialCoverage({ symbols: res.excluded_stocks.map((s) => s.symbol) });
    } else {
      setPartialCoverage(null);
    }
    return {
      expectedReturn: res.results.expected_return,
      var: res.results.var,
      cvar: res.results.cvar,
      pathPercentiles: res.results.path_percentiles,
      finalPercentiles: res.results.final_value_percentiles,
      simulationDays: res.simulation_days,
    };
  }, [portfolioId]);

  return (
    <SimulationSection
      onRun={handleRun}
      referenceLine={undefined}
      title={t.portfolio.simTitle}
      description={t.portfolio.simDesc}
      howItWorksDetail={t.portfolio.simHowItWorksDetail}
      defaultMethod="bootstrap"
      chartPreviewText={t.portfolio.simChartPreview}
      finalDistributionText={t.portfolio.simFinalDistribution}
      loadingStages={[t.portfolio.simStage1, t.portfolio.simStage2, t.portfolio.simStage3]}
      maxWaitText={t.portfolio.simMaxWait}
      methodTooltip={t.portfolio.simMethodTooltip}
      partialCoverage={partialCoverage}
    />
  );
}
