'use client';

import { TicketPercent, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock Offers Data
const MOCK_OFFERS = [
  {
    id: 1,
    title: 'Monsoon Mega Sale',
    subtitle: 'Flat 20% off on all polarized sunglasses.',
    code: 'MONSOON20',
    endDate: '2026-08-31',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80',
    color: 'bg-primary',
    textColor: 'text-white'
  },
  {
    id: 2,
    title: 'Free Eye Test Bonus',
    subtitle: 'Book a free eye test and get ₹500 off your first prescription frame.',
    code: 'VISION500',
    endDate: '2026-12-31',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80',
    color: 'bg-accent',
    textColor: 'text-foreground'
  }
];

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-fraunces)] font-bold text-foreground mb-4">
            Exclusive Offers
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the latest deals on luxury eyewear. Use these codes at checkout or in-store.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {MOCK_OFFERS.map(offer => (
            <div key={offer.id} className="rounded-3xl overflow-hidden border border-border shadow-lg group relative">
              <div className="aspect-[16/9] relative">
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 text-white/90 mb-2 text-sm font-semibold uppercase tracking-wider">
                    <Timer className="w-4 h-4" /> Valid till {new Date(offer.endDate).toLocaleDateString()}
                  </div>
                  <h3 className="text-3xl font-[family-name:var(--font-fraunces)] font-bold text-white mb-2">{offer.title}</h3>
                  <p className="text-white/80">{offer.subtitle}</p>
                </div>
              </div>
              
              <div className="bg-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Use Code</p>
                  <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border border-dashed">
                    <TicketPercent className="w-4 h-4 text-primary" />
                    <span className="font-mono font-bold text-lg text-foreground tracking-widest">{offer.code}</span>
                  </div>
                </div>
                <Button className="rounded-full bg-primary text-white hover:bg-primary/90">
                  Shop Now
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
