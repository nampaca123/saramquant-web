'use client';

import { Globe } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

export function LanguageToggle({ className }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium transition-colors hover:border-gold hover:text-gold',
        className,
      )}
      aria-label="Toggle language"
    >
      <Globe className="h-3.5 w-3.5 text-zinc-400" />
      <span className={language === 'en' ? 'text-zinc-900' : 'text-zinc-400'}>EN</span>
      <span className="text-zinc-300">/</span>
      <span className={language === 'ko' ? 'text-zinc-900' : 'text-zinc-400'}>KR</span>
    </button>
  );
}
