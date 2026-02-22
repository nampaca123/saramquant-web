import type { LocalizedText } from '@/types';

export const t = {
  common: {
    login: { ko: '로그인', en: 'Log in' } satisfies LocalizedText,
    logout: { ko: '로그아웃', en: 'Log out' } satisfies LocalizedText,
    signup: { ko: '회원가입', en: 'Sign up' } satisfies LocalizedText,
    search: { ko: '검색', en: 'Search' } satisfies LocalizedText,
    retry: { ko: '다시 시도', en: 'Retry' } satisfies LocalizedText,
    loading: { ko: '로딩 중...', en: 'Loading...' } satisfies LocalizedText,
    noData: { ko: '데이터가 없어요', en: 'No data' } satisfies LocalizedText,
    error: { ko: '오류가 발생했어요', en: 'Something went wrong' } satisfies LocalizedText,
    cancel: { ko: '취소', en: 'Cancel' } satisfies LocalizedText,
    confirm: { ko: '확인', en: 'Confirm' } satisfies LocalizedText,
    save: { ko: '저장', en: 'Save' } satisfies LocalizedText,
    delete: { ko: '삭제', en: 'Delete' } satisfies LocalizedText,
    close: { ko: '닫기', en: 'Close' } satisfies LocalizedText,
    showMore: { ko: '상세 보기', en: 'Show details' } satisfies LocalizedText,
    showLess: { ko: '접기', en: 'Hide details' } satisfies LocalizedText,
  },

  nav: {
    home: { ko: '홈', en: 'Home' } satisfies LocalizedText,
    screener: { ko: '스크리너', en: 'Screener' } satisfies LocalizedText,
    portfolio: { ko: '포트폴리오', en: 'Portfolio' } satisfies LocalizedText,
    settings: { ko: '설정', en: 'Settings' } satisfies LocalizedText,
  },

  auth: {
    email: { ko: '이메일', en: 'Email' } satisfies LocalizedText,
    password: { ko: '비밀번호', en: 'Password' } satisfies LocalizedText,
    name: { ko: '이름', en: 'Name' } satisfies LocalizedText,
    googleLogin: { ko: 'Google로 로그인', en: 'Log in with Google' } satisfies LocalizedText,
    kakaoLogin: { ko: '카카오로 로그인', en: 'Log in with Kakao' } satisfies LocalizedText,
    noAccount: { ko: '계정이 없으신가요?', en: "Don't have an account?" } satisfies LocalizedText,
    hasAccount: { ko: '이미 계정이 있으신가요?', en: 'Already have an account?' } satisfies LocalizedText,
  },

  risk: {
    overallRisk: { ko: '종합 리스크', en: 'Overall Risk' } satisfies LocalizedText,
    notEnoughData: { ko: '아직 데이터가 충분하지 않아요', en: 'Not enough data yet' } satisfies LocalizedText,
    score: { ko: '점', en: 'pt' } satisfies LocalizedText,
  },

  disclaimer: {
    global: {
      ko: '본 서비스는 투자 자문이 아니며, 제공되는 정보는 참고용입니다. 투자 판단의 책임은 본인에게 있습니다.',
      en: 'This service is not investment advice. Information provided is for reference only. You are responsible for your own investment decisions.',
    } satisfies LocalizedText,
    simulation: {
      ko: '과거 데이터 기반 통계적 추정이며 미래 수익을 보장하지 않습니다.',
      en: 'Statistical estimation based on historical data. Does not guarantee future returns.',
    } satisfies LocalizedText,
  },

  screener: {
    title: { ko: '종목 스크리너', en: 'Stock Screener' } satisfies LocalizedText,
    allMarkets: { ko: '전체 시장', en: 'All Markets' } satisfies LocalizedText,
    allTiers: { ko: '전체 등급', en: 'All Tiers' } satisfies LocalizedText,
    allSectors: { ko: '전체 섹터', en: 'All Sectors' } satisfies LocalizedText,
    advancedFilters: { ko: '고급 필터', en: 'Advanced Filters' } satisfies LocalizedText,
    searchPlaceholder: { ko: '종목명 또는 심볼 검색', en: 'Search by name or symbol' } satisfies LocalizedText,
    noResults: { ko: '조건에 맞는 종목이 없어요', en: 'No stocks match your criteria' } satisfies LocalizedText,
    sortBy: { ko: '정렬', en: 'Sort by' } satisfies LocalizedText,
  },

  home: {
    title: { ko: '마켓 펄스', en: 'Market Pulse' } satisfies LocalizedText,
    marketOverview: { ko: '시장 리스크 분포', en: 'Market Risk Distribution' } satisfies LocalizedText,
    portfolioAlert: { ko: '내 포트폴리오', en: 'My Portfolio' } satisfies LocalizedText,
    portfolioCta: { ko: '포트폴리오를 만들어 보세요', en: 'Create your portfolio' } satisfies LocalizedText,
    holdings: { ko: '보유 종목', en: 'Holdings' } satisfies LocalizedText,
  },

  onboarding: {
    welcome: { ko: 'SaramQuant에 오신 것을 환영합니다', en: 'Welcome to SaramQuant' } satisfies LocalizedText,
    tagline: {
      ko: '숫자를 신호로, 리스크를 한눈에',
      en: 'Numbers into signals, risk at a glance',
    } satisfies LocalizedText,
  },
} as const;
