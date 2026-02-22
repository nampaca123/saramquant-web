import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined';
}

export function Card({ variant = 'default', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-4',
        variant === 'default' && 'bg-white shadow-sm border border-zinc-100',
        variant === 'outlined' && 'border border-zinc-200',
        className,
      )}
      {...props}
    />
  );
}
