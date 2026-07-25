'use client';

import { useEffect, useRef } from 'react';
import { ShieldCheck, Eye, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: ShieldCheck,
    title: '1 Year Warranty',
    description: 'Complete protection on all premium frames and lenses.',
  },
  {
    icon: Eye,
    title: 'Free Clinical Eye Test',
    description: 'Comprehensive 12-step eye examination by certified optometrists.',
  },
  {
    icon: Sparkles,
    title: '100% Genuine',
    description: 'Authentic designer eyewear sourced directly from brands.',
  },
];

export default function TrustStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemsRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-card border-y border-border py-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-border">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                ref={(el) => { itemsRef.current[index] = el; }}
                className={`flex items-start gap-4 ${index !== 0 ? 'pt-8 md:pt-0 md:pl-12' : ''}`}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-lg font-[family-name:var(--font-fraunces)] font-medium text-foreground mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
