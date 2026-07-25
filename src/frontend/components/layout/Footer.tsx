'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowRight, Clock, Sparkles, Send } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { usePathname } from 'next/navigation';

// Social SVGs
const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
);

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/catalog' },
  { label: 'Our Story', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Offers', href: '/offers' },
  { label: 'Contact', href: '/contact' },
];

const SERVICE_LINKS = [
  { label: 'Computerized Eye Testing', href: '/services#eye-test' },
  { label: 'Frame Styling Consultation', href: '/services#styling' },
  { label: 'Contact Lens Fitting', href: '/services#contact-lens' },
  { label: 'Lens Replacement', href: '/services#lens' },
  { label: 'Repair & Adjustments', href: '/services#repair' },
];

const SOCIALS = [
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
  { icon: YoutubeIcon, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith('/admin')) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="relative overflow-hidden bg-[#0B120F] text-[#F4EFE3] pt-12 pb-6 border-t border-[#D0A64E]/20">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle,rgba(208,166,78,0.06),transparent_70%)]" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        {/* Main 3-Column Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-10 border-b border-[#F4EFE3]/10">
          
          {/* LEFT COLUMN: Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <Logo className="text-[#F4EFE3]" variant="stacked" />
            </Link>

            <p className="text-[#B7B0A0] text-xs sm:text-sm leading-relaxed max-w-sm">
              Elevating your vision with precision-crafted frames and India's finest clinical eye care. See the world with elegance.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#D0A64E]/25 text-[#D0A64E] hover:bg-[#D0A64E] hover:text-[#0B120F] transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Visit Us Contact Info */}
            <div className="space-y-2 pt-2 text-xs text-[#B7B0A0]">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#D0A64E] shrink-0" />
                <span>Shop No. 1, Ground Floor, Near City Mall, Surat, Gujarat</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-[#F4EFE3] transition-colors">
                  <Phone size={13} className="text-[#D0A64E]" />
                  <span>+91 98765 43210</span>
                </a>
                <a href="mailto:hello@mrmrsoptical.com" className="flex items-center gap-1.5 hover:text-[#F4EFE3] transition-colors">
                  <Mail size={13} className="text-[#D0A64E]" />
                  <span>hello@mrmrsoptical.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: Store Hours & Newsletter */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            {/* Store Hours Card */}
            <div className="bg-[#14201A] border border-[#D0A64E]/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-lg bg-[#D0A64E]/10 text-[#D0A64E]">
                  <Clock size={16} />
                </div>
                <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-[#D0A64E] font-bold">
                  Store Hours
                </h4>
              </div>
              <div className="space-y-1.5 text-xs text-[#F4EFE3] font-medium">
                <div className="flex justify-between items-center py-1 border-b border-[#F4EFE3]/5">
                  <span className="text-[#B7B0A0]">Mon – Sat:</span>
                  <span className="font-semibold text-[#D0A64E]">10:00 AM – 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#B7B0A0]">Sunday:</span>
                  <span className="font-semibold text-[#D0A64E]">11:00 AM – 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-[#14201A] border border-[#D0A64E]/15 rounded-2xl p-4 sm:p-5">
              <p className="font-mono text-[10px] tracking-[0.2em] text-[#D0A64E] uppercase mb-1 flex items-center gap-1.5 font-semibold">
                <Sparkles size={11} /> Stay In The Loop
              </p>
              <h5 className="text-xs font-semibold text-[#F4EFE3] mb-3">
                Premium Eyewear, <span className="text-[#D0A64E]">Delivered to Your Inbox</span>
              </h5>

              {subscribed ? (
                <div className="text-xs text-emerald-400 font-medium py-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  ✓ You're subscribed! Thank you.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 min-w-0 rounded-xl border border-[#D0A64E]/20 bg-[#0B120F] px-3.5 py-2 text-xs text-[#F4EFE3] placeholder:text-[#847E6F] outline-none focus:border-[#D0A64E]"
                  />
                  <button
                    type="submit"
                    className="shrink-0 flex items-center justify-center rounded-xl bg-[#D0A64E] hover:bg-[#C4993E] px-4 py-2 text-[#0B120F] text-xs font-bold transition-all cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Discover & Services Navigation */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            {/* Discover */}
            <div>
              <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-[#D0A64E] font-bold mb-4">
                Discover
              </h4>
              <ul className="space-y-2.5">
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-xs text-[#B7B0A0] hover:text-[#D0A64E] transition-colors inline-block hover:translate-x-1 transform duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-[#D0A64E] font-bold mb-4">
                Services
              </h4>
              <ul className="space-y-2.5">
                {SERVICE_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-xs text-[#B7B0A0] hover:text-[#D0A64E] transition-colors leading-snug inline-block hover:translate-x-1 transform duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-[#847E6F] font-mono">
          <p>© {new Date().getFullYear()} Mr &amp; Mrs Optical. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#D0A64E] transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-[#D0A64E] transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="/sitemap" className="hover:text-[#D0A64E] transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
