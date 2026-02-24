import type { LocalizedText } from '@/types';

export const landingTexts = {
  headline: { ko: '투자를 데이터 기반으로\n안전하고 쉽게 하도록\n도와드려요', en: 'We help you invest\nsafely and easily\nwith data' } satisfies LocalizedText,
  getStarted: { ko: '시작하기', en: 'Get Started' } satisfies LocalizedText,
  getStartedDesc: { ko: '무료로 시작하고 리스크를 한눈에 파악하세요', en: 'Free to start — see your risk in seconds' } satisfies LocalizedText,
  feature1: { ko: '복잡한 투자 지표를 초보자도 이해할 수 있게 설명해줘요', en: 'We explain complex investing metrics so beginners can understand' } satisfies LocalizedText,
  feature2: { ko: '확률 기반으로 미래 투자 시나리오를 분석해드려요', en: 'We analyze future investment scenarios based on probability' } satisfies LocalizedText,
  feature3: { ko: '포트폴리오 구성을 AI가 여러 지표를 종합해 도와드려요', en: 'AI helps build your portfolio by combining multiple metrics' } satisfies LocalizedText,
  exploreFirst: { ko: '먼저 둘러볼게요', en: 'Just browsing' } satisfies LocalizedText,
} as const;
