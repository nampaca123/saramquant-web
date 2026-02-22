interface FormatPercentOptions {
  sign?: boolean;
  decimals?: number;
}

export function formatPercent(value: number | null, opts: FormatPercentOptions = {}): string {
  if (value == null) return '—';

  const { sign = true, decimals = 2 } = opts;
  const formatted = Math.abs(value).toFixed(decimals);
  const prefix = sign ? (value > 0 ? '+' : value < 0 ? '-' : '') : value < 0 ? '-' : '';
  return `${prefix}${formatted}%`;
}
