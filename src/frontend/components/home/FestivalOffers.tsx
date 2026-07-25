'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EditableText } from '@/components/admin/EditableText';
import { useBookingModal } from '@/store/bookingModalStore';

// Define a real target future date (e.g. October 31, 2026) so it doesn't reset on re-render
const TARGET_DATE_STR = '2026-10-31T23:59:59';

export default function FestivalOffers({ content = {} }: { content?: Record<string, any> }) {
  const openBookingModal = useBookingModal(state => state.open);
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Show popup after 5 seconds on page load
    const timer = setTimeout(() => setShowPopup(true), 5000);
    
    // Calculate initial time left
    const calculateTimeLeft = () => {
      const targetTime = new Date(TARGET_DATE_STR).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
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

    // REAL countdown timer ticking every second
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="offer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#offer-grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          {/* Rx eyebrow badge */}
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-4 flex items-center justify-center gap-2">
            <span>Rx +1.50</span>
            <span className="w-2 h-2 bg-accent inline-block rounded-sm"></span>
          </div>

          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8 border border-accent/30">
            <Gift size={16} /> Limited Time Offer
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold font-serif mb-8">
            <EditableText 
              table="site_content"
              idColumn="section_key"
              idValue="home_offer_title"
              updateColumn="text_value"
              value={content['home_offer_title']?.text || "End of Season Sale"}
            />
          </h2>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto mb-12">
            <EditableText 
              table="site_content"
              idColumn="section_key"
              idValue="home_offer_subtitle"
              updateColumn="text_value"
              value={content['home_offer_subtitle']?.text || "Get up to 50% off on polarized sunglasses and premium frames. Limited time only."}
            />
          </p>

          {/* Countdown Clock Display */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((time, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-foreground/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-bold font-mono shadow-lg border border-primary-foreground/20 mb-3">
                  {time.value.toString().padStart(2, '0')}
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.1em] text-primary-foreground/80">{time.label}</span>
              </div>
            ))}
          </div>

          <Link href="/catalog">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl h-16 px-10 text-lg gap-2 shadow-2xl hover:-translate-y-1 transition-all border-none btn-brass-sweep">
              Claim Offer Now <ArrowRight size={20} />
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
