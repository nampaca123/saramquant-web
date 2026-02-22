'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useText } from '@/lib/i18n/use-text';
import { portfolioApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import { PortfolioTabSelector } from '@/features/portfolio/components/PortfolioTabSelector';
import { MetricsCards } from '@/features/portfolio/components/MetricsCards';
import { HoldingsList } from '@/features/portfolio/components/HoldingsList';
import { AiDiagnosisSection } from '@/features/portfolio/components/AiDiagnosisSection';
import { PortfolioSkeleton } from '@/features/portfolio/components/PortfolioSkeleton';
import type { MarketGroup } from '@/types';
import type {
  PortfolioSummary,
  PortfolioDetail,
  PortfolioAnalysisResponse,
  DiversificationResult,
} from '@/features/portfolio/types/portfolio.types';

const DiversificationChart = dynamic(
  () => import('@/features/portfolio/components/DiversificationChart').then((m) => ({ default: m.DiversificationChart })),
  { ssr: false },
);
const SimulationChart = dynamic(
  () => import('@/features/portfolio/components/SimulationChart').then((m) => ({ default: m.SimulationChart })),
  { ssr: false },
);

function isError(val: unknown): val is { error: string } {
  return val != null && typeof val === 'object' && 'error' in val;
}

export default function PortfolioPage() {
  const txt = useText();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<MarketGroup>('KR');
  const [summaries, setSummaries] = useState<PortfolioSummary[]>([]);
  const [detail, setDetail] = useState<PortfolioDetail | null>(null);
  const [analysis, setAnalysis] = useState<PortfolioAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const activePortfolio = summaries.find((s) => s.marketGroup === tab);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await portfolioApi.list();
      setSummaries(list);
      const p = list.find((s) => s.marketGroup === tab);
      if (p) {
        const [d, a] = await Promise.all([
          portfolioApi.detail(p.id),
          portfolioApi.analysis(p.id).catch(() => null),
        ]);
        setDetail(d);
        setAnalysis(a);
      } else {
        setDetail(null);
        setAnalysis(null);
      }
    } catch { /* handled */ }
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    if (user) fetchData();
    else setLoading(false);
  }, [user, fetchData]);

  if (authLoading || (user && loading)) {
    return (
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        <PortfolioSkeleton />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 animate-fade-in">
        <Card className="text-center py-16">
          <BarChart3 className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900">{txt(t.portfolio.loginCta)}</h2>
          <p className="text-sm text-zinc-500 mt-2">{txt(t.portfolio.loginCtaSub)}</p>
          <Button variant="primary" size="lg" className="mt-6" onClick={() => router.push('/')}>
            {txt(t.common.login)}
          </Button>
        </Card>
      </main>
    );
  }

  const diversData = analysis?.diversification && !isError(analysis.diversification)
    ? analysis.diversification as DiversificationResult
    : null;

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6 animate-fade-in">
      {/* Title + tab */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">{txt(t.portfolio.title)}</h1>
        <PortfolioTabSelector active={tab} onChange={setTab} />
      </div>

      {/* Metrics */}
      <MetricsCards analysis={analysis} />

      {/* Holdings */}
      {detail && <HoldingsList portfolio={detail} onRefresh={fetchData} />}

      {/* Charts row */}
      {activePortfolio && (
        <div className="md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
          <DiversificationChart data={diversData} />
          <SimulationChart portfolioId={activePortfolio.id} />
        </div>
      )}

      {/* AI */}
      {activePortfolio && <AiDiagnosisSection portfolioId={activePortfolio.id} />}
    </main>
  );
}
