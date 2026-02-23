'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MoreVertical, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { CurrencyValue } from '@/components/common/CurrencyValue';
import { formatPercent } from '@/lib/utils/format-percent';
import { dashboardApi, portfolioApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
import { RISK_DIMENSION_LABELS } from '@/constants/indicator-tooltips.constants';
import type { HoldingDetail, PortfolioDetail } from '../types/portfolio.types';
import type { StockSearchResult } from '@/features/screener/types/screener.types';

interface HoldingsListProps {
  portfolio: PortfolioDetail;
  onRefresh: () => void;
}

type ModalType = 'buy' | 'sell' | 'delete' | null;

const PAGE_SIZE = 5;

const DIMENSION_ORDER = ['price_heat', 'volatility', 'trend', 'company_health', 'valuation'] as const;
const TIER_COLORS: Record<string, string> = {
  STABLE: 'bg-stable',
  CAUTION: 'bg-caution',
  WARNING: 'bg-warning',
};

export function HoldingsList({ portfolio, onRefresh }: HoldingsListProps) {
  const txt = useText();
  const { language } = useLanguage();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedHolding, setSelectedHolding] = useState<HoldingDetail | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currency = portfolio.marketGroup === 'KR' ? 'KRW' : 'USD' as const;
  const marketFilter = portfolio.marketGroup === 'KR'
    ? ['KR_KOSPI', 'KR_KOSDAQ']
    : ['US_NYSE', 'US_NASDAQ'];

  const totalPages = Math.ceil(portfolio.holdings.length / PAGE_SIZE);
  const pagedHoldings = portfolio.holdings.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-700">
          {txt(t.portfolio.holdings)} ({portfolio.holdings.length})
        </h3>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2 py-0.5 text-xs rounded border border-zinc-200 disabled:opacity-30 hover:bg-zinc-50"
            >
              ‹
            </button>
            <span className="text-xs font-mono text-zinc-500">
              {page + 1}{txt(t.portfolio.pageOf)}{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-0.5 text-xs rounded border border-zinc-200 disabled:opacity-30 hover:bg-zinc-50"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2" style={{ minHeight: `${PAGE_SIZE * 88}px` }}>
        {pagedHoldings.map((h) => {
          const isUp = h.priceChangePercent != null && h.priceChangePercent > 0;
          const isDown = h.priceChangePercent != null && h.priceChangePercent < 0;
          const currentValue = h.latestClose != null ? h.shares * h.latestClose : null;
          const linkHref = h.market ? `/stocks/${h.market}/${h.symbol}` : undefined;

          const inner = (
            <div className="rounded-lg border border-zinc-100 bg-white px-4 py-3 transition-colors hover:border-zinc-200 hover:bg-zinc-50">
              {/* Row 1: Stock identity + action menu + price */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-zinc-900">{h.name}</span>
                    {h.summaryTier && (
                      <Badge tier={h.summaryTier as 'STABLE' | 'CAUTION' | 'WARNING'} language={language} className="shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-mono text-zinc-400">{h.symbol}</span>
                    {h.sector && <span className="text-xs text-zinc-400 truncate">· {h.sector}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Current price */}
                  <div className="text-right">
                    <div className="text-sm font-mono font-medium text-zinc-900">
                      {h.latestClose != null ? h.latestClose.toLocaleString() : '—'}
                    </div>
                    <div className={cn(
                      'text-xs font-mono',
                      isUp && 'text-up',
                      isDown && 'text-down',
                      !isUp && !isDown && 'text-zinc-400',
                    )}>
                      {formatPercent(h.priceChangePercent)}
                    </div>
                  </div>

                  {/* Action menu */}
                  <div className="relative" ref={menuOpen === h.id ? menuRef : undefined}>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(menuOpen === h.id ? null : h.id); }}
                    >
                      <MoreVertical className="h-4 w-4 text-zinc-400" />
                    </button>
                    {menuOpen === h.id && (
                      <div className="absolute right-0 top-full z-10 mt-1 rounded-lg border border-zinc-200 bg-white shadow-lg py-1 min-w-[100px]">
                        <button
                          className="w-full px-3 py-1.5 text-left text-sm hover:bg-zinc-50"
                          onClick={(e) => { e.preventDefault(); setSelectedHolding(h); setModalType('sell'); setMenuOpen(null); }}
                        >
                          {txt(t.portfolio.sell)}
                        </button>
                        <button
                          className="w-full px-3 py-1.5 text-left text-sm text-warning hover:bg-zinc-50"
                          onClick={(e) => { e.preventDefault(); setSelectedHolding(h); setModalType('delete'); setMenuOpen(null); }}
                        >
                          {txt(t.common.delete)}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: 5 risk dimension indicators */}
              <div className="flex flex-wrap gap-1 mt-2">
                {DIMENSION_ORDER.map((dim) => {
                  const tier = h.dimensionTiers?.[dim];
                  const dotColor = tier ? TIER_COLORS[tier] : null;
                  const dimLabel = RISK_DIMENSION_LABELS[dim];
                  return (
                    <div key={dim} className="flex items-center gap-1 rounded bg-zinc-50 px-1.5 py-0.5">
                      <div className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotColor ?? 'bg-zinc-200')} />
                      <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                        {dimLabel ? dimLabel.label[language] : dim}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Row 3: Holdings meta — purchase info, value & P&L */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-zinc-400">
                <span>{txt(t.portfolio.avgPrice)} <CurrencyValue value={h.avgPrice} currency={currency} className="text-zinc-600 text-[11px]" /></span>
                <span>{h.shares} {txt(t.portfolio.sharesUnit)}</span>
                {currentValue != null && (
                  <span>{txt(t.portfolio.currentValue)} <CurrencyValue value={currentValue} currency={currency} className="text-zinc-600 text-[11px]" /></span>
                )}
                <span>{txt(t.portfolio.firstPurchaseDate)} <span className="text-zinc-600">{h.purchasedAt}</span></span>
                {h.unrealizedPnl != null && (
                  <span className="flex items-center gap-1">
                    {txt(t.portfolio.pnl)}
                    <CurrencyValue
                      value={h.unrealizedPnl}
                      currency={currency}
                      sign
                      className={cn(
                        'font-medium text-[11px]',
                        h.unrealizedPnl > 0 ? 'text-stable' : h.unrealizedPnl < 0 ? 'text-warning' : 'text-zinc-600',
                      )}
                    />
                    {h.unrealizedPnlPercent != null && (
                      <span className={cn(
                        'font-mono',
                        h.unrealizedPnl > 0 ? 'text-stable' : h.unrealizedPnl < 0 ? 'text-warning' : 'text-zinc-600',
                      )}>
                        ({h.unrealizedPnlPercent > 0 ? '+' : ''}{h.unrealizedPnlPercent.toFixed(2)}%)
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          );

          return linkHref ? (
            <Link key={h.id} href={linkHref} className="block">{inner}</Link>
          ) : (
            <div key={h.id}>{inner}</div>
          );
        })}
      </div>

      <Button
        variant="primary"
        size="sm"
        className="mt-3 w-full md:w-auto"
        onClick={() => setModalType('buy')}
      >
        <Plus className="h-4 w-4 mr-1" />
        {txt(t.portfolio.addStock)}
      </Button>

      <BuyModal
        open={modalType === 'buy'}
        onClose={() => setModalType(null)}
        portfolioId={portfolio.id}
        marketFilter={marketFilter}
        onSuccess={onRefresh}
      />

      {selectedHolding && (
        <SellModal
          open={modalType === 'sell'}
          onClose={() => { setModalType(null); setSelectedHolding(null); }}
          portfolioId={portfolio.id}
          holding={selectedHolding}
          onSuccess={onRefresh}
        />
      )}

      {selectedHolding && (
        <DeleteModal
          open={modalType === 'delete'}
          onClose={() => { setModalType(null); setSelectedHolding(null); }}
          portfolioId={portfolio.id}
          holdingId={selectedHolding.id}
          holdingName={selectedHolding.name}
          onSuccess={onRefresh}
        />
      )}
    </Card>
  );
}

/* ── Buy Modal ── */
function BuyModal({ open, onClose, portfolioId, marketFilter, onSuccess }: {
  open: boolean;
  onClose: () => void;
  portfolioId: number;
  marketFilter: string[];
  onSuccess: () => void;
}) {
  const txt = useText();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [selected, setSelected] = useState<StockSearchResult | null>(null);
  const [shares, setShares] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [priceHint, setPriceHint] = useState<{ high?: number; low?: number; close?: number } | null>(null);
  const [priceWarning, setPriceWarning] = useState('');
  const [noTrading, setNoTrading] = useState(false);
  const [priceFetching, setPriceFetching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const priceFetchRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const currency = marketFilter[0]?.startsWith('KR') ? 'KRW' : 'USD' as const;

  useEffect(() => {
    if (query.length < 1) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const all = await Promise.all(
          marketFilter.map((m) => dashboardApi.search({ q: query, market: m, limit: 5 })),
        );
        setResults(all.flat());
      } catch { setResults([]); }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, marketFilter]);

  useEffect(() => {
    if (!selected || !date) {
      setPriceHint(null); setNoTrading(false); setPriceFetching(false);
      return;
    }
    setPrice('');
    setPriceHint(null);
    setPriceWarning('');
    setNoTrading(false);
    setPriceFetching(true);
    clearTimeout(priceFetchRef.current);
    priceFetchRef.current = setTimeout(async () => {
      try {
        const res = await portfolioApi.priceLookup(selected.stockId, date);
        if (res.found && res.close != null) {
          setPriceHint({ high: res.high, low: res.low, close: res.close });
          setPrice(String(res.close));
        } else {
          setNoTrading(true);
        }
      } catch {
        setNoTrading(true);
      } finally {
        setPriceFetching(false);
      }
    }, 400);
    return () => clearTimeout(priceFetchRef.current);
  }, [selected, date]);

  useEffect(() => {
    if (!price || !priceHint?.high || !priceHint?.low) { setPriceWarning(''); return; }
    const p = Number(price);
    if (p < priceHint.low || p > priceHint.high) {
      setPriceWarning(txt(t.portfolio.priceOutOfRange));
    } else {
      setPriceWarning('');
    }
  }, [price, priceHint]);

  const handleSubmit = async () => {
    if (!selected || !shares || !price) return;
    setLoading(true);
    setError('');
    try {
      await portfolioApi.buy(portfolioId, {
        stockId: selected.stockId,
        purchasedAt: date,
        shares: Number(shares),
        manualPrice: Number(price),
      });
      onSuccess();
      onClose();
    } catch {
      setError(txt(t.common.error));
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-bold text-zinc-900 mb-4">{txt(t.portfolio.addStock)}</h3>
      <div className="space-y-3">
        <Input
          placeholder={txt(t.screener.searchPlaceholder)}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
        />
        {results.length > 0 && !selected && (
          <ul className="max-h-40 overflow-auto rounded-lg border border-zinc-200 bg-white">
            {results.map((r) => (
              <li key={r.stockId}>
                <button
                  className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-zinc-50"
                  onClick={() => { setSelected(r); setQuery(`${r.symbol} ${r.name}`); }}
                >
                  <span className="font-mono text-xs text-zinc-400">{r.symbol}</span>
                  <span className="flex-1">{r.name}</span>
                  <span className="text-xs text-zinc-400">{r.market}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div>
          <label className="text-xs font-medium text-zinc-500 mb-1 block">{txt(t.portfolio.buyDate)}</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-500 mb-1 block">{txt(t.portfolio.buyShares)}</label>
          <Input type="number" min="1" placeholder="0" value={shares} onChange={(e) => setShares(e.target.value)} />
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-500 mb-1 block">{txt(t.portfolio.buyPrice)}</label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={priceFetching ? txt(t.portfolio.priceFetching) : txt(t.portfolio.buyPricePlaceholder)}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={priceFetching}
          />
          {priceFetching && (
            <p className="text-[11px] text-zinc-400 mt-1 animate-pulse">{txt(t.portfolio.priceFetching)}</p>
          )}
          {priceHint && (
            <div className="flex gap-3 mt-1.5">
              {priceHint.high != null && (
                <span className="text-[11px] text-zinc-400">
                  {txt(t.portfolio.dayHigh)} <CurrencyValue value={priceHint.high} currency={currency} className="text-[11px] text-warning" />
                </span>
              )}
              {priceHint.low != null && (
                <span className="text-[11px] text-zinc-400">
                  {txt(t.portfolio.dayLow)} <CurrencyValue value={priceHint.low} currency={currency} className="text-[11px] text-stable" />
                </span>
              )}
              <span className="text-[11px] text-zinc-400">
                {txt(t.portfolio.dayClose)} <CurrencyValue value={priceHint.close!} currency={currency} className="text-[11px] text-zinc-700" />
              </span>
            </div>
          )}
          {priceHint && !priceWarning && (
            <p className="text-[11px] text-zinc-400 mt-1">{txt(t.portfolio.priceAutoFilled)}</p>
          )}
          {noTrading && (
            <p className="text-[11px] text-caution mt-1">{txt(t.portfolio.noTradingDay)}</p>
          )}
          {priceWarning && (
            <p className="text-[11px] text-caution mt-1">{priceWarning}</p>
          )}
        </div>

        {error && <p className="text-sm text-warning">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>{txt(t.common.cancel)}</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={loading || priceFetching || !selected || !shares || !price}>
            {loading ? txt(t.common.loading) : txt(t.common.confirm)}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Sell Modal ── */
function SellModal({ open, onClose, portfolioId, holding, onSuccess }: {
  open: boolean;
  onClose: () => void;
  portfolioId: number;
  holding: HoldingDetail;
  onSuccess: () => void;
}) {
  const txt = useText();
  const [sellShares, setSellShares] = useState('');
  const [sellAll, setSellAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const qty = sellAll ? holding.shares : Number(sellShares);
    if (!qty || qty <= 0) return;
    setLoading(true);
    setError('');
    try {
      await portfolioApi.sell(portfolioId, holding.id, { sellShares: qty });
      onSuccess();
      onClose();
    } catch {
      setError(txt(t.common.error));
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-bold text-zinc-900 mb-4">{txt(t.portfolio.sell)}: {holding.name}</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sellAll}
            onChange={(e) => setSellAll(e.target.checked)}
            className="accent-gold"
          />
          <span className="text-sm text-zinc-700">
            {txt(t.portfolio.sellAll)} ({holding.shares} {txt(t.portfolio.sharesUnit)})
          </span>
        </div>
        {!sellAll && (
          <Input
            type="number"
            min="1"
            max={String(holding.shares)}
            value={sellShares}
            onChange={(e) => setSellShares(e.target.value)}
            placeholder={String(holding.shares)}
          />
        )}
        {error && <p className="text-sm text-warning">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>{txt(t.common.cancel)}</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={loading}>
            {loading ? txt(t.common.loading) : txt(t.common.confirm)}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ open, onClose, portfolioId, holdingId, holdingName, onSuccess }: {
  open: boolean;
  onClose: () => void;
  portfolioId: number;
  holdingId: number;
  holdingName: string;
  onSuccess: () => void;
}) {
  const txt = useText();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await portfolioApi.deleteHolding(portfolioId, holdingId);
      onSuccess();
      onClose();
    } catch {
      setError(txt(t.common.error));
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-bold text-zinc-900 mb-2">{txt(t.portfolio.deleteHolding)}</h3>
      <p className="text-sm text-zinc-600 mb-4">{txt(t.portfolio.deleteConfirm)} ({holdingName})</p>
      {error && <p className="text-sm text-warning mb-3">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>{txt(t.common.cancel)}</Button>
        <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
          {loading ? txt(t.common.loading) : txt(t.common.delete)}
        </Button>
      </div>
    </Modal>
  );
}
