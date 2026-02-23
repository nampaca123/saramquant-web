'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import type { DataFreshness } from '../types/screener.types';

function toKST(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function DataFreshnessPopover() {
  const txt = useText();
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

  const rows = [
    { label: txt(t.screener.krPrice), date: data.krPriceDate, at: data.krPriceCollectedAt },
    { label: txt(t.screener.usPrice), date: data.usPriceDate, at: data.usPriceCollectedAt },
    { label: txt(t.screener.krFinancial), date: null, at: data.krFinancialCollectedAt },
    { label: txt(t.screener.usFinancial), date: null, at: data.usFinancialCollectedAt },
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
          className="absolute right-0 top-full mt-1.5 z-50 w-64 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg"
        >
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-zinc-400">
                <th className="pb-1.5 text-left font-medium">&nbsp;</th>
                <th className="pb-1.5 text-right font-medium">{txt(t.screener.dataDate)}</th>
                <th className="pb-1.5 text-right font-medium">{txt(t.screener.collectedAt)}</th>
              </tr>
            </thead>
            <tbody className="text-zinc-600">
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-zinc-100">
                  <td className="py-1 pr-2 font-medium whitespace-nowrap">{r.label}</td>
                  <td className="py-1 text-right tabular-nums">{r.date ?? '-'}</td>
                  <td className="py-1 text-right tabular-nums">{toKST(r.at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
