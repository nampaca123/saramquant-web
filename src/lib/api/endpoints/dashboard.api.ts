import { api } from '../client';
import type { DashboardPage, DashboardStocksParams, StockSearchResult } from '@/features/screener/types/screener.types';

export const dashboardApi = {
  stocks: (params: DashboardStocksParams) =>
    api<DashboardPage>('/api/dashboard/stocks', { params: params as Record<string, string | number | undefined> }),

  search: (params: { q: string; market?: string; limit?: number }) =>
    api<StockSearchResult[]>('/api/dashboard/search', { params }),

  sectors: (market?: string) =>
    api<string[]>('/api/dashboard/sectors', { params: { market } }),
} as const;
