import { api } from '../client';
import type {
  PortfolioSummary,
  PortfolioDetail,
  BuyRequest,
  HoldingDetail,
  PortfolioAnalysisResponse,
} from '@/features/portfolio/types/portfolio.types';

export const portfolioApi = {
  list: () => api<PortfolioSummary[]>('/api/portfolios'),

  detail: (id: number) => api<PortfolioDetail>(`/api/portfolios/${id}`),

  buy: (id: number, body: BuyRequest) =>
    api<HoldingDetail>(`/api/portfolios/${id}/holdings`, { method: 'POST', body }),

  sell: (id: number, holdingId: number, body: { sellShares: number }) =>
    api<void>(`/api/portfolios/${id}/holdings/${holdingId}`, { method: 'PATCH', body }),

  deleteHolding: (id: number, holdingId: number) =>
    api<void>(`/api/portfolios/${id}/holdings/${holdingId}`, { method: 'DELETE' }),

  reset: (id: number) =>
    api<void>(`/api/portfolios/${id}/reset`, { method: 'POST' }),

  analysis: (id: number) =>
    api<PortfolioAnalysisResponse>(`/api/portfolios/${id}/analysis`),

  simulation: (id: number, params: Record<string, string | number>) =>
    api<Record<string, unknown>>(`/api/portfolios/${id}/simulation`, { method: 'POST', params }),
} as const;
