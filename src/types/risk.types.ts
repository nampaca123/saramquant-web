export type RiskTier = 'STABLE' | 'CAUTION' | 'WARNING';
export type DimensionName = 'price_heat' | 'volatility' | 'trend' | 'company_health' | 'valuation';
export type Direction = 'OVERHEATED' | 'OVERSOLD' | 'UPTREND' | 'DOWNTREND' | 'NEUTRAL';

export interface RiskDimension {
  name: DimensionName;
  score: number;
  tier: RiskTier;
  direction: Direction | null;
  components: Record<string, number | null>;
  data_available: boolean;
}

export interface RiskBadgeDimensions {
  dims: RiskDimension[];
}
