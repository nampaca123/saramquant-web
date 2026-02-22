'use client';

import { cn } from '@/lib/utils/cn';
import type { MarketGroup } from '@/types';

interface PortfolioTabSelectorProps {
  active: MarketGroup;
  onChange: (tab: MarketGroup) => void;
}

const TABS: MarketGroup[] = ['KR', 'US'];

export function PortfolioTabSelector({ active, onChange }: PortfolioTabSelectorProps) {
  return (
    <div className="flex gap-1">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm transition-colors',
            active === tab
              ? 'bg-gold text-white font-medium'
              : 'text-zinc-500 hover:text-zinc-700',
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
