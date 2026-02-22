import type { DimensionName, Direction, LocalizedText, RiskTier } from '@/types';

interface DimensionMeta {
  icon: string;
  label: LocalizedText;
  interpretations: Record<
    RiskTier,
    (components: Record<string, number | null>, direction: Direction | null) => LocalizedText
  >;
}

const fmt = (v: number | null, dp = 1) => (v != null ? v.toFixed(dp) : '—');

export const DIMENSION_META: Record<DimensionName, DimensionMeta> = {
  price_heat: {
    icon: '🔥',
    label: { ko: '가격 과열도', en: 'Price Heat' },
    interpretations: {
      STABLE: () => ({
        ko: '가격이 적정 수준이에요',
        en: 'Price is at a fair level',
      }),
      CAUTION: (c, d) =>
        d === 'OVERHEATED'
          ? {
              ko: `좀 비싼 편이에요. RSI ${fmt(c.rsi)}로 과매수에 가까워지고 있어요`,
              en: `Slightly expensive. RSI ${fmt(c.rsi)} approaching overbought`,
            }
          : d === 'OVERSOLD'
            ? {
                ko: `좀 싼 편이에요. RSI ${fmt(c.rsi)}로 과매도 구간이에요`,
                en: `Slightly cheap. RSI ${fmt(c.rsi)} in oversold zone`,
              }
            : {
                ko: '가격 변동에 주의가 필요해요',
                en: 'Watch for price fluctuation',
              },
      WARNING: (c, d) =>
        d === 'OVERHEATED'
          ? {
              ko: `가격이 많이 올라서 과열 상태예요. RSI ${fmt(c.rsi)}`,
              en: `Price is overheated. RSI ${fmt(c.rsi)}`,
            }
          : {
              ko: `가격이 많이 내려서 과매도 상태예요. RSI ${fmt(c.rsi)}`,
              en: `Price is heavily oversold. RSI ${fmt(c.rsi)}`,
            },
    },
  },

  volatility: {
    icon: '📊',
    label: { ko: '변동성', en: 'Volatility' },
    interpretations: {
      STABLE: () => ({
        ko: '시장 평균보다 안정적이에요',
        en: 'More stable than market average',
      }),
      CAUTION: (c) => {
        const pct = c.beta != null && c.beta > 1 ? Math.round((c.beta - 1) * 100) : null;
        return pct != null
          ? {
              ko: `시장보다 ${pct}% 더 출렁이는 편이에요`,
              en: `${pct}% more volatile than the market`,
            }
          : {
              ko: '변동성에 주의가 필요해요',
              en: 'Moderate volatility risk',
            };
      },
      WARNING: (c) => ({
        ko: `변동성이 매우 커요. 시장의 ${fmt(c.beta)}배만큼 움직여요`,
        en: `Very high volatility. Moves ${fmt(c.beta)}x the market`,
      }),
    },
  },

  trend: {
    icon: '📈',
    label: { ko: '추세', en: 'Trend' },
    interpretations: {
      STABLE: (_c, d) =>
        d === 'UPTREND'
          ? { ko: '완만한 상승 흐름이에요', en: 'Gentle uptrend' }
          : { ko: '뚜렷한 추세 없이 횡보 중이에요', en: 'Moving sideways with no clear trend' },
      CAUTION: (_c, d) =>
        d === 'DOWNTREND'
          ? { ko: '하락 추세가 나타나고 있어요', en: 'Emerging downtrend' }
          : { ko: '추세 전환 가능성이 있어요', en: 'Possible trend change' },
      WARNING: (c, d) =>
        d === 'DOWNTREND'
          ? {
              ko: `강한 하락 추세예요. ADX ${fmt(c.adx)}로 추세가 뚜렷해요`,
              en: `Strong downtrend. ADX ${fmt(c.adx)} confirms`,
            }
          : {
              ko: `강한 상승 추세예요. ADX ${fmt(c.adx)}`,
              en: `Strong uptrend. ADX ${fmt(c.adx)}`,
            },
    },
  },

  company_health: {
    icon: '🏢',
    label: { ko: '기업 건전성', en: 'Company Health' },
    interpretations: {
      STABLE: () => ({
        ko: '같은 업종 대비 재무상태가 건강해요',
        en: 'Healthy financials vs. sector peers',
      }),
      CAUTION: () => ({
        ko: '재무 지표가 업종 평균 수준이에요',
        en: 'Financials around sector average',
      }),
      WARNING: () => ({
        ko: '재무 건전성에 주의가 필요해요',
        en: 'Financial health needs attention',
      }),
    },
  },

  valuation: {
    icon: '💰',
    label: { ko: '가치 평가', en: 'Valuation' },
    interpretations: {
      STABLE: () => ({
        ko: '업종 대비 적정하거나 저평가된 수준이에요',
        en: 'Fair or undervalued vs. sector',
      }),
      CAUTION: (c) => ({
        ko: `업종 평균보다 다소 비싼 편이에요${c.per != null ? ` (PER ${fmt(c.per)})` : ''}`,
        en: `Slightly expensive vs. sector${c.per != null ? ` (PER ${fmt(c.per)})` : ''}`,
      }),
      WARNING: (c) => ({
        ko: `실적 대비 주가가 많이 높아요${c.per != null ? `. PER ${fmt(c.per)}` : ''}`,
        en: `Highly overvalued${c.per != null ? `. PER ${fmt(c.per)}` : ''}`,
      }),
    },
  },
};

export const COMPONENT_LABELS: Record<string, LocalizedText> = {
  rsi: { ko: 'RSI (과매수·과매도 지표)', en: 'RSI (Overbought/Oversold)' },
  bb_pct_b: { ko: '볼린저밴드 위치', en: 'Bollinger Band Position' },
  beta: { ko: '베타 (시장 민감도)', en: 'Beta (Market Sensitivity)' },
  volatility_z: { ko: '변동성 Z-score', en: 'Volatility Z-score' },
  adx: { ko: 'ADX (추세 강도)', en: 'ADX (Trend Strength)' },
  plus_di: { ko: '+DI (상승 강도)', en: '+DI (Bullish Strength)' },
  minus_di: { ko: '-DI (하락 강도)', en: '-DI (Bearish Strength)' },
  debt_ratio: { ko: '부채비율', en: 'Debt Ratio' },
  roe: { ko: '자기자본이익률', en: 'ROE' },
  operating_margin: { ko: '영업이익률', en: 'Operating Margin' },
  per: { ko: 'PER (주가수익비율)', en: 'PER (Price/Earnings)' },
  pbr: { ko: 'PBR (주가순자산비율)', en: 'PBR (Price/Book)' },
};
