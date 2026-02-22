import { api } from '../client';
import type {
  StockDetailResponse,
  PriceSeriesResponse,
  BenchmarkComparisonResponse,
  StockSimulationResponse,
} from '@/features/stock/types/stock.types';
import type { PricePeriod } from '@/types';

export const stockApi = {
  detail: (symbol: string, market: string, lang = 'ko') =>
    api<StockDetailResponse>(`/api/stocks/${symbol}`, { params: { market, lang } }),

  prices: (symbol: string, market: string, period: PricePeriod = '1Y') =>
    api<PriceSeriesResponse>(`/api/stocks/${symbol}/prices`, { params: { market, period } }),

  benchmark: (symbol: string, market: string, period: PricePeriod = '1Y') =>
    api<BenchmarkComparisonResponse>(`/api/stocks/${symbol}/benchmark`, { params: { market, period } }),

  simulation: (symbol: string, params: Record<string, string | number>) =>
    api<StockSimulationResponse>(`/api/stocks/${symbol}/simulation`, { params }),
} as const;
