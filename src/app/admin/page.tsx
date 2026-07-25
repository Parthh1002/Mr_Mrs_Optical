'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { 
  Image as ImageIcon, 
  Images, 
  Tag, 
  ShoppingBag, 
  CalendarCheck, 
  MapPin,
  LayoutTemplate,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';

const ADMIN_TILES = [
  {
    title: 'Edit Website',
    description: 'Change homepage banners, texts, and images directly on the live layout.',
    icon: LayoutTemplate,
    href: '/admin/edit-website',
    color: 'bg-primary/10 text-primary border-primary/20'
  },
  {
    title: 'Hero Banners',
    description: 'Manage homepage carousel slides — add discounts, offers, new arrivals.',
    icon: ImageIcon,
    href: '/admin/banners',
    color: 'bg-primary/10 text-primary border-primary/20'
  },
  {
    title: 'Photos & Videos',
    description: 'Manage Reels and Photo Gallery',
    icon: Images,
    href: '/admin/media',
    color: 'bg-primary/10 text-primary border-primary/20'
  },
  {
    title: 'Offers & Discounts',
    description: 'Turn offers on/off and update homepage popup',
    icon: Tag,
    href: '/admin/offers',
    color: 'bg-primary/10 text-primary border-primary/20'
  },
  {
    title: 'Products',
    description: 'Add new glasses or mark items out of stock',
    icon: ShoppingBag,
    href: '/admin/products',
    color: 'bg-primary/10 text-primary border-primary/20'
  },
  {
    title: 'Eye-Test Bookings',
    description: 'View and manage customer appointments',
    icon: CalendarCheck,
    href: '/admin/bookings',
    color: 'bg-primary/10 text-primary border-primary/20'
  },
  {
    title: 'Store Info',
    description: 'Update phone number, address and timings',
    icon: MapPin,
    href: '/admin/settings',
    color: 'bg-primary/10 text-primary border-primary/20'
  }
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const tilesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if previously authenticated in session
    if (sessionStorage.getItem('mrmrs_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          tilesRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isAuthenticated]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const [loginMode, setLoginMode] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('11a21278parth@gmail.com');
  const [password, setPassword] = useState('Parth@123');
  const [authError, setAuthError] = useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (email.trim().toLowerCase() === '11a21278parth@gmail.com' && password === 'Parth@123') {
      sessionStorage.setItem('mrmrs_admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid credentials. Use 11a21278parth@gmail.com & Parth@123');
      gsap.fromTo('.login-form-box', 
        { x: -10 }, 
        { x: 10, duration: 0.1, yoyo: true, repeat: 3, onComplete: () => gsap.set('.login-form-box', { x: 0 }) }
      );
    }
  };

  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered === '123456') { // Mock correct OTP
      sessionStorage.setItem('mrmrs_admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setError(true);
      gsap.fromTo('.otp-container', 
        { x: -10 }, 
        { x: 10, duration: 0.1, yoyo: true, repeat: 3, onComplete: () => gsap.set('.otp-container', { x: 0 }) }
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6">
        <div className="login-form-box bg-card border border-border p-8 rounded-3xl shadow-xl w-full max-w-md">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <Lock size={32} />
          </div>
          
          <h2 className="text-2xl font-[family-name:var(--font-fraunces)] font-bold text-foreground text-center mb-1">
            Admin Portal Access
          </h2>
          <p className="text-muted-foreground text-xs text-center mb-6">
            Sign in to manage live site visual editor & store settings.
          </p>

          {/* Mode Switcher */}
          <div className="flex bg-muted/60 p-1 rounded-xl mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setLoginMode('email'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all ${loginMode === 'email' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('otp'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all ${loginMode === 'otp' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              6-Digit Security PIN
            </button>
          </div>

          {loginMode === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="11a21278parth@gmail.com"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary outline-none transition-colors"
                />
              </div>

              {authError && (
                <p className="text-red-500 text-xs font-semibold text-center bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                  {authError}
                </p>
              )}

              <Button 
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-sm shadow-md gap-2 mt-2"
              >
                Sign In to Admin Portal <ArrowRight size={18} />
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground text-xs mb-6">Enter quick security code (Default: 123456)</p>
              
              <div className="otp-container flex justify-center gap-2 sm:gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-muted/50 border-2 rounded-xl outline-none transition-colors ${
                      error ? 'border-red-500 text-red-500' : 'border-border focus:border-primary focus:bg-card'
                    }`}
                  />
                ))}
              </div>
              
              {error && <p className="text-red-500 text-xs font-semibold mb-4">Incorrect code. Use 123456</p>}

              <Button 
                onClick={verifyOtp}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-sm shadow-md gap-2"
              >
                Verify & Enter <ArrowRight size={18} />
              </Button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-border/60 text-center">
            <p className="text-[11px] text-muted-foreground font-mono">
              Authorized Personnel Only • Secure JWT Session
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Welcome back!</h2>
        <p className="text-muted-foreground mt-1 text-lg">What would you like to update today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {ADMIN_TILES.map((tile, idx) => {
          const Icon = tile.icon;
          return (
            <Link 
              key={tile.title} 
              href={tile.href}
              ref={el => { tilesRef.current[idx] = el; }}
              className="group relative flex flex-col bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all active:scale-[0.98]"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${tile.color} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{tile.title}</h3>
              <p className="text-sm text-muted-foreground">{tile.description}</p>
            </Link>
          );
        })}
      </div>
      
      <div className="mt-12 text-center">
        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          Changes go live on your website immediately
        </p>
      </div>
    </div>
  );
}
