import type { RiskTier } from '@/types';

export interface DashboardStocksParams {
  market?: string;
  tier?: string;
  sector?: string;
  sort?: string;
  page?: number;
  size?: number;
  query?: string;
  betaMin?: number;
  betaMax?: number;
  rsiMin?: number;
  rsiMax?: number;
  sharpeMin?: number;
  sharpeMax?: number;
  atrMin?: number;
  atrMax?: number;
  adxMin?: number;
  adxMax?: number;
  perMin?: number;
  perMax?: number;
  pbrMin?: number;
  pbrMax?: number;
  roeMin?: number;
  roeMax?: number;
  debtRatioMin?: number;
  debtRatioMax?: number;
}

export interface DashboardStockItem {
  stockId: number;
  symbol: string;
  name: string;
  market: string;
  sector: string | null;
  summaryTier: RiskTier | null;
  dimensionTiers: Record<string, string> | null;
  latestClose: number | null;
  priceChangePercent: number | null;
  beta: number | null;
  sharpe: number | null;
  rsi14: number | null;
  atr14: number | null;
  adx14: number | null;
  per: number | null;
  pbr: number | null;
  roe: number | null;
  debtRatio: number | null;
}

export interface DashboardPage {
  content: DashboardStockItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface StockSearchResult {
  stockId: number;
  symbol: string;
  name: string;
  market: string;
  sector: string | null;
}

export interface DataFreshness {
  krPriceUpdatedAt: string | null;
  usPriceUpdatedAt: string | null;
  krFinancialUpdatedAt: string | null;
  usFinancialUpdatedAt: string | null;
}
