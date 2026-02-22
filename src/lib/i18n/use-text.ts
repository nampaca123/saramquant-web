'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import type { LocalizedText } from '@/types';

export function useText() {
  const { language } = useLanguage();
  return (text: LocalizedText) => text[language];
}
