import type { LocalizedText } from '@/types';

export const portfolioTexts = {
  title: { ko: '포트폴리오', en: 'My Portfolio' } satisfies LocalizedText,
  subtitle: { ko: '내 투자의 전체 리스크를 진단하세요', en: 'See how risky your investments are overall' } satisfies LocalizedText,
  loginCta: { ko: '로그인하고 포트폴리오를 관리하세요', en: 'Log in to track your stocks' } satisfies LocalizedText,
  loginCtaSub: { ko: '종목을 추가하면 리스크 분석과 AI 진단을 받을 수 있어요', en: 'Add what you own and get a risk checkup plus AI insights' } satisfies LocalizedText,
  riskScore: { ko: '리스크 점수', en: 'Risk Score' } satisfies LocalizedText,
  volatility: { ko: '포트폴리오 변동성', en: 'How much it swings' } satisfies LocalizedText,
  diversification: { ko: '종목 분산', en: 'Spread' } satisfies LocalizedText,
  maxWeight: { ko: '최대 비중', en: 'Biggest slice' } satisfies LocalizedText,
  holdings: { ko: '보유 종목', en: 'My Stocks' } satisfies LocalizedText,
  addStock: { ko: '보유 종목 등록', en: 'Add a stock' } satisfies LocalizedText,
  sell: { ko: '수량 줄이기', en: 'Reduce' } satisfies LocalizedText,
  sellAll: { ko: '전량 제거', en: 'Remove all' } satisfies LocalizedText,
  deleteHolding: { ko: '보유 삭제', en: 'Remove' } satisfies LocalizedText,
  deleteConfirm: { ko: '정말 삭제하시겠어요?', en: 'Are you sure you want to remove this?' } satisfies LocalizedText,
  avgPrice: { ko: '평균단가', en: 'Avg. price paid' } satisfies LocalizedText,
  sharesUnit: { ko: '주', en: 'shares' } satisfies LocalizedText,
  sectorDiversification: { ko: '섹터 분산', en: 'Industry mix' } satisfies LocalizedText,
  insufficientData: { ko: '데이터 부족', en: 'Not enough data' } satisfies LocalizedText,
  noDataValue: { ko: '—', en: '—' } satisfies LocalizedText,
  vsBenchmark: { ko: '벤치마크 대비', en: 'vs. market' } satisfies LocalizedText,
  stocksDiversified: { ko: '종목 분산', en: 'stocks spread across' } satisfies LocalizedText,
  emptyMessage: { ko: '보유 종목을 등록하면 리스크 분석을 시작할 수 있어요', en: 'Add the stocks you own and we\'ll check your risk' } satisfies LocalizedText,
  findStocks: { ko: '종목 찾기', en: 'Find stocks' } satisfies LocalizedText,
  errorMessage: { ko: '데이터를 불러오지 못했어요', en: 'We couldn\'t load the data' } satisfies LocalizedText,

  // Portfolio simulation
  simTitle: { ko: '내 포트폴리오 미래 시나리오', en: 'What Could My Portfolio Look Like?' } satisfies LocalizedText,
  simDesc: {
    ko: '보유 중인 모든 종목의 과거 움직임을 한꺼번에 분석해서, 내 포트폴리오 전체 가치가 앞으로 어떻게 될 수 있는지 통계적으로 추정해요.',
    en: 'We look at how all your stocks have moved together in the past, then imagine thousands of possible futures for your whole portfolio.',
  } satisfies LocalizedText,
  simHowItWorksDetail: {
    ko: '개별 종목이 아니라 보유 종목 전체를 한꺼번에 시뮬레이션해요.\n\n핵심은 \'종목 간 관계\'예요. 예를 들어 A 주식이 오를 때 B 주식도 같이 오르는 패턴이 있다면, 시뮬레이션에서도 그 패턴이 반영돼요.\n\n부트스트랩: 과거의 같은 날짜를 무작위로 뽑아서, 모든 종목이 그날 실제로 어떻게 움직였는지를 그대로 재현해요. 종목 간의 실제 상관관계가 자연스럽게 보존돼요.\n\nGBM: 수학 공식으로 종목들의 상관관계를 모델링해서 시뮬레이션해요. 더 이론적이지만 깔끔한 결과를 줘요.\n\n결과는 포트폴리오 전체 가치 기준이에요. 데이터가 부족한 종목은 자동으로 제외될 수 있어요.',
    en: 'Instead of looking at one stock, we simulate your entire portfolio at once.\n\nThe key is how your stocks relate to each other. If Stock A tends to rise when Stock B falls, the simulation keeps that pattern.\n\nBootstrap: We pick random past days and replay what all your stocks actually did on those days. This naturally preserves how they moved together.\n\nGBM: We use math to model the relationships between your stocks. More theoretical, but gives cleaner results.\n\nResults show your total portfolio value. Stocks without enough shared data may be excluded.',
  } satisfies LocalizedText,
  simChartPreview: { ko: '실행하면 포트폴리오 가치 범위 차트가 여기에 표시돼요', en: 'Hit the button and a portfolio value chart will show up here' } satisfies LocalizedText,
  simFinalDistribution: { ko: '최종 예상 포트폴리오 가치 분포', en: 'Where your portfolio value might end up' } satisfies LocalizedText,
  simStage1: { ko: '보유 종목의 과거 데이터를 불러오고 있어요', en: 'Loading your stocks\' history' } satisfies LocalizedText,
  simStage2: { ko: '종목 간 관계를 분석하고 있어요', en: 'Analyzing how your stocks relate' } satisfies LocalizedText,
  simStage3: { ko: '시나리오를 계산하고 있어요', en: 'Running the simulation' } satisfies LocalizedText,
  simMaxWait: { ko: '종목이 많으면 조금 더 걸릴 수 있어요', en: 'More stocks means a bit more time' } satisfies LocalizedText,
  simMethodTooltip: {
    ko: 'GBM: 주가 변동이 정규분포를 따른다고 가정하고 수학 공식으로 시뮬레이션해요. 종목 간 상관관계를 통계적으로 모델링해요.\n\n부트스트랩: 실제 과거 수익률에서 같은 날짜를 무작위로 뽑아서 재구성해요. 종목들이 실제로 함께 움직였던 패턴이 자연스럽게 보존돼요.',
    en: 'GBM: Uses a math formula to imagine future prices. Models how your stocks move together statistically.\n\nBootstrap: Picks random days from actual history and replays them. Naturally preserves how your stocks really moved together.',
  } satisfies LocalizedText,

  // Portfolio AI diagnosis
  aiDiagnosis: { ko: 'AI 포트폴리오 진단', en: 'AI Portfolio Checkup' } satisfies LocalizedText,
  aiDesc: {
    ko: '보유 종목의 비중, 섹터 분산, 리스크 기여도, 재무 지표 등을 AI가 종합 분석해요.',
    en: 'AI analyzes your holdings\' weights, sector mix, risk contributions, and financial health all at once.',
  } satisfies LocalizedText,
  aiHowItWorks: { ko: '이 기능은 뭔가요?', en: "What's this?" } satisfies LocalizedText,
  aiHowItWorksDetail: {
    ko: '사람퀀트가 계산한 포트폴리오 데이터를 AI에게 전달해서 진단 보고서를 만들어요.\n\nAI가 받는 데이터:\n• 보유 종목 목록 — 종목명, 비중, 섹터, 리스크 등급\n• 포트폴리오 리스크 점수 — 벤치마크 대비 변동성\n• 리스크 기여도 — 어떤 종목이 전체 위험에 얼마나 영향을 주는지\n• 분산 지표 — 종목 쏠림도, 실질 분산 종목 수, 섹터 집중도\n• 개별 재무 지표 — 부채비율, ROE, 영업이익률 등 (일부 프리셋)\n\n외부 뉴스나 추측은 사용하지 않아요. 내 포트폴리오 실제 데이터 기반 분석이에요.',
    en: 'We feed your actual portfolio data from SaramQuant\'s calculations to the AI.\n\nData the AI receives:\n• Your holdings — name, weight, sector, and risk tier for each stock\n• Portfolio risk score — how volatile your portfolio is vs. the market\n• Risk contributions — which stocks add the most risk\n• Diversification metrics — concentration, effective number of stocks, sector spread\n• Individual financials — debt ratio, ROE, operating margin, etc. (some presets)\n\nNo outside news or speculation. It\'s based entirely on your portfolio\'s real numbers.',
  } satisfies LocalizedText,
  aiPreview: { ko: '위 버튼을 눌러 진단을 요청하면 여기에 AI 분석 결과가 표시돼요', en: 'Tap the button above and AI will diagnose your portfolio right here' } satisfies LocalizedText,
  aiStage1: { ko: '보유 종목을 분석하고 있어요', en: 'Analyzing your holdings' } satisfies LocalizedText,
  aiStage2: { ko: '리스크와 분산을 계산하고 있어요', en: 'Calculating risk and diversification' } satisfies LocalizedText,
  aiStage3: { ko: '진단 보고서를 작성 중이에요', en: 'Writing the diagnosis' } satisfies LocalizedText,
  aiStage4: { ko: '최종 검토 중이에요', en: 'Finishing up' } satisfies LocalizedText,
  aiMaxWait: { ko: '최대 1분 정도 걸릴 수 있어요', en: 'This may take up to a minute' } satisfies LocalizedText,
  presetDiagnosis: { ko: '종합 진단', en: 'Full checkup' } satisfies LocalizedText,
  presetReduceRisk: { ko: '리스크 줄이기', en: 'How to lower risk' } satisfies LocalizedText,
  presetOutlook: { ko: '시장 전망', en: "What's ahead" } satisfies LocalizedText,
  presetAggressive: { ko: '공격적 전략', en: 'Go bold' } satisfies LocalizedText,
  presetWeakness: { ko: '재무 취약점', en: 'Weak spots' } satisfies LocalizedText,
  presetSubDiagnosis: { ko: '리스크·분산·강점·약점 종합 진단', en: 'Risk, diversification, strengths & weaknesses' } satisfies LocalizedText,
  presetSubReduceRisk: { ko: '변동성 높은 종목과 쏠림 종목 점검', en: 'Which stocks make your portfolio riskier' } satisfies LocalizedText,
  presetSubOutlook: { ko: '좋은 장·나쁜 장 시나리오 분석', en: 'What happens if the market goes up or down' } satisfies LocalizedText,
  presetSubAggressive: { ko: '수익률 높이려면 어떻게 바꿀까', en: 'How to adjust your portfolio for more growth' } satisfies LocalizedText,
  presetSubWeakness: { ko: '재무 건전성이 약한 종목 찾기', en: 'Which companies have weak financials' } satisfies LocalizedText,

  // Buy modal
  buyPrice: { ko: '매수가', en: 'Purchase price' } satisfies LocalizedText,
  buyPricePlaceholder: { ko: '매수한 가격을 입력하세요', en: 'Enter the price you paid' } satisfies LocalizedText,
  buyDate: { ko: '매수일', en: 'Purchase date' } satisfies LocalizedText,
  buyShares: { ko: '수량', en: 'Shares' } satisfies LocalizedText,
  dayHigh: { ko: '고가', en: 'High' } satisfies LocalizedText,
  dayLow: { ko: '저가', en: 'Low' } satisfies LocalizedText,
  dayClose: { ko: '종가', en: 'Close' } satisfies LocalizedText,
  priceAutoFilled: { ko: '종가로 자동 입력됐어요. 실제 매수가가 다르면 수정하세요.', en: 'Auto-filled with closing price. Edit if your actual price was different.' } satisfies LocalizedText,
  noTradingDay: { ko: '이 날은 거래일이 아니에요. 매수가를 직접 입력해주세요.', en: "No trading data for this date. Please enter your price manually." } satisfies LocalizedText,
  priceOutOfRange: { ko: '그날의 고가·저가 범위를 벗어났어요. 확인해주세요.', en: "This price is outside the day's high-low range. Please double-check." } satisfies LocalizedText,
  priceFetching: { ko: '해당 날짜의 시세를 불러오는 중...', en: 'Fetching price for that date...' } satisfies LocalizedText,

  // History section
  historyTitle: { ko: '지난 분석 기록', en: 'Past Analyses' } satisfies LocalizedText,
  historyDesc: { ko: '이전에 받은 AI 진단을 다시 볼 수 있어요', en: 'Review your previous AI checkups' } satisfies LocalizedText,
  historyEmpty: { ko: '아직 분석 기록이 없어요', en: 'No past analyses yet' } satisfies LocalizedText,
  historyEmptySub: { ko: 'AI 진단을 한 번 받으면 여기에 기록이 남아요', en: 'Run an AI checkup above and it will appear here' } satisfies LocalizedText,

  // Market tab labels
  marketKR: { ko: '국장', en: 'KR Market' } satisfies LocalizedText,
  marketUS: { ko: '미장', en: 'US Market' } satisfies LocalizedText,

  // Metric tooltips
  riskScoreInfo: {
    ko: '포트폴리오 전체 변동성을 벤치마크(국장: KOSPI, 미장: S&P 500) 대비 비율로 환산한 점수예요.\n\n계산식: (포트폴리오 연간 변동성 ÷ 벤치마크 연간 변동성) × 50\n\n• 40점 이하: 안정 — 벤치마크보다 변동성이 낮아요\n• 40~70점: 주의 — 벤치마크와 비슷하거나 약간 높아요\n• 70점 초과: 경고 — 벤치마크보다 변동성이 크게 높아요\n\nMorningstar Portfolio Risk Score(MPRS) 방식을 간소화해 적용했어요.',
    en: 'Measures total portfolio volatility relative to the benchmark (KR: KOSPI, US: S&P 500).\n\nFormula: (portfolio annual vol ÷ benchmark annual vol) × 50\n\n• ≤ 40: Stable — less volatile than the benchmark\n• 40–70: Caution — similar to or slightly above the benchmark\n• > 70: Warning — significantly more volatile\n\nSimplified adaptation of the Morningstar Portfolio Risk Score (MPRS).',
  } satisfies LocalizedText,
  volatilityInfo: {
    ko: '최근 거래일 기준 포트폴리오 전체의 연간 변동성(annualized volatility)이에요.\n\n계산: 일일 수익률의 표준편차 × √252\n\n벤치마크 변동성과 비교하면 내 포트폴리오가 시장 평균보다 얼마나 흔들리는지 알 수 있어요.',
    en: 'Annualized volatility of your entire portfolio based on recent trading days.\n\nFormula: standard deviation of daily returns × √252\n\nCompare with benchmark volatility to see how much your portfolio swings relative to the market.',
  } satisfies LocalizedText,
  diversificationInfo: {
    ko: '종목이 얼마나 골고루 분산되어 있는지를 나타내는 지표예요.\n\n실질 분산 종목 수(Effective N) = 1 ÷ HHI\nHHI(허핀달-허쉬만 지수) = 각 종목 비중의 제곱의 합\n\n예시: 5종목 균등 분배 → Effective N = 5\n예시: 1종목에 90% 집중 → Effective N ≈ 1.2\n\n숫자가 높을수록 분산이 잘 되어 있다는 의미예요.',
    en: 'Shows how evenly your holdings are spread.\n\nEffective N = 1 ÷ HHI\nHHI (Herfindahl-Hirschman Index) = sum of squared weights\n\nExample: 5 stocks equally weighted → Effective N = 5\nExample: 90% in one stock → Effective N ≈ 1.2\n\nHigher means better diversification.',
  } satisfies LocalizedText,
  maxWeightInfo: {
    ko: '포트폴리오에서 가장 큰 비중을 차지하는 단일 종목의 비율이에요.\n\n이 값이 50%를 넘으면 특정 종목에 대한 쏠림이 크다는 뜻이에요. 해당 종목의 급락 시 포트폴리오 전체에 큰 영향을 줄 수 있어요.',
    en: 'The weight of the single largest position in your portfolio.\n\nAbove 50% means heavy concentration in one stock. A sharp drop in that stock could significantly impact your entire portfolio.',
  } satisfies LocalizedText,
  sectorDiversificationInfo: {
    ko: '보유 종목을 업종(섹터)별로 분류해 각 섹터가 차지하는 비중을 보여줘요.\n\n한 섹터에 집중되어 있으면 해당 산업 전체에 영향을 주는 이벤트(규제, 경기 변동 등)에 취약할 수 있어요.',
    en: 'Shows how your holdings are distributed across industry sectors.\n\nHeavy concentration in one sector makes your portfolio vulnerable to industry-wide events like regulation changes or economic shifts.',
  } satisfies LocalizedText,

  // Diversification display
  effectiveNLabel: { ko: '종목 분산', en: 'Stock spread' } satisfies LocalizedText,

  // Pagination
  pageOf: { ko: '/', en: ' / ' } satisfies LocalizedText,

  // Benchmark comparison
  benchmarkReturn: { ko: '벤치마크 대비 수익률', en: 'Return vs. Benchmark' } satisfies LocalizedText,
  benchmarkReturnInfo: {
    ko: '보유 종목의 매수 시점부터 현재까지의 수익률을 대표 벤치마크(국장: KOSPI, 미장: S&P 500)와 비교해요.\n\n양수면 벤치마크보다 좋은 성과를, 음수면 벤치마크 대비 저조한 성과를 의미해요.',
    en: 'Compares your portfolio return from purchase dates to now against the benchmark (KR: KOSPI, US: S&P 500).\n\nPositive means you outperformed the benchmark; negative means underperformance.',
  } satisfies LocalizedText,
  portfolioReturn: { ko: '내 포트폴리오', en: 'My Portfolio' } satisfies LocalizedText,
  benchmark: { ko: '벤치마크', en: 'Benchmark' } satisfies LocalizedText,
  excess: { ko: '초과 수익', en: 'Excess return' } satisfies LocalizedText,
  benchmarkName: { ko: '벤치마크', en: 'Benchmark' } satisfies LocalizedText,

  // Enriched holdings display
  currentValue: { ko: '보유 가치', en: 'Value' } satisfies LocalizedText,
  firstPurchaseDate: { ko: '최초 매수', en: 'First buy' } satisfies LocalizedText,
  currentPrice: { ko: '현재가', en: 'Current' } satisfies LocalizedText,

  // P&L
  totalPnl: { ko: '총 평가손익', en: 'Total P&L' } satisfies LocalizedText,
  totalPnlInfo: {
    ko: '보유 종목 전체의 평가손익이에요.\n\n평가 가치 = 각 종목의 (현재가 × 수량) 합계\n투자 원금 = 각 종목의 (평균단가 × 수량) 합계\n평가손익 = 평가 가치 − 투자 원금\n\n실현 손익(매도 확정분)이 아닌 미실현 손익이에요.',
    en: 'Unrealized P&L across all your holdings.\n\nMarket value = sum of (current price × shares)\nCost basis = sum of (avg price × shares)\nP&L = market value − cost basis\n\nThis is unrealized — not locked in until you sell.',
  } satisfies LocalizedText,
  invested: { ko: '투자 원금', en: 'Invested' } satisfies LocalizedText,
  marketValue: { ko: '평가 가치', en: 'Market value' } satisfies LocalizedText,
  pnl: { ko: '손익', en: 'P&L' } satisfies LocalizedText,
  costBasis: { ko: '원금', en: 'Cost' } satisfies LocalizedText,
} as const;
