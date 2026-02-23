'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { t } from '@/lib/i18n/translations';
import { FlagIcon } from '@/components/common/FlagIcon';
import type { DataFreshness } from '../types/screener.types';

function toKST(pg: string | null, locale: string): string {
  if (!pg) return '-';
  const iso = pg.includes('+') ? pg : pg.replace(' ', 'T') + 'Z';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString(locale, {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DataFreshnessPopover() {
  const txt = useText();
  const { language } = useLanguage();
  const locale = language === 'ko' ? 'ko-KR' : 'en-US';
  const [data, setData] = useState<DataFreshness | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dashboardApi.freshness().then(setData).catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!data) return null;

  const rows: { flag: 'KR' | 'US'; label: string; time: string }[] = [
    { flag: 'KR', label: txt(t.screener.krPrice), time: toKST(data.krPriceUpdatedAt, locale) },
    { flag: 'US', label: txt(t.screener.usPrice), time: toKST(data.usPriceUpdatedAt, locale) },
    { flag: 'KR', label: txt(t.screener.krFinancial), time: toKST(data.krFinancialUpdatedAt, locale) },
    { flag: 'US', label: txt(t.screener.usFinancial), time: toKST(data.usFinancialUpdatedAt, locale) },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-500 transition-colors"
      >
        <Clock className="h-3 w-3" />
        <span>{txt(t.screener.dataFreshness)}</span>
      </button>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute right-0 top-full mt-1.5 z-50 w-56 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg"
        >
          <div className="flex flex-col gap-1.5 text-[11px]">
            <span className="text-[10px] text-zinc-400 text-right">KST (UTC+9)</span>
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <FlagIcon market={r.flag} size={13} />
                  {r.label}
                </span>
                <span className="text-zinc-700 tabular-nums font-medium">{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
