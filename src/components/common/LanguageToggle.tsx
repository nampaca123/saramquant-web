'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

export function LanguageToggle({ className }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={cn('flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-gold hover:text-gold', className)}
      aria-label="Toggle language"
    >
      {language === 'ko' ? (
        <>
          {/* Korean flag simplified */}
          <svg className="h-4 w-4" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="16" fill="#fff" />
            <circle cx="16" cy="16" r="6" fill="#C60C30" />
            <path d="M16 10a6 6 0 0 1 0 12 3 3 0 0 0 0-6 3 3 0 0 1 0-6z" fill="#003478" />
          </svg>
          KO
        </>
      ) : (
        <>
          {/* US/English flag simplified */}
          <svg className="h-4 w-4" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="16" fill="#B22234" />
            <rect y="4" width="32" height="2.5" fill="#fff" />
            <rect y="9" width="32" height="2.5" fill="#fff" />
            <rect y="14" width="32" height="2.5" fill="#fff" />
            <rect y="19" width="32" height="2.5" fill="#fff" />
            <rect y="24" width="32" height="2.5" fill="#fff" />
            <rect width="14" height="14" fill="#3C3B6E" />
          </svg>
          EN
        </>
      )}
    </button>
  );
}
