export interface HomeSummary {
  benchmarks: BenchmarkSummary[];
  marketOverview: MarketOverview;
  portfolios: PortfolioSummaryBrief[] | null;
}

export interface BenchmarkSummary {
  benchmark: string;
  latestClose: number;
  previousClose: number;
  changePercent: number;
  date: string;
}

export interface MarketOverview {
  tierDistribution: TierDistributionItem[];
  totalStocks: number;
}

export interface TierDistributionItem {
  market: string;
  tier: string;
  count: number;
}

export interface PortfolioSummaryBrief {
  id: number;
  marketGroup: string;
  holdingsCount: number;
}
