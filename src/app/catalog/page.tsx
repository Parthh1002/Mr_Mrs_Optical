'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, RefreshCw, Eye, Tag, X, ShoppingBag, Check, ShieldCheck, Sparkles, ArrowRight, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getActiveProducts } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useBookingModal } from '@/store/bookingModalStore';
import { triggerHaptic } from '@/lib/haptics';

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
    stock_qty: 12,
    description: 'Iconic teardrop aviator frame in polished 24k gold-tone stainless steel with anti-scratch polarized mineral lenses.'
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
    stock_qty: 8,
    description: 'Bold retro cat-eye design adorned with subtle champagne metallic accents and hypoallergenic acetate nose bridges.'
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
    stock_qty: 15,
    description: 'Ultra-lightweight TR90 frame equipped with 99% blue-ray filter lenses to reduce digital eye strain during long screen hours.'
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
    stock_qty: 6,
    description: 'Shatter-proof flexible silicone frames designed specially for active children with soft adjustable ear tips.'
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
    stock_qty: 20,
    description: 'Daily disposable hydrogel contact lenses featuring LACREON technology for 24-hour hydration and UV blocking.'
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
    stock_qty: 5,
    description: 'Timeless browline brow-bar silhouette combining brushed brass metalwork with tortoise-shell upper acetate accents.'
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
    stock_qty: 4,
    description: 'Avant-garde hexagonal frame featuring hand-embedded pearl elements and gradient brown UV400 sun protection.'
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
    stock_qty: 10,
    description: 'Featherlight aerospace-grade Japanese titanium rimless spectacle frame for zero-pressure all-day comfort.'
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

