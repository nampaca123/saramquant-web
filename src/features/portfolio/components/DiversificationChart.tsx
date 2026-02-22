'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import type { DiversificationResult } from '../types/portfolio.types';

interface DiversificationChartProps {
  data: DiversificationResult | null;
}

export function DiversificationChart({ data }: DiversificationChartProps) {
  const txt = useText();

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

  const maxSector = entries[0]?.sector;

  return (
    <Card>
      <h3 className="text-sm font-medium text-zinc-700 mb-3">{txt(t.portfolio.sectorDiversification)}</h3>
      <ResponsiveContainer width="100%" height={entries.length * 36 + 20}>
        <BarChart data={entries} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
          <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} tickFormatter={(v: number) => `${v}%`} />
          <YAxis type="category" dataKey="sector" tick={{ fontSize: 11 }} width={100} />
          <Tooltip formatter={(value) => typeof value === 'number' ? `${value.toFixed(1)}%` : value} />
          <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
            {entries.map((entry) => (
              <Cell key={entry.sector} fill={entry.sector === maxSector ? '#C8981E' : '#d4d4d8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
