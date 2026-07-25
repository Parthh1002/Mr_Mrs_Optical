'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroBannerCarousel from './HeroBannerCarousel';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ content = {} }: { content?: Record<string, any> }) {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate stats on scroll
      gsap.fromTo(
        statsRef.current?.children as unknown as Element[],
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 88%',
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-background" style={{ minHeight: '100svh' }}>

      {/* ── Full-screen carousel (behind everything) ────────────── */}
      <HeroBannerCarousel />

      {/* ── Bottom Stats Bar ─────────────────────────────────────── */}
      <div
        ref={statsRef}
        className="absolute bottom-0 left-0 right-0 z-20 border-t border-line-strong/60 bg-background/80 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-line-strong/40">
            {[
              { value: '5,000+', label: 'Happy Customers' },
              { value: '1,000+', label: 'Luxury Frames' },
              { value: '250+',   label: 'Designer Shades' },
              { value: 'Free',   label: 'Clinical Eye Test', highlight: true },
            ].map((stat, i) => (
              <div key={i} className="py-4 sm:py-5 px-4 sm:px-6 text-center sm:text-left">
                <p className={`text-2xl sm:text-3xl font-bold font-serif ${stat.highlight ? 'text-primary' : 'text-foreground'}`}>
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.1em] text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
