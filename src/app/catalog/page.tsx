'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, RefreshCw, Eye, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getActiveProducts } from '@/lib/api';

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Classic Gold Aviator',
    category: 'men',
    categoryLabel: 'Luxury Men',
    price: 4999,
    mrp: 6999,
    image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop',
    brand: 'Ray-Ban',
    stock_qty: 12
  },
  {
    id: 'prod-2',
    name: 'Vintage Cat-Eye Gold',
    category: 'women',
    categoryLabel: 'Luxury Women',
    price: 5499,
    mrp: 7999,
    image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop',
    brand: 'Gucci',
    stock_qty: 8
  },
  {
    id: 'prod-3',
    name: 'Pro Blue-Cut Matte Black',
    category: 'computer',
    categoryLabel: 'Computer Glasses',
    price: 2499,
    mrp: 3499,
    image_url: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&auto=format&fit=crop',
    brand: 'Oakley',
    stock_qty: 15
  },
  {
    id: 'prod-4',
    name: 'Kids Flexible Round',
    category: 'kids',
    categoryLabel: 'Kids Vision',
    price: 1999,
    mrp: 2999,
    image_url: 'https://images.unsplash.com/photo-1533036666993-41bb62afbb0e?w=600&auto=format&fit=crop',
    brand: 'Persol',
    stock_qty: 6
  },
  {
    id: 'prod-5',
    name: 'Acuvue Moist Daily Lenses',
    category: 'lenses',
    categoryLabel: 'Contact Lenses',
    price: 1499,
    mrp: 1999,
    image_url: 'https://images.unsplash.com/photo-1573511860302-28c5243198e5?w=600&auto=format&fit=crop',
    brand: 'Acuvue',
    stock_qty: 20
  },
  {
    id: 'prod-6',
    name: 'Clubmaster Brass Classic',
    category: 'men',
    categoryLabel: 'Luxury Men',
    price: 5999,
    mrp: 8499,
    image_url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop',
    brand: 'Tom Ford',
    stock_qty: 5
  },
  {
    id: 'prod-7',
    name: 'Geometric Oversized Pearl',
    category: 'women',
    categoryLabel: 'Luxury Women',
    price: 6499,
    mrp: 9999,
    image_url: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=600&auto=format&fit=crop',
    brand: 'Prada',
    stock_qty: 4
  },
  {
    id: 'prod-8',
    name: 'Titanium Rimless Rectangular',
    category: 'computer',
    categoryLabel: 'Computer Glasses',
    price: 3999,
    mrp: 5499,
    image_url: 'https://images.unsplash.com/photo-1577215951806-03f6f1c48c8b?w=600&auto=format&fit=crop',
    brand: 'Oliver Peoples',
    stock_qty: 10
  }
];

