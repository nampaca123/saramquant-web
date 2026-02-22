'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Disclaimer } from '@/components/common/Disclaimer';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/providers/AuthProvider';
import { llmApi } from '@/lib/api';
import { cn } from '@/lib/utils/cn';
import { t } from '@/lib/i18n/translations';
import type { CachedLlmAnalysis } from '../types/stock.types';
import type { LocalizedText } from '@/types';

interface AiAnalysisSectionProps {
  symbol: string;
  market: string;
  cachedAnalysis: CachedLlmAnalysis | null;
}

const PRESETS: { key: string; label: LocalizedText; subtitle: LocalizedText }[] = [
  { key: 'summary', label: t.stock.presetSummary, subtitle: { ko: '핵심만 간단하게', en: 'Key points briefly' } },
  { key: 'beginner', label: t.stock.presetBeginner, subtitle: { ko: '처음 투자하시는 분을 위해', en: 'For first-time investors' } },
  { key: 'risk', label: t.stock.presetRisk, subtitle: { ko: '위험 요소를 집중 분석', en: 'Focus on risk factors' } },
  { key: 'financial', label: t.stock.presetFinancial, subtitle: { ko: '회사의 돈 상태를 분석', en: 'Analyze company finances' } },
];

export function AiAnalysisSection({ symbol, market, cachedAnalysis }: AiAnalysisSectionProps) {
  const txt = useText();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [preset, setPreset] = useState<string>(PRESETS[0].key);
  const [result, setResult] = useState(cachedAnalysis?.analysis ?? '');
  const [disclaimer, setDisclaimer] = useState(cachedAnalysis ? '' : '');
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);

  useEffect(() => {
    if (user) {
      llmApi.usage().then(setUsage).catch(() => {});
    }
  }, [user]);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await llmApi.analyzeStock({ symbol, market, preset, lang: language });
      setResult(res.analysis);
      setDisclaimer(res.disclaimer);
      if (usage) setUsage({ ...usage, used: usage.used + 1 });
    } catch {
      setResult(txt(t.common.error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-bold text-zinc-900">{txt(t.stock.aiAnalysis)}</h3>
        </div>
        {usage && (
          <span className="text-xs font-mono text-zinc-400">
            {usage.used}/{usage.limit} {txt(t.stock.aiUsage)}
          </span>
        )}
      </div>

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

      {!result ? (
        <div className="rounded-lg bg-zinc-50 p-6 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-zinc-300 mb-2" />
          <p className="text-sm text-zinc-600 mb-3">
            {txt({ ko: 'AI가 이 종목의 리스크를 쉬운 말로 분석해드려요', en: 'AI analyzes this stock\'s risk in plain language' })}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAnalyze}
            disabled={!user || loading}
          >
            {loading ? txt(t.common.loading) : txt(t.stock.requestAnalysis)}
          </Button>
        </div>
      ) : (
        <div>
          <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap mb-3">
            {result}
          </div>
          <div className="flex items-center justify-between">
            {disclaimer && <Disclaimer text={disclaimer} variant="inline" />}
            <Button variant="ghost" size="sm" onClick={handleAnalyze} disabled={loading}>
              {loading ? txt(t.common.loading) : txt(t.stock.requestAnalysis)}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
