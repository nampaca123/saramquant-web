'use client';

// TODO: dark mode에서 밴드 렌더링 방식 변경 필요 (흰색 덮기 트릭은 bg-white 전제)
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import type { PathPercentilePoint } from '@/types';

interface SimulationFanChartProps {
  data: PathPercentilePoint[];
  referenceLine?: number;
  height?: number;
}

export function SimulationFanChart({ data, referenceLine, height = 240 }: SimulationFanChartProps) {
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: '#a1a1aa' }}
          tickLine={false}
          axisLine={{ stroke: '#f4f4f5' }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#a1a1aa', fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={false}
          width={60}
          tickFormatter={(v: number) => v.toLocaleString()}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #f4f4f5' }}
          formatter={(value) => typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 0 }) : value}
        />

        {/* 10-90 outer band */}
        <Area dataKey="90" stroke="none" fill="#f4f4f5" fillOpacity={0.5} />
        <Area dataKey="10" stroke="none" fill="#ffffff" fillOpacity={1} />

        {/* 25-75 inner band */}
        <Area dataKey="75" stroke="none" fill="#FDF6E3" fillOpacity={0.7} />
        <Area dataKey="25" stroke="none" fill="#ffffff" fillOpacity={1} />

        {/* Median line */}
        <Line dataKey="50" stroke="#C8981E" strokeWidth={2} dot={false} />

        {referenceLine != null && (
          <ReferenceLine y={referenceLine} stroke="#a1a1aa" strokeDasharray="4 4" />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
