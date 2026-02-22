'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { t } from '@/lib/i18n/translations';
import { TIER_CONFIG } from '@/constants/risk-tier.constants';
import { RiskDimensionCard } from './RiskDimensionCard';
import type { StockRiskBadge } from '../types/stock.types';

interface RiskReportProps {
  riskBadge: StockRiskBadge | null;
}

const DIMENSION_ORDER = ['price_heat', 'volatility', 'trend', 'company_health', 'valuation'] as const;

export function RiskReport({ riskBadge }: RiskReportProps) {
  const txt = useText();
  const { language } = useLanguage();

  if (!riskBadge) {
    return (
      <Card>
        <p className="text-sm text-zinc-400">{txt(t.risk.notEnoughData)}</p>
      </Card>
    );
  }

  const tierCfg = TIER_CONFIG[riskBadge.summaryTier];

  return (
    <div className="space-y-3">
      {/* Summary badge */}
      <Card>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${tierCfg.bg.replace('bg-', 'bg-').replace('-bg', '')}`}
            style={{ backgroundColor: `var(--color-${riskBadge.summaryTier.toLowerCase()})` }}
          />
          <span className="text-lg font-bold text-zinc-900">{txt(t.risk.overallRisk)}</span>
          <Badge tier={riskBadge.summaryTier} language={language} />
        </div>
      </Card>

      {/* 5 dimension cards */}
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-3">
        {DIMENSION_ORDER.map((name) => {
          const dim = riskBadge.dimensions.dims.find((d) => d.name === name);
          if (!dim) return null;
          return <RiskDimensionCard key={name} dimension={dim} />;
        })}
      </div>
    </div>
  );
}
