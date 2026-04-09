'use client';

import { useState, useEffect, useRef, useCallback, type ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { Sparkles, HelpCircle, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/providers/AuthProvider';
import { llmApi } from '@/lib/api';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
import type { SSEError } from '@/lib/api/sse';
import type { MarketGroup } from '@/types';
import type { RecommendationDirection, RecommendationResult } from '../types/recommendation.types';

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

type Phase = 'idle' | 'loading' | 'result' | 'error';

interface RecommendationSectionProps {
  marketGroup: MarketGroup;
  hasHoldings: boolean;
  onSuccess?: () => void;
}

export function RecommendationSection({ marketGroup, hasHoldings, onSuccess }: RecommendationSectionProps) {
  const txt = useText();
  const { language } = useLanguage();
  const { user } = useAuth();

  const [direction, setDirection] = useState<RecommendationDirection>('IMPROVE');
  const [phase, setPhase] = useState<Phase>('idle');
  const [progressMsg, setProgressMsg] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<SSEError | null>(null);
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (user) llmApi.usage().then(setUsage).catch(() => {});
  }, [user]);

  useEffect(() => () => {
    abortRef.current?.abort();
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleRecommend = useCallback(() => {
    setPhase('loading');
    setProgressMsg('');
    setElapsed(0);
    setResult(null);
    setError(null);

    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);

    abortRef.current = llmApi.recommendPortfolio(
      { marketGroup, lang: language, direction },
      {
        onProgress: (_step, message) => setProgressMsg(message),
        onResult: (data) => {
          setResult(data as RecommendationResult);
          setPhase('result');
          if (usage) setUsage({ ...usage, used: usage.used + 3 });
          onSuccess?.();
        },
        onError: (err) => {
          setError(err);
          setPhase('error');
        },
        onComplete: () => {
          if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        },
      },
    );
  }, [marketGroup, language, direction, usage, onSuccess]);

  const presets: { key: RecommendationDirection; label: typeof t.portfolio.recImprove; desc: typeof t.portfolio.recImproveDesc }[] = [
    {
      key: 'IMPROVE',
      label: hasHoldings ? t.portfolio.recImprove : t.portfolio.recImproveEmpty,
      desc: hasHoldings ? t.portfolio.recImproveDesc : t.portfolio.recImproveDescEmpty,
    },
    { key: 'CONSERVATIVE', label: t.portfolio.recConservative, desc: t.portfolio.recConservativeDesc },
    { key: 'GROWTH', label: t.portfolio.recGrowth, desc: t.portfolio.recGrowthDesc },
  ];

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-bold text-zinc-900">{txt(t.portfolio.recTitle)}</h3>
        </div>
        <div className="flex items-center gap-3">
          {usage && (
            <span className="text-xs font-mono text-zinc-400">
              {usage.used}/{usage.limit}
            </span>
          )}
          <div className="relative">
            <button
              onClick={() => setHelpOpen(!helpOpen)}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              {txt(t.portfolio.recHowItWorks)}
            </button>
            {helpOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute z-50 right-0 top-7 w-72 rounded-xl bg-white p-3 shadow-lg border border-zinc-100 animate-fade-in"
              >
                <button onClick={() => setHelpOpen(false)} className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-600">
                  <X className="h-3 w-3" />
                </button>
                <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">
                  {txt(t.portfolio.recHowItWorksDetail)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-500 mb-3">
        {txt(hasHoldings ? t.portfolio.recDesc : t.portfolio.recDescEmpty)}
      </p>

      {/* Presets */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {presets.map((p) => (
          <button
            key={p.key}
            onClick={() => setDirection(p.key)}
            disabled={phase === 'loading'}
            className={cn(
              'rounded-lg border px-3 py-2 text-left transition-all',
              direction === p.key ? 'border-gold bg-gold-wash' : 'border-zinc-100 hover:border-zinc-200',
              phase === 'loading' && 'opacity-50 pointer-events-none',
            )}
          >
            <span className={cn('text-sm font-medium', direction === p.key ? 'text-gold' : 'text-zinc-700')}>
              {txt(p.label)}
            </span>
            <span className="block text-xs text-zinc-400 mt-0.5 line-clamp-2">{txt(p.desc)}</span>
          </button>
        ))}
      </div>

      {/* Run button */}
      <div className="mb-3 flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleRecommend}
          disabled={!user || phase === 'loading'}
          className="flex-1"
        >
          {txt(t.portfolio.recBtn)}
        </Button>
        <span className="text-xs text-zinc-400">{txt(t.portfolio.recCost)}</span>
      </div>

      {/* Output */}
      {phase === 'loading' && <LoadingState progressMsg={progressMsg} elapsed={elapsed} />}
      {phase === 'idle' && <IdleState txt={txt} direction={direction} presets={presets} />}
      {phase === 'error' && error && <ErrorState error={error} txt={txt} onRetry={handleRecommend} />}
      {phase === 'result' && result && <ResultView result={result} txt={txt} />}
    </Card>
  );
}

/* ── Sub-components ── */

function LoadingState({ progressMsg, elapsed }: { progressMsg: string; elapsed: number }) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-gradient-to-b from-zinc-50/80 to-white p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative flex items-center justify-center h-10 w-10">
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/10" />
          <span className="relative animate-pulse"><Sparkles className="h-5 w-5 text-gold" /></span>
        </div>
        <div className="h-5 flex items-center">
          <p className="text-sm font-medium text-zinc-600 animate-fade-in">{progressMsg || 'AI가 분석을 시작하고 있어요...'}</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: `${i * 150}ms`, animationDuration: '1s' }} />
          ))}
        </div>
        <p className="text-xs font-mono text-zinc-400">{elapsed}s</p>
      </div>
    </div>
  );
}

