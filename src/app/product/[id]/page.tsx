'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, Ruler, Truck, ChevronRight, Eye, CalendarCheck, RefreshCw, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProductById } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { useBookingModal } from '@/store/bookingModalStore';

export default function ProductDetailPage() {
  const openBookingModal = useBookingModal(state => state.open);
  const { id } = useParams();
  const [selectedLens, setSelectedLens] = useState('frame-only');
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      const data = await getProductById(id as string);
      setProduct(data);
      setIsLoading(false);
    }
    if (id) loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-[family-name:var(--font-fraunces)] text-foreground mb-4">Product Not Found</h2>
        <Link href="/catalog">
          <Button variant="outline">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-muted/30 rounded-3xl p-8 flex items-center justify-center relative">
              {/* Discount Ribbon */}
              {product.mrp > product.price && (
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-accent text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                    SAVE ₹{product.mrp - product.price}
                  </span>
                </div>
              )}
              <img 
                src={product.image_url || "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80"} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-muted/30 rounded-xl p-2 cursor-pointer border-2 border-transparent hover:border-primary transition-colors">
                  <img src={product.image_url || `https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&q=80`} alt="Thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2 font-semibold">{product.brand_id || 'Premium Brand'}</p>
              <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-fraunces)] font-bold text-foreground mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
                {product.mrp > product.price && (
                  <span className="text-xl text-muted-foreground line-through decoration-muted-foreground/50">₹{product.mrp}</span>
                )}
                {product.stock_qty > 0 ? (
                  <span className="text-sm font-bold text-success bg-success/10 px-3 py-1 rounded">In Stock</span>
                ) : (
                  <span className="text-sm font-bold text-danger bg-danger/10 px-3 py-1 rounded">Out of Stock</span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || 'Experience unparalleled clarity and style with these premium acetate frames. Featuring polarized lenses that block 100% of harmful UV rays.'}
              </p>
            </div>

            {/* Lens Add-on Selector (Lenskart UX) */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" /> Select Lens Type
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'frame-only', title: 'Frame Only', price: '+ ₹0' },
                  { id: 'zero-power', title: 'Zero Power / Blue Cut', price: '+ ₹999' },
                  { id: 'single-vision', title: 'Single Vision (Prescription)', price: '+ ₹1,499' }
                ].map((lens) => (
                  <label key={lens.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedLens === lens.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="lens" 
                        value={lens.id} 
                        checked={selectedLens === lens.id}
                        onChange={(e) => setSelectedLens(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary accent-primary" 
                      />
                      <span className="font-medium text-foreground">{lens.title}</span>
                    </div>
                    <span className="text-muted-foreground font-semibold">{lens.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                onClick={() => {
                  let extraPrice = 0;
                  if (selectedLens === 'zero-power') extraPrice = 999;
                  if (selectedLens === 'single-vision') extraPrice = 1499;
                  
                  addItem({
                    id: `${product.id}-${selectedLens}`,
                    name: `${product.name} (${selectedLens.replace('-', ' ')})`,
                    price: product.price + extraPrice,
                    mrp: product.mrp + extraPrice,
                    image: product.image_url || '',
                    quantity: 1,
                    brand: product.brand_id || 'Premium Brand'
                  });
                  toast.success(`${product.name} added to cart!`);
                }}
                className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-base rounded-xl font-bold border-none gap-2 shadow-lg hover:shadow-primary/20 transition-all"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </Button>
              <Button 
                onClick={openBookingModal}
                size="lg" 
                variant="outline" 
                className="flex-1 h-14 border-primary text-primary hover:bg-primary/5 text-base rounded-xl font-bold gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-5 h-5" /> Book Eye Test
              </Button>
            </div>

            {/* Trust Badges (Vision Express UX) */}
            <div className="grid grid-cols-2 gap-4 border-y border-border py-6 mb-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Free Store Pickup</span>
              </div>
            </div>

            {/* Frame Details Table */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Frame Details</h3>
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Material</dt>
                    <dd className="font-medium text-foreground">Premium Acetate</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Shape</dt>
                    <dd className="font-medium text-foreground">Wayfarer</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Size</dt>
                    <dd className="font-medium text-foreground flex items-center gap-1"><Ruler className="w-3 h-3"/> Medium (52-18-140)</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Gender</dt>
                    <dd className="font-medium text-foreground">Unisex</dd>
                  </div>
                </dl>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
