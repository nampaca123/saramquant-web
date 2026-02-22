'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { stockApi } from '@/lib/api';
import { StockHeader } from '@/features/stock/components/StockHeader';
import { RiskReport } from '@/features/stock/components/RiskReport';
import { AiAnalysisSection } from '@/features/stock/components/AiAnalysisSection';
import { StockSimulationSection } from '@/features/stock/components/StockSimulationSection';
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
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-6">
        <StockDetailSkeleton />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-6">
        <p className="text-sm text-warning">{error || txt(t.common.error)}</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6 animate-fade-in">
      <StockHeader
        header={data.header}
        riskBadge={data.riskBadge}
        onAddPortfolio={() => setModalOpen(true)}
      />

      <PriceChart symbol={params.symbol} market={params.market} />

      <BenchmarkChart
        symbol={params.symbol}
        market={params.market}
        stockName={data.header.name}
      />

      <RiskReport riskBadge={data.riskBadge} />

      <StockSimulationSection
        symbol={params.symbol}
        currentPrice={data.header.latestClose}
      />

      <AiAnalysisSection
        symbol={params.symbol}
        market={params.market}
        cachedAnalysis={data.llmAnalysis}
      />

      <AddToPortfolioButton
        stockId={data.header.stockId}
        symbol={params.symbol}
        market={params.market}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
