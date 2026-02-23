import type { LucideIcon } from 'lucide-react';
import { Flame, Activity, TrendingUp, Building2, Scale } from 'lucide-react';
import type { DimensionName, Direction, LocalizedText, RiskTier } from '@/types';

interface DimensionMeta {
  icon: LucideIcon;
  label: LocalizedText;
  description: LocalizedText;
  criteria: Array<LocalizedText>;
  methodology: LocalizedText;
  interpretations: Record<
    RiskTier,
    (components: Record<string, number | null>, direction: Direction | null) => LocalizedText
  >;
}

const fmt = (v: number | null, dp = 1) => (v != null ? v.toFixed(dp) : '—');

export const DIMENSION_META: Record<DimensionName, DimensionMeta> = {
  price_heat: {
    icon: Flame,
    label: { ko: '가격 과열도', en: 'Price Heat' },
    description: {
      ko: '현재 주가가 최근 흐름 대비 얼마나 안정적인지를 측정해요. 점수가 낮으면 과열이나 과매도 상태일 수 있어요.',
      en: "Checks how normal the current price is vs. recent trends. A lower score means it may have moved too far, too fast.",
    },
    criteria: [
      { ko: 'RSI (60%): 최근 14일간 상승/하락 비율', en: 'RSI (60%): 14-day momentum oscillator' },
      { ko: '볼린저밴드 %B (40%): 가격의 통계적 위치', en: 'Bollinger %B (40%): statistical price position' },
    ],
    methodology: {
      ko: '기술적 분석 오실레이터 기반 (RSI-14, BB %B-20)',
      en: 'Based on standard technical oscillators (RSI-14, BB %B-20)',
    },
    interpretations: {
      STABLE: () => ({
        ko: '가격이 적정 수준이에요',
        en: 'Price looks normal right now',
      }),
      CAUTION: (c, d) =>
        d === 'OVERHEATED'
          ? {
              ko: `좀 비싼 편이에요. RSI ${fmt(c.rsi)}로 과매수에 가까워지고 있어요`,
              en: `Getting a bit pricey — RSI is ${fmt(c.rsi)}, which means it ran up fast`,
            }
          : d === 'OVERSOLD'
            ? {
                ko: `좀 싼 편이에요. RSI ${fmt(c.rsi)}로 과매도 구간이에요`,
                en: `Looks cheap right now — RSI is ${fmt(c.rsi)}, meaning it dropped a lot`,
              }
            : {
                ko: '가격 변동에 주의가 필요해요',
                en: 'Price is acting a little unusual — keep an eye on it',
              },
      WARNING: (c, d) =>
        d === 'OVERHEATED'
          ? {
              ko: `가격이 많이 올라서 과열 상태예요. RSI ${fmt(c.rsi)}`,
              en: `Price shot up too fast — RSI ${fmt(c.rsi)} says it's overheated`,
            }
          : {
              ko: `가격이 많이 내려서 과매도 상태예요. RSI ${fmt(c.rsi)}`,
              en: `Price dropped hard — RSI ${fmt(c.rsi)} says it might be oversold`,
            },
    },
  },

  volatility: {
    icon: Activity,
    label: { ko: '변동성', en: 'Volatility' },
    description: {
      ko: '이 종목이 시장 전체에 비해 얼마나 안정적인지를 측정해요. 점수가 낮으면 가격이 크게 출렁일 수 있어요.',
      en: "How stable this stock is compared to the overall market. A lower score means expect bigger swings.",
    },
    criteria: [
      { ko: 'CAPM 베타 (50%): 시장 대비 가격 민감도', en: 'CAPM Beta (50%): market sensitivity' },
      { ko: '변동성 Z-score (50%): 횡단면 변동 폭', en: 'Volatility Z-score (50%): cross-sectional swing level' },
    ],
    methodology: {
      ko: 'CAPM 베타 + Barra(MSCI) 팩터 모델 기반',
      en: 'Based on CAPM beta + Barra (MSCI) factor model',
    },
    interpretations: {
      STABLE: () => ({
        ko: '시장 평균보다 안정적이에요',
        en: 'Calmer than the market overall',
      }),
      CAUTION: (c) => {
        const pct = c.beta != null && c.beta > 1 ? Math.round((c.beta - 1) * 100) : null;
        return pct != null
          ? {
              ko: `시장보다 ${pct}% 더 출렁이는 편이에요`,
              en: `Swings about ${pct}% more than the market`,
            }
          : {
              ko: '변동성에 주의가 필요해요',
              en: 'A bit jumpy — worth keeping an eye on',
            };
      },
      WARNING: (c) => ({
        ko: `변동성이 매우 커요. 시장의 ${fmt(c.beta)}배만큼 움직여요`,
        en: `Really wild — moves ${fmt(c.beta)}x what the market does`,
      }),
    },
  },

  trend: {
    icon: TrendingUp,
    label: { ko: '추세', en: 'Direction' },
    description: {
      ko: '지금 뚜렷한 추세(상승/하락)가 있는지, 얼마나 강한지를 측정해요. 강한 하락 추세는 위험, 강한 상승은 상대적으로 덜 위험해요.',
      en: "Is the price clearly heading up or down? A strong drop is risky. A steady rise is usually less concerning.",
    },
    criteria: [
      { ko: 'ADX-14: 추세 강도 지표', en: 'ADX-14: trend strength' },
      { ko: '+DI / -DI: 방향성 지표 (상승 추세는 ×0.6 감쇄)', en: '+DI / -DI: direction (uptrend weighted ×0.6)' },
    ],
    methodology: {
      ko: 'Welles Wilder ADX 방향성 시스템 기반',
      en: 'Based on Welles Wilder ADX directional system',
    },
    interpretations: {
      STABLE: (_c, d) =>
        d === 'UPTREND'
          ? { ko: '완만한 상승 흐름이에요', en: 'Slowly climbing — looking good' }
          : { ko: '뚜렷한 추세 없이 횡보 중이에요', en: "Not really going anywhere — just sitting still" },
      CAUTION: (_c, d) =>
        d === 'DOWNTREND'
          ? { ko: '하락 추세가 나타나고 있어요', en: 'Starting to slide downward' }
          : { ko: '추세 전환 가능성이 있어요', en: 'Might be changing direction' },
      WARNING: (c, d) =>
        d === 'DOWNTREND'
          ? {
              ko: `강한 하락 추세예요. ADX ${fmt(c.adx)}로 추세가 뚜렷해요`,
              en: `Dropping fast — ADX ${fmt(c.adx)} shows a strong downward push`,
            }
          : {
              ko: `강한 상승 추세예요. ADX ${fmt(c.adx)}`,
              en: `Rising fast — ADX ${fmt(c.adx)} shows strong momentum`,
            },
    },
  },

  company_health: {
    icon: Building2,
    label: { ko: '기업 건전성', en: 'Company Health' },
    description: {
      ko: '이 회사가 재무적으로 건강한지를 측정해요. 부채비율, ROE, 영업이익률을 같은 업종 회사들의 중간값과 비교해서 판정해요.',
      en: "Is this company in good shape financially? We check how much debt it has, how well it makes money, and how it stacks up against similar companies.",
    },
    criteria: [
      { ko: '부채비율 (40%): 빌린 돈 대비 자기 자본', en: 'Debt ratio (40%): how much does it owe vs. own?' },
      { ko: 'ROE (30%): 자기자본이익률', en: 'ROE (30%): profit efficiency' },
      { ko: '영업이익률 (30%): 매출 대비 이익', en: 'Operating margin (30%): how much of sales turn into profit?' },
    ],
    methodology: {
      ko: 'MSCI 섹터 상대 비교 방식 (섹터 중앙값 대비 평가)',
      en: 'MSCI-style sector-relative comparison (vs. sector median)',
    },
    interpretations: {
      STABLE: () => ({
        ko: '같은 업종 대비 재무상태가 건강해요',
        en: 'Money situation looks solid compared to others',
      }),
      CAUTION: () => ({
        ko: '재무 지표가 업종 평균 수준이에요',
        en: 'About average — not great, not bad',
      }),
      WARNING: () => ({
        ko: '재무 건전성에 주의가 필요해요',
        en: "The company's finances could be healthier",
      }),
    },
  },

  valuation: {
    icon: Scale,
    label: { ko: '가치 평가', en: 'Valuation' },
    description: {
      ko: '주가가 실적 대비 적정한지를 측정해요. PER과 PBR을 같은 업종과 비교해서 판정해요. 점수가 낮으면 실적에 비해 주가가 많이 높은 상태예요.',
      en: "Is the stock price fair for what the company actually earns? We compare it to similar companies. A lower score means you might be paying too much.",
    },
    criteria: [
      { ko: 'PER (50%): 주가 ÷ 주당순이익', en: 'PER (50%): price vs. earnings' },
      { ko: 'PBR (50%): 주가 ÷ 주당순자산', en: 'PBR (50%): price vs. assets' },
    ],
    methodology: {
      ko: 'MSCI 섹터 상대 비교 방식 (섹터 중앙값 대비 평가)',
      en: 'MSCI-style sector-relative comparison (vs. sector median)',
    },
    interpretations: {
      STABLE: () => ({
        ko: '업종 대비 적정하거나 저평가된 수준이에요',
        en: 'Looks fairly priced or even a good deal',
      }),
      CAUTION: (c) => ({
        ko: `업종 평균보다 다소 비싼 편이에요${c.per != null ? ` (PER ${fmt(c.per)})` : ''}`,
        en: `A bit pricey compared to similar companies${c.per != null ? ` (PER ${fmt(c.per)})` : ''}`,
      }),
      WARNING: (c) => ({
        ko: `실적 대비 주가가 많이 높아요${c.per != null ? `. PER ${fmt(c.per)}` : ''}`,
        en: `Looks really expensive for what it earns${c.per != null ? ` — PER is ${fmt(c.per)}` : ''}`,
      }),
    },
  },
};

export const COMPONENT_LABELS: Record<string, LocalizedText> = {
  rsi: { ko: 'RSI (과매수·과매도 지표)', en: 'RSI (too hot / too cold)' },
  bb_pct_b: { ko: '볼린저밴드 위치', en: 'Price position (normal range)' },
  beta: { ko: '베타 (시장 민감도)', en: 'Beta (market sensitivity)' },
  volatility_z: { ko: '변동성 Z-score', en: 'Swing level' },
  adx: { ko: 'ADX (추세 강도)', en: 'ADX (trend strength)' },
  plus_di: { ko: '+DI (상승 강도)', en: 'Upward push' },
  minus_di: { ko: '-DI (하락 강도)', en: 'Downward push' },
  debt_ratio: { ko: '부채비율', en: 'Debt level' },
  roe: { ko: '자기자본이익률', en: 'Profit efficiency' },
  operating_margin: { ko: '영업이익률', en: 'Profit margin' },
  per: { ko: 'PER (주가수익비율)', en: 'PER (payback years)' },
  pbr: { ko: 'PBR (주가순자산비율)', en: 'PBR (price vs. assets)' },
};
