import type { MarketGroup, PathPercentilePoint, RiskTier } from '@/types';

export interface PortfolioSummary {
  id: number;
  marketGroup: MarketGroup;
  holdingsCount: number;
  createdAt: string;
}

export interface HoldingDetail {
  id: number;
  stockId: number;
  symbol: string;
  name: string;
  market: string | null;
  sector: string | null;
  shares: number;
  avgPrice: number;
  currency: 'KRW' | 'USD';
  purchasedAt: string;
  purchaseFxRate: number | null;
  priceSource: 'AUTO' | 'MANUAL';
  latestClose: number | null;
  priceChangePercent: number | null;
  summaryTier: string | null;
  dimensionTiers: Record<string, string> | null;
  unrealizedPnl: number | null;
  unrealizedPnlPercent: number | null;
  currentValue: number | null;
  costBasis: number | null;
}

export interface PortfolioDetail {
  id: number;
  marketGroup: MarketGroup;
  holdings: HoldingDetail[];
  createdAt: string;
  totalCost: number | null;
  totalValue: number | null;
  totalPnl: number | null;
  totalPnlPercent: number | null;
}

export interface BuyRequest {
  stockId: number;
  purchasedAt: string;
  shares: number;
  manualPrice?: number;
}

export interface RiskScoreResult {
  score: number | null;
  tier: RiskTier | 'UNKNOWN';
  portfolio_vol: number;
  benchmark_vol: number;
  effective_lookback: number;
}

export interface StockContribution {
  stock_id: number;
  symbol: string;
  weight: number;
  mcar: number;
  contribution_pct: number;
}

export interface RiskDecompositionResult {
  portfolio_vol: number;
  stock_contributions: StockContribution[];
  factor_analysis?: {
    beta: number;
    risk_decomposition: Record<string, number>;
    portfolio_exposure: Record<string, number>;
  };
}

export interface DiversificationResult {
  hhi: number;
  effective_n: number;
  max_weight: number;
  holdings_count: number;
  sector_concentration?: Record<string, number>;
  sector_hhi?: number;
}

export interface BenchmarkComparisonResult {
  portfolio_return: number;
  benchmark_return: number;
  excess_return: number;
  benchmark_name: string;
  lookback_days: number;
}

export interface PortfolioAnalysisResponse {
  risk_score: RiskScoreResult | null;
  risk_decomposition: RiskDecompositionResult | { error: string } | null;
  diversification: DiversificationResult | { error: string } | null;
  benchmark_comparison: BenchmarkComparisonResult | { error: string } | null;
}

export interface PortfolioSimulationResponse {
  target: {
    type: 'portfolio';
    portfolio_id: number;
    market_group: string;
    holdings_count: number;
    current_value: number;
  };
  simulation_days: number;
  num_simulations: number;
  method: 'bootstrap' | 'gbm';
  confidence: number;
  results: {
    expected_return: number;
    var: number;
    cvar: number;
    final_value_percentiles: Record<string, number>;
    path_percentiles: PathPercentilePoint[];
  };
  parameters: {
    lookback_days: number;
    effective_lookback_days: number;
    min_data_points: number;
  };
  data_coverage: 'FULL' | 'PARTIAL';
  excluded_stocks: Array<{ stock_id: number; symbol: string }>;
}

export interface PortfolioLlmHistory {
  id: number;
  date: string;
  preset: string;
  lang: string;
  analysis: string;
  model: string;
  created_at: string;
}

export interface PriceLookupResponse {
  found: boolean;
  close?: number;
  high?: number;
  low?: number;
  open?: number;
  date?: string;
  source?: string;
  fx_rate?: number;
  message?: string;
}
