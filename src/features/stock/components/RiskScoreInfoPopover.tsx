'use client';

import { Popover } from '@/components/ui/Popover';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import type { DimensionName } from '@/types';
import { DIMENSION_META } from '@/constants/risk-dimension.constants';

interface RiskScoreInfoPopoverProps {
  dimension: DimensionName;
  open: boolean;
  onClose: () => void;
}

export function RiskScoreInfoPopover({ dimension, open, onClose }: RiskScoreInfoPopoverProps) {
  const txt = useText();
  const meta = DIMENSION_META[dimension];

  return (
    <Popover open={open} onClose={onClose} className="top-6 right-0">
      <h4 className="text-sm font-bold text-zinc-900 mb-2 pr-4">
        {txt(meta.label)}
      </h4>
      <p className="text-xs text-zinc-600 leading-relaxed mb-3">
        {txt(meta.description)}
      </p>
      <p className="text-xs font-medium text-zinc-700 mb-1">{txt(t.stock.criteria)}</p>
      <ul className="space-y-1 mb-3">
        {meta.criteria.map((c, i) => (
          <li key={i} className="text-xs text-zinc-500">• {txt(c)}</li>
        ))}
      </ul>
      <p className="text-xs font-mono text-zinc-400 mb-2">{txt(t.stock.scoreScale)}</p>
      <p className="text-xs text-zinc-400 italic">{txt(meta.methodology)}</p>
    </Popover>
  );
}
