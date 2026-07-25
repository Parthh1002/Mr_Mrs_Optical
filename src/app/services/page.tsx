'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Stethoscope, Sparkles, RefreshCw, Baby, Wrench, ChevronDown, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const services = [
  { 
    icon: Stethoscope, 
    title: 'Computerized Eye Test', 
    slug: 'eye-test',
    desc: 'State-of-the-art digital eye examination for perfect precision vision mapping.' 
  },
  { 
    icon: Eye, 
    title: 'Contact Lens Fitting', 
    slug: 'contact-fitting',
    desc: 'Expert mapping and trial consultation for comfortable and clear contact lenses.' 
  },
  { 
    icon: Sparkles, 
    title: 'Frame Styling Consultation', 
    slug: 'frame-styling',
    desc: 'Let our style experts match the perfect frame shape and color to your natural features.' 
  },
  { 
    icon: RefreshCw, 
    title: 'Lens Replacement', 
    slug: 'lens-replacement',
    desc: 'Refresh your favorite existing frames with high-performance advanced prescription lenses.' 
  },
  { 
    icon: Baby, 
    title: 'Kids Vision Screening', 
    slug: 'kids-screening',
    desc: 'Specialized gentle care, pediatric tests, and durable, fun frames designed for children.' 
  },
  { 
    icon: Wrench, 
    title: 'Frame Repair & Adjustment', 
    slug: 'repair',
    desc: 'Custom alignment, frame tightening, nose pad replacement, and minor repairs to keep your eyewear secure.' 
  },
];

const faqs = [
  {
    q: 'How often should I get my eyes tested?',
    a: 'We recommend a comprehensive clinical eye test once every 12 to 18 months, or sooner if you experience any headaches, eye strain, or sudden changes in your vision.'
  },
  {
    q: 'What should I bring to my eye test appointment?',
    a: 'Please bring your current eyeglasses, any contact lens brand details you wear, and any previous optical prescriptions you have.'
  },
  {
    q: 'Do you offer a warranty on frames and lenses?',
    a: 'Yes, we offer a comprehensive 1-year warranty on all our premium frames and lenses against any manufacturing defects.'
  },
  {
    q: 'How long does it take to get my new glasses?',
    a: 'Most standard single-vision glasses are crafted and ready within 24 to 48 hours. Premium progressive or customized blue-cut lenses may take up to 3 to 5 business days.'
  }
];

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3">
            Rx +2.50
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Clinical Services
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive eye care solutions and boutique styling consultations tailored to your unique lifestyle.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, i) => (
            <div 
              key={i}
              className="group bg-card border border-line p-8 rounded-[2rem] hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-brass-dim rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-105 transition-transform">
                  <service.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-3 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-light">
                  {service.desc}
                </p>
              </div>
              <Link 
                href={`/book?service=${service.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.1em] text-primary hover:text-primary/80 transition-colors group/link mt-auto pt-4 border-t border-line/40"
              >
                <span>Book this service</span>
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto mb-24 border-t border-line pt-20">
          <div className="text-center mb-12">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3">
              Rx +2.75
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-card border border-line rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-5 text-left font-serif font-semibold text-lg flex items-center justify-between text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      size={20} 
                      className={`transition-transform duration-300 text-primary ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed font-light border-t border-line/40 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Panel */}
        <div className="bg-primary text-primary-foreground rounded-[2.5rem] p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ctaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ctaGrid)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready for clearer vision?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg font-light">
              Book an appointment today and experience the difference of premium clinical eye care.
            </p>
            <Link href="/book">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/95 rounded-xl h-14 px-8 font-semibold gap-2 border-none shadow-md btn-brass-sweep">
                <Calendar size={18} /> Book Your Appointment
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
