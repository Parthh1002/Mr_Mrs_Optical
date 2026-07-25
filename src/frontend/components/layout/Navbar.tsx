'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, Phone, ChevronDown, Menu, X,
  ArrowRight, ShoppingBag, ShieldCheck, Plus, Minus, Trash2, MapPin, MessageSquare, ExternalLink, Sparkles, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { useCartStore } from '@/store/cartStore';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useBookingModal } from '@/store/bookingModalStore';
import { usePathname, useRouter } from 'next/navigation';

// Sample products for live instant search
const SEARCH_PRODUCTS = [
  { id: 'prod-1', name: 'Classic Gold Aviator', category: 'men', price: 4999, mrp: 6999, brand: 'Ray-Ban', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&auto=format&fit=crop' },
  { id: 'prod-2', name: 'Vintage Cat-Eye Gold', category: 'women', price: 5499, mrp: 7999, brand: 'Gucci', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&auto=format&fit=crop' },
  { id: 'prod-3', name: 'Pro Blue-Cut Matte Black', category: 'computer', price: 2499, mrp: 3499, brand: 'Oakley', image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=300&auto=format&fit=crop' },
  { id: 'prod-4', name: 'Kids Flexible Round', category: 'kids', price: 1999, mrp: 2999, brand: 'Persol', image: 'https://images.unsplash.com/photo-1533036666993-41bb62afbb0e?w=300&auto=format&fit=crop' },
  { id: 'prod-5', name: 'Acuvue Moist Daily Lenses', category: 'lenses', price: 1499, mrp: 1999, brand: 'Acuvue', image: 'https://images.unsplash.com/photo-1573511860302-28c5243198e5?w=300&auto=format&fit=crop' },
  { id: 'prod-6', name: 'Clubmaster Brass Classic', category: 'men', price: 5999, mrp: 8499, brand: 'Tom Ford', image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=300&auto=format&fit=crop' },
  { id: 'prod-7', name: 'Geometric Oversized Pearl', category: 'women', price: 6499, mrp: 9999, brand: 'Prada', image: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=300&auto=format&fit=crop' },
  { id: 'prod-8', name: 'Titanium Rimless Rectangular', category: 'computer', price: 3999, mrp: 5499, brand: 'Oliver Peoples', image: 'https://images.unsplash.com/photo-1577215951806-03f6f1c48c8b?w=300&auto=format&fit=crop' }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'collections' | 'services' | null>(null);
  const [mounted, setMounted] = useState(false);

  // Mobile Menu Submenu Accordion state
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  // 4 Interactive Modals/Drawers State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Cart store
  const { items: cartItems, removeItem, updateQuantity, getCartTotal, getCartCount, addItem } = useCartStore();
  const openBookingModal = useBookingModal(s => s.open);

  const updateWishlist = useCallback(() => {
    try {
      const saved = localStorage.getItem('mrandmrs_wishlist');
      const items = saved ? JSON.parse(saved) : [];
      setWishlistItems(items);
      setWishlistCount(items.length);
    } catch {
      setWishlistItems([]);
      setWishlistCount(0);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    updateWishlist();
    window.addEventListener('wishlistUpdated', updateWishlist);
    return () => window.removeEventListener('wishlistUpdated', updateWishlist);
  }, [updateWishlist]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard shortcut Ctrl/Cmd + K for Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setIsMobileMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen || isCartOpen || isWishlistOpen || isContactOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen, isSearchOpen, isCartOpen, isWishlistOpen, isContactOpen]);

  if (pathname?.startsWith('/admin')) return null;

  const filteredSearchProducts = searchQuery.trim() === ''
    ? SEARCH_PRODUCTS.slice(0, 4)
    : SEARCH_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const navLinkCls =
    'text-xs xl:text-sm font-semibold uppercase tracking-wider xl:tracking-widest transition-colors duration-200 relative group hover:text-primary whitespace-nowrap cursor-pointer';

  const collectionCategories = [
    { name: 'Luxury Men Eyewear', desc: 'Crafted for modern gentlemen', href: '/catalog?category=men' },
    { name: 'Luxury Women Eyewear', desc: 'Elegant statement frames & pearls', href: '/catalog?category=women' },
    { name: 'Computer & Screen Glasses', desc: 'Blue-cut strain protection lenses', href: '/catalog?category=computer' },
    { name: 'Designer Sunglasses', desc: 'UV400 polarized luxury sunshades', href: '/catalog?category=sunglasses' },
    { name: 'Contact Lenses & Care', desc: 'Daily, monthly & colored contact lenses', href: '/catalog?category=lenses' },
  ];

  const serviceCategories = [
    { name: 'Computerized Eye Testing', desc: 'Precision digital refraction & prescription analysis', href: '/services#eye-test' },
    { name: 'Frame Styling Consultation', desc: 'Personalized face-shape & skin-tone frame matching', href: '/services#styling' },
    { name: 'Contact Lens Fitting', desc: 'Clinical keratomertry & trial fitting service', href: '/services#contact-lens' },
    { name: 'Lens Replacement', desc: 'Upgrade old frames with new prescription lenses', href: '/services#lens' },
    { name: 'Repair & Adjustments', desc: 'Free alignment, nose-pad & screw restoration', href: '/services#repair' },
  ];

  return (
    <>
      {/* ── Main Navbar Header ───────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border py-3'
            : 'bg-transparent py-5'
        }`}
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 z-50">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8 mx-auto px-4">
              <Link href="/" className={navLinkCls}>
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* Collections Button & Hover Mega Menu */}
              <div
                className="relative group py-5"
                onMouseEnter={() => setActiveMegaMenu('collections')}
              >
                <Link
                  href="/catalog"
                  className={`${navLinkCls} flex items-center gap-1`}
                >
                  <span>Collections</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${activeMegaMenu === 'collections' ? 'rotate-180 text-primary' : ''}`}
                  />
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>

              {/* Services Button & Hover Mega Menu */}
              <div
                className="relative group py-5"
                onMouseEnter={() => setActiveMegaMenu('services')}
              >
                <Link
                  href="/services"
                  className={`${navLinkCls} flex items-center gap-1`}
                >
                  <span>Services</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${activeMegaMenu === 'services' ? 'rotate-180 text-primary' : ''}`}
                  />
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>

              <Link href="/about" className={navLinkCls}>
                Our Story
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            {/* Header Actions (4 Functional Buttons) */}
            <div className="flex items-center space-x-2 sm:space-x-3.5 z-50">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* 1. SEARCH BUTTON */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-200 cursor-pointer relative"
                aria-label="Search Catalog"
                title="Search (Ctrl + K)"
              >
                <Search size={19} strokeWidth={1.8} />
              </button>

              {/* 2. SHOPPING BAG (CART) BUTTON */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 rounded-full hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-200 cursor-pointer relative"
                aria-label="Shopping Cart"
                title="Shopping Cart"
              >
                <ShoppingBag size={19} strokeWidth={1.8} />
                {mounted && getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* 3. WISHLIST BUTTON */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="p-2.5 rounded-full hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-200 cursor-pointer relative"
                aria-label="Wishlist"
                title="Wishlist Favorites"
              >
                <Heart size={19} strokeWidth={1.8} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-copper text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* 4. PHONE / QUICK CONTACT BUTTON */}
              <button
                onClick={() => setIsContactOpen(true)}
                className="p-2.5 rounded-full hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-200 cursor-pointer relative"
                aria-label="Contact Concierge"
                title="Store Concierge & Call"
              >
                <Phone size={18} strokeWidth={1.8} className="hover:animate-bounce" />
              </button>

              {/* Admin & Book Button */}
              <div className="hidden lg:flex items-center space-x-3 ml-2">
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary border border-primary/40 hover:border-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                  <ShieldCheck size={14} />
                  Admin
                </Link>

                <Button
                  onClick={openBookingModal}
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider text-xs px-5 py-[10px] transition-all duration-200 border-none cursor-pointer btn-brass-sweep"
                >
                  Book Eye Test
                </Button>
              </div>

              {/* Mobile Hamburger */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* ── DESKTOP MEGA MENU DROPDOWN PANEL (FOR COLLECTIONS & SERVICES) ── */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              key={activeMegaMenu}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl shadow-2xl border-t border-b border-border text-foreground"
              onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <div className="container mx-auto px-6 sm:px-12 py-8">
                {activeMegaMenu === 'collections' ? (
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <div className="col-span-7">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary font-bold">
                          Explore Collections Catalog
                        </span>
                        <Link href="/catalog" onClick={() => setActiveMegaMenu(null)} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                          View All Frames <ArrowRight size={13} />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {collectionCategories.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            onClick={() => setActiveMegaMenu(null)}
                            className="p-3.5 rounded-2xl bg-card hover:bg-primary/10 border border-line hover:border-primary/30 transition-all group"
                          >
                            <h5 className="text-sm font-bold text-foreground font-serif group-hover:text-primary transition-colors flex items-center justify-between">
                              <span>{item.name}</span>
                              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </h5>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-5 relative h-56 rounded-3xl overflow-hidden border border-primary/20 shadow-xl group">
                      <img
                        src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop"
                        alt="Luxury Eyewear Collection"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold mb-1">Featured Showcase</span>
                        <h4 className="text-xl font-bold font-serif text-white mb-2">2026 Titanium & Pearl Frames</h4>
                        <Link href="/catalog" onClick={() => setActiveMegaMenu(null)}>
                          <Button size="sm" className="bg-primary text-primary-foreground font-semibold text-xs rounded-xl">
                            Shop New Arrivals
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <div className="col-span-7">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary font-bold">
                          Clinical & Optical Services
                        </span>
                        <Link href="/services" onClick={() => setActiveMegaMenu(null)} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                          View All Services <ArrowRight size={13} />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {serviceCategories.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            onClick={() => setActiveMegaMenu(null)}
                            className="p-3.5 rounded-2xl bg-card hover:bg-primary/10 border border-line hover:border-primary/30 transition-all group"
                          >
                            <h5 className="text-sm font-bold text-foreground font-serif group-hover:text-primary transition-colors flex items-center justify-between">
                              <span>{item.name}</span>
                              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </h5>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-5 relative h-56 rounded-3xl overflow-hidden border border-primary/20 shadow-xl group">
                      <img
                        src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop"
                        alt="Clinical Optometry"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold mb-1">Clinical Care</span>
                        <h4 className="text-xl font-bold font-serif text-white mb-2">Free Computerized Eye Test</h4>
                        <Button
                          onClick={() => { setActiveMegaMenu(null); openBookingModal(); }}
                          size="sm"
                          className="bg-primary text-primary-foreground font-semibold text-xs rounded-xl"
                        >
                          Book Appointment Now
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── MODAL 1: INSTANT LIVE SEARCH MODAL (Cmd + K) ─────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-12 sm:top-20 left-1/2 -translate-x-1/2 w-[92vw] max-w-2xl bg-card border border-primary/30 rounded-3xl p-5 sm:p-6 shadow-2xl z-[61] overflow-hidden"
            >
              {/* Search Bar Input */}
              <div className="relative flex items-center mb-4 pb-4 border-b border-line">
                <Search size={22} className="text-primary mr-3 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search frames, aviators, blue-cut, brands..."
                  className="w-full bg-transparent text-base sm:text-lg text-foreground placeholder:text-muted-foreground outline-none font-medium"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-1 text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-3 p-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick Suggestion Tags */}
              <div className="mb-4">
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                  <Sparkles size={12} className="text-primary" /> Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Aviator', 'Blue-Cut', 'Ray-Ban', 'Gucci', 'Titanium', 'Cat-Eye'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 rounded-full bg-secondary/80 hover:bg-primary/20 hover:text-primary text-xs font-medium text-foreground transition-colors cursor-pointer border border-line"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Search Results */}
              <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Catalog Results ({filteredSearchProducts.length})
                </p>

                {filteredSearchProducts.length > 0 ? (
                  filteredSearchProducts.map(prod => (
                    <Link
                      key={prod.id}
                      href={`/catalog?search=${encodeURIComponent(prod.name)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-secondary/30 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group"
                    >
                      <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono block">{prod.brand}</span>
                        <h5 className="text-sm font-bold text-foreground font-serif truncate group-hover:text-primary transition-colors">{prod.name}</h5>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-foreground">₹{prod.price.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground line-through block text-[11px]">₹{prod.mrp.toLocaleString()}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">No matching frames found for "{searchQuery}"</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground">ESC</kbd> to exit</span>
                <Link
                  href="/catalog"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  View Full Catalog <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: SHOPPING BAG QUICK CART DRAWER ──────────────── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 right-0 w-[min(90vw,420px)] bg-card border-l border-primary/20 shadow-2xl z-[61] flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif text-foreground">Shopping Bag</h3>
                    <p className="text-xs text-muted-foreground font-mono">{getCartCount()} items selected</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {cartItems.length > 0 ? (
                  cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3.5 p-3 rounded-2xl bg-secondary/40 border border-line">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-primary font-mono uppercase">{item.brand}</span>
                        <h5 className="text-xs font-bold text-foreground font-serif truncate">{item.name}</h5>
                        <span className="text-xs font-bold text-foreground">₹{item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-background border border-line rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:text-primary"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-primary"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto text-muted-foreground/30 mb-3" />
                    <h4 className="font-bold text-foreground font-serif text-base mb-1">Your bag is empty</h4>
                    <p className="text-xs text-muted-foreground mb-6">Explore our luxury frames and add your favorite pair.</p>
                    <Link
                      href="/catalog"
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider"
                    >
                      Browse Catalog <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-line bg-background/80 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="font-bold text-lg text-foreground">₹{getCartTotal().toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">✓ Includes free nationwide clinical optical shipping</p>
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full py-3.5 text-center rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-sm btn-brass-sweep border-none shadow-md"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MODAL 3: WISHLIST QUICK DRAWER ────────────────────────── */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 right-0 w-[min(90vw,420px)] bg-card border-l border-primary/20 shadow-2xl z-[61] flex flex-col justify-between"
            >
              <div className="p-5 sm:p-6 border-b border-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-copper/10 text-copper">
                    <Heart size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif text-foreground">Your Favorites</h3>
                    <p className="text-xs text-muted-foreground font-mono">{wishlistCount} saved frames</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {wishlistItems.length > 0 ? (
                  wishlistItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3.5 p-3 rounded-2xl bg-secondary/40 border border-line">
                      <img src={item.image || item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-primary font-mono uppercase">{item.brand || 'Mr & Mrs'}</span>
                        <h5 className="text-xs font-bold text-foreground font-serif truncate">{item.name}</h5>
                        <span className="text-xs font-bold text-foreground">₹{(item.price || 4999).toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => {
                          addItem({ id: item.id || `wish-${idx}`, name: item.name, price: item.price || 4999, mrp: item.mrp || 6999, image: item.image || item.image_url, quantity: 1, brand: item.brand || 'Mr & Mrs' });
                          setIsWishlistOpen(false);
                          setIsCartOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 cursor-pointer"
                      >
                        Add to Bag
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-muted-foreground/30 mb-3" />
                    <h4 className="font-bold text-foreground font-serif text-base mb-1">No saved frames yet</h4>
                    <p className="text-xs text-muted-foreground mb-6">Save your favorite frames while browsing to view them anytime.</p>
                    <Link
                      href="/catalog"
                      onClick={() => setIsWishlistOpen(false)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider"
                    >
                      Explore Catalog <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6 border-t border-line bg-background/80">
                <Link
                  href="/wishlist"
                  onClick={() => setIsWishlistOpen(false)}
                  className="block w-full py-3.5 text-center rounded-xl bg-secondary hover:bg-primary/20 text-foreground font-bold text-sm border border-line"
                >
                  View Full Wishlist Page
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MODAL 4: PHONE & CONCIERGE QUICK CONTACT MODAL ───────── */}
      <AnimatePresence>
        {isContactOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-card border border-primary/30 rounded-3xl p-6 shadow-2xl z-[61] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-line">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl font-serif text-foreground">Concierge Care</h3>
                    <p className="text-xs text-primary font-medium">Mr. & Mrs. Optical Support</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsContactOpen(false)}
                  className="p-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3.5 mb-6">
                {/* 1. Direct Phone Call */}
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-between p-4 rounded-2xl bg-primary/10 border border-primary/25 hover:bg-primary/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-primary group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono block">Direct Call</span>
                      <span className="text-sm font-bold text-foreground">+91 98765 43210</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Call Now</span>
                </a>

                {/* 2. Direct WhatsApp Chat */}
                <a
                  href="https://wa.me/919876543210?text=Hi%20Mr%20%26%20Mrs%20Optical,%20I%20would%20like%20to%20inquire%20about%20eyewear%20and%20consultation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono block">WhatsApp Chat</span>
                      <span className="text-sm font-bold text-foreground">Instant Assistance</span>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-emerald-500" />
                </a>

                {/* 3. Store Visit */}
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-secondary/60 border border-line hover:bg-secondary transition-all"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-primary" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono block">Surat Optical Store</span>
                      <span className="text-xs text-foreground font-medium">Shop 1, Near City Mall, Surat</span>
                    </div>
                  </div>
                  <span className="text-xs text-primary font-semibold">Directions</span>
                </a>
              </div>

              <Button
                onClick={() => { setIsContactOpen(false); openBookingModal(); }}
                className="w-full py-6 text-sm bg-primary text-primary-foreground hover:bg-primary/95 btn-brass-sweep border-none rounded-2xl font-bold tracking-wider cursor-pointer"
              >
                Book Eye Test Appointment
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Slide-Over Menu Panel ─────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[38] bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-[39] w-[min(85vw,360px)] bg-background border-l border-border shadow-2xl lg:hidden flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                <Logo />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col px-4 py-4 gap-1 flex-1">
                {/* 1. Home */}
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-3 text-base font-[family-name:var(--font-serif)] hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                >
                  Home
                </Link>

                {/* 2. Collections (Expandable Accordion) */}
                <div className="rounded-xl overflow-hidden">
                  <button
                    onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                    className="w-full flex items-center justify-between py-3 px-3 text-base font-[family-name:var(--font-serif)] hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    <span>Collections</span>
                    <ChevronDown size={16} className={`transition-transform ${mobileCollectionsOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  {mobileCollectionsOpen && (
                    <div className="pl-4 pr-2 py-2 space-y-2 bg-secondary/30 rounded-xl my-1 border border-line">
                      {collectionCategories.map((cat, i) => (
                        <Link
                          key={i}
                          href={cat.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-xs font-medium text-muted-foreground hover:text-primary py-1.5"
                        >
                          • {cat.name}
                        </Link>
                      ))}
                      <Link
                        href="/catalog"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-xs font-bold text-primary py-1.5 border-t border-line mt-1"
                      >
                        View All Collections →
                      </Link>
                    </div>
                  )}
                </div>

                {/* 3. Services (Expandable Accordion) */}
                <div className="rounded-xl overflow-hidden">
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full flex items-center justify-between py-3 px-3 text-base font-[family-name:var(--font-serif)] hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    <span>Services</span>
                    <ChevronDown size={16} className={`transition-transform ${mobileServicesOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  {mobileServicesOpen && (
                    <div className="pl-4 pr-2 py-2 space-y-2 bg-secondary/30 rounded-xl my-1 border border-line">
                      {serviceCategories.map((serv, i) => (
                        <Link
                          key={i}
                          href={serv.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-xs font-medium text-muted-foreground hover:text-primary py-1.5"
                        >
                          • {serv.name}
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-xs font-bold text-primary py-1.5 border-t border-line mt-1"
                      >
                        View All Services →
                      </Link>
                    </div>
                  )}
                </div>

                {/* 4. Our Story */}
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-3 text-base font-[family-name:var(--font-serif)] hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                >
                  Our Story
                </Link>

                {/* 5. Gallery */}
                <Link
                  href="/gallery"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-3 text-base font-[family-name:var(--font-serif)] hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                >
                  Gallery
                </Link>

                {/* 6. Offers */}
                <Link
                  href="/offers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-3 text-base font-[family-name:var(--font-serif)] hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                >
                  Offers
                </Link>
              </nav>

              <div className="px-6 pb-8 space-y-3 border-t border-border pt-5">
                <Button
                  onClick={() => { setIsMobileMenuOpen(false); openBookingModal(); }}
                  className="w-full py-6 text-sm bg-primary text-primary-foreground hover:bg-primary/90 btn-brass-sweep cursor-pointer border-none rounded-full font-semibold tracking-wider"
                >
                  Book Eye Test
                </Button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsContactOpen(true); }}
                  className="w-full py-3.5 text-sm border border-border hover:bg-muted rounded-full font-medium text-foreground transition-colors cursor-pointer"
                >
                  Call & Concierge Support
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
