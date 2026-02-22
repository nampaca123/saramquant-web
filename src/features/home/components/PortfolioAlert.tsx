'use client';

import Link from 'next/link';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import type { PortfolioSummaryBrief } from '../types/home.types';

interface PortfolioAlertProps {
  portfolios: PortfolioSummaryBrief[] | null;
}

export function PortfolioAlert({ portfolios }: PortfolioAlertProps) {
  const txt = useText();
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="flex flex-col items-center gap-3 py-8">
        <p className="text-sm text-zinc-500">{txt(t.home.portfolioCta)}</p>
        <Link href="/">
          <Button size="sm">{txt(t.common.login)}</Button>
        </Link>
      </Card>
    );
  }

  if (!portfolios || portfolios.length === 0) {
    return (
      <Card>
        <h2 className="text-sm font-semibold text-zinc-900 mb-2">{txt(t.home.portfolioAlert)}</h2>
        <p className="text-sm text-zinc-400">{txt(t.common.noData)}</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-sm font-semibold text-zinc-900 mb-3">{txt(t.home.portfolioAlert)}</h2>
      <div className="flex flex-col gap-2">
        {portfolios.map((p) => (
          <Link
            key={p.id}
            href="/portfolio"
            className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm transition-colors hover:bg-zinc-100"
          >
            <span className="font-medium text-zinc-700">{p.marketGroup}</span>
            <span className="text-xs text-zinc-500">
              {p.holdingsCount} {txt(t.home.holdings)}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
