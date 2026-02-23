'use client';

import { Shield, Sparkles, PieChart } from 'lucide-react';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import type { LucideIcon } from 'lucide-react';

type FeatureItem = {
  icon: LucideIcon;
  titleKey: keyof typeof import('@/constants/i18n/landing.i18n').landingTexts;
  descKey: keyof typeof import('@/constants/i18n/landing.i18n').landingTexts;
};

const FEATURES: FeatureItem[] = [
  { icon: Shield, titleKey: 'featureSignalTitle', descKey: 'featureSignalDesc' },
  { icon: Sparkles, titleKey: 'featureAiTitle', descKey: 'featureAiDesc' },
  { icon: PieChart, titleKey: 'featurePortfolioTitle', descKey: 'featurePortfolioDesc' },
];

export function FeaturesSection() {
  const txt = useText();

  return (
    <section className="relative py-20 sm:py-28 bg-zinc-50/60">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="grid gap-5 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.titleKey}
              className={`animate-slide-up group flex flex-col rounded-2xl border border-zinc-100 bg-white p-6 sm:p-8 transition-shadow hover:shadow-lg hover:shadow-zinc-900/5${
                i === 1 ? ' animation-delay-200' : i === 2 ? ' animation-delay-400' : ''
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-wash transition-colors group-hover:bg-gold-light/60">
                <f.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-zinc-900">
                {txt(t.landing[f.titleKey as keyof typeof t.landing])}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {txt(t.landing[f.descKey as keyof typeof t.landing])}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
