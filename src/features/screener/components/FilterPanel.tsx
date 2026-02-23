'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { useLanguage } from '@/providers/LanguageProvider';
import { FlagIcon } from '@/components/common/FlagIcon';
import { cn } from '@/lib/utils/cn';
import { MARKET_OPTIONS, TIER_FILTER_OPTIONS, SORT_OPTIONS } from '../constants/screener.constants';
import type { DashboardStocksParams } from '../types/screener.types';
import type { Market } from '@/types';

const TIER_ICON = { STABLE: ShieldCheck, CAUTION: AlertTriangle, WARNING: ShieldAlert } as const;

const TIER_STYLE: Record<string, { active: string; icon: string }> = {
  STABLE: {
    active: 'border-stable bg-stable-bg text-stable ring-2 ring-stable/20',
    icon: 'text-stable',
  },
  CAUTION: {
    active: 'border-caution bg-caution-bg text-caution ring-2 ring-caution/20',
    icon: 'text-caution',
  },
  WARNING: {
    active: 'border-warning bg-warning-bg text-warning ring-2 ring-warning/20',
    icon: 'text-warning',
  },
};

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
      ? selectedTiers.filter((v) => v !== value)
      : [...selectedTiers, value];
    update({ tier: next.length > 0 ? next.join(',') : undefined });
  };

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          value={params.query ?? ''}
          onChange={(e) => update({ query: e.target.value || undefined })}
          placeholder={txt(t.screener.searchPlaceholder)}
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-zinc-400 transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
      </div>

      {/* Market tabs */}
      <div className="flex flex-wrap gap-2">
        {MARKET_OPTIONS.map((o) => {
          const active = params.market === o.value;
          return (
            <button
              key={o.value}
              onClick={() => update({ market: o.value, sector: undefined })}
              className={cn(
                'flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                active
                  ? 'border-gold bg-gold-wash text-gold shadow-sm'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50',
              )}
            >
              <FlagIcon market={o.value as Market} size={16} />
              {o.label[language]}
            </button>
          );
        })}
      </div>

      {/* Risk Level - the hero element */}
      <div>
        <p className="mb-2.5 text-sm font-semibold text-zinc-700">
          {txt(t.screener.riskLevel)}
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {TIER_FILTER_OPTIONS.map((o) => {
            const active = selectedTiers.includes(o.value);
            const Icon = TIER_ICON[o.value as keyof typeof TIER_ICON];
            const style = TIER_STYLE[o.value];
            return (
              <button
                key={o.value}
                onClick={() => toggleTier(o.value)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3.5 transition-all sm:py-4',
                  active
                    ? style.active
                    : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50',
                )}
              >
                <Icon className={cn('h-5 w-5', active ? '' : style.icon)} />
                <span className="text-sm font-bold">{o.label[language]}</span>
                <span className="text-[11px] leading-tight opacity-70">
                  {o.description[language]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sector */}
      {sectors.length > 0 && (
        <select
          value={params.sector ?? ''}
          onChange={(e) => update({ sector: e.target.value || undefined })}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">{txt(t.screener.allSectors)}</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}

      {/* Advanced filters toggle */}
      <button
        onClick={() => setAdvancedOpen((prev) => !prev)}
        aria-expanded={advancedOpen}
        className={cn(
          'flex items-center gap-2 self-start rounded-xl px-3 py-2 text-xs font-medium transition-all',
          advancedOpen
            ? 'bg-zinc-100 text-zinc-700'
            : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600',
        )}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        {txt(t.screener.expertFilters)}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', advancedOpen && 'rotate-180')} />
      </button>

      {/* Advanced filters panel */}
      {advancedOpen && (
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
          <p className="text-xs text-zinc-400">{txt(t.screener.expertFiltersDesc)}</p>

          <div>
            <span className="mb-1 block text-xs font-medium text-zinc-600">
              {txt(t.screener.sortBy)}
            </span>
            <select
              value={params.sort ?? 'name_asc'}
              onChange={(e) => update({ sort: e.target.value })}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label[language]}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
