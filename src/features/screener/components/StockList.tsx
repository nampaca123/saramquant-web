'use client';

import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { Button } from '@/components/ui/Button';
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
      <div className="divide-y divide-zinc-50">
        {data.content.map((item) => (
          <StockListItem key={item.stockId} item={item} />
        ))}
      </div>

      {data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={data.number === 0}
            onClick={() => onPageChange(data.number - 1)}
          >
            ←
          </Button>
          <span className="text-sm text-zinc-500">
            {data.number + 1} / {data.totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={data.number >= data.totalPages - 1}
            onClick={() => onPageChange(data.number + 1)}
          >
            →
          </Button>
        </div>
      )}
    </div>
  );
}
