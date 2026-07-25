'use client';

import { motion } from 'framer-motion';

const images = [
  { url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-2' },
  { url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { url: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=800&auto=format&fit=crop', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
  { url: 'https://images.unsplash.com/photo-1572631382901-cece06241203?q=80&w=800&auto=format&fit=crop', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { url: 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?q=80&w=800&auto=format&fit=crop', colSpan: 'col-span-1 md:col-span-3', rowSpan: 'row-span-2' },
];

export default function GalleryPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
          >
            Gallery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            A visual journey through our clinic, happy customers, and premium eyewear collections.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
          {images.map((image, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl overflow-hidden group ${image.colSpan} ${image.rowSpan}`}
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-300" />
              <img 
                src={image.url} 
                alt="Gallery Item" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
