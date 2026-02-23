import type { LocalizedText } from '@/types';

export const settingsTexts = {
  title: { ko: '설정', en: 'Settings' } satisfies LocalizedText,
  subtitle: { ko: '프로필과 환경설정을 관리하세요', en: 'Manage your profile and preferences' } satisfies LocalizedText,

  profile: { ko: '프로필', en: 'Profile' } satisfies LocalizedText,
  name: { ko: '이름', en: 'Name' } satisfies LocalizedText,
  gender: { ko: '성별', en: 'Gender' } satisfies LocalizedText,
  birthYear: { ko: '출생연도', en: 'Birth Year' } satisfies LocalizedText,
  experience: { ko: '투자 경험', en: 'Investment Experience' } satisfies LocalizedText,
  genderNone: { ko: '선택 안함', en: 'Prefer not to say' } satisfies LocalizedText,
  genderMale: { ko: '남성', en: 'Male' } satisfies LocalizedText,
  genderFemale: { ko: '여성', en: 'Female' } satisfies LocalizedText,
  expBeginner: { ko: '초보', en: 'Beginner' } satisfies LocalizedText,
  expIntermediate: { ko: '중급', en: 'Intermediate' } satisfies LocalizedText,
  expAdvanced: { ko: '고급', en: 'Advanced' } satisfies LocalizedText,
  preferredMarkets: { ko: '관심 시장', en: 'Preferred Markets' } satisfies LocalizedText,
  edit: { ko: '편집', en: 'Edit' } satisfies LocalizedText,

  accountInfo: { ko: '계정 정보', en: 'Account Info' } satisfies LocalizedText,
  provider: { ko: '가입 방법', en: 'Sign-up method' } satisfies LocalizedText,
  joined: { ko: '가입일', en: 'Joined' } satisfies LocalizedText,
  roleStandard: { ko: '스탠다드 등급', en: 'Standard' } satisfies LocalizedText,
  roleAdmin: { ko: '관리자 등급', en: 'Admin' } satisfies LocalizedText,

  llmUsage: { ko: 'AI 분석', en: 'AI Analysis' } satisfies LocalizedText,
  llmUsageToday: { ko: '오늘 사용량', en: 'Today' } satisfies LocalizedText,

  language: { ko: '앱 표시 언어', en: 'Display Language' } satisfies LocalizedText,
  languageDesc: { ko: '앱에 표시되는 언어를 선택하세요', en: 'Choose the language displayed in the app' } satisfies LocalizedText,

  account: { ko: '계정 관리', en: 'Account' } satisfies LocalizedText,
  logoutAll: { ko: '모든 기기에서 로그아웃', en: 'Log out from all devices' } satisfies LocalizedText,
  deactivateAccount: { ko: '회원 탈퇴', en: 'Deactivate Account' } satisfies LocalizedText,
  deactivateWarning: { ko: '탈퇴 후에도 다시 로그인하면 계정을 복구할 수 있어요', en: 'You can reactivate your account by logging in again' } satisfies LocalizedText,
  saved: { ko: '저장됨', en: 'Saved' } satisfies LocalizedText,
  loginRequired: { ko: '로그인이 필요해요', en: 'Login required' } satisfies LocalizedText,
  loginRequiredSub: { ko: '설정을 변경하려면 로그인하세요', en: 'Log in to change settings' } satisfies LocalizedText,
} as const;
