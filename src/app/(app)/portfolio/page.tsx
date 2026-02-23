'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PieChart, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useText } from '@/lib/i18n/use-text';
import { portfolioApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import { isError } from '@/lib/utils/is-error';
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

export default function PortfolioPage() {
  const txt = useText();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<MarketGroup>('KR');
  const [summaries, setSummaries] = useState<PortfolioSummary[]>([]);
  const [detail, setDetail] = useState<PortfolioDetail | null>(null);
  const [analysis, setAnalysis] = useState<PortfolioAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const activePortfolio = summaries.find((s) => s.marketGroup === tab);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
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
    } catch {
      setError(txt(t.portfolio.errorMessage));
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    if (user) fetchData();
    else setLoading(false);
  }, [user, fetchData]);

  if (authLoading || (user && loading)) {
    return <PortfolioSkeleton />;
  }

  if (!user) {
    return (
      <div className="animate-fade-in">
        <Card className="text-center py-16">
          <PieChart className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900">{txt(t.portfolio.loginCta)}</h2>
          <p className="text-sm text-zinc-500 mt-2">{txt(t.portfolio.loginCtaSub)}</p>
          <Button variant="primary" size="lg" className="mt-6" onClick={() => router.push('/')}>
            {txt(t.common.login)}
          </Button>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <Card className="text-center py-16">
          <p className="text-sm text-warning mb-4">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchData}>
            {txt(t.common.retry)}
          </Button>
        </Card>
      </div>
    );
  }

  const diversData = analysis?.diversification && !isError(analysis.diversification)
    ? analysis.diversification as DiversificationResult
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-gold" />
          <div>
            <h1 className="text-xl font-bold text-zinc-900">{txt(t.portfolio.title)}</h1>
            <p className="text-xs text-zinc-500">{txt(t.portfolio.subtitle)}</p>
          </div>
        </div>
        <PortfolioTabSelector active={tab} onChange={setTab} />
      </div>

      <MetricsCards analysis={analysis} />

      {detail ? (
        detail.holdings.length > 0 ? (
          <HoldingsList portfolio={detail} onRefresh={fetchData} />
        ) : (
          <Card className="text-center py-12">
            <Briefcase className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-sm text-zinc-600">{txt(t.portfolio.emptyMessage)}</p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => router.push('/screener')}
            >
              {txt(t.portfolio.findStocks)}
            </Button>
          </Card>
        )
      ) : null}

      {activePortfolio && detail && detail.holdings.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DiversificationChart data={diversData} />
            <SimulationChart portfolioId={activePortfolio.id} />
          </div>
          <AiDiagnosisSection portfolioId={activePortfolio.id} />
        </>
      )}
    </div>
  );
}
