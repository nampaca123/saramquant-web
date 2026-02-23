export function formatCurrency(value: number | null, currency: 'KRW' | 'USD'): string {
  if (value == null) return '—';
  const amount = formatAmount(value, currency);
  return currency === 'KRW' ? `${amount}원` : `$${amount}`;
}

export function currencyPrefix(currency: 'KRW' | 'USD'): string {
  return currency === 'KRW' ? '' : '$';
}

export function currencySuffix(currency: 'KRW' | 'USD'): string {
  return currency === 'KRW' ? '원' : '';
}

export function formatAmount(value: number | null, currency: 'KRW' | 'USD'): string {
  if (value == null) return '—';
  if (currency === 'KRW') return Math.round(value).toLocaleString('ko-KR');
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
