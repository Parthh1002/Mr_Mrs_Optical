'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, Phone, ChevronDown, Menu, X,
  ArrowRight, ShoppingBag, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { useCartStore } from '@/store/cartStore';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useBookingModal } from '@/store/bookingModalStore';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname         = usePathname();
  const [isScrolled,     setIsScrolled]      = useState(false);
  const [wishlistCount,  setWishlistCount]   = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu]  = useState<string | null>(null);
  const [mounted,        setMounted]         = useState(false);

  const cartCount        = useCartStore(s => s.getCartCount());
  const openBookingModal = useBookingModal(s => s.open);

  const updateWishlist = useCallback(() => {
    try {
      const saved = localStorage.getItem('mrandmrs_wishlist');
      setWishlistCount(saved ? JSON.parse(saved).length : 0);
    } catch { /* ignore */ }
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

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setIsMobileMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  if (pathname?.startsWith('/admin')) return null;

  const megaMenus = {
    collections: {
      title: 'Premium Collections',
      items: [
        { name: 'Luxury Men',          href: '/catalog?category=men' },
        { name: 'Luxury Women',        href: '/catalog?category=women' },
        { name: 'Computer Glasses',    href: '/catalog?category=computer' },
        { name: 'Designer Sunglasses', href: '/catalog?category=sunglasses' },
      ],
      featuredImage: '/generated/frames-display.jpg',
    },
    services: {
      title: 'Our Services',
      items: [
        { name: 'Computerized Eye Test', href: '/services#eye-test' },
        { name: 'Contact Lens Fitting',  href: '/services#contact-lens' },
        { name: 'Frame Styling',         href: '/services#styling' },
        { name: 'Lens Replacement',      href: '/services#lens' },
      ],
      featuredImage: '/generated/eye-test.jpg',
    },
  };

  const navLinkCls =
    'text-sm font-medium uppercase tracking-widest transition-colors duration-200 relative group hover:text-primary';

  return (
    <>
      {/* ── Main Navbar ──────────────────────────────────────────── */}
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

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
              <Link href="/" className={navLinkCls}>
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>

              <button
                className={`${navLinkCls} flex items-center gap-1 py-5 cursor-pointer`}
                onMouseEnter={() => setActiveMegaMenu('collections')}
              >
                Collections
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${activeMegaMenu === 'collections' ? 'rotate-180' : ''}`}
                />
                <span className="absolute bottom-3 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
              </button>

              <button
                className={`${navLinkCls} flex items-center gap-1 py-5 cursor-pointer`}
                onMouseEnter={() => setActiveMegaMenu('services')}
              >
                Services
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${activeMegaMenu === 'services' ? 'rotate-180' : ''}`}
                />
                <span className="absolute bottom-3 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
              </button>

              <Link href="/about" className={navLinkCls}>
                Our Story
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4 z-50">
              <ThemeToggle />

              <button className="hover:text-primary transition-colors duration-200 cursor-pointer" aria-label="Search">
                <Search size={18} strokeWidth={1.6} />
              </button>

              <Link href="/cart" className="hover:text-primary transition-colors duration-200 relative" aria-label="Cart">
                <ShoppingBag size={18} strokeWidth={1.6} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link href="/wishlist" className="hover:text-primary transition-colors duration-200 relative" aria-label="Wishlist">
                <Heart size={18} strokeWidth={1.6} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <a href="tel:+919876543210" className="hover:text-primary transition-colors duration-200" aria-label="Call us">
                <Phone size={16} strokeWidth={1.6} />
              </a>

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
              className="lg:hidden z-50 p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X size={22} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Desktop Mega Menu ─────────────────────────────────── */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              key={activeMegaMenu}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 right-0 bg-background/97 backdrop-blur-xl shadow-2xl border-t border-border text-foreground"
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <div className="container mx-auto px-12 py-10">
                <div className="grid grid-cols-3 gap-12">
                  <div className="col-span-1">
                    <h3 className="text-2xl font-[family-name:var(--font-serif)] text-primary mb-5">
                      {megaMenus[activeMegaMenu as keyof typeof megaMenus].title}
                    </h3>
                    <ul className="space-y-4">
                      {megaMenus[activeMegaMenu as keyof typeof megaMenus].items.map((item, idx) => (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: idx * 0.06 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setActiveMegaMenu(null)}
                            className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                          >
                            {item.name}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                    <Link
                      href={activeMegaMenu === 'collections' ? '/catalog' : '/services'}
                      onClick={() => setActiveMegaMenu(null)}
                    >
                      <Button variant="link" className="mt-5 px-0 text-primary font-semibold uppercase tracking-widest gap-2 text-xs">
                        View All <ArrowRight size={13} />
                      </Button>
                    </Link>
                  </div>
                  <div className="col-span-2 relative h-56 rounded-2xl overflow-hidden">
                    <img
                      src={megaMenus[activeMegaMenu as keyof typeof megaMenus].featuredImage}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Menu Panel ─────────────────────────────────────── */}
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
                {[
                  { label: 'Home',        href: '/' },
                  { label: 'Collections', href: '/catalog' },
                  { label: 'Services',    href: '/services' },
                  { label: 'Our Story',   href: '/about' },
                  { label: 'Gallery',     href: '/gallery' },
                  { label: 'Offers',      href: '/offers' },
                  { label: `Wishlist (${wishlistCount})`, href: '/wishlist' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: 0.04 + idx * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3.5 px-3 text-base font-[family-name:var(--font-serif)] hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="px-6 pb-8 space-y-3 border-t border-border pt-5">
                <Button
                  onClick={() => { setIsMobileMenuOpen(false); openBookingModal(); }}
                  className="w-full py-6 text-sm bg-primary text-primary-foreground hover:bg-primary/90 btn-brass-sweep cursor-pointer border-none rounded-full font-semibold tracking-wider"
                >
                  Book Eye Test
                </Button>
                <a href="tel:+919876543210" onClick={() => setIsMobileMenuOpen(false)} className="block">
                  <Button
                    variant="outline"
                    className="w-full py-6 text-sm border-border hover:bg-muted rounded-full font-medium"
                  >
                    Call Us Now
                  </Button>
                </a>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-primary py-2 hover:underline"
                >
                  <ShieldCheck size={14} /> Admin Portal
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
