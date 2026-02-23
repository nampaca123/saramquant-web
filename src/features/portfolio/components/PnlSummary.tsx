'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Popover } from '@/components/ui/Popover';
import { CurrencyValue } from '@/components/common/CurrencyValue';
import { useText } from '@/lib/i18n/use-text';
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

  return (
    <Card className="!py-3">
      <div className="flex items-center justify-between gap-4">
        {/* P&L headline */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs text-zinc-500 flex-shrink-0">{txt(t.portfolio.totalPnl)}</span>
          <CurrencyValue
            value={totalPnl}
            currency={currency}
            sign
            className={cn(
              'text-lg font-bold',
              isPositive ? 'text-stable' : isNegative ? 'text-warning' : 'text-zinc-600',
            )}
          />
          {totalPnlPercent != null && (
            <span className={cn(
              'text-xs font-mono font-semibold px-1.5 py-0.5 rounded',
              isPositive ? 'bg-stable-bg text-stable' : isNegative ? 'bg-warning-bg text-warning' : 'bg-zinc-100 text-zinc-400',
            )}>
              {totalPnlPercent > 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
            </span>
          )}
        </div>

        {/* Cost / Value compact + help */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-zinc-400">
            <span>{txt(t.portfolio.invested)} <CurrencyValue value={totalCost} currency={currency} className="text-zinc-600" /></span>
            <span>{txt(t.portfolio.marketValue)} <CurrencyValue value={totalValue} currency={currency} className="text-zinc-600" /></span>
          </div>
          <div className="relative">
            <button onClick={() => setInfoOpen(!infoOpen)}>
              <HelpCircle className="h-3.5 w-3.5 text-zinc-300 hover:text-zinc-500" />
            </button>
            <Popover open={infoOpen} onClose={() => setInfoOpen(false)} className="top-6 right-0 w-72">
              <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line pr-4">
                {txt(t.portfolio.totalPnlInfo)}
              </p>
            </Popover>
          </div>
        </div>
      </div>
    </Card>
  );
}
