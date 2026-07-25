'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useBookingModal } from '@/store/bookingModalStore';

// Define the Product Type
type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
};

export default function WishlistPage() {
  const openBookingModal = useBookingModal(state => state.open);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('mrandmrs_wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  const removeFromWishlist = (id: number) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('mrandmrs_wishlist', JSON.stringify(updated));
    // Trigger custom event so navbar can update badge
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  if (!mounted) return null;

  return (
    <div className="pt-32 pb-16 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-[family-name:var(--font-fraunces)]"
          >
            Your Wishlist
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            {wishlist.length === 0 
              ? "You haven't saved any frames yet." 
              : `You have ${wishlist.length} saved frames.`}
          </motion.p>
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-card rounded-3xl border border-border shadow-sm"
          >
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <Heart size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Browse our premium collection and save your favorites here.</p>
            <Link href="/catalog">
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Explore Collection
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                layout
              >
                <Card className="border-border overflow-hidden rounded-[2rem] bg-card hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-foreground">
                      {product.category}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                      <span className="text-primary font-semibold text-lg">{product.price}</span>
                    </div>
                    <Button 
                      onClick={openBookingModal} 
                      className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-colors gap-2 cursor-pointer btn-brass-sweep border-none"
                    >
                      Book Eye Test & Try On
                      <ArrowRight size={16} />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
