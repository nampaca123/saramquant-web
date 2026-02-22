'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Language } from '@/types';
import { defaultLanguage } from '@/constants/i18n.constants';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    const saved = localStorage.getItem('sq-lang') as Language | null;
    if (saved === 'ko' || saved === 'en') {
      setLanguageState(saved);
      return;
    }
    if (navigator.language.toLowerCase().startsWith('ko')) {
      setLanguageState('ko');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sq-lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <LanguageContext value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