const LENS_OPTIONS = [
  { id: 'standard', name: 'Standard Anti-Glare', price: 0 },
  { id: 'bluecut', name: 'Blue-Cut Screen Protect', price: 999 },
  { id: 'photo', name: 'Photochromic Auto-Darkening', price: 1499 },
  { id: 'progressive', name: 'Progressive Zero-Line', price: 2499 },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});

  // Quick View Modal State
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedLens, setSelectedLens] = useState(LENS_OPTIONS[0]);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  const addItemToCart = useCartStore(s => s.addItem);
  const openBookingModal = useBookingModal(s => s.open);

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
    triggerHaptic('medium');
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

  const handleAddToCartFromModal = () => {
    if (!selectedProduct) return;
    triggerHaptic('success');
    
    const finalPrice = selectedProduct.price + selectedLens.price;
    addItemToCart({
      id: `${selectedProduct.id}-${selectedLens.id}`,
      name: `${selectedProduct.name} (${selectedLens.name})`,
      price: finalPrice,
      mrp: selectedProduct.mrp + selectedLens.price,
      image: selectedProduct.image_url,
      quantity: 1,
      brand: selectedProduct.brand || 'Mr & Mrs'
    });

    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 2500);
  };

  // Filter products live based on active category
  const filteredProducts = products.filter(product => {
    if (activeCategory === 'all') return true;
    
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

      {/* Filter Tabs */}
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
                        <span className="font-mono font-bold text-lg text-foreground">₹{product.price.toLocaleString()}</span>
                        {hasDiscount && (
                          <span className="text-xs text-muted-foreground line-through font-mono">₹{product.mrp.toLocaleString()}</span>
                        )}
                      </div>
                      
                      {/* 💎 100% FUNCTIONAL POPUP QUICK VIEW BUTTON 💎 */}
                      <Button 
                        onClick={() => { setSelectedProduct(product); setSelectedLens(LENS_OPTIONS[0]); }}
                        size="sm" 
                        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 text-xs h-10 border-none btn-brass-sweep cursor-pointer shadow-md"
                      >
                        <Eye size={14} className="mr-1.5" /> View
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 💎 ULTRA-LUXURY QUICK VIEW PRODUCT PREVIEW POPUP MODAL 💎 ── */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            {/* Dark Glass Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-[70]"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-primary/30 rounded-3xl p-6 sm:p-8 shadow-2xl z-[71] text-foreground"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 p-2.5 rounded-full bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-foreground transition-all z-20 cursor-pointer border border-line"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left Column: Image Showcase */}
                <div className="md:col-span-6 relative bg-background/60 rounded-3xl p-8 border border-line flex flex-col items-center justify-center overflow-hidden">
                  {/* Brand Badge */}
                  <div className="absolute top-4 left-4 bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono font-bold px-3 py-1 uppercase tracking-widest rounded-full">
                    {selectedProduct.brand || 'Mr & Mrs Optical'}
                  </div>

                  {/* Wishlist Heart inside modal */}
                  <button
                    onClick={(e) => toggleWishlist(e, selectedProduct.id)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-primary transition-colors cursor-pointer"
                  >
                    <Heart
                      size={18}
                      className={wishlisted[selectedProduct.id] ? 'fill-foreground text-foreground' : 'text-white'}
                    />
                  </button>

                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full max-h-72 object-contain hover:scale-105 transition-transform duration-500 my-4"
                  />

                  {/* Quality Seal */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-2 bg-secondary/50 px-4 py-2 rounded-full border border-line">
                    <ShieldCheck size={16} className="text-primary" />
                    <span>100% Certified Clinical Optical Quality</span>
                  </div>
                </div>

                {/* Right Column: Product Details & Lens Configuration */}
                <div className="md:col-span-6 space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">(4.9 / 5.0 Rating)</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-foreground mb-2">
                      {selectedProduct.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {selectedProduct.description || 'Handcrafted precision eyewear frame using lightweight durable materials designed for long-lasting optical comfort.'}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-3 p-3.5 rounded-2xl bg-secondary/30 border border-line">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
                      ₹{(selectedProduct.price + selectedLens.price).toLocaleString()}
                    </span>
                    {selectedProduct.mrp > selectedProduct.price && (
                      <span className="text-sm text-muted-foreground line-through font-mono">
                        ₹{(selectedProduct.mrp + selectedLens.price).toLocaleString()}
                      </span>
                    )}
                    {selectedLens.price > 0 && (
                      <span className="text-xs text-primary font-semibold ml-auto font-mono">
                        +{selectedLens.name} (+₹{selectedLens.price})
                      </span>
                    )}
                  </div>

                  {/* Lens Coating Selection */}
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-primary font-bold block mb-2">
                      Select Prescription Lens Coating:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {LENS_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedLens(opt)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                            selectedLens.id === opt.id
                              ? 'bg-primary/15 border-primary text-primary font-bold shadow-sm'
                              : 'bg-card border-line text-foreground hover:bg-secondary'
                          }`}
                        >
                          <div className="truncate">{opt.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            {opt.price === 0 ? 'Included' : `+₹${opt.price}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-3">
                    <Button
                      onClick={handleAddToCartFromModal}
                      className="w-full py-6 text-sm bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-2xl btn-brass-sweep border-none shadow-xl cursor-pointer gap-2"
                    >
                      {addedToCartToast ? (
                        <>
                          <Check size={18} className="text-emerald-300 animate-bounce" />
                          <span>Added to Shopping Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={18} />
                          <span>Add Frame to Shopping Bag</span>
                        </>
                      )}
                    </Button>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => { setSelectedProduct(null); openBookingModal(); }}
                        variant="outline"
                        className="flex-1 py-5 text-xs rounded-xl font-semibold border-line hover:bg-secondary cursor-pointer"
                      >
                        Book Eye Test
                      </Button>

                      <Link href={`/product/${selectedProduct.id}`} onClick={() => setSelectedProduct(null)} className="flex-1">
                        <Button
                          variant="ghost"
                          className="w-full py-5 text-xs rounded-xl font-semibold text-primary hover:bg-primary/10 cursor-pointer gap-1"
                        >
                          Full Details Page <ArrowRight size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
