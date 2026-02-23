'use client';

import { currencySymbol, formatAmount } from '@/lib/utils/format-currency';
import { cn } from '@/lib/utils/cn';

interface CurrencyValueProps {
  value: number | null;
  currency: 'KRW' | 'USD';
  className?: string;
  sign?: boolean;
}

export function CurrencyValue({ value, currency, className, sign }: CurrencyValueProps) {
  if (value == null) return <span className={className}>—</span>;

  const prefix = sign ? (value > 0 ? '+' : value < 0 ? '-' : '') : (value < 0 ? '-' : '');
  const absValue = Math.abs(value);

  return (
    <span className={cn('font-mono', className)}>
      {prefix}
      <span style={{ fontFamily: 'system-ui, sans-serif' }}>{currencySymbol(currency)}</span>
      {formatAmount(absValue, currency)}
    </span>
  );
}
