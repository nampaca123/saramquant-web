import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50',
          error && 'border-warning focus:border-warning focus:ring-warning',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-warning">{error}</p>}
    </div>
  ),
);

Input.displayName = 'Input';