function IdleState({ txt, direction, presets }: {
  txt: (v: { ko: string; en: string }) => string;
  direction: RecommendationDirection;
  presets: { key: RecommendationDirection; label: { ko: string; en: string } }[];
}) {
  const label = presets.find((p) => p.key === direction);
  return (
    <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-full bg-gold-wash p-2">
          <Sparkles className="h-4 w-4 text-gold" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">AI</span>
            <span className="text-[10px] text-zinc-400">·</span>
            <span className="text-[10px] text-zinc-400">{label ? txt(label.label) : ''}</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-4/5 rounded bg-zinc-200/60" />
            <div className="h-3 w-3/5 rounded bg-zinc-200/60" />
            <div className="h-3 w-full rounded bg-zinc-200/60" />
          </div>
          <p className="text-[11px] text-zinc-400 mt-3">{txt(t.portfolio.recPreview)}</p>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, txt, onRetry }: {
  error: SSEError;
  txt: (v: { ko: string; en: string }) => string;
  onRetry: () => void;
}) {
  const messageMap: Record<SSEError['code'], typeof t.portfolio.recErrorTemp> = {
    AUTH_EXPIRED: t.portfolio.recErrorAuth,
    CREDIT_EXCEEDED: t.portfolio.recErrorCredit,
    RATE_LIMITED: t.portfolio.recErrorTemp,
    NETWORK_ERROR: t.portfolio.recErrorTemp,
    TIMEOUT: t.portfolio.recErrorTemp,
    SERVER_ERROR: t.portfolio.recErrorServer,
  };

  return (
    <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-700">{txt(messageMap[error.code])}</p>
          {error.retryable && (
            <div className="mt-3 flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={onRetry}>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                {txt(t.common.retry)}
              </Button>
              <span className="text-[11px] text-zinc-400">{txt(t.portfolio.recRetryCost)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ACTION_STYLES = {
  ADD: { bg: 'bg-stable/10', text: 'text-stable', label: t.portfolio.recActionAdd },
  KEEP: { bg: 'bg-blue-50', text: 'text-blue-600', label: t.portfolio.recActionKeep },
  REMOVE: { bg: 'bg-warning/10', text: 'text-warning', label: t.portfolio.recActionRemove },
} as const;

function ResultView({ result, txt }: {
  result: RecommendationResult;
  txt: (v: { ko: string; en: string }) => string;
}) {
  return (
    <div className="space-y-4">
      {result.currentAssessment && (
        <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
          <h4 className="text-xs font-semibold text-zinc-500 mb-1.5">{txt(t.portfolio.recAssessment)}</h4>
          <p className="text-sm text-zinc-700 leading-relaxed">{result.currentAssessment}</p>
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold text-zinc-500 mb-2">{txt(t.portfolio.recStocks)}</h4>
        <div className="space-y-2">
          {result.stocks.map((s) => {
            const style = ACTION_STYLES[s.action] ?? ACTION_STYLES.ADD;
            return (
              <div key={`${s.stockId}-${s.symbol}`} className="rounded-lg border border-zinc-100 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium', style.bg, style.text)}>
                      {txt(style.label)}
                    </span>
                    <span className="text-sm font-semibold text-zinc-900">{s.name}</span>
                    <span className="text-xs text-zinc-400">{s.symbol}</span>
                  </div>
                  <span className="text-sm font-mono font-medium text-zinc-700">
                    {s.allocationPercent}%
                  </span>
                </div>
                {s.sector && <p className="text-[11px] text-zinc-400 mb-1">{s.sector}</p>}
                <p className="text-xs text-zinc-600 leading-relaxed">{s.reasoning}</p>
              </div>
            );
          })}
        </div>
      </div>

      {result.overallReasoning && (
        <div>
          <h4 className="text-xs font-semibold text-zinc-500 mb-2">{txt(t.portfolio.recOverall)}</h4>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 max-h-[360px] overflow-y-auto">
            <ReactMarkdown components={mdComponents}>{result.overallReasoning}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-[10px] text-zinc-300">{result.model}</span>
        <span className="text-[10px] text-zinc-300">·</span>
        <span className="text-[10px] text-zinc-300">{result.toolCallCount} tool calls</span>
      </div>
    </div>
  );
}
