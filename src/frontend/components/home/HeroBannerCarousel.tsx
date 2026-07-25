'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingModal } from '@/store/bookingModalStore';

// ── Default slides (can be overridden from admin/DB) ──────────────────────────
export const DEFAULT_SLIDES = [
  {
    id: 'slide-1',
    badge: null,
    headline: 'See The World',
    headline2: 'With Elegance.',
    subtitle: 'Curated collections of premium eyewear for those who appreciate the finer details. Trusted by 5,000+ happy customers in Dahegam.',
    cta_text: 'Book Free Eye Test',
    cta_type: 'booking', // 'booking' | 'link'
    cta_href: '/catalog',
    cta2_text: 'Explore Collection',
    cta2_href: '/catalog',
    image: '/generated/banner-hero.jpg',
    overlay: 'from-background/95 via-background/75 to-transparent',
  },
  {
    id: 'slide-2',
    badge: '🎉 MONSOON SALE — FLAT 30% OFF',
    headline: 'Premium Frames',
    headline2: 'At Unreal Prices.',
    subtitle: 'Limited time offer on 500+ designer frames. Use code MONSOON30 at checkout. Valid till stock lasts!',
    cta_text: 'Shop The Sale',
    cta_type: 'link',
    cta_href: '/catalog?offer=monsoon',
    cta2_text: 'View All Frames',
    cta2_href: '/catalog',
    image: '/generated/banner-sale.jpg',
    overlay: 'from-background/92 via-background/65 to-background/10',
  },
  {
    id: 'slide-3',
    badge: '✅ 100% FREE — No Hidden Charges',
    headline: 'Computerized',
    headline2: 'Eye Test Free.',
    subtitle: 'Get a comprehensive 12-step eye examination by our certified optometrists. Book today — completely free with every frame purchase.',
    cta_text: 'Book Eye Test',
    cta_type: 'booking',
    cta_href: '/services',
    cta2_text: 'Our Services',
    cta2_href: '/services',
    image: '/generated/banner-eyetest.jpg',
    overlay: 'from-background/95 via-background/70 to-background/5',
  },
  {
    id: 'slide-4',
    badge: '✨ NEW ARRIVAL — SUMMER 2025',
    headline: 'Fresh Styles,',
    headline2: 'Just Arrived.',
    subtitle: 'The Summer 2025 collection is here! Explore the latest international designer frames, sunglasses & contact lenses — exclusively at Mr & Mrs Optical.',
    cta_text: 'Shop New Arrivals',
    cta_type: 'link',
    cta_href: '/catalog?filter=new',
    cta2_text: 'View Lookbook',
    cta2_href: '/gallery',
    image: '/generated/banner-collection.jpg',
    overlay: 'from-background/90 via-background/60 to-transparent',
  },
];

// ── Slide transition variants ─────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
    transition: { duration: 0.55, ease: [0.32, 0.72, 0, 1] as const },
  }),
};

const textVariants = {
  hidden: { y: 32, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

interface Slide {
  id: string;
  badge: string | null;
  headline: string;
  headline2: string;
  subtitle: string;
  cta_text: string;
  cta_type: string;
  cta_href: string;
  cta2_text: string;
  cta2_href: string;
  image: string;
  overlay: string;
}

interface Props {
  slides?: Slide[];
  autoPlayMs?: number;
}

export default function HeroBannerCarousel({ slides = DEFAULT_SLIDES, autoPlayMs = 3000 }: Props) {
  const openBookingModal = useBookingModal(s => s.open);
  const [[current, dir], setPage] = useState([0, 0]);
  const [paused, setPaused]       = useState(false);
  const intervalRef               = useRef<ReturnType<typeof setInterval> | null>(null);

  // Touch swipe tracking
  const touchStartX = useRef(0);
  const touchEndX   = useRef(0);

  const goTo = useCallback((idx: number, direction: number) => {
    setPage([idx, direction]);
  }, []);

  const next = useCallback(() => {
    const nextIdx = (current + 1) % slides.length;
    goTo(nextIdx, 1);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    const prevIdx = (current - 1 + slides.length) % slides.length;
    goTo(prevIdx, -1);
  }, [current, slides.length, goTo]);

  // Auto-play timer
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, autoPlayMs);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next, paused, autoPlayMs]);

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 40) {
      delta > 0 ? next() : prev();
    }
    // Resume after swipe
    setTimeout(() => setPaused(false), 1500);
  };

  const slide = slides[current];

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Slide Images ─────────────────────────────────────────── */}
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background image with Ken Burns zoom */}
          <motion.img
            src={slide.image}
            alt={slide.headline}
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: 'linear' }}
          />

          {/* Gradient scrim */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-70" />
        </motion.div>
      </AnimatePresence>

      {/* ── Slide Text Content ────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="max-w-2xl lg:max-w-3xl">

            {/* Badge */}
            <AnimatePresence mode="wait">
              {slide.badge && (
                <motion.div
                  key={`badge-${slide.id}`}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="mb-4 inline-block"
                >
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    {slide.badge}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Headline */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`h1-${slide.id}`}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-foreground leading-[1.1] mb-4 drop-shadow-md"
              >
                <motion.span
                  className="block overflow-hidden"
                  custom={0}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {slide.headline}
                </motion.span>
                <motion.span
                  className="block overflow-hidden text-primary"
                  custom={1}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {slide.headline2}
                </motion.span>
              </motion.h1>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${slide.id}`}
                custom={2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed mb-8"
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* CTA Buttons */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`cta-${slide.id}`}
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                {slide.cta_type === 'booking' ? (
                  <Button
                    onClick={openBookingModal}
                    size="lg"
                    className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg border-none btn-brass-sweep cursor-pointer flex items-center gap-2 group w-full sm:w-auto justify-center"
                  >
                    {slide.cta_text}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Link href={slide.cta_href} className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg border-none btn-brass-sweep cursor-pointer flex items-center gap-2 group w-full justify-center"
                    >
                      {slide.cta_text}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}

                <Link href={slide.cta2_href} className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium bg-transparent hover:bg-muted text-foreground border border-line-strong rounded-xl w-full justify-center"
                  >
                    {slide.cta2_text}
                  </Button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Prev / Next Arrows ────────────────────────────────────── */}
      <button
        onClick={() => { prev(); setPaused(true); setTimeout(() => setPaused(false), 2000); }}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-background/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 shadow-lg"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => { next(); setPaused(true); setTimeout(() => setPaused(false), 2000); }}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-background/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 shadow-lg"
      >
        <ChevronRight size={18} />
      </button>

      {/* ── Dot Indicators ───────────────────────────────────────── */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { goTo(i, i > current ? 1 : -1); setPaused(true); setTimeout(() => setPaused(false), 2000); }}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-7 h-2 bg-primary'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* ── Progress Bar ─────────────────────────────────────────── */}
      {!paused && (
        <motion.div
          key={`progress-${slide.id}`}
          className="absolute bottom-0 left-0 h-[3px] bg-primary z-30 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: autoPlayMs / 1000, ease: 'linear' }}
          style={{ width: '100%' }}
        />
      )}
    </div>
  );
}
