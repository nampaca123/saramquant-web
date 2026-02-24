import type { LocalizedText } from '@/types';

export const commonTexts = {
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
  greeting: { ko: '안녕하세요', en: 'Hello' } satisfies LocalizedText,
  helpDesk: { ko: '도움말', en: 'Help' } satisfies LocalizedText,
  helpDeskMessage: {
    ko: '이용 중 문제가 있으시면 아래 이메일로 연락해 주세요.',
    en: 'If you run into any issues, feel free to reach out via email below.',
  } satisfies LocalizedText,
  emailUs: { ko: '이메일 보내기', en: 'Send email' } satisfies LocalizedText,
} as const;

export const navTexts = {
  home: { ko: '홈', en: 'Home' } satisfies LocalizedText,
  screener: { ko: '스크리너', en: 'Screener' } satisfies LocalizedText,
  portfolio: { ko: '포트폴리오', en: 'Portfolio' } satisfies LocalizedText,
  settings: { ko: '설정', en: 'Settings' } satisfies LocalizedText,
} as const;

export const errorTexts = {
  calcServerDown: { ko: '분석 서버에 연결할 수 없어요', en: 'Cannot connect to analysis server' } satisfies LocalizedText,
  temporaryError: { ko: '일시적 오류가 발생했어요', en: 'A temporary error occurred' } satisfies LocalizedText,
} as const;
