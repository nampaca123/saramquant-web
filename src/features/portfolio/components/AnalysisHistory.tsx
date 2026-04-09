'use client';

import { useState, useEffect, useCallback, type ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { History, ChevronDown, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { portfolioApi } from '@/lib/api';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
import type { PortfolioLlmHistory } from '../types/portfolio.types';

const PRESET_LABELS: Record<string, { ko: string; en: string }> = {
  diagnosis: { ko: '종합 진단', en: 'Full checkup' },
  reduce_risk: { ko: '리스크 줄이기', en: 'Lower risk' },
  outlook: { ko: '시장 전망', en: "What's ahead" },
  aggressive: { ko: '공격적 전략', en: 'Go bold' },
  financial_weakness: { ko: '재무 취약점', en: 'Weak spots' },
};

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

interface AnalysisHistoryProps {
  portfolioId: number;
  refreshKey?: number;
  embedded?: boolean;
}

export function AnalysisHistory({ portfolioId, refreshKey, embedded }: AnalysisHistoryProps) {
  const txt = useText();
  const { language } = useLanguage();
  const [items, setItems] = useState<PortfolioLlmHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await portfolioApi.llmHistory(portfolioId);
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);

  useEffect(() => { fetch(); }, [fetch, refreshKey]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return language === 'ko'
      ? `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const presetLabel = (key: string) => {
    const p = PRESET_LABELS[key];
    return p ? p[language] : key;
  };

  const content = loading ? (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
    </div>
  ) : items.length === 0 ? (
    <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-center">
      <FileText className="h-6 w-6 text-zinc-300 mx-auto mb-2" />
      <p className="text-sm text-zinc-500">{txt(t.portfolio.historyEmpty)}</p>
      <p className="text-xs text-zinc-400 mt-1">{txt(t.portfolio.historyEmptySub)}</p>
    </div>
  ) : (
    <div className="space-y-2">
      {items.map((item) => {
        const open = expandedId === item.id;
        return (
          <div key={item.id} className="rounded-lg border border-zinc-100 overflow-hidden transition-all">
            <button
              onClick={() => setExpandedId(open ? null : item.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0 inline-flex items-center rounded-full bg-gold-wash px-2 py-0.5 text-[11px] font-medium text-gold">
                  {presetLabel(item.preset)}
                </span>
                <span className="text-xs text-zinc-400 truncate">{formatDate(item.created_at)}</span>
              </div>
              <ChevronDown className={cn(
                'h-3.5 w-3.5 text-zinc-400 shrink-0 transition-transform',
                open && 'rotate-180',
              )} />
            </button>
            {open && (
              <div className="px-3 pb-3 animate-fade-in">
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 max-h-[360px] overflow-y-auto">
                  <ReactMarkdown components={mdComponents}>{item.analysis}</ReactMarkdown>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-zinc-300">{item.model}</span>
                  <span className="text-[10px] text-zinc-300">·</span>
                  <span className="text-[10px] text-zinc-300">{item.lang.toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  if (embedded) return content;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        <History className="h-4 w-4 text-gold" />
        <h3 className="text-sm font-bold text-zinc-900">{txt(t.portfolio.historyTitle)}</h3>
      </div>
      <p className="text-xs text-zinc-500 mb-3">{txt(t.portfolio.historyDesc)}</p>
      {content}
    </Card>
  );
}
