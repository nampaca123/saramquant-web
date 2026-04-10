'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  { src: '/image/screenshots/sq_stock_detail_risks.png', alt: 'Stock risk analysis dashboard' },
  { src: '/image/screenshots/sq_analysis_cgv.png', alt: 'AI analysis with Monte Carlo simulation' },
  { src: '/image/screenshots/sq_ai_agent_en.png', alt: 'AI portfolio builder agent' },
];

const INTERVAL = 5000;

export function BrowserCarousel({ activeIndex, onIndexChange }: { activeIndex: number; onIndexChange: (i: number) => void }) {
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(activeIndex);
  const [progressKey, setProgressKey] = useState(0);

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

  const goPrev = useCallback(() => {
    goTo((displayIndex - 1 + SLIDES.length) % SLIDES.length);
  }, [displayIndex, goTo]);

  const goNext = useCallback(() => {
    goTo((displayIndex + 1) % SLIDES.length);
  }, [displayIndex, goTo]);

  return (
    <div className="relative w-full">
      <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12),0_4px_16px_-2px_rgba(0,0,0,0.06)]">
        <div className="flex shrink-0 items-center gap-2 border-b border-zinc-200/80 bg-zinc-50 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
            <span className="block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#FEBC2E' }} />
            <span className="block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#28C840' }} />
          </div>
          <div className="mx-auto flex h-5 w-48 items-center justify-center rounded-md bg-zinc-100 text-[10px] text-zinc-400">
            saramquant.com
          </div>
        </div>

        <div className="group/slide relative aspect-video overflow-hidden bg-white">
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
                className="object-contain object-top"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={i === 0}
              />
            </div>
          ))}

          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-opacity duration-200 hover:bg-white lg:flex h-8 w-8 opacity-0 group-hover/slide:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 text-zinc-600" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-opacity duration-200 hover:bg-white lg:flex h-8 w-8 opacity-0 group-hover/slide:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 text-zinc-600" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-zinc-900/40 px-2.5 py-1.5 backdrop-blur-sm">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group relative h-1 rounded-full transition-all duration-300"
                style={{ width: i === displayIndex ? 28 : 6 }}
              >
                <span
                  className="absolute inset-0 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: i === displayIndex ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)' }}
                />
                {i === displayIndex && (
                  <span
                    key={progressKey}
                    className="absolute inset-y-0 left-0 rounded-full bg-white"
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
      </div>
    </div>
  );
}
