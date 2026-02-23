'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Popover } from '@/components/ui/Popover';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { formatPercent } from '@/lib/utils/format-percent';
import { isError } from '@/lib/utils/is-error';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
import type { LocalizedText } from '@/types';
import type { PortfolioAnalysisResponse } from '../types/portfolio.types';

interface MetricsCardsProps {
  analysis: PortfolioAnalysisResponse | null;
}

export function MetricsCards({ analysis }: MetricsCardsProps) {
  const txt = useText();
  const { language } = useLanguage();

  const riskScore = analysis?.risk_score;
  const decomp = analysis?.risk_decomposition;
  const divers = analysis?.diversification;

  const hasDecomp = decomp && !isError(decomp);
  const hasDivers = divers && !isError(divers);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <MetricCard
        label={txt(t.portfolio.riskScore)}
        tooltip={t.portfolio.riskScoreInfo}
      >
        {riskScore && riskScore.score != null && riskScore.tier !== 'UNKNOWN' ? (
          <>
            <Badge tier={riskScore.tier as 'STABLE' | 'CAUTION' | 'WARNING'} language={language} />
            <p className="text-2xl font-mono font-bold text-zinc-900 mt-1">
              {riskScore.score}<span className="text-sm font-normal text-zinc-500">{txt(t.risk.score)}</span>
            </p>
          </>
        ) : (
          <EmptyValue />
        )}
      </MetricCard>

      <MetricCard
        label={txt(t.portfolio.volatility)}
        tooltip={t.portfolio.volatilityInfo}
      >
        {hasDecomp ? (
          <>
            <p className="text-2xl font-mono font-bold text-zinc-900">
              {formatPercent(decomp.portfolio_vol * 100, { sign: false })}
            </p>
            {riskScore?.benchmark_vol != null && (
              <p className="text-xs text-zinc-400 mt-0.5">
                {txt(t.portfolio.vsBenchmark)} {formatPercent(riskScore.benchmark_vol * 100, { sign: false })}
              </p>
            )}
          </>
        ) : (
          <EmptyValue />
        )}
      </MetricCard>

      <MetricCard
        label={txt(t.portfolio.diversification)}
        tooltip={t.portfolio.diversificationInfo}
      >
        {hasDivers ? (
          <>
            <p className={cn(
              'text-2xl font-mono font-bold',
              divers.hhi < 0.25 ? 'text-stable' : divers.hhi > 0.5 ? 'text-warning' : 'text-zinc-900',
            )}>
              {divers.effective_n}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">{txt(t.portfolio.effectiveNLabel)}</p>
          </>
        ) : (
          <EmptyValue />
        )}
      </MetricCard>

      <MetricCard
        label={txt(t.portfolio.maxWeight)}
        tooltip={t.portfolio.maxWeightInfo}
      >
        {hasDivers ? (
          <p className={cn(
            'text-2xl font-mono font-bold',
            divers.max_weight > 0.5 ? 'text-caution' : 'text-zinc-900',
          )}>
            {formatPercent(divers.max_weight * 100, { sign: false })}
          </p>
        ) : (
          <EmptyValue />
        )}
      </MetricCard>
    </div>
  );
}

function EmptyValue() {
  const txt = useText();
  return (
    <>
      <p className="text-xs text-zinc-400">{txt(t.portfolio.insufficientData)}</p>
      <p className="text-2xl font-mono font-bold text-zinc-300 mt-1">—</p>
    </>
  );
}

function MetricCard({ label, tooltip, children }: {
  label: string;
  tooltip: LocalizedText;
  children: React.ReactNode;
}) {
  const txt = useText();
  const [open, setOpen] = useState(false);

  return (
    <Card className="relative">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs text-zinc-500">{label}</p>
        <button onClick={() => setOpen(!open)}>
          <HelpCircle className="h-3.5 w-3.5 text-zinc-300 hover:text-zinc-500 transition-colors" />
        </button>
      </div>
      {children}
      <Popover open={open} onClose={() => setOpen(false)} className="top-8 right-0 w-72 z-50">
        <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line pr-4">
          {txt(tooltip)}
        </p>
      </Popover>
    </Card>
  );
}
