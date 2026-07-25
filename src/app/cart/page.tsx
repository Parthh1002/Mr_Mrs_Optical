'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBookingModal } from '@/store/bookingModalStore';

export default function CartPage() {
  const openBookingModal = useBookingModal(state => state.open);
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-[family-name:var(--font-fraunces)] font-medium mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any premium eyewear yet.</p>
        <Link href="/catalog">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full px-8">
            Explore Collection
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-fraunces)] font-bold mb-12">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 bg-card rounded-3xl p-6 border border-border items-center">
                <div className="w-24 h-24 bg-muted/30 rounded-2xl flex-shrink-0 p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">{item.brand}</div>
                  <h3 className="text-lg font-[family-name:var(--font-fraunces)] font-semibold mb-2">{item.name}</h3>
                  <div className="font-bold text-lg">₹{item.price}</div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-danger transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="flex items-center gap-3 bg-muted/50 rounded-full px-3 py-1">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-lg transition-colors"
                    >-</button>
                    <span className="w-4 text-center font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-lg transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-3xl p-8 border border-border sticky top-32">
              <h3 className="text-xl font-bold font-[family-name:var(--font-fraunces)] mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span>Free Clinical Eye Test</span>
                  <span className="font-semibold">Included</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-6 mb-8 flex justify-between items-end">
                <span className="font-semibold text-lg">Total</span>
                <span className="text-3xl font-bold font-[family-name:var(--font-fraunces)] text-accent">₹{getCartTotal()}</span>
              </div>
              
              <Button 
                onClick={openBookingModal}
                size="lg" 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold gap-2 cursor-pointer btn-brass-sweep border-none"
              >
                Proceed to Booking <ArrowRight size={20} />
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                You will book a time slot first. Payment is collected at the store.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
