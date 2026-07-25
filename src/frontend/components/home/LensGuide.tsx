'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Monitor, Sun, Maximize, Shield, Sparkles, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingModal } from '@/store/bookingModalStore';

type LensTypeId = 'standard' | 'blueCut' | 'photochromic' | 'progressive';

interface LensInfo {
  id: LensTypeId;
  name: string;
  tagline: string;
  description: string;
  icon: any;
  badge?: string;
  highlights: string[];
}

export default function LensGuide() {
  const openBookingModal = useBookingModal(state => state.open);
  const [activeColumn, setActiveColumn] = useState<LensTypeId>('photochromic');

  const lensDetails: Record<LensTypeId, LensInfo> = {
    standard: {
      id: 'standard',
      name: 'Standard Lens',
      tagline: 'Everyday clear & durable vision',
      description: 'High-quality optical clarity for single-vision prescriptions. Ideal for daily wear with essential protection.',
      icon: Shield,
      highlights: ['Crystal Clear Optics', 'Durable Scratch Guard', 'Lightweight Comfort'],
    },
    blueCut: {
      id: 'blueCut',
      name: 'Blue-Cut Lens',
      tagline: 'Ultimate digital screen protection',
      description: 'Filters harmful blue light emitted from phones, laptops, and screens. Reduces digital eye fatigue and glare.',
      icon: Monitor,
      badge: 'Screen Care',
      highlights: ['Blue Light Shield', 'Anti-Glare Tech', 'Relieves Eyestrain'],
    },
    photochromic: {
      id: 'photochromic',
      name: 'Photochromic Lens',
      tagline: 'Adapts dynamically to sunlight & UV',
      description: 'Intelligent lenses that stay clear indoors and automatically darken into protective sunglasses when stepping outside.',
      icon: Sun,
      badge: 'Most Popular',
      highlights: ['2-in-1 Indoor/Outdoor', '100% UV Protection', 'Instant Adaptability'],
    },
    progressive: {
      id: 'progressive',
      name: 'Progressive Lens',
      tagline: 'Seamless multi-distance vision without lines',
      description: 'Advanced multifocal technology providing smooth transition between near, intermediate, and distance viewing.',
      icon: Maximize,
      badge: 'Multivision',
      highlights: ['No Bifocal Line', 'Natural Focus Flow', 'Multi-Distance Clarity'],
    },
  };

  const features = [
    { name: 'Anti-Reflective Coating', standard: true, blueCut: true, photochromic: true, progressive: true },
    { name: 'Scratch Resistant Coating', standard: true, blueCut: true, photochromic: true, progressive: true },
    { name: '100% UV Protection (UV400)', standard: false, blueCut: true, photochromic: true, progressive: true },
    { name: 'Digital Strain & Screen Relief', standard: false, blueCut: true, photochromic: true, progressive: true },
    { name: 'Darkens Automatically in Sunlight', standard: false, blueCut: false, photochromic: true, progressive: false },
    { name: 'Multi-Distance Vision (Near & Far)', standard: false, blueCut: false, photochromic: false, progressive: true },
  ];

  const columns: { id: LensTypeId; name: string; icon: any; desc: string }[] = [
    { id: 'standard', name: 'Standard', icon: Shield, desc: 'Everyday clear' },
    { id: 'blueCut', name: 'Blue-Cut', icon: Monitor, desc: 'Digital screens' },
    { id: 'photochromic', name: 'Photochromic', icon: Sun, desc: 'Adapts to sun' },
    { id: 'progressive', name: 'Progressive', icon: Maximize, desc: 'Multifocal' },
  ];

  const currentLens = lensDetails[activeColumn];

  return (
    <section className="py-16 md:py-24 bg-background border-t border-line transition-colors">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles size={13} className="text-primary animate-pulse" />
            Rx +1.00 Lens Guide
          </div>
          <h2 className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Lens Technology</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4 text-foreground tracking-tight">
            Clearer Vision, Better Life
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Explore our advanced optical lens range crafted for exceptional clarity, screen protection, and dynamic sunlight response.
          </p>
        </div>

        {/* Lens Type Tab Selector Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 md:mb-12 px-2 -mx-2 sm:mx-0">
          {columns.map((col) => {
            const Icon = col.icon;
            const isActive = activeColumn === col.id;
            const badgeText = lensDetails[col.id].badge;

            return (
              <button
                key={col.id}
                onClick={() => setActiveColumn(col.id)}
                className={`relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105 z-10'
                    : 'bg-card border-line text-foreground hover:bg-secondary/80'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-primary-foreground' : 'text-primary'} />
                <span>{col.name}</span>
                {badgeText && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-copper animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* MOBILE VIEW (< md): Interactive Lens Spotlight Card */}
        <div className="block md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeColumn}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-card border border-primary/30 rounded-3xl p-6 shadow-xl relative overflow-hidden"
            >
              {/* Background Ambient Glow */}
              <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

              {/* Lens Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <currentLens.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-foreground font-serif">{currentLens.name}</h4>
                    <p className="text-xs text-primary font-medium">{currentLens.tagline}</p>
                  </div>
                </div>

                {currentLens.badge && (
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-copper text-white shadow-sm shrink-0">
                    {currentLens.badge}
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {currentLens.description}
              </p>

              {/* Key Highlights */}
              <div className="flex flex-wrap gap-2 mb-6">
                {currentLens.highlights.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/80 text-foreground text-xs font-medium border border-line"
                  >
                    <Sparkles size={11} className="text-primary" />
                    {item}
                  </span>
                ))}
              </div>

              {/* Features Included Checklist */}
              <div className="space-y-2.5 pt-4 border-t border-line mb-6">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                  Included Features Breakdown
                </div>
                {features.map((feature, idx) => {
                  const isIncluded = feature[activeColumn];
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                        isIncluded
                          ? 'bg-primary/5 border border-primary/15 text-foreground'
                          : 'bg-muted/30 border border-transparent text-muted-foreground/50 opacity-60'
                      }`}
                    >
                      <span className="text-xs font-medium">{feature.name}</span>
                      {isIncluded ? (
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          <Check size={14} /> Included
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground/40 px-2.5 py-0.5">
                          <X size={13} /> N/A
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Consultation CTA Button */}
              <Button
                onClick={openBookingModal}
                size="lg"
                className="w-full rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-6 text-sm btn-brass-sweep border-none shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Consult Optometrist for {currentLens.name}</span>
                <ChevronRight size={16} />
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* DESKTOP VIEW (>= md): Full Interactive Comparison Matrix */}
        <div className="hidden md:block">
          <div className="bg-card border border-line rounded-3xl p-8 shadow-xl overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-5 gap-6 mb-8 items-stretch">
              <div className="col-span-1 flex flex-col justify-center">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
                  Lens Types
                </span>
                <p className="text-xs text-muted-foreground/70 mt-1">Select to highlight feature details</p>
              </div>

              {columns.map((col) => {
                const Icon = col.icon;
                const isActive = activeColumn === col.id;
                const badge = lensDetails[col.id].badge;

                return (
                  <div
                    key={col.id}
                    onClick={() => setActiveColumn(col.id)}
                    className={`text-center p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-between relative ${
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary shadow-xl scale-105 z-10'
                        : 'bg-card border-line text-foreground opacity-75 hover:opacity-100 hover:border-primary/40'
                    }`}
                  >
                    {badge && (
                      <div
                        className={`absolute -top-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm ${
                          isActive ? 'bg-copper text-white' : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {badge}
                      </div>
                    )}
                    <Icon className={`w-8 h-8 mb-3 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                    <div>
                      <h4 className="font-bold text-lg font-serif">{col.name}</h4>
                      <p className={`text-xs mt-1 ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {col.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Rows */}
            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-5 gap-6 items-center py-4 border-b border-line/60 hover:bg-secondary/40 transition-colors rounded-xl px-4"
                >
                  <div className="col-span-1 font-medium text-foreground text-sm">
                    {feature.name}
                  </div>

                  {/* Columns */}
                  {columns.map((col) => {
                    const isIncluded = feature[col.id];
                    const isActiveCol = activeColumn === col.id;

                    return (
                      <div
                        key={col.id}
                        className={`flex justify-center transition-all duration-300 ${
                          isActiveCol ? 'scale-110 opacity-100 font-bold' : 'opacity-40'
                        }`}
                      >
                        {isIncluded ? (
                          <div
                            className={`p-1.5 rounded-full ${
                              isActiveCol
                                ? 'bg-primary-foreground/20 text-primary-foreground'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            <Check className="w-5 h-5" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30 text-xs">—</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="mt-10 text-center">
              <Button
                onClick={openBookingModal}
                size="lg"
                className="rounded-xl bg-primary hover:bg-primary/95 px-8 py-6 text-base text-primary-foreground font-semibold btn-brass-sweep border-none shadow-md cursor-pointer"
              >
                Consult Our Optometrist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
