'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';
import { authApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { LanguageToggle } from './LanguageToggle';
import { SearchCombobox } from './SearchCombobox';

const NAV_ITEMS = [
  { href: '/home', label: t.nav.home },
  { href: '/screener', label: t.nav.screener },
  { href: '/portfolio', label: t.nav.portfolio },
  { href: '/settings', label: t.nav.settings },
] as const;

export function Header() {
  const txt = useText();
  const { user } = useAuth();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* noop */ }
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/home" className="flex items-center gap-2 shrink-0">
          <Image src="/image/logo/saramquant-logo.jpg" alt="SaramQuant" width={28} height={28} className="rounded-md" />
          <span className="hidden text-sm font-bold text-zinc-900 sm:inline">SaramQuant</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >
              {txt(item.label)}
            </Link>
          ))}
        </nav>

        <SearchCombobox className="hidden flex-1 max-w-xs md:block" />

        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle />
          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              {txt(t.common.logout)}
            </button>
          ) : (
            <Link href="/" className="text-sm font-medium text-gold hover:text-gold/80 transition-colors">
              {txt(t.common.login)}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
