'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import type { StockSearchResult } from '@/features/screener/types/screener.types';

interface MobileSearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSearchOverlay({ open, onClose }: MobileSearchOverlayProps) {
  const router = useRouter();
  const txt = useText();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (query.length < 1) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await dashboardApi.search({ q: query, limit: 10 });
        setResults(data);
      } catch { setResults([]); }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const select = (item: StockSearchResult) => {
    onClose();
    router.push(`/stocks/${item.market}/${item.symbol}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100">
        <button onClick={onClose}>
          <ArrowLeft className="h-5 w-5 text-zinc-500" />
        </button>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={txt(t.screener.searchPlaceholder)}
          className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
        />
      </div>

      <div className="overflow-auto">
        {results.map((item) => (
          <button
            key={item.stockId}
            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 cursor-pointer"
            onClick={() => select(item)}
          >
            <span className="font-mono text-sm text-zinc-700">{item.symbol}</span>
            <span className="flex-1 text-sm">{item.name}</span>
            <span className="text-xs text-zinc-400">{item.market}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
