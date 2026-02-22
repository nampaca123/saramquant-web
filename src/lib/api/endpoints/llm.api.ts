import { api } from '../client';
import type {
  LlmAnalysisResponse,
  LlmUsageResponse,
  StockAnalysisRequest,
  PortfolioAnalysisRequest,
} from '@/features/llm/types/llm.types';

export const llmApi = {
  getStockAnalysis: (symbol: string, params: { market: string; preset?: string; lang?: string }) =>
    api<LlmAnalysisResponse | null>(`/api/stocks/${symbol}/llm-analysis`, { params }),

  analyzeStock: (body: StockAnalysisRequest) =>
    api<LlmAnalysisResponse>('/api/llm/stock-analysis', { method: 'POST', body }),

  analyzePortfolio: (body: PortfolioAnalysisRequest) =>
    api<LlmAnalysisResponse>('/api/llm/portfolio-analysis', { method: 'POST', body }),

  usage: () => api<LlmUsageResponse>('/api/llm/usage'),
} as const;
