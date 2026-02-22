'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { useLanguage } from '@/providers/LanguageProvider';
import { FlagIcon } from '@/components/common/FlagIcon';
import { cn } from '@/lib/utils/cn';
import { MARKET_OPTIONS, TIER_FILTER_OPTIONS, SORT_OPTIONS } from '../constants/screener.constants';
import type { DashboardStocksParams } from '../types/screener.types';
import type { Market } from '@/types';

interface FilterPanelProps {
  params: DashboardStocksParams;
  onChange: (params: DashboardStocksParams) => void;
  className?: string;
}

export function FilterPanel({ params, onChange, className }: FilterPanelProps) {
  const txt = useText();
  const { language } = useLanguage();
  const [sectors, setSectors] = useState<string[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    dashboardApi.sectors(params.market).then(setSectors).catch(() => {});
  }, [params.market]);

  const update = (patch: Partial<DashboardStocksParams>) =>
    onChange({ ...params, page: 0, ...patch });

  const selectedTiers = params.tier ? params.tier.split(',') : [];

  const toggleTier = (value: string) => {
    const next = selectedTiers.includes(value)
      ? selectedTiers.filter((t) => t !== value)
      : [...selectedTiers, value];
    update({ tier: next.length > 0 ? next.join(',') : undefined });
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Search */}
      <input
        value={params.query ?? ''}
        onChange={(e) => update({ query: e.target.value || undefined })}
        placeholder={txt(t.screener.searchPlaceholder)}
        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm placeholder:text-zinc-400 outline-none focus:border-gold focus:ring-1 focus:ring-gold"
      />

      {/* Market tabs with flags */}
      <div className="flex flex-wrap gap-1.5">
        {MARKET_OPTIONS.map((o) => {
          const active = (params.market ?? '') === o.value;
          return (
            <button
              key={o.value}
              onClick={() => update({ market: o.value || undefined, sector: undefined })}
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                active
                  ? 'border-gold bg-gold-wash text-gold'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
              )}
            >
              {o.value && <FlagIcon market={o.value as Market} size={16} />}
              {o.label[language]}
            </button>
          );
        })}
      </div>

      {/* Tier chips */}
      <div className="flex flex-wrap gap-1.5">
        {TIER_FILTER_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => toggleTier(o.value)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              selectedTiers.includes(o.value)
                ? o.value === 'STABLE' ? 'border-stable bg-stable-bg text-stable'
                  : o.value === 'CAUTION' ? 'border-caution bg-caution-bg text-caution'
                  : 'border-warning bg-warning-bg text-warning'
                : 'border-zinc-200 text-zinc-500 hover:border-zinc-300',
            )}
          >
            {o.label[language]}
          </button>
        ))}
      </div>

      {/* Sector */}
      {sectors.length > 0 && (
        <select
          value={params.sector ?? ''}
          onChange={(e) => update({ sector: e.target.value || undefined })}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm"
        >
          <option value="">{txt(t.screener.allSectors)}</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}

      {/* Sort */}
      <select
        value={params.sort ?? 'name_asc'}
        onChange={(e) => update({ sort: e.target.value })}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label[language]}</option>
        ))}
      </select>

      {/* Advanced filters toggle */}
      <button
        onClick={() => setAdvancedOpen(!advancedOpen)}
        aria-expanded={advancedOpen}
        className="flex items-center gap-1.5 self-start text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <ChevronRight className={cn('h-3 w-3 transition-transform', advancedOpen && 'rotate-90')} />
        {txt(t.screener.advancedFilters)}
      </button>

      {/* Advanced filters grid */}
      {advancedOpen && (
        <div className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 lg:grid-cols-1 sm:grid-cols-2">
          <RangeFilter label="Beta" minVal={params.betaMin} maxVal={params.betaMax}
            onMin={(v) => update({ betaMin: v })} onMax={(v) => update({ betaMax: v })} step={0.1} />
          <RangeFilter label="RSI" minVal={params.rsiMin} maxVal={params.rsiMax}
            onMin={(v) => update({ rsiMin: v })} onMax={(v) => update({ rsiMax: v })} />
          <RangeFilter label="Sharpe" minVal={params.sharpeMin} maxVal={params.sharpeMax}
            onMin={(v) => update({ sharpeMin: v })} onMax={(v) => update({ sharpeMax: v })} step={0.1} />
          <RangeFilter label="ATR" minVal={params.atrMin} maxVal={params.atrMax}
            onMin={(v) => update({ atrMin: v })} onMax={(v) => update({ atrMax: v })} />
          <RangeFilter label="ADX" minVal={params.adxMin} maxVal={params.adxMax}
            onMin={(v) => update({ adxMin: v })} onMax={(v) => update({ adxMax: v })} />
          <RangeFilter label="PER" minVal={params.perMin} maxVal={params.perMax}
            onMin={(v) => update({ perMin: v })} onMax={(v) => update({ perMax: v })} />
          <RangeFilter label="PBR" minVal={params.pbrMin} maxVal={params.pbrMax}
            onMin={(v) => update({ pbrMin: v })} onMax={(v) => update({ pbrMax: v })} step={0.1} />
          <RangeFilter label="ROE" minVal={params.roeMin} maxVal={params.roeMax}
            onMin={(v) => update({ roeMin: v })} onMax={(v) => update({ roeMax: v })} />
          <RangeFilter label={language === 'ko' ? '부채비율' : 'Debt Ratio'}
            minVal={params.debtRatioMin} maxVal={params.debtRatioMax}
            onMin={(v) => update({ debtRatioMin: v })} onMax={(v) => update({ debtRatioMax: v })} />
        </div>
      )}
    </div>
  );
}

function RangeFilter({
  label, minVal, maxVal, onMin, onMax, step = 1,
}: {
  label: string;
  minVal?: number;
  maxVal?: number;
  onMin: (v: number | undefined) => void;
  onMax: (v: number | undefined) => void;
  step?: number;
}) {
  const parse = (s: string) => (s === '' ? undefined : Number(s));
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-zinc-600">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          step={step}
          value={minVal ?? ''}
          onChange={(e) => onMin(parse(e.target.value))}
          placeholder="Min"
          className="w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs outline-none focus:border-gold"
        />
        <span className="text-zinc-300">–</span>
        <input
          type="number"
          step={step}
          value={maxVal ?? ''}
          onChange={(e) => onMax(parse(e.target.value))}
          placeholder="Max"
          className="w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs outline-none focus:border-gold"
        />
      </div>
    </div>
  );
}
