import type { LocalizedText } from '@/types';

export const homeTexts = {
  title: { ko: '마켓 펄스', en: 'Market Pulse' } satisfies LocalizedText,
  subtitle: { ko: '오늘의 시장 상태를 한눈에', en: "Today's market at a glance" } satisfies LocalizedText,
  marketOverview: { ko: '시장 리스크 분포', en: 'Market Risk Distribution' } satisfies LocalizedText,
  portfolioAlert: { ko: '내 포트폴리오', en: 'My Portfolio' } satisfies LocalizedText,
  portfolioCta: { ko: '포트폴리오를 만들어 보세요', en: 'Create your portfolio' } satisfies LocalizedText,
  holdings: { ko: '보유 종목', en: 'Holdings' } satisfies LocalizedText,
  emptyPortfolio: { ko: '보유 종목을 등록해보세요', en: 'Register your holdings' } satisfies LocalizedText,
  findStocks: { ko: '종목 찾기', en: 'Find stocks' } satisfies LocalizedText,
  tierStable: { ko: '안정', en: 'Stable' } satisfies LocalizedText,
  tierCaution: { ko: '주의', en: 'Caution' } satisfies LocalizedText,
  tierWarning: { ko: '경고', en: 'Warning' } satisfies LocalizedText,
} as const;
