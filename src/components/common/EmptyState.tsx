import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import type { LocalizedText } from '@/types';
import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  message: LocalizedText | string;
  language: 'ko' | 'en';
  icon?: LucideIcon;
  description?: LocalizedText | string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ message, language, icon: Icon = Inbox, description, action, className }: EmptyStateProps) {
  const text = typeof message === 'string' ? message : message[language];
  const desc = description
    ? typeof description === 'string' ? description : description[language]
    : undefined;

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 mb-3">
        <Icon className="h-6 w-6 text-zinc-400" />
      </div>
      <p className="text-sm font-medium text-zinc-600">{text}</p>
      {desc && <p className="mt-1 text-xs text-zinc-400 max-w-xs">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
