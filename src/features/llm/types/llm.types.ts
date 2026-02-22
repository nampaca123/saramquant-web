export interface StockAnalysisRequest {
  symbol: string;
  market: string;
  preset?: string;
  lang?: string;
}

export interface PortfolioAnalysisRequest {
  portfolioId: number;
  preset?: string;
  lang?: string;
}

export interface LlmAnalysisResponse {
  analysis: string;
  model: string;
  cached: boolean;
  disclaimer: string;
}

export interface LlmUsageResponse {
  used: number;
  limit: number;
  date: string;
}
