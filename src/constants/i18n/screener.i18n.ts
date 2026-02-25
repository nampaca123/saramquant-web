import type { LocalizedText } from '@/types';

export const screenerTexts = {
  title: { ko: '종목 스크리너', en: 'Find Stocks' } satisfies LocalizedText,
  subtitle: { ko: '조건에 맞는 종목을 리스크 관점에서 찾아보세요', en: 'Browse stocks and filter by how risky they are' } satisfies LocalizedText,
  allMarkets: { ko: '전체 시장', en: 'All Markets' } satisfies LocalizedText,
  allTiers: { ko: '전체 등급', en: 'Any risk level' } satisfies LocalizedText,
  allSectors: { ko: '전체 업종', en: 'All Industries' } satisfies LocalizedText,
  sectorLabel: { ko: '업종', en: 'Industry' } satisfies LocalizedText,
  advancedFilters: { ko: '고급 필터', en: 'More filters' } satisfies LocalizedText,
  searchPlaceholder: { ko: '종목명 또는 심볼 검색', en: 'Search by name or ticker' } satisfies LocalizedText,
  noResults: { ko: '조건에 맞는 종목이 없어요', en: 'Nothing matched — try different filters' } satisfies LocalizedText,
  sortBy: { ko: '정렬 기준', en: 'Sort by' } satisfies LocalizedText,
  riskLevel: { ko: '리스크 등급', en: 'Risk Level' } satisfies LocalizedText,
  expertFilters: { ko: '전문가용 상세 필터', en: 'Advanced Filters' } satisfies LocalizedText,
  expertFiltersDesc: { ko: '투자 경험이 있는 분들을 위한 세부 필터예요', en: 'Detailed filters for experienced investors' } satisfies LocalizedText,
  colStock: { ko: '종목', en: 'Stock' } satisfies LocalizedText,
  colRiskDimensions: { ko: '리스크 5대 지표', en: '5 Risk Signals' } satisfies LocalizedText,
  colPrice: { ko: '현재가', en: 'Price' } satisfies LocalizedText,
  dataFreshness: { ko: '데이터 갱신일', en: 'Last Updated' } satisfies LocalizedText,
  krPrice: { ko: '한국 시세', en: 'KR Price' } satisfies LocalizedText,
  usPrice: { ko: '미국 시세', en: 'US Price' } satisfies LocalizedText,
  krFinancial: { ko: '한국 재무제표', en: 'KR Financials' } satisfies LocalizedText,
  usFinancial: { ko: '미국 재무제표', en: 'US Financials' } satisfies LocalizedText,
  etfNotice: {
    ko: 'ETF·펀드 등 재무제표가 없는 상품은 분석 대상에 포함되지 않아요. 개별 종목(주식)만 다루고 있어요.',
    en: "ETFs, funds, and similar products aren't included here — we only cover individual stocks that have financial statements to analyze.",
  } satisfies LocalizedText,
  dimensionFilter: { ko: '5대 리스크 지표로 골라보기', en: 'Filter by 5 Risk Signals' } satisfies LocalizedText,
  dimensionFilterDesc: {
    ko: '각 지표에서 원하는 등급만 골라보세요',
    en: 'Pick the risk level you want for each signal',
  } satisfies LocalizedText,
} as const;
