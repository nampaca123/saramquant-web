export function formatIndicator(value: number | null, decimals = 2): string {
  if (value == null) return '—';
  return value.toFixed(decimals);
}
