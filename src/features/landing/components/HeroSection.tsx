'use client';

import Image from 'next/image';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';

export function HeroSection() {
  const txt = useText();

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gold-wash/70 blur-[120px] animate-glow-pulse" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <div className="flex flex-col items-center text-center">
          {/* Logo mark - large, natural, no box */}
          <div className="animate-fade-in mb-8">
            <Image
              src="/image/logo/saramquant-logo.jpg"
              alt=""
              width={80}
              height={80}
              className="rounded-3xl"
              priority
              aria-hidden="true"
            />
          </div>

          <h1 className="animate-fade-in text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl text-balance">
            {txt(t.landing.headlinePrimary)}
            <br />
            <span className="text-gold">
              {txt(t.landing.headlineAccent)}
            </span>
          </h1>

          <p className="animate-slide-up mt-5 max-w-lg text-base leading-relaxed text-zinc-500 sm:text-lg text-pretty">
            {txt(t.landing.subheading)}
          </p>

          {/* Browser mockup with product screenshot */}
          <div className="animate-slide-up animation-delay-200 mt-14 w-full max-w-4xl">
            <BrowserMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function BrowserMockup() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-zinc-100 shadow-2xl shadow-zinc-900/10 overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50 border-b border-zinc-200/60">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-md bg-white px-4 py-1 text-xs text-zinc-400 border border-zinc-200/60 max-w-xs w-full justify-center">
          saramquant.com
        </div>
        <div className="w-[52px]" />
      </div>
      {/* Screenshot */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src="/image/landing/stock-detail-screenshot.png"
          alt="SaramQuant stock analysis interface showing risk scores, price charts, and sector comparisons"
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 896px"
          priority
        />
      </div>
    </div>
  );
}
