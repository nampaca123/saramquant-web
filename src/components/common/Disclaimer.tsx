'use client';

import { useState } from 'react';
import { CircleHelp, Mail } from 'lucide-react';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { Popover } from '@/components/ui/Popover';
import type { LocalizedText } from '@/types';
import { cn } from '@/lib/utils/cn';

const SUPPORT_EMAIL = 'knnam12@outlook.com';

interface DisclaimerProps {
  text: LocalizedText | string;
  variant?: 'global' | 'inline';
  className?: string;
}

export function Disclaimer({ text, variant = 'global', className }: DisclaimerProps) {
  const txt = useText();
  const [helpOpen, setHelpOpen] = useState(false);
  const content = typeof text === 'string' ? text : txt(text);

  if (variant === 'inline') {
    return <p className={cn('text-xs text-zinc-400 mt-2', className)}>{content}</p>;
  }

  return (
    <footer className={cn('border-t border-zinc-100 bg-zinc-50 px-4 py-3', className)}>
      <div className="mx-auto max-w-6xl flex items-center justify-center gap-3">
        <p className="text-xs text-zinc-400 text-center">{content}</p>

        <div className="relative">
          <button
            onClick={() => setHelpOpen((v) => !v)}
            className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-700"
          >
            <CircleHelp className="h-3 w-3" />
            {txt(t.common.helpDesk)}
          </button>

          <Popover
            open={helpOpen}
            onClose={() => setHelpOpen(false)}
            className="bottom-full right-0 mb-2 w-64"
          >
            <p className="text-sm text-zinc-600 leading-relaxed">
              {txt(t.common.helpDeskMessage)}
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-3 flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-700"
            >
              <Mail className="h-3.5 w-3.5" />
              {txt(t.common.emailUs)}
            </a>
            <p className="mt-2 text-[11px] text-zinc-400 select-all">{SUPPORT_EMAIL}</p>
          </Popover>
        </div>
      </div>
    </footer>
  );
}
