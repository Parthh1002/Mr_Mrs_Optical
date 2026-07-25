'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBookingModal } from '@/store/bookingModalStore';
import { supabase } from '@/lib/supabase';

const DEFAULT_TARGET = '2026-12-31T23:59:59';

export default function FestivalOffers({ content = {} }: { content?: Record<string, any> }) {
  const openBookingModal = useBookingModal(state => state.open);
  const [showPopup, setShowPopup] = useState(false);

  // Admin Countdown Config State
  const [isActive, setIsActive] = useState(true);
  const [title, setTitle] = useState('End of Season Sale');
  const [subtitle, setSubtitle] = useState('Get up to 50% off on polarized sunglasses and premium frames. Limited time only.');
  const [targetDateStr, setTargetDateStr] = useState(DEFAULT_TARGET);
  const [ctaText, setCtaText] = useState('Claim Offer Now');

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Load Admin Countdown Settings
  const loadCountdownSettings = useCallback(async () => {
    try {
      // Check localStorage backup first for instant reactivity
      const localSaved = localStorage.getItem('mrandmrs_sale_countdown');
      if (localSaved) {
        const parsed = JSON.parse(localSaved);
        if (parsed.active !== undefined) setIsActive(parsed.active);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.subtitle) setSubtitle(parsed.subtitle);
        if (parsed.target) setTargetDateStr(parsed.target);
        if (parsed.cta) setCtaText(parsed.cta);
      }

      // Fetch from Supabase site_content
      const { data } = await supabase.from('site_content').select('*').in('key', [
        'sale_countdown_active', 'sale_countdown_title', 'sale_countdown_subtitle', 'sale_countdown_target', 'sale_countdown_cta'
      ]);

      if (data && data.length > 0) {
        const map: Record<string, string> = {};
        data.forEach(item => { map[item.key] = item.text_content || ''; });

        if (map['sale_countdown_active'] !== undefined) setIsActive(map['sale_countdown_active'] === 'true');
        if (map['sale_countdown_title']) setTitle(map['sale_countdown_title']);
        if (map['sale_countdown_subtitle']) setSubtitle(map['sale_countdown_subtitle']);
        if (map['sale_countdown_target']) setTargetDateStr(map['sale_countdown_target']);
        if (map['sale_countdown_cta']) setCtaText(map['sale_countdown_cta']);
      }
    } catch {
      /* fallback to defaults */
    }
  }, []);

  useEffect(() => {
    loadCountdownSettings();

    window.addEventListener('countdownUpdated', loadCountdownSettings);
    return () => window.removeEventListener('countdownUpdated', loadCountdownSettings);
  }, [loadCountdownSettings]);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 6000);

    const calculateTimeLeft = () => {
      const targetTime = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (isNaN(difference) || difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [targetDateStr]);

  if (!isActive) return null;

  return (
    <>
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#8A5A1F] via-[#A8722B] to-[#6E4413] text-[#F4EFE3] relative overflow-hidden transition-all">
        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="offer-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M 36 0 L 0 0 0 36" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#offer-grid)" />
          </svg>
        </div>

        {/* Ambient Radial Glass Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10 text-center max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md text-amber-200 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest mb-6 border border-amber-300/30 shadow-lg">
            <Sparkles size={14} className="text-amber-300 animate-pulse" />
            <span>Limited Time Offer</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif mb-4 tracking-tight text-white drop-shadow-md">
            {title}
          </h2>
          
          <p className="text-sm sm:text-lg md:text-xl text-amber-100/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>

          {/* 💎 ULTRA-LUXURY GLASSMORPHISM COUNTDOWN TIMER 💎 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 md:gap-8 max-w-3xl mx-auto mb-10 px-2">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINUTES', value: timeLeft.minutes },
              { label: 'SECONDS', value: timeLeft.seconds },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/15 shadow-2xl overflow-hidden"
              >
                {/* Inner Gloss Shine Reflection */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent pointer-events-none" />

                <span className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-mono text-white tracking-tight drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                  {item.value.toString().padStart(2, '0')}
                </span>

                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-amber-200/90 mt-2 font-bold">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Action Button */}
          <Link href="/catalog">
            <Button
              size="lg"
              className="rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 sm:px-10 py-6 text-sm sm:text-base gap-2 shadow-2xl hover:-translate-y-1 transition-all border-none cursor-pointer btn-brass-sweep"
            >
              <span>{ctaText}</span>
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Theme-aware Toast / Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 left-6 z-50 max-w-sm bg-card rounded-3xl p-6 shadow-2xl border border-line text-foreground"
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-secondary/80 w-8 h-8 rounded-full flex items-center justify-center transition-colors border border-line cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
              <Clock size={24} />
            </div>
            <h4 className="text-xl font-bold font-serif mb-2">
              Unlock 20% Off Today!
            </h4>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Book your free computerized eye test today and receive an exclusive 20% discount on your entire purchase.
            </p>
            <Button
              onClick={() => { setShowPopup(false); openBookingModal(); }}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md btn-brass-sweep border-none py-6 cursor-pointer"
            >
              Book Free Eye Test
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
