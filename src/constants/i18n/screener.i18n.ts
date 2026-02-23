import type { LocalizedText } from '@/types';

export const screenerTexts = {
  title: { ko: '종목 스크리너', en: 'Find Stocks' } satisfies LocalizedText,
  subtitle: { ko: '조건에 맞는 종목을 리스크 관점에서 찾아보세요', en: 'Browse stocks and filter by how risky they are' } satisfies LocalizedText,
  allMarkets: { ko: '전체 시장', en: 'All Markets' } satisfies LocalizedText,
  allTiers: { ko: '전체 등급', en: 'Any risk level' } satisfies LocalizedText,
  allSectors: { ko: '전체 섹터', en: 'All Industries' } satisfies LocalizedText,
  advancedFilters: { ko: '고급 필터', en: 'More filters' } satisfies LocalizedText,
  searchPlaceholder: { ko: '종목명 또는 심볼 검색', en: 'Search by name or ticker' } satisfies LocalizedText,
  noResults: { ko: '조건에 맞는 종목이 없어요', en: 'Nothing matched — try different filters' } satisfies LocalizedText,
  sortBy: { ko: '정렬', en: 'Sort by' } satisfies LocalizedText,
  colStock: { ko: '종목', en: 'Stock' } satisfies LocalizedText,
  colRiskDimensions: { ko: '리스크 5대 지표', en: '5 Risk Signals' } satisfies LocalizedText,
  colPrice: { ko: '현재가', en: 'Price' } satisfies LocalizedText,
  dataFreshness: { ko: '데이터 현황', en: 'Data Status' } satisfies LocalizedText,
  krPrice: { ko: '🇰🇷 시세', en: '🇰🇷 Price' } satisfies LocalizedText,
  usPrice: { ko: '🇺🇸 시세', en: '🇺🇸 Price' } satisfies LocalizedText,
  krFinancial: { ko: '🇰🇷 재무제표', en: '🇰🇷 Financials' } satisfies LocalizedText,
  usFinancial: { ko: '🇺🇸 재무제표', en: '🇺🇸 Financials' } satisfies LocalizedText,
  dataDate: { ko: '기준일', en: 'Date' } satisfies LocalizedText,
  collectedAt: { ko: '수집', en: 'Collected' } satisfies LocalizedText,
  noData: { ko: '-', en: '-' } satisfies LocalizedText,
} as const;
