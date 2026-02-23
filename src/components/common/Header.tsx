'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, LayoutGrid, PieChart, Settings, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { authApi } from '@/lib/api';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
import { LanguageToggle } from './LanguageToggle';
import { SearchCombobox } from './SearchCombobox';
import { MobileSearchOverlay } from './MobileSearchOverlay';

const NAV_ITEMS = [
  { href: '/screener', label: t.nav.screener, icon: LayoutGrid },
  { href: '/portfolio', label: t.nav.portfolio, icon: PieChart },
] as const;

export function Header() {
  const txt = useText();
  const { language } = useLanguage();
  const pathname = usePathname();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* noop */ }
    window.location.href = '/';
  };

  const displayName = user?.profile?.nickname ?? user?.name ?? '';
  const avatarUrl = user?.profile?.profileImageUrl;
  const greetingText = language === 'ko'
    ? `${txt(t.common.greeting)} ${displayName}님!`
    : `${txt(t.common.greeting)}, ${displayName}!`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
          <Link href="/screener" className="flex items-center gap-2 shrink-0">
            <Image src="/image/logo/saramquant-logo.jpg" alt="SaramQuant" width={28} height={28} className="rounded-md" />
            <span className="hidden text-sm font-bold text-zinc-900 sm:inline">SaramQuant</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                    active
                      ? 'bg-gold-wash text-gold font-medium'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {txt(item.label)}
                </Link>
              );
            })}
          </nav>

          <SearchCombobox className="hidden flex-1 max-w-xs md:block" />

          <div className="ml-auto flex items-center gap-3">
            <button
              className="md:hidden p-1.5 text-zinc-500 hover:text-zinc-700"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <LanguageToggle />

            {user ? (
              <>
                <Link
                  href="/settings"
                  className={cn(
                    'hidden md:flex items-center justify-center h-8 w-8 rounded-full transition-colors',
                    pathname.startsWith('/settings')
                      ? 'bg-gold-wash text-gold'
                      : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600',
                  )}
                  aria-label={txt(t.nav.settings)}
                >
                  <Settings className="h-4 w-4" />
                </Link>

                <div className="hidden md:flex items-center gap-2 border-l border-zinc-200 pl-3">
                  <Link href="/settings" className="flex items-center gap-2 group">
                    <span className="relative h-7 w-7 shrink-0 rounded-full bg-zinc-100 ring-1 ring-zinc-200 overflow-hidden">
                      {avatarUrl && !imgError ? (
                        <Image
                          src={avatarUrl}
                          alt=""
                          fill
                          unoptimized
                          className="rounded-full object-cover"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <User className="absolute inset-0 m-auto h-4 w-4 text-zinc-400" />
                      )}
                    </span>
                    <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors whitespace-nowrap">
                      {greetingText}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-2 rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-300 hover:border-zinc-300 hover:text-zinc-500 transition-colors whitespace-nowrap"
                  >
                    {txt(t.common.logout)}
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="md:hidden text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {txt(t.common.logout)}
                </button>
              </>
            ) : (
              <Link href="/" className="text-sm font-medium text-gold hover:text-gold/80 transition-colors">
                {txt(t.common.login)}
              </Link>
            )}
          </div>
        </div>
      </header>
      <MobileSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
