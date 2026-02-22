'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FlagIcon } from '@/components/common/FlagIcon';
import { useText } from '@/lib/i18n/use-text';
import { useAuth } from '@/providers/AuthProvider';
import { portfolioApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import type { MarketGroup } from '@/types';
import type { PortfolioSummary } from '@/features/portfolio/types/portfolio.types';

interface AddToPortfolioButtonProps {
  stockId: number;
  symbol: string;
  market: string;
  open: boolean;
  onClose: () => void;
}

const today = () => new Date().toISOString().split('T')[0];

export function AddToPortfolioButton({ stockId, open, onClose }: AddToPortfolioButtonProps) {
  const txt = useText();
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [shares, setShares] = useState('');
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && user) {
      portfolioApi.list().then((list) => {
        setPortfolios(list);
        if (list.length > 0) setSelectedId(list[0].id);
      }).catch(() => {});
    }
  }, [open, user]);

  const sharesNum = Number(shares);
  const isFutureDate = date > today();
  const isInvalidShares = shares !== '' && (sharesNum <= 0 || !Number.isInteger(sharesNum));
  const canSubmit = selectedId && shares && sharesNum > 0 && Number.isInteger(sharesNum) && !isFutureDate;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      await portfolioApi.buy(selectedId, {
        stockId,
        purchasedAt: date,
        shares: sharesNum,
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
          {portfolios.length > 0 && (
            <div>
              <label className="text-sm font-medium text-zinc-700 mb-1 block">
                {txt(t.stock.selectPortfolio)}
              </label>
              <div className="flex gap-2">
                {portfolios.map((p) => (
                  <Button
                    key={p.id}
                    variant={selectedId === p.id ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedId(p.id)}
                  >
                    <FlagIcon market={p.marketGroup as MarketGroup} size={14} className="mr-1" />
                    {p.marketGroup}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-zinc-700 mb-1 block">
              {txt(t.stock.shares)}
            </label>
            <Input
              type="number"
              min="1"
              step="1"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="10"
              aria-invalid={isInvalidShares}
            />
            {isInvalidShares && (
              <p className="mt-1 flex items-center gap-1 text-xs text-warning">
                <AlertCircle className="h-3 w-3" />
                {txt({ ko: '1 이상의 정수를 입력하세요', en: 'Enter a whole number ≥ 1' })}
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
                {txt({ ko: '미래 날짜는 선택할 수 없어요', en: 'Cannot select a future date' })}
              </p>
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
