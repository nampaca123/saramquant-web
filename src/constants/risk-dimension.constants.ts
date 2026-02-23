import type { LucideIcon } from 'lucide-react';
import { Flame, Activity, TrendingUp, Building2, Scale } from 'lucide-react';
import type { DimensionName, Direction, LocalizedText, RiskTier } from '@/types';

interface DimensionMeta {
  icon: LucideIcon;
  label: LocalizedText;
  description: LocalizedText;
  criteria: Array<LocalizedText>;
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
      ko: '현재 주가가 최근 흐름 대비 얼마나 비싼지/싼지를 측정해요. 점수가 높으면 단기 가격 조정 가능성이 있어요.',
      en: "Checks if the price has gone up (or down) too fast lately. A high score means it might cool off soon.",
    },
    criteria: [
      { ko: 'RSI: 최근 14일간 상승/하락 비율', en: 'RSI: has it risen or fallen too quickly?' },
      { ko: '볼린저밴드: 가격의 통계적 위치', en: 'Bollinger Band: is the price unusually high or low?' },
    ],
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
    label: { ko: '변동성', en: 'Wild Swings' },
    description: {
      ko: '이 종목이 시장 전체에 비해 얼마나 출렁이는지를 측정해요. 점수가 높으면 가격이 크게 움직일 수 있어요.',
      en: "How much this stock jumps around compared to the overall market. A high score means expect a bumpy ride.",
    },
    criteria: [
      { ko: '베타: 시장 대비 가격 민감도', en: 'Beta: does it swing more or less than the market?' },
      { ko: '변동성 Z-score: 통계적 변동 폭', en: 'How unusual are the price swings?' },
    ],
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
      { ko: 'ADX: 추세 강도 지표', en: 'ADX: how strong is the direction?' },
      { ko: '+DI/-DI: 방향성 지표', en: 'Is it heading up or down?' },
    ],
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
      { ko: '부채비율: 빌린 돈 대비 자기 자본', en: 'Debt: how much does it owe vs. own?' },
      { ko: 'ROE: 자기자본이익률', en: 'ROE: is it good at making profit?' },
      { ko: '영업이익률: 매출 대비 이익', en: 'Margin: how much of sales turn into profit?' },
    ],
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
    label: { ko: '가치 평가', en: 'Price Tag' },
    description: {
      ko: '주가가 실적 대비 비싼지 싼지를 측정해요. PER과 PBR을 같은 업종과 비교해서 판정. 점수가 높으면 실적에 비해 주가가 많이 높은 상태예요.',
      en: "Is the stock price fair for what the company actually earns? We compare it to similar companies. A high score means you might be paying too much.",
    },
    criteria: [
      { ko: 'PER: 주가 ÷ 주당순이익', en: 'PER: how many years to earn back what you paid?' },
      { ko: 'PBR: 주가 ÷ 주당순자산', en: 'PBR: are you paying more than what the company owns?' },
    ],
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
