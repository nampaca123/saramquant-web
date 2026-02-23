'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Popover } from '@/components/ui/Popover';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import type { DiversificationResult } from '../types/portfolio.types';

interface DiversificationChartProps {
  data: DiversificationResult | null;
}

const MAX_VISIBLE = 5;

export function DiversificationChart({ data }: DiversificationChartProps) {
  const txt = useText();
  const [infoOpen, setInfoOpen] = useState(false);

  if (!data?.sector_concentration || Object.keys(data.sector_concentration).length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-medium text-zinc-700 mb-3">{txt(t.portfolio.sectorDiversification)}</h3>
        <p className="text-sm text-zinc-400">{txt(t.common.noData)}</p>
      </Card>
    );
  }

  const entries = Object.entries(data.sector_concentration)
    .map(([sector, pct]) => ({ sector, pct: pct * 100 }))
    .sort((a, b) => b.pct - a.pct);

  const maxPct = entries[0]?.pct ?? 100;
  const needsScroll = entries.length > MAX_VISIBLE;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-700">{txt(t.portfolio.sectorDiversification)}</h3>
        <div className="relative">
          <button onClick={() => setInfoOpen(!infoOpen)}>
            <HelpCircle className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-600" />
          </button>
          <Popover open={infoOpen} onClose={() => setInfoOpen(false)} className="top-6 right-0 w-72">
            <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line pr-4">
              {txt(t.portfolio.sectorDiversificationInfo)}
            </p>
          </Popover>
        </div>
      </div>

      <div
        className={needsScroll ? 'overflow-y-auto' : ''}
        style={{ maxHeight: needsScroll ? `${MAX_VISIBLE * 36}px` : undefined }}
      >
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div key={entry.sector} className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 w-20 flex-shrink-0 truncate">{entry.sector}</span>
              <div className="flex-1 h-5 bg-zinc-100 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${(entry.pct / maxPct) * 100}%`,
                    backgroundColor: i === 0 ? '#C8981E' : '#d4d4d8',
                  }}
                />
              </div>
              <span className="text-xs font-mono text-zinc-600 w-12 text-right flex-shrink-0">
                {entry.pct.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
