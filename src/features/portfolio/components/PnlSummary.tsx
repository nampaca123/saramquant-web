'use client';

import { useState } from 'react';
import { HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Popover } from '@/components/ui/Popover';
import { useText } from '@/lib/i18n/use-text';
import { formatCurrency } from '@/lib/utils/format-currency';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
import type { PortfolioDetail } from '../types/portfolio.types';

interface PnlSummaryProps {
  portfolio: PortfolioDetail;
}

export function PnlSummary({ portfolio }: PnlSummaryProps) {
  const txt = useText();
  const [infoOpen, setInfoOpen] = useState(false);

  const { totalCost, totalValue, totalPnl, totalPnlPercent } = portfolio;
  if (totalCost == null || totalValue == null || totalPnl == null) return null;

  const currency = portfolio.marketGroup === 'KR' ? 'KRW' : 'USD' as const;
  const isPositive = totalPnl > 0;
  const isNegative = totalPnl < 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-700">{txt(t.portfolio.totalPnl)}</h3>
        <div className="relative">
          <button onClick={() => setInfoOpen(!infoOpen)}>
            <HelpCircle className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-600" />
          </button>
          <Popover open={infoOpen} onClose={() => setInfoOpen(false)} className="top-6 right-0 w-72">
            <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line pr-4">
              {txt(t.portfolio.totalPnlInfo)}
            </p>
          </Popover>
        </div>
      </div>

      {/* Main P&L display */}
      <div className="flex items-baseline gap-3 mb-4">
        <Icon className={cn(
          'h-5 w-5 flex-shrink-0',
          isPositive ? 'text-stable' : isNegative ? 'text-warning' : 'text-zinc-400',
        )} />
        <span className={cn(
          'text-2xl font-mono font-bold',
          isPositive ? 'text-stable' : isNegative ? 'text-warning' : 'text-zinc-600',
        )}>
          {isPositive ? '+' : ''}{formatCurrency(totalPnl, currency)}
        </span>
        {totalPnlPercent != null && (
          <span className={cn(
            'text-sm font-mono font-medium',
            isPositive ? 'text-stable' : isNegative ? 'text-warning' : 'text-zinc-400',
          )}>
            ({isPositive ? '+' : ''}{totalPnlPercent.toFixed(2)}%)
          </span>
        )}
      </div>

      {/* Cost / Value breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-zinc-400 mb-0.5">{txt(t.portfolio.invested)}</p>
          <p className="text-sm font-mono font-medium text-zinc-700">{formatCurrency(totalCost, currency)}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 mb-0.5">{txt(t.portfolio.marketValue)}</p>
          <p className="text-sm font-mono font-medium text-zinc-700">{formatCurrency(totalValue, currency)}</p>
        </div>
      </div>
    </Card>
  );
}
