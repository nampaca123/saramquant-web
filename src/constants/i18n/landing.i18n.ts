import type { LocalizedText } from '@/types';

export const landingTexts = {
  headlinePrimary: { ko: '리스크를 숫자가 아닌', en: 'We turn risk into' } satisfies LocalizedText,
  headlineAccent: { ko: '쉬운 언어로 번역해드려요', en: 'plain English, not Wall Street jargon' } satisfies LocalizedText,
  subheading: { ko: '복잡한 투자 지표, 이제 직관적으로 이해하세요', en: 'Investing is confusing. We make it make sense.' } satisfies LocalizedText,
  getStarted: { ko: '시작하기', en: 'Get Started' } satisfies LocalizedText,
  getStartedDesc: { ko: '무료로 시작하고 리스크를 한눈에 파악하세요', en: 'Free to start — see your risk in seconds' } satisfies LocalizedText,
  featureSignalTitle: { ko: '리스크 신호 번역', en: 'Risk Made Simple' } satisfies LocalizedText,
  featureSignalDesc: { ko: '복잡한 재무 지표를 안정 · 주의 · 경고 3단계로 요약', en: 'Complicated numbers turned into 3 easy signals' } satisfies LocalizedText,
  featureAiTitle: { ko: 'AI 리스크 리포트', en: 'AI Explains It' } satisfies LocalizedText,
  featureAiDesc: { ko: 'AI가 종목별 위험 요인을 쉬운 말로 분석', en: 'AI tells you what\'s risky about a stock — in words you get' } satisfies LocalizedText,
  featurePortfolioTitle: { ko: '포트폴리오 진단', en: 'Portfolio Checkup' } satisfies LocalizedText,
  featurePortfolioDesc: { ko: '내 보유 종목의 전체 리스크를 한눈에 확인', en: 'See all your risk in one place' } satisfies LocalizedText,
  exploreFirst: { ko: '먼저 둘러볼게요', en: 'Just browsing' } satisfies LocalizedText,
} as const;
