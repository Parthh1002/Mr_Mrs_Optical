'use client';

const brands = [
  'Ray-Ban', 'Oakley', 'Gucci', 'Prada', 'Tom Ford', 'Persol', 'Oliver Peoples', 'Cartier', 'Dior', 'Chanel'
];

export default function BrandsMarquee() {
  return (
    <section className="py-20 bg-background overflow-hidden border-t border-line">
      <div className="container mx-auto px-6 mb-12 text-center">
        {/* Monospace Eyebrow Badge */}
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3">
          Rx +1.25
        </div>
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
          Authorized Retailer For
        </h2>
      </div>
      
      <div className="relative flex overflow-x-hidden group border-y border-line py-8 bg-surface">
        {/* Double the list and translate -50% for infinite scroll. Pause on hover. */}
        <div className="animate-marquee whitespace-nowrap flex items-center group-hover:[animation-play-state:paused] transition-all">
          {[...brands, ...brands].map((brand, idx) => (
            <span 
              key={idx} 
              className="mx-12 text-3xl md:text-5xl font-bold font-serif text-foreground/20 hover:text-primary transition-colors duration-300 cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
        
        {/* Gradients for smooth fade effect at edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-surface to-transparent pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-surface to-transparent pointer-events-none z-10"></div>
      </div>
    </section>
  );
}
