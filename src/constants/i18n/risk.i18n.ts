import type { LocalizedText } from '@/types';

export const riskTexts = {
  overallRisk: { ko: '종합 리스크', en: 'Overall Risk' } satisfies LocalizedText,
  notEnoughData: { ko: '아직 데이터가 충분하지 않아요', en: 'Not enough data yet' } satisfies LocalizedText,
  score: { ko: '점', en: 'pt' } satisfies LocalizedText,
} as const;

export const disclaimerTexts = {
  global: {
    ko: '본 서비스는 투자 자문이 아니며, 제공되는 정보는 참고용입니다. 투자 판단의 책임은 본인에게 있습니다.',
    en: 'This service is not investment advice. Information provided is for reference only. You are responsible for your own investment decisions.',
  } satisfies LocalizedText,
  simulation: {
    ko: '과거 데이터 기반 통계적 추정이며 미래 수익을 보장하지 않습니다.',
    en: 'Statistical estimation based on historical data. Does not guarantee future returns.',
  } satisfies LocalizedText,
} as const;
