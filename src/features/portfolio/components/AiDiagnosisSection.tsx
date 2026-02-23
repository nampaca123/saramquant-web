'use client';

import { useCallback } from 'react';
import { AiAnalysisSectionBase } from '@/components/common/AiAnalysisSectionBase';
import { llmApi } from '@/lib/api';
import { useLanguage } from '@/providers/LanguageProvider';
import { t } from '@/lib/i18n/translations';
import type { AiPreset } from '@/components/common/AiAnalysisSectionBase';

const PRESETS: AiPreset[] = [
  { key: 'diagnosis', label: t.portfolio.presetDiagnosis, subtitle: t.portfolio.presetSubDiagnosis },
  { key: 'reduce_risk', label: t.portfolio.presetReduceRisk, subtitle: t.portfolio.presetSubReduceRisk },
  { key: 'outlook', label: t.portfolio.presetOutlook, subtitle: t.portfolio.presetSubOutlook },
  { key: 'aggressive', label: t.portfolio.presetAggressive, subtitle: t.portfolio.presetSubAggressive },
  { key: 'financial_weakness', label: t.portfolio.presetWeakness, subtitle: t.portfolio.presetSubWeakness },
];

interface AiDiagnosisSectionProps {
  portfolioId: number;
}

export function AiDiagnosisSection({ portfolioId }: AiDiagnosisSectionProps) {
  const { language } = useLanguage();

  const handleAnalyze = useCallback(async (preset: string) => {
    return llmApi.analyzePortfolio({ portfolioId, preset, lang: language });
  }, [portfolioId, language]);

  return (
    <AiAnalysisSectionBase
      onAnalyze={handleAnalyze}
      presets={PRESETS}
      title={t.portfolio.aiDiagnosis}
      description={t.portfolio.aiDesc}
      howItWorksDetail={t.portfolio.aiHowItWorksDetail}
      howItWorksLabel={t.portfolio.aiHowItWorks}
      previewText={t.portfolio.aiPreview}
      loadingStages={[t.portfolio.aiStage1, t.portfolio.aiStage2, t.portfolio.aiStage3, t.portfolio.aiStage4]}
      maxWaitText={t.portfolio.aiMaxWait}
    />
  );
}
