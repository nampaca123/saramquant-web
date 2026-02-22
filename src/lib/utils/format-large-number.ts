export function formatLargeNumber(value: number | null, locale: 'ko' | 'en'): string {
  if (value == null) return '—';

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (locale === 'ko') {
    if (abs >= 1_0000_0000_0000) return `${sign}${(abs / 1_0000_0000_0000).toFixed(1)}조`;
    if (abs >= 1_0000_0000) return `${sign}${(abs / 1_0000_0000).toFixed(0)}억`;
    if (abs >= 1_0000) return `${sign}${(abs / 1_0000).toFixed(0)}만`;
    return `${sign}${Math.round(abs).toLocaleString('ko-KR')}`;
  }

  if (abs >= 1_000_000_000_000) return `${sign}$${(abs / 1_000_000_000_000).toFixed(1)}T`;
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  return `${sign}$${Math.round(abs).toLocaleString('en-US')}`;
}
