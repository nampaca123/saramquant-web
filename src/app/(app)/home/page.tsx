'use client';

import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { homeApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { BenchmarkCards } from '@/features/home/components/BenchmarkCards';
import { MarketOverview } from '@/features/home/components/MarketOverview';
import { PortfolioAlert } from '@/features/home/components/PortfolioAlert';
import { HomeSkeleton } from '@/features/home/components/HomeSkeleton';
import type { HomeSummary } from '@/features/home/types/home.types';

export default function HomePage() {
  const txt = useText();
  const [data, setData] = useState<HomeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    homeApi
      .summary()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <HomeSkeleton />;

  if (!data) {
    return (
      <div className="flex flex-col items-center py-16 text-zinc-400">
        <p className="text-sm">{txt(t.common.error)}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Home className="h-5 w-5 text-gold" />
        <div>
          <h1 className="text-xl font-bold text-zinc-900">{txt(t.home.title)}</h1>
          <p className="text-xs text-zinc-500">
            {txt({ ko: '오늘의 시장 상태를 한눈에', en: "Today's market at a glance" })}
          </p>
        </div>
      </div>

      <BenchmarkCards benchmarks={data.benchmarks} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <MarketOverview data={data.marketOverview} />
        <PortfolioAlert portfolios={data.portfolios} />
      </div>
    </div>
  );
}
