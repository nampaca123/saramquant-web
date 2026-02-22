import type { LocalizedText } from '@/types';

export const landingTexts = {
  headlinePrimary: { ko: '리스크를 숫자가 아닌', en: 'Translating risk into' } satisfies LocalizedText,
  headlineAccent: { ko: '쉬운 언어로 번역해드려요', en: 'easy language, not numbers' } satisfies LocalizedText,
  subheading: { ko: '복잡한 투자 지표, 이제 직관적으로 이해하세요', en: 'Understand complex investment indicators intuitively' } satisfies LocalizedText,
  getStarted: { ko: '시작하기', en: 'Get Started' } satisfies LocalizedText,
  getStartedDesc: { ko: '무료로 시작하고 리스크를 한눈에 파악하세요', en: 'Start free and see risk at a glance' } satisfies LocalizedText,
  featureSignalTitle: { ko: '리스크 신호 번역', en: 'Risk Signal Translation' } satisfies LocalizedText,
  featureSignalDesc: { ko: '복잡한 재무 지표를 안정 · 주의 · 경고 3단계로 요약', en: 'Financial indicators summarized into 3 clear signals' } satisfies LocalizedText,
  featureAiTitle: { ko: 'AI 리스크 리포트', en: 'AI Risk Report' } satisfies LocalizedText,
  featureAiDesc: { ko: 'AI가 종목별 위험 요인을 쉬운 말로 분석', en: 'AI explains stock risk factors in plain language' } satisfies LocalizedText,
  featurePortfolioTitle: { ko: '포트폴리오 진단', en: 'Portfolio Diagnosis' } satisfies LocalizedText,
  featurePortfolioDesc: { ko: '내 보유 종목의 전체 리스크를 한눈에 확인', en: 'See your total portfolio risk at a glance' } satisfies LocalizedText,
} as const;
