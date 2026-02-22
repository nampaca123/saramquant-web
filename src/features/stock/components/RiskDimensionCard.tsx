'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { formatIndicator } from '@/lib/utils/format-indicator';
import { t } from '@/lib/i18n/translations';
import { DIMENSION_META, COMPONENT_LABELS } from '@/constants/risk-dimension.constants';
import { TIER_CONFIG } from '@/constants/risk-tier.constants';
import { RiskScoreInfoPopover } from './RiskScoreInfoPopover';
import type { RiskDimension } from '@/types';

interface RiskDimensionCardProps {
  dimension: RiskDimension;
}

export function RiskDimensionCard({ dimension }: RiskDimensionCardProps) {
  const txt = useText();
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const meta = DIMENSION_META[dimension.name];
  const tierCfg = TIER_CONFIG[dimension.tier];
  const Icon = meta.icon;
  const interpretation = meta.interpretations[dimension.tier](dimension.components, dimension.direction);

  const tierBarColor: Record<string, string> = {
    STABLE: 'bg-stable',
    CAUTION: 'bg-caution',
    WARNING: 'bg-warning',
  };

  if (!dimension.data_available) {
    return (
      <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
        <div className="flex items-center gap-1.5">
          <Icon className="h-4 w-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-400">{txt(meta.label)}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-zinc-200" />
        <p className="text-sm text-zinc-400 italic mt-1.5">{txt(t.risk.notEnoughData)}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-100 bg-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center relative">
        <div className="flex items-center gap-1.5">
          <Icon className="h-4 w-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-700">{txt(meta.label)}</span>
          <button onClick={() => setPopoverOpen(true)}>
            <HelpCircle className="h-3.5 w-3.5 text-zinc-400 cursor-pointer hover:text-zinc-600" />
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge tier={dimension.tier} language={language} />
          <span className="text-sm font-mono text-zinc-500">
            {dimension.score}{txt(t.risk.score)}
          </span>
        </div>
        <RiskScoreInfoPopover
          dimension={dimension.name}
          open={popoverOpen}
          onClose={() => setPopoverOpen(false)}
        />
      </div>

      {/* Score label */}
      <p className="text-xs text-zinc-400 mt-0.5">{txt(t.stock.riskScore)}</p>

      {/* Progress bar */}
      <div className="mt-1.5 h-2 rounded-full bg-zinc-100 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', tierBarColor[dimension.tier])}
          style={{ width: `${dimension.score}%` }}
        />
      </div>

      {/* Interpretation */}
      <p className="text-sm text-zinc-600 mt-1.5">{txt(interpretation)}</p>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex items-center gap-1 text-xs text-zinc-400 cursor-pointer hover:text-zinc-600"
      >
        {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        {expanded ? txt(t.common.showLess) : txt(t.common.showMore)}
      </button>

      {/* Components detail */}
      {expanded && (
        <div className="mt-2 space-y-1 border-t border-zinc-50 pt-2">
          {Object.entries(dimension.components).map(([key, val]) => {
            const label = COMPONENT_LABELS[key];
            if (!label) return null;
            return (
              <div key={key} className="flex justify-between py-1">
                <span className="text-xs text-zinc-500">{txt(label)}</span>
                <span className="text-xs font-mono text-zinc-700">{formatIndicator(val)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
