import type { RiskBadgeDimensions, RiskTier } from '@/types';

export interface StockHeader {
  stockId: number;
  symbol: string;
  name: string;
  market: string;
  sector: string | null;
  latestClose: number | null;
  priceChangePercent: number | null;
  latestDate: string | null;
}

export interface StockRiskBadge {
  summaryTier: RiskTier;
  date: string;
  dimensions: RiskBadgeDimensions;
}

export interface StockIndicators {
  date: string;
  rsi14: number | null;
  macd: number | null;
  macdSignal: number | null;
  macdHist: number | null;
  stochK: number | null;
  stochD: number | null;
  bbUpper: number | null;
  bbMiddle: number | null;
  bbLower: number | null;
  adx14: number | null;
  plusDi: number | null;
  minusDi: number | null;
  atr14: number | null;
  sma20: number | null;
  ema20: number | null;
  sar: number | null;
  obv: number | null;
  vma20: number | null;
  beta: number | null;
  alpha: number | null;
  sharpe: number | null;
}

export interface StockFundamentals {
  date: string;
  per: number | null;
  pbr: number | null;
  eps: number | null;
  bps: number | null;
  roe: number | null;
  debtRatio: number | null;
  operatingMargin: number | null;
}

export interface SectorComparison {
  sector: string;
  stockCount: number;
  medianPer: number | null;
  medianPbr: number | null;
  medianRoe: number | null;
  medianOperatingMargin: number | null;
  medianDebtRatio: number | null;
}

export interface FactorExposures {
  date: string;
  sizeZ: number | null;
  valueZ: number | null;
  momentumZ: number | null;
  volatilityZ: number | null;
  qualityZ: number | null;
  leverageZ: number | null;
}

export interface CachedLlmAnalysis {
  preset: string;
  lang: string;
  analysis: string;
  model: string;
  createdAt: string;
}

export interface StockDetailResponse {
  header: StockHeader;
  riskBadge: StockRiskBadge | null;
  indicators: StockIndicators | null;
  fundamentals: StockFundamentals | null;
  sectorComparison: SectorComparison | null;
  factorExposures: FactorExposures | null;
  llmAnalysis: CachedLlmAnalysis | null;
}

export interface PricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceSeriesResponse {
  symbol: string;
  market: string;
  period: string;
  prices: PricePoint[];
}

export interface BenchmarkSeriesPoint {
  date: string;
  value: number;
}

export interface BenchmarkComparisonResponse {
  symbol: string;
  benchmark: string;
  period: string;
  stockSeries: BenchmarkSeriesPoint[];
  benchmarkSeries: BenchmarkSeriesPoint[];
}
