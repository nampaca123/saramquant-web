'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { useLanguage } from '@/providers/LanguageProvider';
import { FlagIcon } from '@/components/common/FlagIcon';
import { cn } from '@/lib/utils/cn';
import { RISK_DIMENSION_LABELS } from '@/constants/indicator-tooltips.constants';
import { MARKET_OPTIONS, TIER_FILTER_OPTIONS, SORT_OPTIONS } from '../constants/screener.constants';
import type { DashboardStocksParams } from '../types/screener.types';
import type { Market } from '@/types';

type DimensionKey = 'priceHeatTier' | 'volatilityTier' | 'trendTier' | 'companyHealthTier' | 'valuationTier';

const DIMENSION_FILTERS: { paramKey: DimensionKey; dimName: string }[] = [
  { paramKey: 'priceHeatTier', dimName: 'price_heat' },
  { paramKey: 'volatilityTier', dimName: 'volatility' },
  { paramKey: 'trendTier', dimName: 'trend' },
  { paramKey: 'companyHealthTier', dimName: 'company_health' },
  { paramKey: 'valuationTier', dimName: 'valuation' },
];

const TIER_DOTS: { value: string; dot: string; activeDot: string; ring: string }[] = [
  { value: 'STABLE',  dot: 'bg-stable/25',  activeDot: 'bg-stable',  ring: 'ring-stable/30' },
  { value: 'CAUTION', dot: 'bg-caution/25', activeDot: 'bg-caution', ring: 'ring-caution/30' },
  { value: 'WARNING', dot: 'bg-warning/25', activeDot: 'bg-warning', ring: 'ring-warning/30' },
];

