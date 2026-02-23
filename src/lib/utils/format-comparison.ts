import type { LocalizedText, Language } from '@/types';

type ComparisonLevel = 'low' | 'similar' | 'high';

interface ComparisonMeta {
  label: LocalizedText;
  template: (value: number, median: number, lang: Language) => string;
  sentiment: Record<ComparisonLevel, LocalizedText>;
  lowerIsBetter: boolean;
}

const METRICS: Record<string, ComparisonMeta> = {
  per: {
    label: { ko: '투자금 회수 기간', en: 'How Pricey Is It?' },
    template: (v, m, l) =>
      l === 'ko'
        ? `이 회사는 1년 벌이의 ${v.toFixed(1)}배 가격이에요. 같은 업종 평균은 ${m.toFixed(1)}배예요.`
        : `You'd wait ${v.toFixed(1)} years to earn back what you paid. Others in this sector average ${m.toFixed(1)} years.`,
    sentiment: {
      low: { ko: '업종 대비 저렴한 편이에요', en: 'On the cheaper side for this sector' },
      similar: { ko: '업종 평균과 비슷해요', en: 'Pretty normal for this sector' },
      high: { ko: '업종 대비 비싼 편이에요', en: 'On the pricey side for this sector' },
    },
    lowerIsBetter: true,
  },
  pbr: {
    label: { ko: '자산 대비 가격', en: 'Price vs What It Owns' },
    template: (v, m, l) =>
      l === 'ko'
        ? `회사 순자산의 ${v.toFixed(1)}배 가격이에요. 같은 업종 평균은 ${m.toFixed(1)}배예요.`
        : `You're paying ${v.toFixed(1)}x what the company actually owns. The sector average is ${m.toFixed(1)}x.`,
    sentiment: {
      low: { ko: '업종 대비 저렴한 편이에요', en: 'Looks like a bargain for this sector' },
      similar: { ko: '업종 평균과 비슷해요', en: 'Pretty normal for this sector' },
      high: { ko: '업종 대비 비싼 편이에요', en: 'On the pricey side for this sector' },
    },
    lowerIsBetter: true,
  },
  roe: {
    label: { ko: '수익 효율', en: 'How Well It Makes Money' },
    template: (v, m, l) =>
      l === 'ko'
        ? `자기 돈으로 1년에 ${(v * 100).toFixed(1)}%를 벌어요. 같은 업종 평균은 ${(m * 100).toFixed(1)}%예요.`
        : `For every $100 of its own money, it earns $${(v * 100).toFixed(1)} a year. The sector average is $${(m * 100).toFixed(1)}.`,
    sentiment: {
      low: { ko: '업종 대비 못 벌고 있어요', en: 'Not earning as much as others in this sector' },
      similar: { ko: '업종 평균과 비슷하게 벌고 있어요', en: 'Earning about the same as others' },
      high: { ko: '업종 대비 잘 벌고 있어요', en: 'Earning more than most in this sector' },
    },
    lowerIsBetter: false,
  },
  operatingMargin: {
    label: { ko: '영업이익률', en: 'How Much It Keeps' },
    template: (v, m, l) =>
      l === 'ko'
        ? `1만원어치 팔면 ${Math.round(v * 10000).toLocaleString()}원이 남아요. 같은 업종 평균은 ${Math.round(m * 10000).toLocaleString()}원이에요.`
        : `For every $100 in sales, $${(v * 100).toFixed(1)} is actual profit. The sector average is $${(m * 100).toFixed(1)}.`,
    sentiment: {
      low: { ko: '업종 대비 수익성이 낮은 편이에요', en: 'Keeping less profit than most in this sector' },
      similar: { ko: '업종 평균과 비슷해요', en: 'Keeping about the same as others' },
      high: { ko: '업종 대비 수익성이 높은 편이에요', en: 'Keeping more profit than most in this sector' },
    },
    lowerIsBetter: false,
  },
  debtRatio: {
    label: { ko: '빚 수준', en: 'How Much It Owes' },
    template: (v, m, l) =>
      l === 'ko'
        ? `자기 돈 대비 빚이 약 ${v.toFixed(1)}배예요. 같은 업종 평균은 약 ${m.toFixed(1)}배예요.`
        : `It owes about ${v.toFixed(1)}x more than what it owns. The sector average is ${m.toFixed(1)}x.`,
    sentiment: {
      low: { ko: '업종 대비 빚이 적은 편이에요', en: 'Less debt than most in this sector' },
      similar: { ko: '업종 평균과 비슷해요', en: 'About average for this sector' },
      high: { ko: '업종 대비 빚이 많은 편이에요', en: 'More debt than most in this sector' },
    },
    lowerIsBetter: true,
  },
};

function getLevel(value: number, median: number): ComparisonLevel {
  if (median === 0) return 'similar';
  const ratio = value / median;
  if (ratio <= 0.8) return 'low';
  if (ratio >= 1.2) return 'high';
  return 'similar';
}

export interface ComparisonResult {
  key: string;
  label: LocalizedText;
  description: string;
  sentiment: LocalizedText;
  isGood: boolean;
}

export function formatSectorComparison(
  key: string,
  value: number | null,
  median: number | null,
  language: Language,
): ComparisonResult | null {
  const meta = METRICS[key];
  if (!meta || value == null || median == null) return null;

  const level = getLevel(value, median);
  const description = meta.template(value, median, language);
  const sentiment = meta.sentiment[level];

  const isGood = meta.lowerIsBetter
    ? level === 'low'
    : level === 'high';

  return { key, label: meta.label, description, sentiment, isGood };
}

export function getAllComparisons(
  data: Record<string, { value: number | null; median: number | null }>,
  language: Language,
): ComparisonResult[] {
  return Object.entries(data)
    .map(([key, { value, median }]) => formatSectorComparison(key, value, median, language))
    .filter((r): r is ComparisonResult => r != null);
}
