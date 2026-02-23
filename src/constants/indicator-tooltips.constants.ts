import type { LocalizedText } from '@/types';

export interface IndicatorTooltip {
  label: LocalizedText;
  brief: LocalizedText;
  detail: LocalizedText;
}

export const INDICATOR_TOOLTIPS: Record<string, IndicatorTooltip> = {
  beta: {
    label: { ko: '베타', en: 'Beta' },
    brief: {
      ko: '시장이 출렁일 때 이 종목이 얼마나 같이 출렁이는지',
      en: 'How wild this stock gets when the market shakes',
    },
    detail: {
      ko: '시장이 1% 오르면 이 종목은 약 {value}% 올라요. 1보다 크면 시장보다 더 출렁이고, 1보다 작으면 덜 출렁여요.',
      en: 'If the market goes up 1%, this stock moves about {value}%. Above 1 means it swings harder than the market. Below 1 means it\'s calmer.',
    },
  },
  rsi14: {
    label: { ko: 'RSI', en: 'RSI' },
    brief: {
      ko: '최근 2주간 주가가 얼마나 올랐는지의 비율',
      en: 'Has the price gone up too much or dropped too far lately?',
    },
    detail: {
      ko: "0~100 사이 값. 70 이상이면 '많이 올라서 과열', 30 이하면 '많이 빠져서 바닥권'. 50 근처면 보통이에요.",
      en: "Goes from 0 to 100. Above 70? Probably went up too fast. Below 30? Might've fallen too far. Around 50 is chill.",
    },
  },
  sharpe: {
    label: { ko: '샤프 비율', en: 'Sharpe Ratio' },
    brief: {
      ko: '감수한 위험 대비 수익이 괜찮은지',
      en: 'Is the reward worth the risk?',
    },
    detail: {
      ko: "높을수록 '위험 대비 수익이 좋다'는 뜻이에요. 1 이상이면 우수, 0 이하면 위험만 크고 수익은 별로인 거예요.",
      en: "Higher is better — means you're getting paid well for the risk. Above 1 is great. Below 0 means you're taking risk for nothing.",
    },
  },
  atr14: {
    label: { ko: 'ATR', en: 'ATR' },
    brief: {
      ko: '하루에 가격이 평균적으로 얼마나 움직이는지',
      en: 'How much the price bounces around in a single day',
    },
    detail: {
      ko: '최근 14일 동안 하루 최고가와 최저가의 평균 차이예요. 숫자가 클수록 하루 변동폭이 커요.',
      en: 'The average gap between the daily high and low over the past 2 weeks. Bigger number = wilder daily swings.',
    },
  },
  adx14: {
    label: { ko: 'ADX', en: 'ADX' },
    brief: {
      ko: '가격이 한 방향으로 얼마나 강하게 가고 있는지',
      en: 'Is the price heading somewhere, or just bouncing around?',
    },
    detail: {
      ko: '25 이상이면 뚜렷한 추세, 40 이상이면 아주 강한 추세. 20 이하면 방향 없이 왔다갔다하는 중이에요.',
      en: "Above 25 means it's clearly going somewhere. Above 40 is a really strong move. Below 20? It's just wandering.",
    },
  },
  per: {
    label: { ko: 'PER', en: 'PER' },
    brief: {
      ko: '주가가 회사가 버는 돈에 비해 비싼지 싼지',
      en: 'Is this stock cheap or expensive for what the company earns?',
    },
    detail: {
      ko: "주가 / 1년에 주당 버는 돈. 쉽게 말해 '투자금 회수에 몇 년 걸리나'. 10이면 10년, 30이면 30년. 같은 업종끼리 비교해야 의미가 있어요.",
      en: "Think of it as: how many years would it take to earn back what you paid? PER 10 = 10 years. Best to compare stocks in the same industry.",
    },
  },
  pbr: {
    label: { ko: 'PBR', en: 'PBR' },
    brief: {
      ko: '주가가 회사 재산에 비해 비싼지 싼지',
      en: 'Are you paying more or less than what the company actually owns?',
    },
    detail: {
      ko: "주가 / 주당 회사 순자산. 1이면 회사 재산만큼의 가격, 2면 재산의 2배 가격. 1 미만이면 '재산보다 싸게 팔리고 있다'는 뜻이에요.",
      en: "If it's 1, the stock costs exactly what the company owns. Under 1? You're getting it for less than it's worth on paper. Over 2 means you're paying double.",
    },
  },
  roe: {
    label: { ko: 'ROE', en: 'ROE' },
    brief: {
      ko: '회사가 자기 돈으로 얼마나 잘 벌고 있는지',
      en: 'How good is the company at turning its own money into profit?',
    },
    detail: {
      ko: '자기 자본 대비 1년 순이익 비율. 10%면 100억 넣어서 10억 번 거예요. 높을수록 돈을 효율적으로 쓰는 회사예요.',
      en: 'If ROE is 10%, the company makes $10 for every $100 it has. Higher means they\'re better at making money with what they\'ve got.',
    },
  },
  debtRatio: {
    label: { ko: '부채비율', en: 'Debt Level' },
    brief: {
      ko: '회사의 빚이 얼마나 많은지',
      en: 'How much does this company owe?',
    },
    detail: {
      ko: '빚 / 자기 돈. 100%면 자기 돈만큼 빚이 있는 거고, 200%면 자기 돈의 2배 빚이 있는 거예요. 낮을수록 재정적으로 안전해요.',
      en: "If it's 1x, they owe as much as they own. 2x means they owe double. Lower is safer — less debt, less stress.",
    },
  },
  operatingMargin: {
    label: { ko: '영업이익률', en: 'Profit Margin' },
    brief: {
      ko: '장사해서 실제로 남는 돈의 비율',
      en: 'How much of every dollar in sales actually becomes profit?',
    },
    detail: {
      ko: '매출에서 원가와 운영비를 빼고 남는 비율. 20%면 100원 팔 때 20원이 남아요. 높을수록 알짜 장사를 하는 회사예요.',
      en: "If it's 20%, the company keeps $20 for every $100 in sales after paying all the bills. Higher = the company is really good at making money.",
    },
  },
};

