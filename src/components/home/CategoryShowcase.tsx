'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { ArrowRight, Heart, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ── Categories with handpicked premium images ────────────────────────────────
const categories = [
  {
    id: 'men',
    name: 'Luxury Men',
    sub: 'Premium frames & sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&auto=format&fit=crop',
    href: '/catalog?category=men',
    colSpan: 'md:col-span-7',
    rowSpan: '',
    tall: true,
  },
  {
    id: 'women',
    name: 'Luxury Women',
    sub: 'Chic designer eyewear',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=900&auto=format&fit=crop',
    href: '/catalog?category=women',
    colSpan: 'md:col-span-5',
    rowSpan: '',
    tall: true,
  },
  {
    id: 'computer',
    name: 'Computer Glasses',
    sub: 'Blue-cut & anti-glare lenses',
    image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=900&auto=format&fit=crop',
    href: '/catalog?category=computer',
    colSpan: 'md:col-span-4',
    rowSpan: '',
    tall: false,
  },
  {
    id: 'kids',
    name: 'Kids Vision',
    sub: 'Durable & colourful frames',
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=900&auto=format&fit=crop',
    href: '/catalog?category=kids',
    colSpan: 'md:col-span-4',
    rowSpan: '',
    tall: false,
  },
  {
    id: 'lenses',
    name: 'Contact Lenses',
    sub: 'Daily, monthly & speciality',
    image: 'https://images.unsplash.com/photo-1573511860302-28c5243198e5?w=900&auto=format&fit=crop',
    href: '/catalog?category=lenses',
    colSpan: 'md:col-span-4',
    rowSpan: '',
    tall: false,
  },
];

// ── Category Card ─────────────────────────────────────────────────────────────
function CategoryCard({
  cat,
  wishlisted,
  onWishlist,
}: {
  cat: (typeof categories)[0];
  wishlisted: boolean;
  onWishlist: (e: React.MouseEvent, id: string) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      href={cat.href}
      className={`category-card relative rounded-[1.75rem] overflow-hidden group block ${cat.colSpan} ${cat.tall ? 'h-[400px] md:h-[440px]' : 'h-[300px] md:h-[320px]'} shadow-md hover:shadow-2xl transition-shadow duration-500`}
    >
      {/* Shimmer placeholder while image loads */}
      {!imgLoaded && (
        <div className="absolute inset-0 bg-surface-2 animate-pulse" />
      )}

      {/* Image with inner parallax */}
      <img
        src={cat.image}
        alt={cat.name}
        onLoad={() => setImgLoaded(true)}
        className={`absolute inset-0 w-full h-[115%] -top-[7.5%] object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.08] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
      />

      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/30 to-black/0 transition-opacity duration-500 group-hover:from-black/80" />

      {/* Gold shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(135deg, rgba(208,166,78,0.08) 0%, transparent 60%)' }}
      />

      {/* Gold border ring on hover */}
      <div className="absolute inset-0 rounded-[1.75rem] ring-0 group-hover:ring-2 ring-[#D0A64E]/50 transition-all duration-400 pointer-events-none" />

      {/* Wishlist button */}
      <button
        onClick={(e) => onWishlist(e, cat.id)}
        className={`absolute top-5 right-5 z-20 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-all duration-300 ${
          wishlisted
            ? 'bg-primary border-primary text-primary-foreground scale-110'
            : 'bg-black/40 border-white/15 text-white hover:bg-primary hover:border-primary hover:text-primary-foreground'
        }`}
        aria-label="Toggle wishlist"
      >
        <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Content — slides up on hover */}
      <div className="absolute bottom-0 left-0 w-full px-6 pb-6 z-10">
        {/* Title */}
        <h4 className="text-2xl md:text-3xl font-medium font-serif text-white drop-shadow-md transition-transform duration-400 group-hover:-translate-y-1">
          {cat.name}
        </h4>

        {/* Subtitle + arrow — always visible on touch/mobile, hover slide-up on desktop */}
        <div className="mt-2 flex items-center justify-between max-sm:opacity-100 max-sm:translate-y-0 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-50">
          <span className="text-white/70 text-sm font-light">{cat.sub}</span>
          <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider">
            Explore <ArrowUpRight size={13} />
          </div>
        </div>

        {/* Gold underline */}
        <div className="mt-3 h-0.5 w-0 bg-primary rounded-full transition-all duration-500 group-hover:w-14" />
      </div>
    </Link>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function CategoryShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});

  // Load saved wishlist state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mrandmrs_wishlist');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        setWishlisted(Object.fromEntries(ids.map(id => [id, true])));
      }
    } catch { /* ignore */ }
  }, []);

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.cat-header',
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.cat-header', start: 'top 84%' },
        },
      );

      // Cards stagger with slight scale
      gsap.fromTo('.category-card',
        { y: 55, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.85,
          stagger: { amount: 0.45, from: 'start' },
          ease: 'power3.out',
          scrollTrigger: { trigger: '.cats-grid', start: 'top 78%' },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    setWishlisted(prev => {
      const next = { ...prev, [id]: !prev[id] };

      // Persist to localStorage
      try {
        const ids = Object.entries(next)
          .filter(([, v]) => v)
          .map(([k]) => k);
        localStorage.setItem('mrandmrs_wishlist', JSON.stringify(ids));
        window.dispatchEvent(new Event('wishlistUpdated'));
      } catch { /* ignore */ }

      return next;
    });
  };

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-background border-t border-line overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="cat-header flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 md:mb-16 gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3 opacity-80">
              Rx +0.50
            </div>
            <h2 className="text-xs sm:text-sm uppercase tracking-widest text-primary font-semibold mb-3">
              Discover
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium font-serif text-foreground leading-tight">
              Shop by Category
            </h3>
          </div>
          <Link
            href="/catalog"
            className="group hidden sm:flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors duration-200 uppercase tracking-[0.1em] text-xs"
          >
            View All Collections
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* ── Top row: 2 tall cards ────────────────────────────── */}
        <div className="cats-grid flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-5">
          {/* Top row */}
          <div className="md:col-span-7">
            <CategoryCard cat={categories[0]} wishlisted={!!wishlisted[categories[0].id]} onWishlist={toggleWishlist} />
          </div>
          <div className="md:col-span-5">
            <CategoryCard cat={categories[1]} wishlisted={!!wishlisted[categories[1].id]} onWishlist={toggleWishlist} />
          </div>

          {/* Bottom row: 3 equal cards */}
          <div className="md:col-span-4">
            <CategoryCard cat={categories[2]} wishlisted={!!wishlisted[categories[2].id]} onWishlist={toggleWishlist} />
          </div>
          <div className="md:col-span-4">
            <CategoryCard cat={categories[3]} wishlisted={!!wishlisted[categories[3].id]} onWishlist={toggleWishlist} />
          </div>
          <div className="md:col-span-4">
            <CategoryCard cat={categories[4]} wishlisted={!!wishlisted[categories[4].id]} onWishlist={toggleWishlist} />
          </div>
        </div>

        {/* Mobile: View All button */}
        <div className="mt-8 flex sm:hidden justify-center">
          <Link
            href="/catalog"
            className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest hover:underline"
          >
            View All Collections <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
