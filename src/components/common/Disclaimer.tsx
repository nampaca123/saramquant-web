'use client';

import { useText } from '@/lib/i18n/use-text';
import type { LocalizedText } from '@/types';
import { cn } from '@/lib/utils/cn';

interface DisclaimerProps {
  text: LocalizedText | string;
  variant?: 'global' | 'inline';
  className?: string;
}

export function Disclaimer({ text, variant = 'global', className }: DisclaimerProps) {
  const txt = useText();
  const content = typeof text === 'string' ? text : txt(text);

  if (variant === 'inline') {
    return <p className={cn('text-xs text-zinc-400 mt-2', className)}>{content}</p>;
  }

  return (
    <footer className={cn('border-t border-zinc-100 bg-zinc-50 px-4 py-3', className)}>
      <p className="mx-auto max-w-6xl text-xs text-zinc-400 text-center">{content}</p>
    </footer>
  );
}
