'use client';

import { useState, useEffect, useCallback } from 'react';
import { dashboardApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { FilterPanel } from '@/features/screener/components/FilterPanel';
import { StockList } from '@/features/screener/components/StockList';
import { ScreenerSkeleton } from '@/features/screener/components/ScreenerSkeleton';
import type { DashboardStocksParams, DashboardPage } from '@/features/screener/types/screener.types';
import { DEFAULT_PAGE_SIZE } from '@/features/screener/constants/screener.constants';

const INITIAL_PARAMS: DashboardStocksParams = {
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
      <h1 className="text-xl font-bold text-zinc-900">{txt(t.screener.title)}</h1>

      <FilterPanel params={params} onChange={setParams} />

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
  );
}
