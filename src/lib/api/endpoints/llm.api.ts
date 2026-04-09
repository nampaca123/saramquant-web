import { api } from '../client';
import { connectSSE, type SSECallbacks } from '../sse';
import type {
  LlmAnalysisResponse,
  LlmUsageResponse,
  StockAnalysisRequest,
  PortfolioAnalysisRequest,
} from '@/features/llm/types/llm.types';
import type { RecommendationHistoryItem } from '@/features/portfolio/types/recommendation.types';

export const llmApi = {
  getStockAnalysis: (symbol: string, params: { market: string; preset?: string; lang?: string }) =>
    api<LlmAnalysisResponse | null>(`/api/stocks/${symbol}/llm-analysis`, { params }),

  analyzeStock: (body: StockAnalysisRequest) =>
    api<LlmAnalysisResponse>('/api/llm/stock-analysis', { method: 'POST', body }),

  analyzePortfolio: (body: PortfolioAnalysisRequest) =>
    api<LlmAnalysisResponse>('/api/llm/portfolio-analysis', { method: 'POST', body }),

  usage: () => api<LlmUsageResponse>('/api/llm/usage'),

  recommendPortfolio: (
    params: { marketGroup: string; lang: string; direction: string },
    callbacks: SSECallbacks,
  ) => connectSSE('/api/llm/portfolio-recommendation', params, callbacks),

  recommendationHistory: (params: { marketGroup: string; page?: number; size?: number }) =>
    api<RecommendationHistoryItem[]>('/api/llm/recommendation-history', {
      params: { marketGroup: params.marketGroup, page: params.page ?? 0, size: params.size ?? 10 },
    }),
} as const;
