'use client';

import Image from 'next/image';
import { LanguageToggle } from '@/components/common/LanguageToggle';

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 sm:px-10 lg:px-16 bg-white/80 backdrop-blur-md border-b border-zinc-100/60">
      <div className="flex items-center gap-3">
        <Image
          src="/image/logo/saramquant-logo.jpg"
          alt="SaramQuant"
          width={36}
          height={36}
          className="rounded-xl"
          priority
        />
        <span className="text-lg font-bold tracking-tight text-zinc-900">
          SaramQuant
        </span>
      </div>
      <LanguageToggle />
    </nav>
  );
}
