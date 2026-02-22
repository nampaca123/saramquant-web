'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardApi } from '@/lib/api';
import type { StockSearchResult } from '@/features/screener/types/screener.types';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';

export function SearchCombobox({ className }: { className?: string }) {
  const txt = useText();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      setOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await dashboardApi.search({ q: query, limit: 10 });
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (item: StockSearchResult) => {
    setQuery('');
    setOpen(false);
    router.push(`/stocks/${item.market}/${item.symbol}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      select(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5">
        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={txt(t.screener.searchPlaceholder)}
          className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
        />
      </div>

      {open && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg">
          {results.map((item, i) => (
            <li key={item.stockId}>
              <button
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-50',
                  i === activeIndex && 'bg-zinc-50',
                )}
                onClick={() => select(item)}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="font-mono text-xs text-zinc-400">{item.symbol}</span>
                <span className="flex-1 text-zinc-900">{item.name}</span>
                <span className="text-xs text-zinc-400">{item.market}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
