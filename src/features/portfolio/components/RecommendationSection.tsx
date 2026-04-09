'use client';

import { useState, useEffect, useRef, useCallback, type ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { Bot, ChevronRight, AlertTriangle, RefreshCw, Wrench, Check, Circle, History, X, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/providers/AuthProvider';
import { llmApi } from '@/lib/api';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
import type { SSEError, ToolCallInfo, ToolResultInfo } from '@/lib/api/sse';
import type { MarketGroup } from '@/types';
import type { RecommendationDirection, RecommendationResult } from '../types/recommendation.types';
import { RecommendationHistory } from './RecommendationHistory';

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
      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300" />
      <span>{props.children}</span>
    </li>
  ),
  hr: () => <hr className="my-3.5 border-zinc-100" />,
};

type Phase = 'idle' | 'loading' | 'result' | 'error';

interface ToolEntry {
  tool: string;
  status: 'running' | 'done';
  summary?: string;
  durationMs?: number;
}

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
  const [thinkingText, setThinkingText] = useState('');
  const [toolEntries, setToolEntries] = useState<ToolEntry[]>([]);
  const [progressMsg, setProgressMsg] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<SSEError | null>(null);
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [recHistoryKey, setRecHistoryKey] = useState(0);

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
    setThinkingText('');
    setToolEntries([]);
    setProgressMsg('');
    setElapsed(0);
    setResult(null);
    setError(null);

    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);

    abortRef.current = llmApi.recommendPortfolio(
      { marketGroup, lang: language, direction },
      {
        onProgress: (_step, message) => setProgressMsg(message),
        onThinking: (text) => setThinkingText((prev) => prev + text),
        onToolCall: (info: ToolCallInfo) => {
          setToolEntries((prev) => [...prev, { tool: info.tool, status: 'running' }]);
          setThinkingText('');
        },
        onToolResult: (info: ToolResultInfo) => {
          setToolEntries((prev) =>
            prev.map((e) =>
              e.tool === info.tool && e.status === 'running'
                ? { ...e, status: 'done' as const, summary: info.summary, durationMs: info.durationMs }
                : e,
            ),
          );
        },
        onResult: (data) => {
          setResult(data as RecommendationResult);
          setPhase('result');
          if (usage) setUsage({ ...usage, used: usage.used + 3 });
          setRecHistoryKey((k) => k + 1);
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

  const presets: { key: RecommendationDirection; label: { ko: string; en: string }; desc: { ko: string; en: string } }[] = [
    {
      key: 'IMPROVE',
      label: hasHoldings ? { ko: '전체 개선', en: 'Improve All' } : { ko: '포트폴리오 구성', en: 'Build Portfolio' },
      desc: hasHoldings ? { ko: 'AI가 전반적으로 개선해요', en: 'AI improves overall' } : { ko: 'AI가 맞춤 구성해요', en: 'AI builds for you' },
    },
    { key: 'CONSERVATIVE', label: { ko: '안정 위주', en: 'Play it Safe' }, desc: { ko: '변동성 줄이기', en: 'Reduce swings' } },
    { key: 'GROWTH', label: { ko: '수익 위주', en: 'Go for Growth' }, desc: { ko: '성장 가능성 위주', en: 'High growth focus' } },
  ];

  return (
    <>
      <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-zinc-900">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">{txt(t.portfolio.recTitle)}</h3>
              <p className="text-[11px] text-zinc-400">{txt(hasHoldings ? t.portfolio.recDesc : t.portfolio.recDescEmpty)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {usage && (
              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full">
                {usage.used}/{usage.limit}
              </span>
            )}
            <button
              onClick={() => setHistoryOpen(true)}
              className="p-1.5 rounded-lg hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600 transition-colors"
              title={txt(t.portfolio.recHistoryTitle)}
            >
              <History className="h-4 w-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setHelpOpen(!helpOpen)}
                className="p-1.5 rounded-lg hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
              {helpOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute z-50 right-0 top-9 w-72 rounded-xl bg-white p-3 shadow-lg border border-zinc-100 animate-fade-in"
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

        <div className="p-5">
          {/* Presets — compact horizontal */}
          <div className="flex gap-2 mb-4">
            {presets.map((p) => (
              <button
                key={p.key}
                onClick={() => setDirection(p.key)}
                disabled={phase === 'loading'}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-left transition-all',
                  direction === p.key
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-100 hover:border-zinc-200 bg-white',
                  phase === 'loading' && 'opacity-50 pointer-events-none',
                )}
              >
                <span className={cn('text-xs font-medium block', direction === p.key ? 'text-white' : 'text-zinc-700')}>
                  {txt(p.label)}
                </span>
                <span className={cn('text-[10px] block mt-0.5', direction === p.key ? 'text-zinc-400' : 'text-zinc-400')}>
                  {txt(p.desc)}
                </span>
              </button>
            ))}
          </div>

          {/* Run button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleRecommend}
            disabled={!user || phase === 'loading'}
            className="w-full mb-4 bg-zinc-900 hover:bg-zinc-800 border-zinc-900"
          >
            <Bot className="h-3.5 w-3.5 mr-1.5" />
            {txt(t.portfolio.recBtn)}
            <span className="ml-auto text-[11px] opacity-60">{txt(t.portfolio.recCost)}</span>
          </Button>

          {/* Main output area */}
          {phase === 'loading' && (
            <AgentWorkspace
              thinkingText={thinkingText}
              toolEntries={toolEntries}
              progressMsg={progressMsg}
              elapsed={elapsed}
              txt={txt}
            />
          )}
          {phase === 'idle' && <IdleState txt={txt} />}
          {phase === 'error' && error && <ErrorState error={error} txt={txt} onRetry={handleRecommend} />}
          {phase === 'result' && result && <ResultView result={result} txt={txt} />}
        </div>
      </div>

      {/* History modal */}
      <Modal open={historyOpen} onClose={() => setHistoryOpen(false)} className="max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-zinc-400" />
            <h3 className="text-sm font-bold text-zinc-900">{txt(t.portfolio.recHistoryTitle)}</h3>
          </div>
          <button onClick={() => setHistoryOpen(false)} className="text-zinc-400 hover:text-zinc-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        <RecommendationHistory marketGroup={marketGroup} refreshKey={recHistoryKey} embedded />
      </Modal>
    </>
  );
}

/* ── Agent workspace — the "working" view ── */

const TOOL_LABELS: Record<string, { ko: string; en: string }> = {
  screen_stocks: { ko: '종목 검색', en: 'Stock screening' },
  get_stock_detail: { ko: '종목 분석', en: 'Stock analysis' },
  get_sector_overview: { ko: '섹터 분석', en: 'Sector overview' },
  evaluate_portfolio: { ko: '리스크 검증', en: 'Risk evaluation' },
  web_search: { ko: '웹 검색', en: 'Web search' },
};

function AgentWorkspace({
  thinkingText,
  toolEntries,
  progressMsg,
  elapsed,
  txt,
}: {
  thinkingText: string;
  toolEntries: ToolEntry[];
  progressMsg: string;
  elapsed: number;
  txt: (v: { ko: string; en: string }) => string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thinkingText, toolEntries]);

  return (
    <div className="rounded-xl border border-zinc-100 overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-50/80 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-medium text-zinc-600">{txt(t.portfolio.recThinkingLabel)}</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 tabular-nums">{elapsed}s</span>
      </div>

      {/* Scrollable workspace */}
      <div ref={scrollRef} className="max-h-[300px] overflow-y-auto p-4 space-y-2.5 bg-white">
        {/* Tool step entries */}
        {toolEntries.map((entry, i) => (
          <div
            key={`${entry.tool}-${i}`}
            className={cn(
              'flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs transition-all',
              entry.status === 'done' ? 'bg-zinc-50' : 'bg-zinc-50 border border-zinc-100',
            )}
          >
            {entry.status === 'running' ? (
              <div className="mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin shrink-0" />
            ) : (
              <Check className="mt-0.5 h-3.5 w-3.5 text-emerald-500 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={cn('font-medium', entry.status === 'done' ? 'text-zinc-500' : 'text-zinc-700')}>
                  {txt(TOOL_LABELS[entry.tool] ?? { ko: entry.tool, en: entry.tool })}
                </span>
                {entry.status === 'done' && entry.durationMs != null && (
                  <span className="text-[10px] text-zinc-400 ml-2">{(entry.durationMs / 1000).toFixed(1)}s</span>
                )}
              </div>
              {entry.status === 'done' && entry.summary && (
                <span className="text-[11px] text-zinc-400 block mt-0.5">{entry.summary}</span>
              )}
            </div>
          </div>
        ))}

        {/* Progress message */}
        {progressMsg && !thinkingText && (
          <p className="text-[11px] text-zinc-400 px-1">{progressMsg}</p>
        )}

        {/* Thinking text stream */}
        {thinkingText && (
          <div className="px-1">
            <p className="text-[12px] leading-[1.75] text-zinc-500 whitespace-pre-wrap break-words">
              {thinkingText}
              <span className="inline-block w-1 h-3.5 bg-zinc-400/50 animate-pulse ml-0.5 -mb-0.5 rounded-sm" />
            </p>
          </div>
        )}

        {/* Empty state while waiting for first event */}
        {toolEntries.length === 0 && !thinkingText && !progressMsg && (
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 px-1">
            <div className="h-3 w-3 rounded-full border-2 border-zinc-300 border-t-zinc-500 animate-spin" />
            <span>{txt({ ko: '에이전트 시작 중...', en: 'Starting agent...' })}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function IdleState({ txt }: { txt: (v: { ko: string; en: string }) => string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/30 p-5">
      <div className="flex items-start gap-3">
        <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-zinc-100">
          <Bot className="h-4 w-4 text-zinc-400" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">Agent</span>
            <Circle className="h-1 w-1 fill-zinc-300 text-zinc-300" />
            <span className="text-[10px] text-zinc-400">{txt({ ko: '대기 중', en: 'Idle' })}</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2.5 w-4/5 rounded bg-zinc-100" />
            <div className="h-2.5 w-3/5 rounded bg-zinc-100" />
            <div className="h-2.5 w-full rounded bg-zinc-100" />
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
  const messageMap: Record<SSEError['code'], { ko: string; en: string }> = {
    AUTH_EXPIRED: t.portfolio.recErrorAuth,
    CREDIT_EXCEEDED: t.portfolio.recErrorCredit,
    RATE_LIMITED: t.portfolio.recErrorTemp,
    NETWORK_ERROR: t.portfolio.recErrorTemp,
    TIMEOUT: t.portfolio.recErrorTemp,
    SERVER_ERROR: t.portfolio.recErrorServer,
  };

  return (
    <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
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
  ADD: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: t.portfolio.recActionAdd },
  KEEP: { bg: 'bg-blue-50', text: 'text-blue-600', label: t.portfolio.recActionKeep },
  REMOVE: { bg: 'bg-orange-50', text: 'text-orange-600', label: t.portfolio.recActionRemove },
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
                  <span className="text-sm font-mono font-medium text-zinc-700">{s.allocationPercent}%</span>
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
        <span className="text-[10px] text-zinc-300">{result.toolCallCount} tools</span>
      </div>
    </div>
  );
}
