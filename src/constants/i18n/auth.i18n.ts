import type { LocalizedText } from '@/types';

export const authTexts = {
  email: { ko: '이메일', en: 'Email' } satisfies LocalizedText,
  password: { ko: '비밀번호', en: 'Password' } satisfies LocalizedText,
  name: { ko: '이름', en: 'Name' } satisfies LocalizedText,
  googleLogin: { ko: 'Google로 로그인', en: 'Log in with Google' } satisfies LocalizedText,
  kakaoLogin: { ko: '카카오로 로그인', en: 'Log in with Kakao' } satisfies LocalizedText,
  noAccount: { ko: '계정이 없으신가요?', en: "Don't have an account?" } satisfies LocalizedText,
  hasAccount: { ko: '이미 계정이 있으신가요?', en: 'Already have an account?' } satisfies LocalizedText,
} as const;
