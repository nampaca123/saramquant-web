import { cn } from '@/lib/utils/cn';
import type { RiskTier, Language } from '@/types';
import { TIER_CONFIG } from '@/constants/risk-tier.constants';

interface BadgeProps {
  tier: RiskTier;
  language: Language;
  className?: string;
}

export function Badge({ tier, language, className }: BadgeProps) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        cfg.bg,
        cfg.color,
        className,
      )}
    >
      {cfg.label[language]}
    </span>
  );
}
