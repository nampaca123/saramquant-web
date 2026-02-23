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
} as const;
