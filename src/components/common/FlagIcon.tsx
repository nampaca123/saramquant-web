import { CircleFlag } from 'react-circle-flags';
import type { Market, MarketGroup } from '@/types';

const MARKET_TO_COUNTRY: Record<Market | MarketGroup, string> = {
  KR_KOSPI: 'kr',
  KR_KOSDAQ: 'kr',
  US_NYSE: 'us',
  US_NASDAQ: 'us',
  KR: 'kr',
  US: 'us',
};

interface FlagIconProps {
  market: Market | MarketGroup;
  size?: number;
  className?: string;
}

export function FlagIcon({ market, size = 20, className }: FlagIconProps) {
  const code = MARKET_TO_COUNTRY[market];
  return <CircleFlag countryCode={code} height={size} width={size} className={className} />;
}
