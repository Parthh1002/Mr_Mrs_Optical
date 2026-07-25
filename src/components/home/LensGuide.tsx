'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Monitor, Sun, Maximize, Shield, Sparkles, ChevronRight, Eye, ShieldCheck, Zap } from 'lucide-react';
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
  const [selectedLens, setSelectedLens] = useState<LensTypeId>('photochromic');

  const lensDetails: Record<LensTypeId, LensInfo> = {
    standard: {
      id: 'standard',
      name: 'Standard Optical Lens',
      tagline: 'Everyday crystal-clear & durable vision',
      description: 'High-quality optical clarity engineered for single-vision prescriptions. Perfect for daily casual use with essential scratch resistance and glare reduction.',
      icon: Shield,
      bgGlow: 'from-amber-500/10 via-amber-500/5 to-transparent',
      highlights: ['Crystal Clear Optics', 'Durable Scratch Guard', 'Lightweight Daily Wear'],
    },
    blueCut: {
      id: 'blueCut',
      name: 'Blue-Cut Screen Lens',
      tagline: 'Ultimate digital screen & eyestrain protection',
      description: 'Advanced optical filters block high-energy blue light from smartphones, monitors, and TVs. Prevents digital eyestrain, headaches, and sleep disruption.',
      icon: Monitor,
      badge: 'Screen Essential',
      bgGlow: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      highlights: ['Blue Light Filter Tech', 'Anti-Glare Shield', 'Reduces Eye Fatigue'],
    },
    photochromic: {
      id: 'photochromic',
      name: 'Photochromic Adaptive Lens',
      tagline: 'Adapts dynamically to ambient sunlight & UV rays',
      description: 'Smart light-reactive lenses that stay crystal clear indoors and automatically shade into protective sunglasses when stepping into bright outdoor sunlight.',
      icon: Sun,
      badge: 'Most Popular',
      bgGlow: 'from-amber-600/15 via-orange-500/5 to-transparent',
      highlights: ['2-in-1 Indoor & Sunglasses', '100% Broad UV400 Protection', 'Instant Light Adaptation'],
    },
    progressive: {
      id: 'progressive',
      name: 'Progressive Multifocal Lens',
      tagline: 'Seamless multi-distance vision with no visible lines',
      description: 'Next-generation lens design providing smooth focus transitions between reading up close, computer distance, and viewing far away without bifocal lines.',
      icon: Maximize,
      badge: 'Multivision',
      bgGlow: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      highlights: ['No Visible Bifocal Lines', 'Natural Focus Transition', 'All-in-One Vision Solution'],
    },
  };

  const featureList: FeatureBenefit[] = [
    {
      name: 'Anti-Reflective Coating',
      description: 'Eliminates distracting reflections for sharper vision during night driving & video calls.',
      includedIn: { standard: true, blueCut: true, photochromic: true, progressive: true },
    },
    {
      name: 'Scratch-Resistant Armor',
      description: 'Hardened outer coating shielding lenses from everyday scuffs and scratches.',
      includedIn: { standard: true, blueCut: true, photochromic: true, progressive: true },
    },
    {
      name: '100% UV400 Protection',
      description: 'Complete broad-spectrum protection shielding eyes against UVA & UVB rays.',
      includedIn: { standard: false, blueCut: true, photochromic: true, progressive: true },
    },
    {
      name: 'Digital Strain Relief',
      description: 'Filters blue light from digital displays to minimize eyestrain and headaches.',
      includedIn: { standard: false, blueCut: true, photochromic: true, progressive: true },
    },
    {
      name: 'Sunlight Adaptive Darkening',
      description: 'Intelligent light activation darkens lenses outdoors into stylish sunglasses.',
      includedIn: { standard: false, blueCut: false, photochromic: true, progressive: false },
    },
    {
      name: 'Multi-Distance Precision',
      description: 'Seamless optical progression across near, intermediate, and far viewing zones.',
      includedIn: { standard: false, blueCut: false, photochromic: false, progressive: true },
    },
  ];

  const lensOptions: { id: LensTypeId; name: string; icon: any; shortDesc: string }[] = [
    { id: 'standard', name: 'Standard', icon: Shield, shortDesc: 'Everyday Clear' },
    { id: 'blueCut', name: 'Blue-Cut', icon: Monitor, shortDesc: 'Digital Screen Care' },
    { id: 'photochromic', name: 'Photochromic', icon: Sun, shortDesc: 'Adapts to Sunlight' },
    { id: 'progressive', name: 'Progressive', icon: Maximize, shortDesc: 'Seamless Multifocal' },
  ];

  const currentLens = lensDetails[selectedLens];
  const includedFeatures = featureList.filter(f => f.includedIn[selectedLens]);

  return (
    <section className="py-16 md:py-24 bg-background border-t border-line transition-colors">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles size={13} className="text-primary animate-pulse" />
            Lens Technology Showcase
          </div>
          <h2 className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Optical Excellence</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4 text-foreground tracking-tight">
            Find Your Perfect Lens
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Select a lens type below to explore its specific features, protection levels, and optical benefits.
          </p>
        </div>

        {/* Interactive Lens Category Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
          {lensOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedLens === opt.id;
            const badgeText = lensDetails[opt.id].badge;

            return (
              <button
                key={opt.id}
                onClick={() => setSelectedLens(opt.id)}
                className={`relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer border ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-xl scale-[1.03] z-10'
                    : 'bg-card border-line text-foreground hover:bg-secondary/80 hover:border-primary/40'
                }`}
              >
                {badgeText && (
                  <span
                    className={`absolute -top-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm ${
                      isSelected ? 'bg-copper text-white' : 'bg-primary/90 text-primary-foreground'
                    }`}
                  >
                    {badgeText}
                  </span>
                )}
                <Icon size={26} className={`mb-2.5 ${isSelected ? 'text-primary-foreground' : 'text-primary'}`} />
                <h4 className="font-bold text-sm sm:text-base font-serif">{opt.name}</h4>
                <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {opt.shortDesc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Lens Spotlight Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLens}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.99 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-card border border-primary/25 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentLens.bgGlow} pointer-events-none`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Overview & CTAs */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                      <currentLens.icon className="w-8 h-8" />
                    </div>
                    <div>
                      {currentLens.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono block mb-0.5">
                          {currentLens.badge}
                        </span>
                      )}
                      <h4 className="font-bold text-2xl sm:text-3xl text-foreground font-serif">
                        {currentLens.name}
                      </h4>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-primary mb-3">
                    {currentLens.tagline}
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {currentLens.description}
                  </p>

                  {/* Highlights Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentLens.highlights.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-secondary text-foreground text-xs font-medium border border-line"
                      >
                        <Zap size={12} className="text-primary" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-line/60">
                  <Button
                    onClick={openBookingModal}
                    size="lg"
                    className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-8 py-6 text-sm btn-brass-sweep border-none shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Consult Optometrist for {currentLens.name}</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>

              {/* Right Column: Included Features Breakdown Cards */}
              <div className="lg:col-span-7 bg-background/60 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-line/80">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-line">
                  <span className="font-mono text-xs uppercase tracking-wider text-foreground font-bold flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    Included Features ({includedFeatures.length})
                  </span>
                  <span className="text-xs text-muted-foreground">Tailored Optics</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {includedFeatures.map((feat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="p-3.5 rounded-xl bg-card border border-primary/15 hover:border-primary/40 transition-all flex items-start gap-3 shadow-xs"
                    >
                      <div className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20">
                        <Check size={14} />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-foreground font-serif">{feat.name}</h5>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          {feat.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
