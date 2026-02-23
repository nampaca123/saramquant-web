'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { formatPercent } from '@/lib/utils/format-percent';
import { isError } from '@/lib/utils/is-error';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
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
    <div className="flex overflow-x-auto gap-3 scrollbar-none md:grid md:grid-cols-4 md:gap-3">
      <Card className="min-w-[140px] flex-shrink-0">
        <p className="text-xs text-zinc-500 mb-1">{txt(t.portfolio.riskScore)}</p>
        {riskScore && riskScore.score != null && riskScore.tier !== 'UNKNOWN' ? (
          <>
            <Badge tier={riskScore.tier as 'STABLE' | 'CAUTION' | 'WARNING'} language={language} />
            <p className="text-xl font-mono font-bold text-zinc-900 mt-1">
              {riskScore.score}{txt(t.risk.score)}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs text-zinc-400">{txt(t.portfolio.insufficientData)}</p>
            <p className="text-xl font-mono font-bold text-zinc-400 mt-1">—</p>
          </>
        )}
      </Card>

      <Card className="min-w-[140px] flex-shrink-0">
        <p className="text-xs text-zinc-500 mb-1">{txt(t.portfolio.volatility)}</p>
        {hasDecomp ? (
          <>
            <p className="text-xl font-mono font-bold text-zinc-900">
              {formatPercent(decomp.portfolio_vol * 100, { sign: false })}
            </p>
            {riskScore?.benchmark_vol != null && (
              <p className="text-xs text-zinc-400 mt-0.5">
                {txt(t.portfolio.vsBenchmark)} {formatPercent(riskScore.benchmark_vol * 100, { sign: false })}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-xs text-zinc-400">{txt(t.portfolio.insufficientData)}</p>
            <p className="text-xl font-mono font-bold text-zinc-400 mt-1">—</p>
          </>
        )}
      </Card>

      <Card className="min-w-[140px] flex-shrink-0">
        <p className="text-xs text-zinc-500 mb-1">{txt(t.portfolio.diversification)}</p>
        {hasDivers ? (
          <p className={cn(
            'text-xl font-mono font-bold',
            divers.hhi < 0.25 ? 'text-stable' : divers.hhi > 0.5 ? 'text-warning' : 'text-zinc-900',
          )}>
            {divers.effective_n} {txt(t.portfolio.stocksDiversified)}
          </p>
        ) : (
          <>
            <p className="text-xs text-zinc-400">{txt(t.portfolio.insufficientData)}</p>
            <p className="text-xl font-mono font-bold text-zinc-400 mt-1">—</p>
          </>
        )}
      </Card>

      <Card className="min-w-[140px] flex-shrink-0">
        <p className="text-xs text-zinc-500 mb-1">{txt(t.portfolio.maxWeight)}</p>
        {hasDivers ? (
          <p className={cn(
            'text-xl font-mono font-bold',
            divers.max_weight > 0.5 ? 'text-caution' : 'text-zinc-900',
          )}>
            {formatPercent(divers.max_weight * 100, { sign: false })}
          </p>
        ) : (
          <>
            <p className="text-xs text-zinc-400">{txt(t.portfolio.insufficientData)}</p>
            <p className="text-xl font-mono font-bold text-zinc-400 mt-1">—</p>
          </>
        )}
      </Card>
    </div>
  );
}