const TIER_CHIP: Record<string, { idle: string; active: string }> = {
  STABLE: {
    idle: 'border-stable/30 text-stable/70 hover:border-stable/50',
    active: 'border-stable bg-stable-bg text-stable',
  },
  CAUTION: {
    idle: 'border-caution/30 text-caution/70 hover:border-caution/50',
    active: 'border-caution bg-caution-bg text-caution',
  },
  WARNING: {
    idle: 'border-warning/30 text-warning/70 hover:border-warning/50',
    active: 'border-warning bg-warning-bg text-warning',
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

  const sectorOptions = [
    { value: '', label: txt(t.screener.allSectors) },
    ...sectors.map((s) => ({ value: s, label: s })),
  ];

  const sortOptions = SORT_OPTIONS.map((o) => ({
    value: o.value,
    label: o.label[language],
  }));

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          value={params.query ?? ''}
          onChange={(e) => update({ query: e.target.value || undefined })}
          placeholder={txt(t.screener.searchPlaceholder)}
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-zinc-400 focus:border-gold focus:ring-1 focus:ring-gold"
        />
      </div>

      {/* Market tabs */}
      <div className="flex flex-wrap gap-1.5">
        {MARKET_OPTIONS.map((o) => {
          const active = params.market === o.value;
          return (
            <button
              key={o.value}
              onClick={() => update({ market: o.value, sector: undefined })}
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                active
                  ? 'border-gold bg-gold-wash text-gold'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
              )}
            >
              <FlagIcon market={o.value as Market} size={16} />
              {o.label[language]}
            </button>
          );
        })}
      </div>

      {/* Tier chips — subtle tint when idle, full color when active */}
      <div className="flex flex-wrap gap-1.5">
        {TIER_FILTER_OPTIONS.map((o) => {
          const chip = TIER_CHIP[o.value];
          return (
            <button
              key={o.value}
              onClick={() => toggleTier(o.value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                selectedTiers.includes(o.value) ? chip.active : chip.idle,
              )}
            >
              {o.label[language]}
            </button>
          );
        })}
      </div>

      {/* 5-dimension tier matrix */}
      <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 px-3 py-2">
        {/* Column headers — aligned with dots */}
        <div className="mb-1.5 grid grid-cols-[1fr_repeat(3,36px)] items-center gap-x-1">
          <span />
          {TIER_FILTER_OPTIONS.map((o) => (
            <span key={o.value} className="text-center text-[9px] font-medium text-zinc-400">
              {o.label[language]}
            </span>
          ))}
        </div>
        {/* Rows — one per dimension */}
        <div className="flex flex-col gap-1.5">
          {DIMENSION_FILTERS.map(({ paramKey, dimName }) => {
            const dimLabel = RISK_DIMENSION_LABELS[dimName];
            const selected = params[paramKey]?.split(',') ?? [];
            const toggle = (tier: string) => {
              const next = selected.includes(tier)
                ? selected.filter((v) => v !== tier)
                : [...selected, tier];
              update({ [paramKey]: next.length > 0 ? next.join(',') : undefined });
            };
            return (
              <div key={dimName} className="grid grid-cols-[1fr_repeat(3,36px)] items-center gap-x-1">
                <span className="truncate text-[11px] text-zinc-600">
                  {dimLabel?.label[language] ?? dimName}
                </span>
                {TIER_DOTS.map((td) => {
                  const on = selected.includes(td.value);
                  return (
                    <button
                      key={td.value}
                      onClick={() => toggle(td.value)}
                      className="flex items-center justify-center"
                    >
                      <span
                        className={cn(
                          'block h-3.5 w-3.5 rounded-full transition-all',
                          on ? `${td.activeDot} ring-2 ${td.ring} scale-110` : `${td.dot} hover:scale-110`,
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sector */}
      {sectors.length > 0 && (
        <ExpandSelect
          value={params.sector ?? ''}
          options={sectorOptions}
          onSelect={(v) => update({ sector: v || undefined })}
        />
      )}

      {/* Advanced toggle */}
      <button
        onClick={() => setAdvancedOpen((prev) => !prev)}
        aria-expanded={advancedOpen}
        className={cn(
          'flex items-center gap-1.5 self-start text-xs transition-colors',
          advancedOpen ? 'font-medium text-zinc-700' : 'text-zinc-400 hover:text-zinc-600',
        )}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        {txt(t.screener.expertFilters)}
        <ChevronDown className={cn('h-3 w-3 transition-transform', advancedOpen && 'rotate-180')} />
      </button>

      {/* Advanced panel */}
      {advancedOpen && (
        <div className="space-y-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
          <p className="text-[11px] text-zinc-400">{txt(t.screener.expertFiltersDesc)}</p>

          <div>
            <span className="mb-1 block text-xs font-medium text-zinc-600">
              {txt(t.screener.sortBy)}
            </span>
            <ExpandSelect
              value={params.sort ?? 'name_asc'}
              options={sortOptions}
              onSelect={(v) => update({ sort: v })}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
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

/* ── Expanding-box select ── */

function ExpandSelect({
  value, options, onSelect, className,
}: {
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center justify-between border bg-white px-3 py-1.5 text-sm transition-colors',
          open
            ? 'rounded-t-lg border-zinc-300 border-b-zinc-100'
            : 'rounded-lg border-zinc-200 hover:border-zinc-300',
        )}
      >
        <span className="truncate text-zinc-900">{selected?.label ?? ''}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 -mt-px max-h-60 overflow-y-auto overscroll-contain rounded-b-lg border border-t-0 border-zinc-300 bg-white shadow-lg">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onSelect(o.value); close(); }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
                o.value === value
                  ? 'bg-gold-wash font-medium text-gold'
                  : 'text-zinc-700 hover:bg-zinc-50',
              )}
            >
              {o.value === value && <Check className="h-3 w-3 shrink-0" />}
              <span className="truncate">{o.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Range input pair ── */

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
        <input type="number" step={step} value={minVal ?? ''}
          onChange={(e) => onMin(parse(e.target.value))} placeholder="Min"
          className="w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs outline-none focus:border-gold" />
        <span className="text-zinc-300">–</span>
        <input type="number" step={step} value={maxVal ?? ''}
          onChange={(e) => onMax(parse(e.target.value))} placeholder="Max"
          className="w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs outline-none focus:border-gold" />
      </div>
    </div>
  );
}
