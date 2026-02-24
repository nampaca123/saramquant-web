'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const SLIDES = [
  { src: '/image/screenshots/sq_stock_detail_risks.png', alt: 'Stock risk analysis dashboard' },
  { src: '/image/screenshots/sq_analysis_cgv.png', alt: 'AI analysis with Monte Carlo simulation' },
  { src: '/image/screenshots/sq_pf_list.png', alt: 'Portfolio overview with holdings' },
];

const INTERVAL = 5000;

export function BrowserCarousel({ activeIndex, onIndexChange }: { activeIndex: number; onIndexChange: (i: number) => void }) {
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(activeIndex);
  const [progressKey, setProgressKey] = useState(0);

  // Sync when parent changes activeIndex (e.g. feature button click)
  useEffect(() => {
    if (activeIndex !== displayIndex && !isTransitioning) {
      setDirection(activeIndex > displayIndex || (displayIndex === 2 && activeIndex === 0) ? 'next' : 'prev');
      setIsTransitioning(true);
      setTimeout(() => {
        setDisplayIndex(activeIndex);
        setProgressKey(k => k + 1);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }
  }, [activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback((next: number) => {
    if (isTransitioning || next === displayIndex) return;
    setDirection(next > displayIndex || (displayIndex === 2 && next === 0) ? 'next' : 'prev');
    setIsTransitioning(true);
    setTimeout(() => {
      setDisplayIndex(next);
      setProgressKey(k => k + 1);
      onIndexChange(next);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  }, [isTransitioning, displayIndex, onIndexChange]);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (displayIndex + 1) % SLIDES.length;
      goTo(next);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [displayIndex, goTo]);

  return (
    <div className="relative w-full">
      {/* Browser frame */}
      <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-100 shadow-2xl shadow-zinc-900/10">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-zinc-200/80 bg-zinc-50 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="block h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="block h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="block h-2.5 w-2.5 rounded-full bg-zinc-300" />
          </div>
          <div className="mx-auto flex h-6 w-52 items-center justify-center rounded-md bg-zinc-100 text-[11px] text-zinc-400">
            saramquant.com
          </div>
        </div>

        {/* Screenshot area */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-50">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className="absolute inset-0 transition-all duration-500 ease-out"
              style={{
                opacity: i === displayIndex ? (isTransitioning ? 0 : 1) : 0,
                transform: i === displayIndex
                  ? (isTransitioning
                    ? `translateX(${direction === 'next' ? '4%' : '-4%'})`
                    : 'translateX(0)')
                  : `translateX(${direction === 'next' ? '-4%' : '4%'})`,
              }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative h-1.5 rounded-full transition-all duration-300"
            style={{ width: i === displayIndex ? 32 : 8 }}
          >
            <span
              className="absolute inset-0 rounded-full transition-colors duration-300"
              style={{ backgroundColor: i === displayIndex ? '#C8981E' : '#d4d4d8' }}
            />
            {i === displayIndex && (
              <span
                key={progressKey}
                className="absolute inset-y-0 left-0 rounded-full bg-gold"
                style={{
                  animation: `progress ${INTERVAL}ms linear`,
                  width: '100%',
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