export const RISK_DIMENSION_LABELS: Record<string, { label: LocalizedText; question: LocalizedText }> = {
  price_heat: {
    label: { ko: '가격 과열도', en: 'Price Heat' },
    question: { ko: '지금 가격이 과열됐나요?', en: 'Has the price run up too fast?' },
  },
  volatility: {
    label: { ko: '변동성', en: 'Wild Swings' },
    question: { ko: '가격이 얼마나 출렁이나요?', en: 'How much does the price jump around?' },
  },
  trend: {
    label: { ko: '추세 강도', en: 'Direction' },
    question: { ko: '지금 가격이 한 방향으로 움직이고 있나요?', en: 'Is the price heading up, down, or nowhere?' },
  },
  company_health: {
    label: { ko: '회사 체력', en: 'Company Health' },
    question: { ko: '이 회사 재정이 튼튼한가요?', en: "Is this company's money situation solid?" },
  },
  valuation: {
    label: { ko: '가격 수준', en: 'Price Tag' },
    question: { ko: '지금 주가가 비싼 편인가요?', en: 'Am I paying too much for this stock?' },
  },
};

export const FACTOR_LABELS: Record<string, { label: LocalizedText; positive: LocalizedText; negative: LocalizedText }> = {
  sizeZ: {
    label: { ko: '회사 규모', en: 'Company Size' },
    positive: { ko: '대기업 성향', en: 'Big company' },
    negative: { ko: '중소기업 성향', en: 'Smaller company' },
  },
  valueZ: {
    label: { ko: '가격 매력', en: 'Deal or No Deal' },
    positive: { ko: '저평가 성향', en: 'Looks like a deal' },
    negative: { ko: '고평가 성향', en: 'Might be overpriced' },
  },
  momentumZ: {
    label: { ko: '최근 주가 흐름', en: 'Recent Trend' },
    positive: { ko: '최근 상승세', en: 'Been going up' },
    negative: { ko: '최근 하락세', en: 'Been going down' },
  },
  volatilityZ: {
    label: { ko: '가격 변동 크기', en: 'How Wild It Gets' },
    positive: { ko: '많이 흔들리는 편', en: 'Bumpy ride' },
    negative: { ko: '안정적인 편', en: 'Smooth ride' },
  },
  qualityZ: {
    label: { ko: '기업 경영 상태', en: 'How Well It\'s Run' },
    positive: { ko: '경영 우수', en: 'Well-run company' },
    negative: { ko: '경영 개선 필요', en: 'Could be run better' },
  },
  leverageZ: {
    label: { ko: '빚 활용도', en: 'Debt Use' },
    positive: { ko: '빚을 많이 쓰는 편', en: 'Uses a lot of borrowed money' },
    negative: { ko: '빚이 적은 편', en: 'Doesn\'t borrow much' },
  },
};
