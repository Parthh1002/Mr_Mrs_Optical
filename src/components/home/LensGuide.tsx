'use client';

import { useState } from 'react';
import { Check, Monitor, Sun, Maximize, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBookingModal } from '@/store/bookingModalStore';

export default function LensGuide() {
  const openBookingModal = useBookingModal(state => state.open);
  const [activeColumn, setActiveColumn] = useState<'standard' | 'blueCut' | 'photochromic' | 'progressive'>('photochromic');

  const features = [
    { name: 'Anti-Reflective Coating', standard: true, blueCut: true, photochromic: true, progressive: true },
    { name: 'Scratch Resistant', standard: true, blueCut: true, photochromic: true, progressive: true },
    { name: '100% UV Protection', standard: false, blueCut: true, photochromic: true, progressive: true },
    { name: 'Digital Strain Relief', standard: false, blueCut: true, photochromic: true, progressive: true },
    { name: 'Darkens in Sunlight', standard: false, blueCut: false, photochromic: true, progressive: false },
    { name: 'Multi-Distance Vision', standard: false, blueCut: false, photochromic: false, progressive: true },
  ];

  const columns = [
    { id: 'standard', name: 'Standard', icon: Shield, desc: 'Everyday clear vision', key: 'standard' },
    { id: 'blueCut', name: 'Blue-Cut', icon: Monitor, desc: 'For digital screens', key: 'blueCut' },
    { id: 'photochromic', name: 'Photochromic', icon: Sun, desc: 'Adapts to sunlight', key: 'photochromic' },
    { id: 'progressive', name: 'Progressive', icon: Maximize, desc: 'Seamless multifocal', key: 'progressive' }
  ];

  return (
    <section className="py-24 bg-background border-t border-line">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          {/* Rx eyebrow badge */}
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3">
            Rx +1.00
          </div>
          <h2 className="text-sm uppercase tracking-widest text-primary font-semibold mb-4">Lens Technology</h2>
          <h3 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-foreground">
            Clearer Vision, Better Life
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our premium selection of advanced optical lenses designed to protect your eyes and enhance your daily life.
          </p>
        </div>

        {/* Tab selector buttons for live column highlighting */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {columns.map((col) => {
            const Icon = col.icon;
            return (
              <button
                key={col.id}
                onClick={() => setActiveColumn(col.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 border cursor-pointer ${
                  activeColumn === col.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                    : 'bg-card border-line text-foreground hover:bg-secondary'
                }`}
              >
                <Icon size={16} />
                {col.name}
              </button>
            );
          })}
        </div>

        <div className="overflow-x-auto pb-8">
          <div className="min-w-[800px] px-4">
            {/* Header Row */}
            <div className="grid grid-cols-5 gap-6 mb-8 items-stretch">
              <div className="col-span-1 flex items-center">
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Lens Features</span>
              </div>
              
              {columns.map((col) => {
                const Icon = col.icon;
                const isActive = activeColumn === col.id;
                return (
                  <div 
                    key={col.id}
                    onClick={() => setActiveColumn(col.id as any)}
                    className={`text-center p-6 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col items-center justify-center relative ${
                      isActive 
                        ? 'bg-primary text-primary-foreground border-primary shadow-xl scale-105 z-10' 
                        : 'bg-card border-line text-foreground opacity-60 hover:opacity-90'
                    }`}
                  >
                    {col.id === 'photochromic' && (
                      <div className={`absolute -top-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                        isActive ? 'bg-copper text-white' : 'bg-primary text-primary-foreground'
                      }`}>
                        Most Popular
                      </div>
                    )}
                    <Icon className={`w-8 h-8 mb-3 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                    <h4 className="font-bold text-lg">{col.name}</h4>
                    <p className={`text-xs mt-1 ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{col.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Feature Rows */}
            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div 
                  key={idx} 
                  className="grid grid-cols-5 gap-6 items-center py-4 border-b border-line hover:bg-secondary/40 transition-all rounded-xl px-4"
                >
                  <div className="col-span-1 font-medium text-foreground text-sm">
                    {feature.name}
                  </div>
                  
                  {/* Standard */}
                  <div className={`flex justify-center transition-all duration-500 ${activeColumn === 'standard' ? 'scale-110 opacity-100' : 'opacity-40'}`}>
                    {feature.standard ? (
                      <Check className={`w-5 h-5 ${activeColumn === 'standard' ? 'text-primary-foreground' : 'text-primary'}`} />
                    ) : (
                      <span className="text-muted-foreground/30 text-xs">—</span>
                    )}
                  </div>
                  
                  {/* Blue-Cut */}
                  <div className={`flex justify-center transition-all duration-500 ${activeColumn === 'blueCut' ? 'scale-110 opacity-100' : 'opacity-40'}`}>
                    {feature.blueCut ? (
                      <Check className={`w-5 h-5 ${activeColumn === 'blueCut' ? 'text-primary-foreground' : 'text-primary'}`} />
                    ) : (
                      <span className="text-muted-foreground/30 text-xs">—</span>
                    )}
                  </div>
                  
                  {/* Photochromic */}
                  <div className={`flex justify-center transition-all duration-500 ${activeColumn === 'photochromic' ? 'scale-110 opacity-100' : 'opacity-40'}`}>
                    {feature.photochromic ? (
                      <Check className={`w-5 h-5 ${activeColumn === 'photochromic' ? 'text-primary-foreground' : 'text-primary'}`} />
                    ) : (
                      <span className="text-muted-foreground/30 text-xs">—</span>
                    )}
                  </div>
                  
                  {/* Progressive */}
                  <div className={`flex justify-center transition-all duration-500 ${activeColumn === 'progressive' ? 'scale-110 opacity-100' : 'opacity-40'}`}>
                    {feature.progressive ? (
                      <Check className={`w-5 h-5 ${activeColumn === 'progressive' ? 'text-primary-foreground' : 'text-primary'}`} />
                    ) : (
                      <span className="text-muted-foreground/30 text-xs">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                onClick={openBookingModal} 
                size="lg" 
                className="rounded-xl bg-primary hover:bg-primary/95 px-8 text-primary-foreground font-semibold btn-brass-sweep border-none shadow-md cursor-pointer"
              >
                Consult Our Optometrist
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
