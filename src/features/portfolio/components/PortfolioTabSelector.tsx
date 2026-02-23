'use client';

import { FlagIcon } from '@/components/common/FlagIcon';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
import type { MarketGroup } from '@/types';
import type { LocalizedText } from '@/types';

interface PortfolioTabSelectorProps {
  active: MarketGroup;
  onChange: (tab: MarketGroup) => void;
}

const TABS: { value: MarketGroup; label: LocalizedText }[] = [
  { value: 'KR', label: t.portfolio.marketKR },
  { value: 'US', label: t.portfolio.marketUS },
];

export function PortfolioTabSelector({ active, onChange }: PortfolioTabSelectorProps) {
  const txt = useText();

  return (
    <div className="flex rounded-lg border border-zinc-200 p-0.5">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-all',
            active === tab.value
              ? 'bg-gold text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700',
          )}
        >
          <FlagIcon market={tab.value} size={14} />
          {txt(tab.label)}
        </button>
      ))}
    </div>
  );
}
