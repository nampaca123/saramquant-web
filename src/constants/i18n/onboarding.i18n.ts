import type { LocalizedText } from '@/types';

export const onboardingTexts = {
  heading: { ko: '프로필을 완성하세요', en: 'Complete your profile' } satisfies LocalizedText,
  headingDesc: { ko: '맞춤 분석을 위해 필요해요 · 외부에 공유되지 않아요', en: 'Helps us personalize your experience · We never share this' } satisfies LocalizedText,
  avatarHint: { ko: '프로필 사진 추가 (선택)', en: 'Add a photo (optional)' } satisfies LocalizedText,
  accountInfo: { ko: '계정 정보', en: 'Account' } satisfies LocalizedText,
  nicknameLabel: { ko: '닉네임', en: 'Nickname' } satisfies LocalizedText,
  nicknamePlaceholder: { ko: '어떻게 불러드릴까요?', en: 'What should we call you?' } satisfies LocalizedText,
  selectAtLeastOne: { ko: '최소 1개를 선택하세요', en: 'Pick at least one' } satisfies LocalizedText,
  required: { ko: '필수 항목이에요', en: "We need this one" } satisfies LocalizedText,
  start: { ko: '시작하기', en: "Let's go!" } satisfies LocalizedText,
  consentNotice: {
    ko: '본 서비스는 투자 자문이 아닌 정보 제공·교육 목적이며, 투자 전 전문가 상담을 권장합니다. 서비스 운영·보안을 위해 개인정보(이메일, 닉네임, 생년), IP 주소 및 IP 기반 대략적 위치를 수집하며 법령이 정한 기간까지 보유합니다.',
    en: 'This service is for informational and educational purposes only — not investment advice. Consult a professional before investing. We collect personal data (email, nickname, birth year), IP address, and IP-based approximate location for service operation and security, retained as required by law.',
  } satisfies LocalizedText,
  consentTerms: { ko: '이용약관', en: 'Terms' } satisfies LocalizedText,
  consentPrivacy: { ko: '개인정보처리방침', en: 'Privacy Policy' } satisfies LocalizedText,
  consentAgree: {
    ko: '위 내용을 확인했으며 동의합니다',
    en: 'I have read and agree to the above',
  } satisfies LocalizedText,
  consentRequired: { ko: '동의가 필요합니다', en: 'You must agree to continue' } satisfies LocalizedText,
} as const;