const tabs = [
  { id: 'all', name: 'All' },
  { id: 'men', name: 'Luxury Men' },
  { id: 'women', name: 'Luxury Women' },
  { id: 'kids', name: 'Kids Vision' },
  { id: 'computer', name: 'Computer Glasses' },
  { id: 'lenses', name: 'Contact Lenses' }
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('all');
    }
  }, [categoryParam]);

  useEffect(() => {
    async function fetchCatalog() {
      setIsLoading(true);
      try {
        const dbProducts = await getActiveProducts();
        // If DB has products, use them, otherwise use fallback mock products
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (error) {
        console.error('Error fetching products, using mock fallback:', error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Sync wishlist from localStorage
    const saved = localStorage.getItem('mrandmrs_wishlist');
    if (saved) {
      const parsed = JSON.parse(saved);
      const temp: Record<string, boolean> = {};
      parsed.forEach((id: string) => {
        temp[id] = true;
      });
      setWishlisted(temp);
    }

    fetchCatalog();
  }, []);

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    let saved = localStorage.getItem('mrandmrs_wishlist') 
      ? JSON.parse(localStorage.getItem('mrandmrs_wishlist')!) 
      : [];
      
    if (saved.includes(productId)) {
      saved = saved.filter((id: string) => id !== productId);
    } else {
      saved.push(productId);
    }
    
    localStorage.setItem('mrandmrs_wishlist', JSON.stringify(saved));
    window.dispatchEvent(new Event('wishlistUpdated'));
    
    setWishlisted(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Filter products live based on active category
  const filteredProducts = products.filter(product => {
    if (activeCategory === 'all') return true;
    
    // Support category string or mapped category_id check
    const cat = (product.category || '').toLowerCase();
    const gender = (product.gender || '').toLowerCase();
    
    if (activeCategory === 'men') return cat === 'men' || gender === 'men';
    if (activeCategory === 'women') return cat === 'women' || gender === 'women';
    if (activeCategory === 'kids') return cat === 'kids';
    if (activeCategory === 'computer') return cat === 'computer';
    if (activeCategory === 'lenses') return cat === 'lenses';
    
    return cat === activeCategory;
  });

  return (
    <div className="container mx-auto px-6 md:px-12 max-w-7xl">
      <div className="text-center mb-16">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3">
          Rx +2.25
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">
          Bespoke Eyewear
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Explore our handpicked curation of luxury optical frames and high-performance lenses.
        </p>
      </div>

      {/* Filter Tabs - Live Grid Filtering (No Page Reload) */}
      <div className="flex flex-wrap justify-center gap-3 mb-16 border-b border-line pb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 border cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                : 'bg-card border-line text-foreground hover:bg-secondary'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Grid Results */}
      <div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <RefreshCw className="w-8 h-8 animate-spin mb-4" />
            <p>Loading premium collection...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-card rounded-3xl border border-line border-dashed">
            <p className="font-medium text-lg">No products found in this category.</p>
            <p className="text-sm mt-2">Try selecting another filter or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const hasDiscount = product.mrp > product.price;
              const discountPercent = hasDiscount 
                ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                : 0;

              return (
                <div 
                  key={product.id} 
                  className="group relative bg-card rounded-3xl overflow-hidden border border-line hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-square bg-background/50 p-6 flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.image_url || "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80"} 
                      alt={product.name} 
                      className="w-4/5 object-contain group-hover:scale-108 transition-transform duration-[600ms] ease-out" 
                    />
                    
                    {/* Discount Tag */}
                    {hasDiscount && (
                      <div className="absolute top-4 left-4 bg-accent/20 border border-accent/30 text-accent text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full z-10 flex items-center gap-1">
                        <Tag size={10} /> Save {discountPercent}%
                      </div>
                    )}

                    {/* Wishlist Heart Toggle */}
                    <button 
                      onClick={(e) => toggleWishlist(e, product.id)}
                      className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md hover:bg-primary transition-all duration-300 flex items-center justify-center border border-white/10"
                      title="Add to Wishlist"
                    >
                      <Heart 
                        size={16} 
                        className={`transition-colors duration-300 ${
                          wishlisted[product.id] 
                            ? 'fill-foreground text-foreground' 
                            : 'text-white hover:text-primary-foreground'
                        }`}
                      />
                    </button>

                    {/* Stock status */}
                    {product.stock_qty <= 0 && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <span className="bg-black/80 text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content details */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-primary mb-2">
                      {product.brand || 'Bespoke Collection'}
                    </div>
                    <h3 className="font-serif font-medium text-foreground text-lg mb-4 line-clamp-1">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-line/50">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono font-bold text-lg text-foreground">₹{product.price}</span>
                        {hasDiscount && (
                          <span className="text-xs text-muted-foreground line-through font-mono">₹{product.mrp}</span>
                        )}
                      </div>
                      
                      <Link href={`/product/${product.id}`}>
                        <Button size="sm" className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 text-xs h-10 border-none btn-brass-sweep">
                          <Eye size={14} className="mr-1.5" /> View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 text-foreground">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <RefreshCw className="w-8 h-8 animate-spin mb-4" />
          <p>Loading Catalog...</p>
        </div>
      }>
        <CatalogContent />
      </Suspense>
    </div>
  );
}
