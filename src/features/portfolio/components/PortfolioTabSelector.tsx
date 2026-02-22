'use client';

import { FlagIcon } from '@/components/common/FlagIcon';
import { cn } from '@/lib/utils/cn';
import type { MarketGroup } from '@/types';

interface PortfolioTabSelectorProps {
  active: MarketGroup;
  onChange: (tab: MarketGroup) => void;
}

const TABS: { value: MarketGroup; label: string }[] = [
  { value: 'KR', label: 'KR' },
  { value: 'US', label: 'US' },
];

export function PortfolioTabSelector({ active, onChange }: PortfolioTabSelectorProps) {
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
          {tab.label}
        </button>
      ))}
    </div>
  );
}
