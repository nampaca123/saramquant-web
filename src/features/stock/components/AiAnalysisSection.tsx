'use client';

import { useState, useEffect } from 'react';
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

interface AiAnalysisSectionProps {
  symbol: string;
  market: string;
  cachedAnalysis: CachedLlmAnalysis | null;
}

const PRESETS = [
  { key: 'summary', label: t.stock.presetSummary },
  { key: 'beginner', label: t.stock.presetBeginner },
  { key: 'risk', label: t.stock.presetRisk },
  { key: 'financial', label: t.stock.presetFinancial },
] as const;

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
        <h3 className="text-lg font-bold text-zinc-900">{txt(t.stock.aiAnalysis)}</h3>
        {usage && (
          <span className="text-xs font-mono text-zinc-400">
            {usage.used}/{usage.limit} {txt(t.stock.aiUsage)}
          </span>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        {PRESETS.map((p) => (
          <Button
            key={p.key}
            variant="ghost"
            size="sm"
            className={cn(
              'text-xs',
              preset === p.key && 'bg-gold-wash text-gold border border-gold/20',
            )}
            onClick={() => setPreset(p.key)}
          >
            {txt(p.label)}
          </Button>
        ))}
      </div>

      <div className="flex justify-end mb-3">
        <Button
          variant="primary"
          size="sm"
          onClick={handleAnalyze}
          disabled={!user || loading}
        >
          {loading ? txt(t.common.loading) : txt(t.stock.requestAnalysis)}
        </Button>
      </div>

      {result && (
        <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
          {result}
        </div>
      )}

      {disclaimer && <Disclaimer text={disclaimer} variant="inline" />}
    </Card>
  );
}
