'use client';

import { useState, useEffect, type ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { Sparkles, MessageSquareText, HelpCircle, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Disclaimer } from '@/components/common/Disclaimer';
import { AnalysisLoadingOverlay } from '@/components/common/AnalysisLoadingOverlay';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/providers/AuthProvider';
import { llmApi } from '@/lib/api';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
import type { CachedLlmAnalysis } from '../types/stock.types';
import type { LocalizedText } from '@/types';

const mdComponents: Components = {
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="text-[15px] font-bold text-zinc-900 mt-5 mb-2 first:mt-0 border-b border-zinc-100 pb-1.5" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="text-sm font-semibold text-zinc-800 mt-3.5 mb-1.5" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="text-[13px] leading-[1.75] text-zinc-600 my-1.5" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-zinc-800" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="my-1.5 space-y-1 pl-1" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li className="flex gap-2 text-[13px] leading-[1.75] text-zinc-600">
      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/60" />
      <span>{props.children}</span>
    </li>
  ),
  hr: () => <hr className="my-3.5 border-zinc-100" />,
};

const AI_LOADING_STAGES = [t.stock.aiStage1, t.stock.aiStage2, t.stock.aiStage3, t.stock.aiStage4];

interface AiAnalysisSectionProps {
  symbol: string;
  market: string;
  cachedAnalysis: CachedLlmAnalysis | null;
}

const PRESETS: { key: string; label: LocalizedText; subtitle: LocalizedText }[] = [
  { key: 'summary', label: t.stock.presetSummary, subtitle: t.stock.presetSubSummary },
  { key: 'beginner', label: t.stock.presetBeginner, subtitle: t.stock.presetSubBeginner },
  { key: 'risk', label: t.stock.presetRisk, subtitle: t.stock.presetSubRisk },
  { key: 'financial', label: t.stock.presetFinancial, subtitle: t.stock.presetSubFinancial },
];

interface PresetResult { analysis: string; disclaimer: string }

export function AiAnalysisSection({ symbol, market, cachedAnalysis }: AiAnalysisSectionProps) {
  const txt = useText();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [preset, setPreset] = useState<string>(PRESETS[0].key);
  const [results, setResults] = useState<Record<string, PresetResult>>(() => {
    if (!cachedAnalysis) return {};
    return { [cachedAnalysis.preset]: { analysis: cachedAnalysis.analysis, disclaimer: '' } };
  });
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const currentResult = results[preset];

  useEffect(() => {
    if (user) {
      llmApi.usage().then(setUsage).catch(() => {});
    }
  }, [user]);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await llmApi.analyzeStock({ symbol, market, preset, lang: language });
      setResults((prev) => ({ ...prev, [preset]: { analysis: res.analysis, disclaimer: res.disclaimer } }));
      if (usage) setUsage({ ...usage, used: usage.used + 1 });
    } catch {
      setResults((prev) => ({ ...prev, [preset]: { analysis: txt(t.common.error), disclaimer: '' } }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-bold text-zinc-900">{txt(t.stock.aiAnalysis)}</h3>
        </div>
        <div className="flex items-center gap-3">
          {usage && (
            <span className="text-xs font-mono text-zinc-400">
              {usage.used}/{usage.limit} {txt(t.stock.aiUsage)}
            </span>
          )}
          <div className="relative">
            <button
              onClick={() => setHelpOpen(!helpOpen)}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              {txt(t.stock.aiHowItWorks)}
            </button>
            {helpOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute z-50 right-0 top-7 w-72 rounded-xl bg-white p-3 shadow-lg border border-zinc-100 animate-fade-in"
              >
                <button
                  onClick={() => setHelpOpen(false)}
                  className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-3 w-3" />
                </button>
                <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">
                  {txt(t.stock.aiHowItWorksDetail)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-500 mb-3">
        {txt(t.stock.aiDesc)}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPreset(p.key)}
            className={cn(
              'rounded-lg border px-3 py-2 text-left transition-all',
              preset === p.key
                ? 'border-gold bg-gold-wash'
                : 'border-zinc-100 hover:border-zinc-200',
            )}
          >
            <span className={cn('text-sm font-medium', preset === p.key ? 'text-gold' : 'text-zinc-700')}>
              {txt(p.label)}
            </span>
            <span className="block text-xs text-zinc-400 mt-0.5">{txt(p.subtitle)}</span>
          </button>
        ))}
      </div>

      <div className="mb-3">
        <Button
          variant="primary"
          size="sm"
          onClick={handleAnalyze}
          disabled={!user || loading}
          className="w-full"
        >
          {txt(t.stock.requestAnalysis)}
        </Button>
      </div>

      {loading ? (
        <AnalysisLoadingOverlay
          icon={<Sparkles className="h-5 w-5 text-gold" />}
          stages={AI_LOADING_STAGES}
          maxWaitText={t.stock.aiMaxWait}
        />
      ) : !currentResult ? (
        <AnalysisPreview txt={txt} preset={preset} />
      ) : (
        <div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 mb-3 max-h-[420px] overflow-y-auto">
            <ReactMarkdown components={mdComponents}>
              {currentResult.analysis}
            </ReactMarkdown>
          </div>
          {currentResult.disclaimer && <Disclaimer text={currentResult.disclaimer} variant="inline" />}
        </div>
      )}
    </Card>
  );
}

function AnalysisPreview({ txt, preset }: { txt: (v: any) => string; preset: string }) {
  const presetObj = PRESETS.find((p) => p.key === preset);
  const presetLabel = presetObj ? txt(presetObj.label) : '';

  return (
    <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-full bg-gold-wash p-2">
          <MessageSquareText className="h-4 w-4 text-gold" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">AI</span>
            <span className="text-[10px] text-zinc-400">·</span>
            <span className="text-[10px] text-zinc-400">{presetLabel}</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-4/5 rounded bg-zinc-200/60" />
            <div className="h-3 w-3/5 rounded bg-zinc-200/60" />
            <div className="h-3 w-full rounded bg-zinc-200/60" />
            <div className="h-3 w-2/3 rounded bg-zinc-200/60" />
          </div>
          <p className="text-[11px] text-zinc-400 mt-3">
            {txt(t.stock.aiPreview)}
          </p>
        </div>
      </div>
    </div>
  );
}
