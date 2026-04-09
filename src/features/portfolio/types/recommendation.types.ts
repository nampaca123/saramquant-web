export type RecommendationDirection = 'IMPROVE' | 'CONSERVATIVE' | 'GROWTH';

export interface RecommendedStock {
  stockId: number;
  symbol: string;
  name: string;
  sector: string | null;
  allocationPercent: number;
  action: 'KEEP' | 'ADD' | 'REMOVE';
  reasoning: string;
}

export interface RecommendationResult {
  stocks: RecommendedStock[];
  overallReasoning: string;
  currentAssessment: string | null;
  model: string;
  toolCallCount: number;
}

export interface RecommendationHistoryItem {
  id: number;
  marketGroup: string;
  stocks: string;
  reasoning: string;
  model: string;
  createdAt: string;
}
