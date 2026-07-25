'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, GripVertical, Eye, EyeOff,
  ChevronUp, ChevronDown, Save, Image as ImageIcon,
  ToggleLeft, ToggleRight, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DEFAULT_SLIDES } from '@/components/home/HeroBannerCarousel';

type Slide = typeof DEFAULT_SLIDES[0];

const EMPTY_SLIDE: Slide = {
  id: '',
  badge: '',
  headline: 'New Slide',
  headline2: 'Your Tagline.',
  subtitle: 'Add your promotional message here.',
  cta_text: 'Shop Now',
  cta_type: 'link',
  cta_href: '/catalog',
  cta2_text: 'Learn More',
  cta2_href: '/about',
  image: '/generated/banner-hero.jpg',
  overlay: 'from-background/90 via-background/65 to-transparent',
};

export default function BannersAdmin() {
  const [slides, setSlides]           = useState<Slide[]>(DEFAULT_SLIDES);
  const [editIdx, setEditIdx]         = useState<number | null>(null);
  const [autoPlayMs, setAutoPlayMs]   = useState(3000);
  const [saved, setSaved]             = useState(false);
  const [previewing, setPreviewing]   = useState<number | null>(null);

  const update = (idx: number, field: keyof Slide, value: string) => {
    setSlides(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const addSlide = () => {
    const newSlide = { ...EMPTY_SLIDE, id: `slide-${Date.now()}` };
    setSlides(prev => [...prev, newSlide]);
    setEditIdx(slides.length);
  };

  const removeSlide = (idx: number) => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, i) => i !== idx));
    setEditIdx(null);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setSlides(prev => {
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
    setEditIdx(idx - 1);
  };

  const moveDown = (idx: number) => {
    if (idx === slides.length - 1) return;
    setSlides(prev => {
      const arr = [...prev];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr;
    });
    setEditIdx(idx + 1);
  };

  const handleSave = () => {
    // In production this would POST to API/Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const PRESET_IMAGES = [
    { label: 'Hero (Woman w/ Glasses)', value: '/generated/banner-hero.jpg' },
    { label: 'Monsoon Sale (Frames Display)', value: '/generated/banner-sale.jpg' },
    { label: 'Eye Test Clinic', value: '/generated/banner-eyetest.jpg' },
    { label: 'New Collection (Couple)', value: '/generated/banner-collection.jpg' },
    { label: 'Computer Glasses', value: '/generated/computer-glasses.jpg' },
    { label: 'Luxury Men', value: '/generated/luxury-men.jpg' },
    { label: 'Luxury Women', value: '/generated/luxury-women.jpg' },
  ];

  return (
    <div className="space-y-8">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground">Hero Banner Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage the homepage auto-sliding banner carousel — drag to reorder, click to edit.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={addSlide} className="gap-2 bg-primary text-primary-foreground border-none">
            <Plus size={16} /> Add Slide
          </Button>
          <Button
            onClick={handleSave}
            variant="outline"
            className={`gap-2 transition-all ${saved ? 'bg-emerald-600 text-white border-emerald-600' : ''}`}
          >
            <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* ── Auto-play Speed ─────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-foreground">
          <Clock size={18} className="text-primary" />
          <span className="font-semibold text-sm">Auto-slide interval:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[2000, 3000, 4000, 5000, 7000].map(ms => (
            <button
              key={ms}
              onClick={() => setAutoPlayMs(ms)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                autoPlayMs === ms
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {ms / 1000}s
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground sm:ml-auto">
          Currently: slides change every <strong className="text-primary">{autoPlayMs / 1000} seconds</strong>
        </p>
      </div>

      {/* ── Slides List ─────────────────────────────────────────── */}
      <div className="space-y-3">
        <AnimatePresence>
          {slides.map((slide, idx) => (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, height: 0 }}
              transition={{ duration: 0.28 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              {/* ── Slide Header Row ──────────────────────────────── */}
              <div
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 ${editIdx === idx ? 'border-b border-border' : ''}`}
                onClick={() => setEditIdx(editIdx === idx ? null : idx)}
              >
                {/* Drag handle (visual only) */}
                <GripVertical size={18} className="text-muted-foreground flex-shrink-0" />

                {/* Slide preview thumbnail */}
                <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                  <img src={slide.image} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Slide info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {idx + 1}. {slide.headline} {slide.headline2}
                  </p>
                  {slide.badge && (
                    <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-semibold">
                      {slide.badge}
                    </span>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); moveUp(idx); }}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
                    aria-label="Move up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); moveDown(idx); }}
                    disabled={idx === slides.length - 1}
                    className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
                    aria-label="Move down"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSlide(idx); }}
                    disabled={slides.length <= 1}
                    className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 disabled:opacity-30 transition-colors ml-1"
                    aria-label="Delete slide"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* ── Slide Edit Form ───────────────────────────────── */}
              <AnimatePresence>
                {editIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">

                      {/* Badge */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Promotional Badge (optional)
                        </label>
                        <input
                          type="text"
                          value={slide.badge || ''}
                          onChange={e => update(idx, 'badge', e.target.value)}
                          placeholder="e.g. 🎉 MONSOON SALE — FLAT 30% OFF"
                          className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>

                      {/* Headline */}
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Headline Line 1
                        </label>
                        <input
                          type="text"
                          value={slide.headline}
                          onChange={e => update(idx, 'headline', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>

                      {/* Headline 2 */}
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Headline Line 2 <span className="text-primary">(gold color)</span>
                        </label>
                        <input
                          type="text"
                          value={slide.headline2}
                          onChange={e => update(idx, 'headline2', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>

                      {/* Subtitle */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Subtitle / Description
                        </label>
                        <textarea
                          value={slide.subtitle}
                          onChange={e => update(idx, 'subtitle', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                        />
                      </div>

                      {/* CTA Button */}
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Primary Button Text
                        </label>
                        <input
                          type="text"
                          value={slide.cta_text}
                          onChange={e => update(idx, 'cta_text', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>

                      {/* CTA type */}
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Primary Button Action
                        </label>
                        <select
                          value={slide.cta_type}
                          onChange={e => update(idx, 'cta_type', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                          <option value="booking">Open Eye Test Booking Modal</option>
                          <option value="link">Go to Link (URL below)</option>
                        </select>
                      </div>

                      {slide.cta_type === 'link' && (
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                            Primary Button URL
                          </label>
                          <input
                            type="text"
                            value={slide.cta_href}
                            onChange={e => update(idx, 'cta_href', e.target.value)}
                            placeholder="/catalog?filter=sale"
                            className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                        </div>
                      )}

                      {/* Secondary CTA */}
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Secondary Button Text
                        </label>
                        <input
                          type="text"
                          value={slide.cta2_text}
                          onChange={e => update(idx, 'cta2_text', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Secondary Button URL
                        </label>
                        <input
                          type="text"
                          value={slide.cta2_href}
                          onChange={e => update(idx, 'cta2_href', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>

                      {/* Image Picker */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Background Image
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-3">
                          {PRESET_IMAGES.map(img => (
                            <button
                              key={img.value}
                              onClick={() => update(idx, 'image', img.value)}
                              title={img.label}
                              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                                slide.image === img.value
                                  ? 'border-primary shadow-lg scale-105'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <img src={img.value} alt={img.label} className="w-full h-full object-cover" />
                              {slide.image === img.value && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                  <div className="w-4 h-4 rounded-full bg-primary border-2 border-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={slide.image}
                          onChange={e => update(idx, 'image', e.target.value)}
                          placeholder="/generated/banner-hero.jpg or full URL"
                          className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>

                      {/* Live preview */}
                      <div className="md:col-span-2">
                        <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden border border-border">
                          <img src={slide.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
                          <div className="absolute inset-0 flex flex-col justify-center px-8">
                            {slide.badge && (
                              <span className="inline-block self-start mb-2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                {slide.badge}
                              </span>
                            )}
                            <p className="text-xl sm:text-2xl font-serif font-bold text-foreground leading-tight drop-shadow-md">
                              {slide.headline} <span className="text-primary">{slide.headline2}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed line-clamp-2">
                              {slide.subtitle}
                            </p>
                            <div className="mt-3 flex gap-2">
                              <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg">
                                {slide.cta_text} →
                              </span>
                              <span className="border border-border text-foreground text-xs font-medium px-3 py-1.5 rounded-lg">
                                {slide.cta2_text}
                              </span>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 bg-black/50 text-white text-[9px] px-2 py-0.5 rounded font-mono">
                            LIVE PREVIEW
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Add slide footer ────────────────────────────────────── */}
      <button
        onClick={addSlide}
        className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
      >
        <Plus size={18} /> Add New Slide
      </button>
    </div>
  );
}
