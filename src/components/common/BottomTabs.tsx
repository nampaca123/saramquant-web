'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, PieChart, Settings } from 'lucide-react';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';

const TABS = [
  { href: '/home', label: t.nav.home, icon: Home },
  { href: '/screener', label: t.nav.screener, icon: LayoutGrid },
  { href: '/portfolio', label: t.nav.portfolio, icon: PieChart },
  { href: '/settings', label: t.nav.settings, icon: Settings },
] as const;

export function BottomTabs() {
  const txt = useText();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-100 bg-white md:hidden">
      <div className="flex h-14">
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors',
                active ? 'text-gold' : 'text-zinc-400',
              )}
            >
              <Icon className="h-5 w-5" />
              {txt(tab.label)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
