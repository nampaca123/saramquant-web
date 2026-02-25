'use client';

import { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';

export function EtfNoticePopover() {
  const txt = useText();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-500 transition-colors"
      >
        <Info className="h-3 w-3" />
      </button>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute right-0 top-full mt-1.5 z-50 w-60 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg"
        >
          <p className="text-[11px] leading-relaxed text-zinc-600">
            {txt(t.screener.etfNotice)}
          </p>
        </div>
      )}
    </div>
  );
}
