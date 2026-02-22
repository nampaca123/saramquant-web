export function formatCurrency(value: number | null, currency: 'KRW' | 'USD'): string {
  if (value == null) return '—';

  if (currency === 'KRW') {
    return `₩${Math.round(value).toLocaleString('ko-KR')}`;
  }
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
