'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { stockApi } from '@/lib/api';
import { StockHeader } from '@/features/stock/components/StockHeader';
import { RiskReport } from '@/features/stock/components/RiskReport';
import { AiAnalysisSection } from '@/features/stock/components/AiAnalysisSection';
import { StockSimulationSection } from '@/features/stock/components/StockSimulationSection';
import { SectorComparisonCard } from '@/features/stock/components/SectorComparisonCard';
import { FactorExposureChart } from '@/features/stock/components/FactorExposureChart';
import { AddToPortfolioButton } from '@/features/stock/components/AddToPortfolioButton';
import { StockDetailSkeleton } from '@/features/stock/components/StockDetailSkeleton';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import type { StockDetailResponse } from '@/features/stock/types/stock.types';

const PriceChart = dynamic(
  () => import('@/features/stock/components/PriceChart').then((m) => ({ default: m.PriceChart })),
  { ssr: false },
);
const BenchmarkChart = dynamic(
  () => import('@/features/stock/components/BenchmarkChart').then((m) => ({ default: m.BenchmarkChart })),
  { ssr: false },
);

export default function StockDetailPage() {
  const params = useParams<{ market: string; symbol: string }>();
  const txt = useText();
  const [data, setData] = useState<StockDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    stockApi.detail(params.symbol, params.market)
      .then(setData)
      .catch(() => setError(txt(t.common.error)))
      .finally(() => setLoading(false));
  }, [params.symbol, params.market]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <StockDetailSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto">
        <p className="text-sm text-warning">{error || txt(t.common.error)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <StockHeader
        header={data.header}
        riskBadge={data.riskBadge}
        onAddPortfolio={() => setModalOpen(true)}
      />

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* Left column: charts + risk report */}
        <div className="flex-1 min-w-0 space-y-6">
          <PriceChart symbol={params.symbol} market={params.market} />

          <BenchmarkChart
            symbol={params.symbol}
            market={params.market}
            stockName={data.header.name}
          />

          <RiskReport riskBadge={data.riskBadge} />
        </div>

        {/* Right column: AI + simulation + comparison + factors */}
        <div className="w-full space-y-6 lg:w-80 lg:shrink-0 lg:sticky lg:top-20 lg:self-start">
          <AiAnalysisSection
            symbol={params.symbol}
            market={params.market}
            cachedAnalysis={data.llmAnalysis}
          />

          <StockSimulationSection
            symbol={params.symbol}
            currentPrice={data.header.latestClose}
          />

          {data.sectorComparison && (
            <SectorComparisonCard
              comparison={data.sectorComparison}
              fundamentals={data.fundamentals}
            />
          )}

          {data.factorExposures && (
            <FactorExposureChart exposures={data.factorExposures} />
          )}
        </div>
      </div>

      <AddToPortfolioButton
        stockId={data.header.stockId}
        symbol={params.symbol}
        market={params.market}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
