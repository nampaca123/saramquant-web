import { type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  displayValue?: string;
}

export function Slider({ label, displayValue, className, ...props }: SliderProps) {
  return (
    <div className="flex flex-col gap-1">
      {(label || displayValue) && (
        <div className="flex items-center justify-between text-xs text-zinc-500">
          {label && <span>{label}</span>}
          {displayValue && <span className="font-mono">{displayValue}</span>}
        </div>
      )}
      <input
        type="range"
        className={cn('w-full accent-gold', className)}
        {...props}
      />
    </div>
  );
}
