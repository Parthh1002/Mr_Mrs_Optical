'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle2, Image as ImageIcon, X, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { createProductServer, updateProductStock } from '@/lib/api';
import { EditableText } from '@/components/admin/EditableText';
import { EditableImage } from '@/components/admin/EditableImage';
import { EditModeProvider } from '@/components/admin/EditModeProvider';

interface Product {
  id: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  mrp?: number;
  image: string;
  image_url?: string;
  category_id?: string;
  category?: string;
  gender?: string;
  brand_id?: string;
  stock_status: string;
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newMrp, setNewMrp] = useState('');
  const [newCategory, setNewCategory] = useState('men');
  const [newBrand, setNewBrand] = useState('Ray-Ban');
  const [newImage, setNewImage] = useState('');
  const [newStockStatus, setNewStockStatus] = useState('in_stock');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  const toggleStock = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'in_stock' ? 'out_of_stock' : 'in_stock';
      await updateProductStock(id, newStatus);
      setProducts(products.map(p => p.id === id ? { ...p, stock_status: newStatus } : p));
      toast.success(newStatus === 'out_of_stock' ? 'Marked as Out of Stock' : 'Marked as In Stock');
    } catch (e) {
      toast.error('Failed to update stock status');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) {
      toast.error('Please enter name and price.');
      return;
    }

    setIsSaving(true);
    const parsedPrice = parseFloat(newPrice);
    const parsedMrp = parseFloat(newMrp || newPrice);
    
    // Set fallback high quality Unsplash image based on category
    const defaultImages: Record<string, string> = {
      men: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
      women: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&q=80',
      computer: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=500&q=80',
      kids: 'https://images.unsplash.com/photo-1533036666993-41bb62afbb0e?w=500&q=80',
      lenses: 'https://images.unsplash.com/photo-1573511860302-28c5243198e5?w=500&q=80'
    };
    const imageUrl = newImage || defaultImages[newCategory] || defaultImages.men;

    try {
      await createProductServer({
        name: newName,
        price: parsedPrice,
        compareAtPrice: parsedMrp,
        imageUrl,
        categoryName: newCategory,
        brandName: newBrand,
        stockStatus: newStockStatus
      });

      toast.success('Product created successfully!');
      
      // Reset State & Close
      setNewName('');
      setNewPrice('');
      setNewMrp('');
      setNewImage('');
      setIsAddModalOpen(false);
      
      // Refresh list
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create product.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <EditModeProvider>
      <div className="max-w-5xl mx-auto pb-24 space-y-8 text-foreground">
        
        {/* Header Block */}
        <div className="sticky top-[64px] z-30 bg-background/80 backdrop-blur-xl py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-line space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground font-serif">Products Inventory</h1>
              <p className="text-muted-foreground text-sm">Manage storefront catalog, prices, and stocks</p>
            </div>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md btn-brass-sweep border-none cursor-pointer"
            >
              <Plus className="w-5 h-5" /> Add New Product
            </Button>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search products by name..." 
              className="pl-10 py-6 text-base rounded-xl bg-card border-line text-foreground focus-visible:ring-primary"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading products from Supabase...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(product => {
              const inStock = product.stock_status === 'in_stock';
              return (
                <div 
                  key={product.id} 
                  className={`bg-card border border-line rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-primary/40 ${!inStock ? 'opacity-65 grayscale-[0.4]' : ''}`}
                >
                  <div className="aspect-square bg-background/50 relative flex items-center justify-center p-4">
                    {product.image ? (
                      <EditableImage 
                        src={product.image} 
                        table="products"
                        idColumn="id"
                        idValue={product.id}
                        updateColumn="image"
                        alt={product.name} 
                        className="w-[85%] h-[85%] object-contain" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground relative">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-30" />
                        <span className="text-xs">No Image</span>
                        <EditableImage 
                          src=""
                          table="products"
                          idColumn="id"
                          idValue={product.id}
                          updateColumn="image"
                          className="absolute inset-0 w-full h-full opacity-0" 
                        />
                      </div>
                    )}
                    
                    {/* Stock Status Toggle button */}
                    <button 
                      onClick={() => toggleStock(product.id, product.stock_status)}
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider shadow-sm transition-all duration-300 cursor-pointer ${
                        inStock 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      }`}
                    >
                      {inStock ? 'In Stock' : 'Sold Out'}
                    </button>
                  </div>
                  
                  <div className="p-4 text-left border-t border-line/40">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary block mb-1">
                      {product.brand_id || 'Premium Eyewear'}
                    </span>
                    <h3 className="font-serif font-bold text-foreground line-clamp-1">
                      <EditableText 
                        value={product.name}
                        table="products"
                        idColumn="id"
                        idValue={product.id}
                        updateColumn="name"
                      />
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-mono font-bold text-sm text-foreground">
                        ₹<EditableText 
                          value={String(product.price)}
                          table="products"
                          idColumn="id"
                          idValue={product.id}
                          updateColumn="price"
                        />
                      </span>
                      {(product.compare_at_price || product.mrp) && (
                        <span className="text-xs text-muted-foreground line-through font-mono">
                          ₹<EditableText 
                            value={String(product.compare_at_price || product.mrp)}
                            table="products"
                            idColumn="id"
                            idValue={product.id}
                            updateColumn="compare_at_price"
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredProducts.length === 0 && !loading && (
              <div className="col-span-full py-16 text-center text-muted-foreground border border-line border-dashed rounded-2xl bg-card">
                No products found in database.
              </div>
            )}
          </div>
        )}

        {/* Add Product Modal Dialog */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <div className="bg-card border border-line rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative z-10 text-left">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-foreground transition-all cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="mb-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brass-dim flex items-center justify-center text-primary">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-foreground">Add New Product</h3>
                  <p className="text-xs text-muted-foreground">Insert a new eyewear item to Supabase</p>
                </div>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Product Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    placeholder="E.g. Aviator Gold Classy"
                    className="w-full bg-background border border-line rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Price (₹) *</label>
                    <input 
                      type="number" 
                      required 
                      value={newPrice} 
                      onChange={e => setNewPrice(e.target.value)}
                      placeholder="4999"
                      className="w-full bg-background border border-line rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">MRP / Compare (₹)</label>
                    <input 
                      type="number" 
                      value={newMrp} 
                      onChange={e => setNewMrp(e.target.value)}
                      placeholder="6999"
                      className="w-full bg-background border border-line rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Category *</label>
                    <select 
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full bg-background border border-line rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="men">Luxury Men</option>
                      <option value="women">Luxury Women</option>
                      <option value="kids">Kids Vision</option>
                      <option value="computer">Computer Glasses</option>
                      <option value="lenses">Contact Lenses</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Brand *</label>
                    <input 
                      type="text" 
                      required 
                      value={newBrand} 
                      onChange={e => setNewBrand(e.target.value)}
                      placeholder="Ray-Ban, Gucci..."
                      className="w-full bg-background border border-line rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Image URL (Optional)</label>
                  <input 
                    type="text" 
                    value={newImage} 
                    onChange={e => setNewImage(e.target.value)}
                    placeholder="Leave empty for category default image"
                    className="w-full bg-background border border-line rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Stock Status</label>
                  <select 
                    value={newStockStatus}
                    onChange={e => setNewStockStatus(e.target.value)}
                    className="w-full bg-background border border-line rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out Of Stock</option>
                  </select>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full h-12 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl btn-brass-sweep border-none shadow-md mt-4 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={16} />
                  {isSaving ? 'Creating...' : 'Save Product'}
                </Button>
              </form>
            </div>
          </div>
        )}

      </div>
    </EditModeProvider>
  );
}
