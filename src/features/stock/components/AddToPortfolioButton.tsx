'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FlagIcon } from '@/components/common/FlagIcon';
import { CurrencyValue } from '@/components/common/CurrencyValue';
import { useText } from '@/lib/i18n/use-text';
import { useAuth } from '@/providers/AuthProvider';
import { portfolioApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import type { MarketGroup } from '@/types';

interface AddToPortfolioButtonProps {
  stockId: number;
  symbol: string;
  market: string;
  open: boolean;
  onClose: () => void;
}

const today = () => new Date().toISOString().split('T')[0];

export function AddToPortfolioButton({ stockId, market, open, onClose }: AddToPortfolioButtonProps) {
  const txt = useText();
  const { user } = useAuth();
  const marketGroup: MarketGroup = market.startsWith('KR') ? 'KR' : 'US';
  const currency = marketGroup === 'KR' ? 'KRW' : 'USD' as const;
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [shares, setShares] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [priceHint, setPriceHint] = useState<{ high?: number; low?: number; close?: number } | null>(null);
  const [priceWarning, setPriceWarning] = useState('');
  const [noTrading, setNoTrading] = useState(false);
  const [priceFetching, setPriceFetching] = useState(false);
  const priceFetchRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (open && user) {
      portfolioApi.list().then((list) => {
        const match = list.find((p) => p.marketGroup === marketGroup);
        if (match) setSelectedId(match.id);
      }).catch(() => {});
    }
  }, [open, user, marketGroup]);

  useEffect(() => {
    if (!open || !stockId || !date) {
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
        const res = await portfolioApi.priceLookup(stockId, date);
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
  }, [open, stockId, date]);

  useEffect(() => {
    if (!price || !priceHint?.high || !priceHint?.low) { setPriceWarning(''); return; }
    const p = Number(price);
    setPriceWarning(p < priceHint.low || p > priceHint.high ? txt(t.portfolio.priceOutOfRange) : '');
  }, [price, priceHint]);

  const sharesNum = Number(shares);
  const priceNum = Number(price);
  const isFutureDate = date > today();
  const isInvalidShares = shares !== '' && sharesNum <= 0;
  const canSubmit = selectedId && shares && sharesNum > 0 && price && priceNum > 0 && !isFutureDate && !priceFetching;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      await portfolioApi.buy(selectedId, {
        stockId,
        purchasedAt: date,
        shares: sharesNum,
        manualPrice: priceNum,
      });
      setSuccess(true);
      setTimeout(() => { onClose(); setSuccess(false); }, 1500);
    } catch {
      setError(txt(t.common.error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-holding-title">
      <h3 id="add-holding-title" className="text-lg font-bold text-zinc-900 mb-4">
        {txt(t.stock.addToPortfolio)}
      </h3>

      {success ? (
        <p className="text-sm text-stable font-medium">{txt(t.stock.added)}</p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <FlagIcon market={marketGroup} size={16} />
            <span className="font-medium">{marketGroup} {txt(t.nav.portfolio)}</span>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 mb-1 block">
              {txt(t.stock.shares)}
            </label>
            <Input
              type="number"
              min="0.0001"
              step="any"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="0.5"
              aria-invalid={isInvalidShares}
            />
            {isInvalidShares && (
              <p className="mt-1 flex items-center gap-1 text-xs text-warning">
                <AlertCircle className="h-3 w-3" />
                {txt(t.stock.sharesError)}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 mb-1 block">
              {txt(t.stock.purchaseDate)}
            </label>
            <Input
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value)}
              aria-invalid={isFutureDate}
            />
            {isFutureDate && (
              <p className="mt-1 flex items-center gap-1 text-xs text-warning">
                <AlertCircle className="h-3 w-3" />
                {txt(t.stock.dateError)}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 mb-1 block">
              {txt(t.portfolio.buyPrice)}
            </label>
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

          {error && (
            <p className="flex items-center gap-1 text-xs text-warning">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              {txt(t.common.cancel)}
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit} disabled={loading || !canSubmit}>
              {loading ? txt(t.common.loading) : txt(t.common.confirm)}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
