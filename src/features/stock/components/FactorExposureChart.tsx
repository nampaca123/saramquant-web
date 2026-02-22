'use client';

import { Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { FACTOR_LABELS } from '@/constants/indicator-tooltips.constants';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
import type { FactorExposures } from '../types/stock.types';

interface FactorExposureChartProps {
  exposures: FactorExposures;
}

const FACTOR_KEYS = ['sizeZ', 'valueZ', 'momentumZ', 'volatilityZ', 'qualityZ', 'leverageZ'] as const;

export function FactorExposureChart({ exposures }: FactorExposureChartProps) {
  const txt = useText();
  const { language } = useLanguage();

  const factors = FACTOR_KEYS.map((key) => ({
    key,
    value: exposures[key],
    meta: FACTOR_LABELS[key],
  })).filter((f) => f.value != null);

  if (factors.length === 0) return null;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-4 w-4 text-gold" />
        <h3 className="text-sm font-bold text-zinc-900">
          {txt(t.stock.factorTitle)}
        </h3>
      </div>

      <div className="space-y-3">
        {factors.map(({ key, value, meta }) => {
          const v = value!;
          const clamped = Math.max(-2, Math.min(2, v));
          const pct = ((clamped + 2) / 4) * 100;
          const interpretation = v >= 0 ? meta.positive : meta.negative;

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-zinc-700">{txt(meta.label)}</span>
                <span className="text-xs text-zinc-500">{txt(interpretation)}</span>
              </div>
              <div className="relative h-2 rounded-full bg-zinc-100">
                {/* Center line */}
                <div className="absolute left-1/2 top-0 h-full w-px bg-zinc-300" />
                {/* Bar */}
                <div
                  className={cn(
                    'absolute top-0 h-full rounded-full transition-all',
                    Math.abs(v) > 2 ? 'bg-warning' : Math.abs(v) > 1 ? 'bg-caution' : 'bg-zinc-400',
                  )}
                  style={{
                    left: v >= 0 ? '50%' : `${pct}%`,
                    width: `${Math.abs(clamped) / 4 * 100}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-zinc-400">
        {txt(t.stock.factorDesc)}
      </p>
    </Card>
  );
}
