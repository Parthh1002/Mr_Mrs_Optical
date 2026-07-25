'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

const products = [
  { id: 1, name: 'Acetate Bold', price: '$240', category: 'Eyeglasses', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'Titanium Minimal', price: '$310', category: 'Eyeglasses', image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'Classic Aviator', price: '$180', category: 'Sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'Tortoise Shell', price: '$210', category: 'Eyeglasses', image: 'https://images.unsplash.com/photo-1572631382901-cece06241203?q=80&w=800&auto=format&fit=crop' },
  { id: 5, name: 'Round Vintage', price: '$260', category: 'Eyeglasses', image: 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?q=80&w=800&auto=format&fit=crop' },
  { id: 6, name: 'Cat Eye Glam', price: '$290', category: 'Sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop' },
];

export default function CollectionPage() {
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mrandmrs_wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved).map((item: any) => item.id));
    }
  }, []);

  const toggleWishlist = (product: any) => {
    let saved = JSON.parse(localStorage.getItem('mrandmrs_wishlist') || '[]');
    const isSaved = saved.some((item: any) => item.id === product.id);

    if (isSaved) {
      saved = saved.filter((item: any) => item.id !== product.id);
      setWishlist(wishlist.filter(id => id !== product.id));
    } else {
      saved.push(product);
      setWishlist([...wishlist, product.id]);
    }

    localStorage.setItem('mrandmrs_wishlist', JSON.stringify(saved));
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              The Collection
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-xl"
            >
              Explore our curated selection of premium eyewear. Handpicked for unparalleled quality and style.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 md:mt-0"
          >
            <Button variant="outline" className="rounded-full px-6 flex items-center gap-2">
              <Filter size={18} />
              Filter by Category
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="group"
            >
              <Card className="border-border overflow-hidden rounded-3xl bg-card hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-foreground">
                    {product.category}
                  </div>
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Heart 
                      size={18} 
                      className={wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"} 
                    />
                  </button>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                    <span className="text-primary font-semibold text-lg">{product.price}</span>
                  </div>
                  <Button className="w-full rounded-xl bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground transition-colors">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
