'use client';

import { useState, useEffect, useCallback } from 'react';
import { LayoutGrid } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { FilterPanel } from '@/features/screener/components/FilterPanel';
import { StockList } from '@/features/screener/components/StockList';
import { ScreenerSkeleton } from '@/features/screener/components/ScreenerSkeleton';
import type { DashboardStocksParams, DashboardPage } from '@/features/screener/types/screener.types';
import { DEFAULT_PAGE_SIZE } from '@/features/screener/constants/screener.constants';

const INITIAL_PARAMS: DashboardStocksParams = {
  market: 'KR_KOSPI',
  sort: 'name_asc',
  page: 0,
  size: DEFAULT_PAGE_SIZE,
};

export default function ScreenerPage() {
  const txt = useText();
  const [params, setParams] = useState<DashboardStocksParams>(INITIAL_PARAMS);
  const [data, setData] = useState<DashboardPage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (p: DashboardStocksParams) => {
    setLoading(true);
    try {
      const result = await dashboardApi.stocks(p);
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(params);
  }, [params, fetchData]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <LayoutGrid className="h-5 w-5 text-gold" />
        <div>
          <h1 className="text-xl font-bold text-zinc-900">{txt(t.screener.title)}</h1>
          <p className="text-xs text-zinc-500">
            {txt(t.screener.subtitle)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <FilterPanel params={params} onChange={setParams} className="lg:w-64 lg:shrink-0" />

        <div className="flex-1 min-w-0">
          {loading ? (
            <ScreenerSkeleton />
          ) : (
            <StockList
              data={data}
              loading={loading}
              onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
