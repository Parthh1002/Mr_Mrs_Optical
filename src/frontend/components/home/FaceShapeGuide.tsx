'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';

const faceShapes = [
  {
    id: 'oval',
    name: 'Oval Face',
    description: 'Balanced proportions with slightly wider cheekbones.',
    recommendation: 'Walnut & Rectangle Frames',
    reason: 'Maintain natural balance. Avoid oversized frames.',
    frames: ['Geometric', 'Rectangle', 'Aviator'],
    image: '/generated/luxury-women.jpg',
  },
  {
    id: 'round',
    name: 'Round Face',
    description: 'Full cheeks with a rounded chin and hairline.',
    recommendation: 'Square & Geometric Frames',
    reason: 'Adds angles and definition to soft features.',
    frames: ['Square', 'Wayfarer', 'Cat-Eye'],
    image: '/generated/luxury-men.jpg',
  },
  {
    id: 'square',
    name: 'Square Face',
    description: 'Strong jawline with a broad forehead.',
    recommendation: 'Round & Oval Frames',
    reason: 'Softens angular features and elongates the face.',
    frames: ['Round', 'Oval', 'Wireframe'],
    image: '/generated/frames-display.jpg',
  },
  {
    id: 'heart',
    name: 'Heart Face',
    description: 'Wider forehead tapering down to a narrow chin.',
    recommendation: 'Bottom-Heavy & Rimless Frames',
    reason: 'Balances the width of the upper face.',
    frames: ['Aviator', 'Rimless', 'Light Colored'],
    image: '/generated/computer-glasses.jpg',
  },
];

export default function FaceShapeGuide() {
  const [activeShape, setActiveShape] = useState(faceShapes[0]);

  return (
    <section className="py-20 sm:py-24 bg-background text-foreground border-t border-line relative overflow-hidden">
      {/* Background ambient lighting glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles size={13} />
            Personal Styling
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4 text-foreground">
            Find Frames For Your Face
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Select your face shape to discover tailor-made eyewear recommendations designed to highlight your best features.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 mb-12">
          {faceShapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => setActiveShape(shape)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border cursor-pointer ${
                activeShape.id === shape.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                  : 'bg-card border-line text-foreground hover:bg-muted'
              }`}
            >
              {shape.name}
            </button>
          ))}
        </div>

        {/* Selected Shape Content Card */}
        <div className="max-w-4xl mx-auto bg-card border border-line rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeShape.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              {/* Image Preview */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-line shadow-md group">
                <img
                  src={activeShape.image}
                  alt={activeShape.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                    Recommended Style
                  </span>
                  <h4 className="text-lg font-serif font-bold mt-0.5">{activeShape.recommendation}</h4>
                </div>
              </div>

              {/* Information Text */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-2">
                    {activeShape.name}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {activeShape.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/60 border border-line">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Stylist Tip</p>
                  <p className="text-sm text-foreground">{activeShape.reason}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Recommended Frame Shapes:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeShape.frames.map((frame) => (
                      <span
                        key={frame}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold border border-primary/20"
                      >
                        <Check size={12} />
                        {frame}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/catalog?search=${encodeURIComponent(activeShape.recommendation)}`}>
                    <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-6 text-sm font-bold gap-2 btn-brass-sweep border-none cursor-pointer">
                      Explore Matching Frames <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
