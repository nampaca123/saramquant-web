import type { LocalizedText } from '@/types';

export const screenerTexts = {
  title: { ko: '종목 스크리너', en: 'Stock Screener' } satisfies LocalizedText,
  subtitle: { ko: '조건에 맞는 종목을 리스크 관점에서 찾아보세요', en: 'Find stocks filtered by risk criteria' } satisfies LocalizedText,
  allMarkets: { ko: '전체 시장', en: 'All Markets' } satisfies LocalizedText,
  allTiers: { ko: '전체 등급', en: 'All Tiers' } satisfies LocalizedText,
  allSectors: { ko: '전체 섹터', en: 'All Sectors' } satisfies LocalizedText,
  advancedFilters: { ko: '고급 필터', en: 'Advanced Filters' } satisfies LocalizedText,
  searchPlaceholder: { ko: '종목명 또는 심볼 검색', en: 'Search by name or symbol' } satisfies LocalizedText,
  noResults: { ko: '조건에 맞는 종목이 없어요', en: 'No stocks match your criteria' } satisfies LocalizedText,
  sortBy: { ko: '정렬', en: 'Sort by' } satisfies LocalizedText,
  colStock: { ko: '종목', en: 'Stock' } satisfies LocalizedText,
  colRiskDimensions: { ko: '리스크 5대 지표', en: 'Risk 5 Dimensions' } satisfies LocalizedText,
  colPrice: { ko: '현재가', en: 'Price' } satisfies LocalizedText,
} as const;
