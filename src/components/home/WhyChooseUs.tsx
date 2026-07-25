'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Stethoscope, Award, Glasses, Baby, Eye, ArrowUpRight } from 'lucide-react';
import { EditableText } from '@/components/admin/EditableText';

gsap.registerPlugin(ScrollTrigger);

// ── Bento card data with rich, high-quality images ──────────────────────────
const bentoCards = [
  {
    id: 'eye-test',
    icon: Stethoscope,
    title: 'Computerized Eye Test',
    desc: 'State-of-the-art clinical precision for perfect vision mapping.',
    image: '/generated/eye-test.jpg',
    big: true,
    accent: 'from-emerald-950/90 via-emerald-950/60 to-transparent',
  },
  {
    id: 'experts',
    icon: Award,
    title: 'Certified Experts',
    desc: 'Board-certified optometrists with 10+ years of clinical experience.',
    image: '/generated/optometrist.jpg',
    big: false,
  },
  {
    id: 'collections',
    icon: Glasses,
    title: 'Premium Collections',
    desc: 'Curated luxury brands & international designer frames.',
    image: '/generated/frames-display.jpg',
    big: false,
  },
  {
    id: 'lenses',
    icon: Eye,
    title: 'Contact Lenses',
    desc: 'Expert fitting for daily, monthly & speciality contact lenses.',
    image: '/generated/contact-lens.jpg',
    big: false,
  },
  {
    id: 'kids',
    icon: Baby,
    title: 'Kids Vision',
    desc: 'Specialised paediatric eye care & durable, colourful frames.',
    image: '/generated/kids-vision.jpg',
    big: false,
  },
];

export default function WhyChooseUs({ content = {} }: { content?: Record<string, any> }) {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Header reveal ──────────────────────────────────────
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 82%' },
        },
      );

      // ── Cards stagger from below ───────────────────────────
      gsap.fromTo(
        '.bento-card',
        { y: 60, opacity: 0, scale: 0.96 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.85,
          stagger: { amount: 0.5, from: 'start' },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 78%',
          },
        },
      );

      // ── Image parallax inside each card ───────────────────
      gsap.utils.toArray<HTMLElement>('.bento-inner-img').forEach(img => {
        gsap.to(img, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.bento-card') as Element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 md:py-36 bg-background overflow-hidden border-t border-line">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">

        {/* ── Section Header ──────────────────────────────────── */}
        <div ref={headerRef} className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3 opacity-80">
            Rx +0.25
          </div>
          <h2 className="text-xs sm:text-sm uppercase tracking-widest text-primary font-semibold mb-4">
            The Mr &amp; Mrs Standard
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium font-serif text-foreground mb-5 leading-tight">
            <EditableText
              table="site_content" idColumn="section_key"
              idValue="home_why_title" updateColumn="text_value"
              value={content['home_why_title']?.text || 'Why Dahegam Chooses Us'}
            />
          </h3>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            <EditableText
              table="site_content" idColumn="section_key"
              idValue="home_why_subtitle" updateColumn="text_value"
              value={content['home_why_subtitle']?.text || 'We combine advanced clinical technology with a curated selection of international frames.'}
            />
          </p>
        </div>

        {/* ── Bento Grid ─────────────────────────────────────── */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 auto-rows-[220px] sm:auto-rows-[250px] lg:auto-rows-[280px]"
        >
          {/* ── Large card (2×2) ─────────────────────────────── */}
          <div className="bento-card sm:col-span-2 lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-[2rem] group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500">
            <div className="bento-inner-img absolute inset-0 w-full h-[115%] -top-[7.5%]">
              <img
                src={bentoCards[0].image}
                alt={bentoCards[0].title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.06]"
                loading="lazy"
              />
            </div>

            {/* Gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/40 to-black/10 transition-opacity duration-500 group-hover:from-black/80" />

            {/* Gold glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D0A64E]/0 to-[#D0A64E]/0 group-hover:from-[#D0A64E]/10 transition-all duration-700 rounded-[2rem]" />

            {/* Icon */}
            <div className="absolute top-7 left-7 z-20 w-14 h-14 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary border border-primary/20 shadow-lg">
              <Stethoscope size={26} strokeWidth={1.5} />
            </div>

            {/* Arrow */}
            <div className="absolute top-7 right-7 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
              <ArrowUpRight size={18} />
            </div>

            {/* Bottom text */}
            <div className="absolute bottom-0 left-0 w-full p-7 z-20">
              <h4 className="text-3xl font-bold font-serif text-white mb-2 drop-shadow-sm">
                {bentoCards[0].title}
              </h4>
              <p className="text-white/75 font-light leading-relaxed text-sm">
                {bentoCards[0].desc}
              </p>
              <div className="mt-4 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-16 rounded-full" />
            </div>
          </div>

          {/* ── Small cards ────────────────────────────────────── */}
          {bentoCards.slice(1).map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bento-card relative overflow-hidden rounded-[1.75rem] group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
              >
                {/* Background image with parallax */}
                <div className="bento-inner-img absolute inset-0 w-full h-[120%] -top-[10%]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.08]"
                    loading="lazy"
                  />
                </div>

                {/* Dark scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 group-hover:from-black/80 transition-all duration-500" />

                {/* Gold overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D0A64E]/0 to-[#D0A64E]/0 group-hover:to-[#D0A64E]/12 transition-all duration-500 rounded-[1.75rem]" />

                {/* Icon badge */}
                <div className="absolute top-5 left-5 z-20 w-11 h-11 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary border border-primary/20">
                  <Icon size={20} strokeWidth={1.5} />
                </div>

                {/* Arrow */}
                <div className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
                  <ArrowUpRight size={15} />
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 w-full p-5 z-20">
                  <h4 className="text-lg font-bold font-serif text-white mb-1">
                    {card.title}
                  </h4>
                  <p className="text-white/65 text-xs font-light leading-relaxed line-clamp-2">
                    {card.desc}
                  </p>
                  <div className="mt-3 h-px w-0 bg-primary transition-all duration-500 group-hover:w-10 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
