'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { llmApi } from '@/lib/api';
import type { LlmUsageResponse } from '@/features/llm';

export function LlmUsageCard() {
  const txt = useText();
  const [usage, setUsage] = useState<LlmUsageResponse | null>(null);

  useEffect(() => {
    llmApi.usage().then(setUsage).catch(() => {});
  }, []);

  if (!usage) return null;

  const pct = Math.min((usage.used / usage.limit) * 100, 100);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-gold" />
        <h3 className="text-sm font-semibold text-zinc-700">{txt(t.settings.llmUsage)}</h3>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <p className="text-xs text-zinc-400">{txt(t.settings.llmUsageToday)}</p>
        <p className="text-sm font-medium text-zinc-700">
          {usage.used} <span className="text-zinc-400">/ {usage.limit}</span>
        </p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-gold transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Card>
  );
}
