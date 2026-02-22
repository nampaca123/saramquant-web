import type { LocalizedText, RiskTier } from '@/types';

interface TierConfig {
  color: string;
  bg: string;
  label: LocalizedText;
}

export const TIER_CONFIG: Record<RiskTier, TierConfig> = {
  STABLE: {
    color: 'text-stable',
    bg: 'bg-stable-bg',
    label: { ko: '안정', en: 'Stable' },
  },
  CAUTION: {
    color: 'text-caution',
    bg: 'bg-caution-bg',
    label: { ko: '주의', en: 'Caution' },
  },
  WARNING: {
    color: 'text-warning',
    bg: 'bg-warning-bg',
    label: { ko: '경고', en: 'Warning' },
  },
};
