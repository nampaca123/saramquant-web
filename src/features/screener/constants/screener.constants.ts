import type { LocalizedText } from '@/types';

export const DEFAULT_PAGE_SIZE = 20;

export const SORT_OPTIONS: { value: string; label: LocalizedText }[] = [
  { value: 'name_asc', label: { ko: '이름 (ㄱ→ㅎ)', en: 'Name (A→Z)' } },
  { value: 'name_desc', label: { ko: '이름 (ㅎ→ㄱ)', en: 'Name (Z→A)' } },
  { value: 'beta_asc', label: { ko: 'Beta (낮은순)', en: 'Beta (Low→High)' } },
  { value: 'beta_desc', label: { ko: 'Beta (높은순)', en: 'Beta (High→Low)' } },
  { value: 'sharpe_asc', label: { ko: 'Sharpe (낮은순)', en: 'Sharpe (Low→High)' } },
  { value: 'sharpe_desc', label: { ko: 'Sharpe (높은순)', en: 'Sharpe (High→Low)' } },
  { value: 'rsi_asc', label: { ko: 'RSI (낮은순)', en: 'RSI (Low→High)' } },
  { value: 'rsi_desc', label: { ko: 'RSI (높은순)', en: 'RSI (High→Low)' } },
  { value: 'atr_asc', label: { ko: 'ATR (낮은순)', en: 'ATR (Low→High)' } },
  { value: 'atr_desc', label: { ko: 'ATR (높은순)', en: 'ATR (High→Low)' } },
  { value: 'adx_asc', label: { ko: 'ADX (낮은순)', en: 'ADX (Low→High)' } },
  { value: 'adx_desc', label: { ko: 'ADX (높은순)', en: 'ADX (High→Low)' } },
  { value: 'per_asc', label: { ko: 'PER (낮은순)', en: 'PER (Low→High)' } },
  { value: 'per_desc', label: { ko: 'PER (높은순)', en: 'PER (High→Low)' } },
  { value: 'pbr_asc', label: { ko: 'PBR (낮은순)', en: 'PBR (Low→High)' } },
  { value: 'pbr_desc', label: { ko: 'PBR (높은순)', en: 'PBR (High→Low)' } },
  { value: 'roe_asc', label: { ko: 'ROE (낮은순)', en: 'ROE (Low→High)' } },
  { value: 'roe_desc', label: { ko: 'ROE (높은순)', en: 'ROE (High→Low)' } },
  { value: 'debt_ratio_asc', label: { ko: '부채비율 (낮은순)', en: 'Debt Ratio (Low→High)' } },
  { value: 'debt_ratio_desc', label: { ko: '부채비율 (높은순)', en: 'Debt Ratio (High→Low)' } },
];

export const MARKET_OPTIONS: { value: string; label: LocalizedText }[] = [
  { value: 'KR_KOSPI', label: { ko: 'KOSPI', en: 'KOSPI' } },
  { value: 'KR_KOSDAQ', label: { ko: 'KOSDAQ', en: 'KOSDAQ' } },
  { value: 'US_NYSE', label: { ko: 'NYSE', en: 'NYSE' } },
  { value: 'US_NASDAQ', label: { ko: 'NASDAQ', en: 'NASDAQ' } },
];

export const TIER_FILTER_OPTIONS: {
  value: string;
  label: LocalizedText;
  description: LocalizedText;
}[] = [
  {
    value: 'STABLE',
    label: { ko: '안정', en: 'Stable' },
    description: { ko: '위험이 낮아요', en: 'Low risk' },
  },
  {
    value: 'CAUTION',
    label: { ko: '주의', en: 'Caution' },
    description: { ko: '주의가 필요해요', en: 'Some risk' },
  },
  {
    value: 'WARNING',
    label: { ko: '경고', en: 'Warning' },
    description: { ko: '위험이 높아요', en: 'High risk' },
  },
];
