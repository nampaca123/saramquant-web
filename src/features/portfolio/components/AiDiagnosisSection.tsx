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

interface AiDiagnosisSectionProps {
  portfolioId: number;
}

const PRESETS = [
  { key: 'diagnosis', label: t.portfolio.presetDiagnosis },
  { key: 'reduce_risk', label: t.portfolio.presetReduceRisk },
  { key: 'outlook', label: t.portfolio.presetOutlook },
  { key: 'aggressive', label: t.portfolio.presetAggressive },
  { key: 'financial_weakness', label: t.portfolio.presetWeakness },
] as const;

export function AiDiagnosisSection({ portfolioId }: AiDiagnosisSectionProps) {
  const txt = useText();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [preset, setPreset] = useState<string>(PRESETS[0].key);
  const [result, setResult] = useState('');
  const [disclaimer, setDisclaimer] = useState('');
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
      const res = await llmApi.analyzePortfolio({ portfolioId, preset, lang: language });
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
        <h3 className="text-lg font-bold text-zinc-900">{txt(t.portfolio.aiDiagnosis)}</h3>
        {usage && (
          <span className="text-xs font-mono text-zinc-400">
            {usage.used}/{usage.limit} {txt(t.stock.aiUsage)}
          </span>
        )}
      </div>

      <div className="flex overflow-x-auto gap-2 scrollbar-none mb-3">
        {PRESETS.map((p) => (
          <Button
            key={p.key}
            variant="ghost"
            size="sm"
            className={cn(
              'text-xs flex-shrink-0',
              preset === p.key && 'bg-gold-wash text-gold border border-gold/20',
            )}
            onClick={() => setPreset(p.key)}
          >
            {txt(p.label)}
          </Button>
        ))}
      </div>

      <div className="flex justify-end mb-3">
        <Button variant="primary" size="sm" onClick={handleAnalyze} disabled={loading}>
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
