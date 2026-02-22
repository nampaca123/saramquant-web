import type { MarketGroup, RiskTier } from '@/types';

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
  shares: number;
  avgPrice: number;
  currency: 'KRW' | 'USD';
  purchasedAt: string;
  purchaseFxRate: number | null;
  priceSource: 'AUTO' | 'MANUAL';
}

export interface PortfolioDetail {
  id: number;
  marketGroup: MarketGroup;
  holdings: HoldingDetail[];
  createdAt: string;
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

export interface PortfolioAnalysisResponse {
  risk_score: RiskScoreResult | null;
  risk_decomposition: RiskDecompositionResult | null;
  diversification: DiversificationResult | null;
}
