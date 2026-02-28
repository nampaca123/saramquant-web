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

  const emptyValue = <span className="text-2xl font-mono font-bold text-zinc-300 leading-none">—</span>;
  const emptySub = <p className="text-[11px] text-zinc-400">{txt(t.portfolio.insufficientData)}</p>;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <MetricCard
        label={txt(t.portfolio.riskScore)}
        tooltipContent={<RiskScoreTooltipContent />}
        value={
          riskScore && riskScore.score != null && riskScore.tier !== 'UNKNOWN' ? (
            <div className="flex items-end gap-2">
              <span className="text-2xl font-mono font-bold text-zinc-900 leading-none">
                {riskScore.score}
              </span>
              <Badge tier={riskScore.tier as 'STABLE' | 'CAUTION' | 'WARNING'} language={language} className="mb-0.5" />
            </div>
          ) : emptyValue
        }
        sub={riskScore?.score == null || riskScore.tier === 'UNKNOWN' ? emptySub : undefined}
      />

      <MetricCard
        label={txt(t.portfolio.volatility)}
        tooltip={t.portfolio.volatilityInfo}
        value={
          hasDecomp ? (
            <span className="text-2xl font-mono font-bold text-zinc-900 leading-none">
              {formatPercent(decomp.portfolio_vol * 100, { sign: false })}
            </span>
          ) : emptyValue
        }
        sub={
          hasDecomp && riskScore?.benchmark_vol != null
            ? <p className="text-[11px] text-zinc-400">{txt(t.portfolio.vsBenchmark)} {formatPercent(riskScore.benchmark_vol * 100, { sign: false })}</p>
            : !hasDecomp ? emptySub : undefined
        }
      />

      <MetricCard
        label={txt(t.portfolio.diversification)}
        tooltip={t.portfolio.diversificationInfo}
        value={
          hasDivers ? (
            <span className={cn(
              'text-2xl font-mono font-bold leading-none',
              divers.hhi < 0.25 ? 'text-stable' : divers.hhi > 0.5 ? 'text-warning' : 'text-zinc-900',
            )}>
              {divers.effective_n}
            </span>
          ) : emptyValue
        }
        sub={hasDivers ? <p className="text-[11px] text-zinc-400">{txt(t.portfolio.effectiveNLabel)}</p> : emptySub}
      />

      <MetricCard
        label={txt(t.portfolio.maxWeight)}
        tooltip={t.portfolio.maxWeightInfo}
        value={
          hasDivers ? (
            <span className={cn(
              'text-2xl font-mono font-bold leading-none',
              divers.max_weight > 0.5 ? 'text-caution' : 'text-zinc-900',
            )}>
              {formatPercent(divers.max_weight * 100, { sign: false })}
            </span>
          ) : emptyValue
        }
        sub={!hasDivers ? emptySub : undefined}
      />
    </div>
  );
}

function MetricCard({ label, tooltip, tooltipContent, value, sub }: {
  label: string;
  tooltip?: LocalizedText;
  tooltipContent?: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
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
      <div className="flex-1" />
      {value}
      <div className="min-h-[18px] mt-1">{sub}</div>
      <Popover open={open} onClose={() => setOpen(false)} className="top-8 right-0 w-72 z-50">
        {tooltipContent ?? (
          <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line pr-4">
            {tooltip ? txt(tooltip) : ''}
          </p>
        )}
      </Popover>
    </Card>
  );
}

function RiskScoreTooltipContent() {
  const txt = useText();

  return (
    <>
      <h4 className="text-sm font-bold text-zinc-900 mb-2 pr-4">{txt(t.portfolio.riskScoreExplain)}</h4>
      <p className="text-xs text-zinc-600 leading-relaxed mb-3">{txt(t.portfolio.riskScoreInfo)}</p>
      <p className="text-xs font-mono text-zinc-400 mb-3">{txt(t.portfolio.riskScoreScale)}</p>
      <p className="text-xs font-medium text-zinc-700 mb-1">{txt(t.portfolio.riskScoreCriteria)}</p>
      <ul className="space-y-1 mb-3">
        <li className="text-xs text-zinc-500">• {txt(t.portfolio.riskScoreCriteriaLow)}</li>
        <li className="text-xs text-zinc-500">• {txt(t.portfolio.riskScoreCriteriaMid)}</li>
        <li className="text-xs text-zinc-500">• {txt(t.portfolio.riskScoreCriteriaHigh)}</li>
      </ul>
      <p className="text-xs text-zinc-500 leading-relaxed mb-2">{txt(t.portfolio.riskScoreMethodology)}</p>
      <p className="text-xs text-zinc-400 italic">{txt(t.portfolio.riskScoreSource)}</p>
    </>
  );
}
