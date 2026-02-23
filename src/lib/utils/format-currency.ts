export function formatCurrency(value: number | null, currency: 'KRW' | 'USD'): string {
  if (value == null) return '—';
  return `${currencySymbol(currency)}${formatAmount(value, currency)}`;
}

export function currencySymbol(currency: 'KRW' | 'USD'): string {
  return currency === 'KRW' ? '₩' : '$';
}

export function formatAmount(value: number | null, currency: 'KRW' | 'USD'): string {
  if (value == null) return '—';
  if (currency === 'KRW') return Math.round(value).toLocaleString('ko-KR');
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
