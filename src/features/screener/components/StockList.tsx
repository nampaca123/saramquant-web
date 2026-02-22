'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
import { StockListItem } from './StockListItem';
import type { DashboardPage } from '../types/screener.types';

interface StockListProps {
  data: DashboardPage | null;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function StockList({ data, loading, onPageChange }: StockListProps) {
  const txt = useText();

  if (loading || !data) return null;

  if (data.content.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-zinc-400">
        <p className="text-sm">{txt(t.screener.noResults)}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Column headers (desktop) */}
      <div className="hidden sm:grid grid-cols-[minmax(180px,1.2fr)_minmax(240px,1.5fr)_minmax(100px,0.8fr)] gap-x-4 px-4 pb-2 text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
        <span>{txt({ ko: '종목', en: 'Stock' })}</span>
        <span>{txt({ ko: '리스크 5대 지표', en: 'Risk 5 Dimensions' })}</span>
        <span className="text-right">{txt({ ko: '현재가', en: 'Price' })}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {data.content.map((item) => (
          <StockListItem key={item.stockId} item={item} />
        ))}
      </div>

      {data.totalPages > 1 && (
        <Pagination
          current={data.number}
          total={data.totalPages}
          onChange={onPageChange}
        />
      )}
    </div>
  );
}

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const pages = useMemo(() => {
    const result: (number | 'ellipsis')[] = [];
    const range = 2;
    const start = Math.max(0, current - range);
    const end = Math.min(total - 1, current + range);

    if (start > 0) {
      result.push(0);
      if (start > 1) result.push('ellipsis');
    }
    for (let i = start; i <= end; i++) result.push(i);
    if (end < total - 1) {
      if (end < total - 2) result.push('ellipsis');
      result.push(total - 1);
    }
    return result;
  }, [current, total]);

  return (
    <div className="mt-6 flex items-center justify-center gap-1">
      <PageButton onClick={() => onChange(0)} disabled={current === 0} aria-label="First page">
        <ChevronsLeft className="h-4 w-4" />
      </PageButton>
      <PageButton onClick={() => onChange(current - 1)} disabled={current === 0} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" />
      </PageButton>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e${i}`} className="px-1 text-zinc-400">…</span>
        ) : (
          <PageButton
            key={p}
            onClick={() => onChange(p)}
            active={p === current}
          >
            {p + 1}
          </PageButton>
        ),
      )}

      <PageButton onClick={() => onChange(current + 1)} disabled={current >= total - 1} aria-label="Next page">
        <ChevronRight className="h-4 w-4" />
      </PageButton>
      <PageButton onClick={() => onChange(total - 1)} disabled={current >= total - 1} aria-label="Last page">
        <ChevronsRight className="h-4 w-4" />
      </PageButton>
    </div>
  );
}

function PageButton({
  active, disabled, children, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors',
        active ? 'bg-gold text-white font-medium' : 'text-zinc-600 hover:bg-zinc-100',
        disabled && 'pointer-events-none opacity-40',
      )}
      {...props}
    >
      {children}
    </button>
  );
}
