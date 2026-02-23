'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useText } from '@/lib/i18n/use-text';
import type { LocalizedText } from '@/types';

interface AnalysisLoadingOverlayProps {
  icon: ReactNode;
  stages: LocalizedText[];
  maxWaitText: LocalizedText;
}

export function AnalysisLoadingOverlay({ icon, stages, maxWaitText }: AnalysisLoadingOverlayProps) {
  const txt = useText();
  const [stageIdx, setStageIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setStageIdx((i) => (i + 1) % stages.length), 3500);
    return () => clearInterval(id);
  }, [stages.length]);

  return (
    <div className="rounded-xl border border-zinc-100 bg-gradient-to-b from-zinc-50/80 to-white p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative flex items-center justify-center h-10 w-10">
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/10" />
          <span className="relative animate-pulse">{icon}</span>
        </div>

        <div className="h-5 flex items-center">
          <p key={stageIdx} className="text-sm font-medium text-zinc-600 animate-fade-in">
            {txt(stages[stageIdx])}
          </p>
        </div>

        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-gold animate-bounce"
              style={{ animationDelay: `${i * 150}ms`, animationDuration: '1s' }}
            />
          ))}
        </div>

        <div className="space-y-0.5">
          <p className="text-xs font-mono text-zinc-400">{elapsed}s</p>
          <p className="text-[11px] text-zinc-400">{txt(maxWaitText)}</p>
        </div>
      </div>
    </div>
  );
}
