'use client';

import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useText } from '@/lib/i18n/use-text';
import { formatCurrency } from '@/lib/utils/format-currency';
import { dashboardApi, portfolioApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
import type { HoldingDetail, PortfolioDetail } from '../types/portfolio.types';
import type { StockSearchResult } from '@/features/screener/types/screener.types';

interface HoldingsListProps {
  portfolio: PortfolioDetail;
  onRefresh: () => void;
}

type ModalType = 'buy' | 'sell' | 'delete' | null;

export function HoldingsList({ portfolio, onRefresh }: HoldingsListProps) {
  const txt = useText();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedHolding, setSelectedHolding] = useState<HoldingDetail | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
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

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-700">
          {txt(t.portfolio.holdings)} ({portfolio.holdings.length})
        </h3>
      </div>

      <div className="divide-y divide-zinc-50">
        {portfolio.holdings.map((h) => (
          <div key={h.id} className="flex justify-between items-center py-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-zinc-700">{h.symbol}</span>
                <span className="text-sm font-medium">{h.name}</span>
              </div>
              <span className="text-xs text-zinc-400">
                {txt(t.portfolio.avgPrice)} {formatCurrency(h.avgPrice, currency)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">
                {h.shares} {txt(t.portfolio.sharesUnit)}
              </span>
              <div className="relative" ref={menuOpen === h.id ? menuRef : undefined}>
                <button onClick={() => setMenuOpen(menuOpen === h.id ? null : h.id)}>
                  <MoreVertical className="h-4 w-4 text-zinc-400" />
                </button>
                {menuOpen === h.id && (
                  <div className="absolute right-0 top-full z-10 mt-1 rounded-lg border border-zinc-200 bg-white shadow-lg py-1 min-w-[100px]">
                    <button
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-zinc-50"
                      onClick={() => { setSelectedHolding(h); setModalType('sell'); setMenuOpen(null); }}
                    >
                      {txt(t.portfolio.sell)}
                    </button>
                    <button
                      className="w-full px-3 py-1.5 text-left text-sm text-warning hover:bg-zinc-50"
                      onClick={() => { setSelectedHolding(h); setModalType('delete'); setMenuOpen(null); }}
                    >
                      {txt(t.common.delete)}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
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
    if (!selected || !date) { setPriceHint(null); setNoTrading(false); return; }
    clearTimeout(priceFetchRef.current);
    priceFetchRef.current = setTimeout(async () => {
      try {
        const res = await portfolioApi.priceLookup(selected.stockId, date);
        if (res.found && res.close != null) {
          setPriceHint({ high: res.high, low: res.low, close: res.close });
          setPrice(String(res.close));
          setNoTrading(false);
          setPriceWarning('');
        } else {
          setPriceHint(null);
          setPrice('');
          setNoTrading(true);
        }
      } catch {
        setPriceHint(null);
        setNoTrading(true);
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
            placeholder={txt(t.portfolio.buyPricePlaceholder)}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {priceHint && (
            <div className="flex gap-3 mt-1.5">
              {priceHint.high != null && (
                <span className="text-[11px] text-zinc-400">
                  {txt(t.portfolio.dayHigh)} <span className="font-mono text-warning">{formatCurrency(priceHint.high, currency)}</span>
                </span>
              )}
              {priceHint.low != null && (
                <span className="text-[11px] text-zinc-400">
                  {txt(t.portfolio.dayLow)} <span className="font-mono text-stable">{formatCurrency(priceHint.low, currency)}</span>
                </span>
              )}
              <span className="text-[11px] text-zinc-400">
                {txt(t.portfolio.dayClose)} <span className="font-mono text-zinc-700">{formatCurrency(priceHint.close!, currency)}</span>
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
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={loading || !selected || !shares || !price}>
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
