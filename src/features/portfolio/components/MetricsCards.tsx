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
      {/* Risk Score */}
      <MetricCard label={txt(t.portfolio.riskScore)} tooltip={t.portfolio.riskScoreInfo}>
        {riskScore && riskScore.score != null && riskScore.tier !== 'UNKNOWN' ? (
          <div className="flex items-end gap-2 mt-auto">
            <span className="text-2xl font-mono font-bold text-zinc-900 leading-none">
              {riskScore.score}
            </span>
            <Badge tier={riskScore.tier as 'STABLE' | 'CAUTION' | 'WARNING'} language={language} className="mb-0.5" />
          </div>
        ) : (
          <EmptyValue />
        )}
      </MetricCard>

      {/* Volatility */}
      <MetricCard label={txt(t.portfolio.volatility)} tooltip={t.portfolio.volatilityInfo}>
        {hasDecomp ? (
          <>
            <span className="text-2xl font-mono font-bold text-zinc-900 leading-none mt-auto">
              {formatPercent(decomp.portfolio_vol * 100, { sign: false })}
            </span>
            {riskScore?.benchmark_vol != null && (
              <p className="text-[11px] text-zinc-400 mt-1">
                {txt(t.portfolio.vsBenchmark)} {formatPercent(riskScore.benchmark_vol * 100, { sign: false })}
              </p>
            )}
          </>
        ) : (
          <EmptyValue />
        )}
      </MetricCard>

      {/* Diversification */}
      <MetricCard label={txt(t.portfolio.diversification)} tooltip={t.portfolio.diversificationInfo}>
        {hasDivers ? (
          <>
            <span className={cn(
              'text-2xl font-mono font-bold leading-none mt-auto',
              divers.hhi < 0.25 ? 'text-stable' : divers.hhi > 0.5 ? 'text-warning' : 'text-zinc-900',
            )}>
              {divers.effective_n}
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">{txt(t.portfolio.effectiveNLabel)}</p>
          </>
        ) : (
          <EmptyValue />
        )}
      </MetricCard>

      {/* Max Weight */}
      <MetricCard label={txt(t.portfolio.maxWeight)} tooltip={t.portfolio.maxWeightInfo}>
        {hasDivers ? (
          <span className={cn(
            'text-2xl font-mono font-bold leading-none mt-auto',
            divers.max_weight > 0.5 ? 'text-caution' : 'text-zinc-900',
          )}>
            {formatPercent(divers.max_weight * 100, { sign: false })}
          </span>
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
    <div className="mt-auto">
      <span className="text-2xl font-mono font-bold text-zinc-300 leading-none">—</span>
      <p className="text-[11px] text-zinc-400 mt-1">{txt(t.portfolio.insufficientData)}</p>
    </div>
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
    <Card className="relative flex flex-col min-h-[100px]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-zinc-500 leading-none">{label}</p>
        <button onClick={() => setOpen(!open)}>
          <HelpCircle className="h-3.5 w-3.5 text-zinc-300 hover:text-zinc-500 transition-colors" />
        </button>
      </div>
      <div className="flex flex-col flex-1 justify-end">
        {children}
      </div>
      <Popover open={open} onClose={() => setOpen(false)} className="top-8 right-0 w-72 z-50">
        <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line pr-4">
          {txt(tooltip)}
        </p>
      </Popover>
    </Card>
  );
}
