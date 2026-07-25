'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Monitor, Sun, Maximize, Shield, Sparkles, ChevronRight, ChevronLeft, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingModal } from '@/store/bookingModalStore';

type LensTypeId = 'standard' | 'blueCut' | 'photochromic' | 'progressive';

interface FeatureBenefit {
  name: string;
  description: string;
  includedIn: Record<LensTypeId, boolean>;
}

interface LensInfo {
  id: LensTypeId;
  name: string;
  tagline: string;
  description: string;
  icon: any;
  badge?: string;
  bgGlow: string;
  highlights: string[];
}

export default function LensGuide() {
  const openBookingModal = useBookingModal(state => state.open);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(2); // Default Photochromic (index 2)

  const lensList: LensInfo[] = [
    {
      id: 'standard',
      name: 'Standard Optical Lens',
      tagline: 'Everyday crystal-clear & durable vision',
      description: 'High-quality optical clarity engineered for single-vision prescriptions. Perfect for daily casual use with essential scratch resistance.',
      icon: Shield,
      bgGlow: 'from-amber-500/15 via-amber-500/5 to-transparent',
      highlights: ['Crystal Clear Optics', 'Durable Scratch Guard', 'Lightweight Daily Wear'],
    },
    {
      id: 'blueCut',
      name: 'Blue-Cut Screen Lens',
      tagline: 'Ultimate digital screen & eyestrain protection',
      description: 'Advanced optical filters block high-energy blue light from smartphones, laptops, and monitors. Reduces digital eyestrain & sleep disruption.',
      icon: Monitor,
      badge: 'Screen Essential',
      bgGlow: 'from-blue-500/15 via-indigo-500/5 to-transparent',
      highlights: ['Blue Light Filter Tech', 'Anti-Glare Shield', 'Reduces Eye Fatigue'],
    },
    {
      id: 'photochromic',
      name: 'Photochromic Sun-Adaptive',
      tagline: 'Adapts dynamically to ambient sunlight & UV rays',
      description: 'Smart light-reactive lenses that stay crystal clear indoors and automatically shade into protective sunglasses when stepping outside into sunlight.',
      icon: Sun,
      badge: 'Most Popular',
      bgGlow: 'from-amber-600/20 via-orange-500/5 to-transparent',
      highlights: ['2-in-1 Indoor & Sunglasses', '100% Broad UV400 Protection', 'Instant Light Adaptation'],
    },
    {
      id: 'progressive',
      name: 'Progressive Multifocal Lens',
      tagline: 'Seamless multi-distance vision without lines',
      description: 'Next-generation multifocal lens design providing smooth focus transitions between reading, computer work, and distance viewing.',
      icon: Maximize,
      badge: 'Multivision',
      bgGlow: 'from-emerald-500/15 via-teal-500/5 to-transparent',
      highlights: ['No Visible Bifocal Lines', 'Natural Focus Transition', 'All-in-One Vision Solution'],
    },
  ];

  const featureList: FeatureBenefit[] = [
    {
      name: 'Anti-Reflective Coating',
      description: 'Eliminates glare for night driving & video calls.',
      includedIn: { standard: true, blueCut: true, photochromic: true, progressive: true },
    },
    {
      name: 'Scratch-Resistant Armor',
      description: 'Shields lenses from everyday scuffs & scratches.',
      includedIn: { standard: true, blueCut: true, photochromic: true, progressive: true },
    },
    {
      name: '100% UV400 Protection',
      description: 'Broad-spectrum defense against UVA & UVB rays.',
      includedIn: { standard: false, blueCut: true, photochromic: true, progressive: true },
    },
    {
      name: 'Digital Strain Relief',
      description: 'Filters screen blue light to minimize eyestrain.',
      includedIn: { standard: false, blueCut: true, photochromic: true, progressive: true },
    },
    {
      name: 'Sunlight Adaptive Darkening',
      description: 'Darkens automatically outdoors into sunglasses.',
      includedIn: { standard: false, blueCut: false, photochromic: true, progressive: false },
    },
    {
      name: 'Multi-Distance Precision',
      description: 'Seamless focus across near, mid & far distances.',
      includedIn: { standard: false, blueCut: false, photochromic: false, progressive: true },
    },
  ];

  // Scroll to index helper (Horizontal container scroll only - NEVER affects window page scroll)
  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.children;
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      const targetScrollLeft = card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2;
      container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
      setActiveCardIndex(index);
    }
  };

  // Sync scroll position with active state
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const centerPosition = container.scrollLeft + container.offsetWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const element = child as HTMLElement;
      const childCenter = element.offsetLeft + element.offsetWidth / 2;
      const distance = Math.abs(centerPosition - childCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeCardIndex) {
      setActiveCardIndex(closestIndex);
    }
  };

  useEffect(() => {
    // Initial horizontal centering inside container only
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cards = container.children;
      if (cards[2]) {
        const card = cards[2] as HTMLElement;
        container.scrollLeft = card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2;
      }
    }
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background border-t border-line transition-colors overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles size={13} className="text-primary animate-pulse" />
            Lens Technology Showcase
          </div>
          <h2 className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Optical Technology</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4 text-foreground tracking-tight">
            Find Your Perfect Lens
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Swipe or scroll through our premium lens collection to discover tailored protection and vision features.
          </p>
        </div>

        {/* Quick Nav Filter Buttons & Slider Arrow Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Lens Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 max-w-full">
            {lensList.map((lens, idx) => {
              const Icon = lens.icon;
              const isActive = activeCardIndex === idx;

              return (
                <button
                  key={lens.id}
                  onClick={() => scrollToIndex(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shrink-0 cursor-pointer border ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-card border-line text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-primary-foreground' : 'text-primary'} />
                  <span>{lens.name.split(' ')[0]}</span>
                  {lens.badge && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-copper animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation Arrows & Counter */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-xs text-muted-foreground font-medium">
              0{activeCardIndex + 1} / 0{lensList.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollToIndex(Math.max(0, activeCardIndex - 1))}
                disabled={activeCardIndex === 0}
                className="p-2.5 rounded-full bg-card border border-line text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                aria-label="Previous Lens"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollToIndex(Math.min(lensList.length - 1, activeCardIndex + 1))}
                disabled={activeCardIndex === lensList.length - 1}
                className="p-2.5 rounded-full bg-card border border-line text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                aria-label="Next Lens"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* HORIZONTAL SWIPEABLE / SCROLLABLE CAROUSEL CONTAINER */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex items-stretch gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-4 px-2 -mx-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {lensList.map((lens, idx) => {
            const Icon = lens.icon;
            const isActive = activeCardIndex === idx;
            const includedFeatures = featureList.filter(f => f.includedIn[lens.id]);

            return (
              <div
                key={lens.id}
                className={`snap-center shrink-0 w-[88vw] sm:w-[540px] md:w-[620px] lg:w-[720px] transition-all duration-300 ${
                  isActive ? 'scale-[1.01] z-10' : 'opacity-85 scale-[0.98]'
                }`}
              >
                <div className="h-full bg-card border border-primary/25 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
                  {/* Ambient Card Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${lens.bgGlow} pointer-events-none`} />

                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
                      <div className="flex items-center gap-3.5">
                        <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xl sm:text-2xl text-foreground font-serif">
                            {lens.name}
                          </h4>
                          <p className="text-xs font-semibold text-primary mt-0.5">{lens.tagline}</p>
                        </div>
                      </div>

                      {lens.badge && (
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-copper text-white shadow-sm shrink-0">
                          {lens.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 relative z-10">
                      {lens.description}
                    </p>

                    {/* Highlights Tags */}
                    <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                      {lens.highlights.map((item, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-secondary text-foreground text-xs font-medium border border-line"
                        >
                          <Zap size={12} className="text-primary" />
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Included Features List */}
                    <div className="pt-5 border-t border-line/60 mb-6 relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs uppercase tracking-wider text-foreground font-bold flex items-center gap-1.5">
                          <ShieldCheck size={15} className="text-emerald-500" />
                          Key Features Included ({includedFeatures.length})
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {includedFeatures.map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className="p-3 rounded-xl bg-background/80 border border-primary/10 flex items-start gap-2.5"
                          >
                            <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20">
                              <Check size={13} />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-foreground font-serif">{feat.name}</h5>
                              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                                {feat.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Consultation CTA */}
                  <div className="pt-4 border-t border-line/60 relative z-10">
                    <Button
                      onClick={openBookingModal}
                      size="lg"
                      className="w-full rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-5 text-xs sm:text-sm btn-brass-sweep border-none shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Book Eye Test for {lens.name.split(' ')[0]} Lens</span>
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {lensList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeCardIndex === idx ? 'w-8 bg-primary' : 'w-2 bg-line hover:bg-muted-foreground'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
