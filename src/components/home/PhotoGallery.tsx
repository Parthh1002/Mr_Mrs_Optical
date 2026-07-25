'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ZoomIn, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LOCAL_GALLERY = [
  {
    id: 1,
    src: '/generated/luxury-men.jpg',
    alt: 'Luxury Men Eyewear',
    span: 'col-span-2 row-span-2',
    category: 'Men\'s Collection',
  },
  {
    id: 2,
    src: '/generated/luxury-women.jpg',
    alt: 'Women\'s Designer Frames',
    span: 'col-span-1 row-span-1',
    category: 'Women\'s Collection',
  },
  {
    id: 3,
    src: '/generated/computer-glasses.jpg',
    alt: 'Computer Glasses & Blue-Cut Lenses',
    span: 'col-span-1 row-span-1',
    category: 'Computer Glasses',
  },
  {
    id: 4,
    src: '/generated/frames-display.jpg',
    alt: 'Designer Sunglasses & Boutique Display',
    span: 'col-span-1 row-span-2',
    category: 'Sunglasses',
  },
  {
    id: 5,
    src: '/generated/optometrist.jpg',
    alt: 'Certified Optometrist Consultation',
    span: 'col-span-1 row-span-1',
    category: 'Our Store',
  },
  {
    id: 6,
    src: '/generated/eye-test.jpg',
    alt: 'Computerized Eye Test Clinic',
    span: 'col-span-2 row-span-1',
    category: 'Clinical Eye Test',
  },
];

export default function PhotoGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-item',
        { opacity: 0, y: 32, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? LOCAL_GALLERY.length - 1 : prev - 1) : null));
  const nextImage = () =>
    setLightboxIndex((prev) => (prev !== null ? (prev === LOCAL_GALLERY.length - 1 ? 0 : prev + 1) : null));

  return (
    <section ref={containerRef} className="py-20 sm:py-24 bg-background text-foreground border-t border-line relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles size={13} />
            Visual Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4 text-foreground">
            Boutique Gallery
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Explore our curated studio collection, state-of-the-art optical machinery, and custom-styled frames in Dahegam.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[240px]">
          {LOCAL_GALLERY.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className={`gallery-item ${item.span} relative group overflow-hidden rounded-2xl cursor-pointer bg-muted border border-line shadow-md hover:shadow-2xl transition-all duration-500`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-5">
                <span className="self-end p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                  <ZoomIn size={16} />
                </span>
                <div>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-primary font-bold">
                    {item.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-white mt-1 drop-shadow-md">
                    {item.alt}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50 cursor-pointer"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50 cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="max-w-4xl max-h-[85vh] relative flex flex-col items-center">
            <img
              src={LOCAL_GALLERY[lightboxIndex].src}
              alt={LOCAL_GALLERY[lightboxIndex].alt}
              className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-4 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                {LOCAL_GALLERY[lightboxIndex].category}
              </span>
              <p className="text-lg font-semibold text-white mt-1">
                {LOCAL_GALLERY[lightboxIndex].alt}
              </p>
            </div>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50 cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </section>
  );
}
