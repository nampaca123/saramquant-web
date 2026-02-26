'use client';

import { useCallback } from 'react';
import { AiAnalysisSectionBase } from '@/components/common/AiAnalysisSectionBase';
import { llmApi } from '@/lib/api';
import { useLanguage } from '@/providers/LanguageProvider';
import { t } from '@/lib/i18n/translations';
import type { AiPreset } from '@/components/common/AiAnalysisSectionBase';
import type { CachedLlmAnalysis } from '../types/stock.types';

const PRESETS: AiPreset[] = [
  { key: 'summary', label: t.stock.presetSummary, subtitle: t.stock.presetSubSummary },
  { key: 'beginner', label: t.stock.presetBeginner, subtitle: t.stock.presetSubBeginner },
  { key: 'risk', label: t.stock.presetRisk, subtitle: t.stock.presetSubRisk },
  { key: 'financial', label: t.stock.presetFinancial, subtitle: t.stock.presetSubFinancial },
];

interface AiAnalysisSectionProps {
  symbol: string;
  market: string;
  cachedAnalysis: CachedLlmAnalysis | null;
}

export function AiAnalysisSection({ symbol, market, cachedAnalysis }: AiAnalysisSectionProps) {
  const { language } = useLanguage();

  const handleAnalyze = useCallback(async (preset: string) => {
    return llmApi.analyzeStock({ symbol, market, preset, lang: language });
  }, [symbol, market, language]);

  return (
    <AiAnalysisSectionBase
      onAnalyze={handleAnalyze}
      presets={PRESETS}
      title={t.stock.aiAnalysis}
      description={t.stock.aiDesc}
      howItWorksDetail={t.stock.aiHowItWorksDetail}
      previewText={t.stock.aiPreview}
      loadingStages={[t.stock.aiStage1, t.stock.aiStage2, t.stock.aiStage3, t.stock.aiStage4]}
      maxWaitText={t.stock.aiMaxWait}
      cachedResult={cachedAnalysis ? { preset: cachedAnalysis.preset, analysis: cachedAnalysis.analysis, disclaimer: '' } : undefined}
      sharedEconomyDetail={t.stock.aiSharedEconomy}
    />
  );
}
