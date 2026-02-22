'use client';

import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FlagIcon } from '@/components/common/FlagIcon';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { formatCurrency } from '@/lib/utils/format-currency';
import { formatPercent } from '@/lib/utils/format-percent';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
import type { Market } from '@/types';
import type { StockHeader as StockHeaderData, StockRiskBadge } from '../types/stock.types';

interface StockHeaderProps {
  header: StockHeaderData;
  riskBadge: StockRiskBadge | null;
  onAddPortfolio: () => void;
}

export function StockHeader({ header, riskBadge, onAddPortfolio }: StockHeaderProps) {
  const txt = useText();
  const { language } = useLanguage();
  const currency = header.market.startsWith('US') ? 'USD' : 'KRW';
  const changeColor = header.priceChangePercent != null
    ? header.priceChangePercent > 0 ? 'text-up' : header.priceChangePercent < 0 ? 'text-down' : 'text-zinc-500'
    : 'text-zinc-500';

  return (
    <Card className="border-b border-zinc-100">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-start">
        <div>
          <div className="flex items-center gap-2">
            <FlagIcon market={header.market as Market} size={20} />
            <h1 className="text-xl font-bold text-zinc-900">{header.name}</h1>
            {riskBadge && <Badge tier={riskBadge.summaryTier} language={language} />}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-mono text-zinc-400">{header.symbol}</span>
            <span className="text-xs text-zinc-400">{header.market}</span>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1">
          <span className="text-2xl font-mono font-bold text-zinc-900">
            {formatCurrency(header.latestClose, currency)}
          </span>
          <span className={cn('text-sm font-mono', changeColor)}>
            {formatPercent(header.priceChangePercent)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-zinc-400">
          {txt(t.stock.registrationPrompt)}
        </p>
        <Button variant="secondary" size="sm" onClick={onAddPortfolio}>
          <Plus className="h-4 w-4 mr-1" />
          {txt(t.stock.addToPortfolio)}
        </Button>
      </div>
    </Card>
  );
}
