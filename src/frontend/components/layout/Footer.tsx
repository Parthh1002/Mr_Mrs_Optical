'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowRight, Clock } from 'lucide-react';

// Inline SVGs for social icons not available in this lucide-react version
const InstagramIcon = ({ size = 17 }: { size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>);
const FacebookIcon  = ({ size = 17 }: { size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>);
const YoutubeIcon   = ({ size = 17 }: { size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>);

import { Logo } from '@/components/ui/Logo';
import { usePathname } from 'next/navigation';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as any },
  }),
};

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
  { icon: FacebookIcon,  href: '#', label: 'Facebook'  },
  { icon: YoutubeIcon,   href: '#', label: 'YouTube'   },
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
    <footer className="relative overflow-hidden bg-[#0D1512] text-[#F4EFE3]">

      {/* ── top accent line ─────────────────────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D0A64E]/60 to-transparent" />

      {/* ── giant watermark ─────────────────────────────────────── */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   text-[22vw] font-bold font-[family-name:var(--font-serif)] whitespace-nowrap
                   text-[#D0A64E]/[0.035] leading-none tracking-tighter"
      >
        MR &amp; MRS
      </span>

      {/* ── radial glow ─────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 w-[560px] h-[560px] rounded-full
                   bg-[radial-gradient(circle,rgba(208,166,78,0.07),transparent_70%)]"
      />

      <div className="container relative z-10 mx-auto px-6 md:px-12 pt-20 pb-0">

        {/* ── NEWSLETTER BANNER ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-20 rounded-2xl border border-[#D0A64E]/20 bg-[#111C17]
                     px-8 py-10 md:px-14 md:py-12 overflow-hidden"
        >
          {/* subtle corner ornament */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full
                          bg-[radial-gradient(circle,rgba(208,166,78,0.08),transparent_70%)]
                          translate-x-1/4 -translate-y-1/4" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-md">
              <p className="font-mono text-xs tracking-[0.25em] text-[#D0A64E] uppercase mb-3">
                Stay In The Loop
              </p>
              <h3 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-medium leading-snug">
                Premium Eyewear, <span className="text-[#D0A64E]">Delivered to Your Inbox</span>
              </h3>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-3 bg-[#D0A64E]/10 border border-[#D0A64E]/30 rounded-xl px-6 py-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-[#F4EFE3]/80">You're subscribed! Thank you.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-0 min-w-0 md:min-w-[380px]">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 min-w-0 rounded-l-xl border border-[#D0A64E]/25 bg-[#0D1512]/60
                             px-5 py-3.5 text-sm text-[#F4EFE3] placeholder:text-[#847E6F]
                             outline-none focus:border-[#D0A64E]/60 transition-colors"
                />
                <button
                  type="submit"
                  className="shrink-0 flex items-center gap-2 rounded-r-xl bg-[#D0A64E] hover:bg-[#C4993E]
                             px-6 py-3.5 text-[#12160D] text-sm font-bold tracking-wider
                             transition-colors duration-200 cursor-pointer"
                >
                  Subscribe <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* ── MAIN GRID ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand col */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="lg:col-span-4 space-y-7"
          >
            <Link href="/" className="inline-block">
              <Logo className="text-[#F4EFE3]" variant="stacked" />
            </Link>

            <p className="text-[#B7B0A0] text-sm leading-relaxed max-w-xs">
              Elevating your vision with precision-crafted frames and India's finest clinical eye care.
              See the world with elegance.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-1">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-xl
                             border border-[#D0A64E]/20 text-[#D0A64E]
                             hover:bg-[#D0A64E]/10 hover:border-[#D0A64E]/50
                             transition-all duration-200"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>

            {/* Hours badge */}
            <div className="flex items-start gap-3 bg-[#182620] border border-[#D0A64E]/15 rounded-xl px-4 py-4">
              <Clock size={16} className="text-[#D0A64E] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-mono tracking-widest text-[#D0A64E] uppercase mb-1.5">Store Hours</p>
                <p className="text-[#B7B0A0] text-xs leading-relaxed">
                  Mon – Sat: 10:00 AM – 8:00 PM<br />
                  Sunday: 11:00 AM – 6:00 PM
                </p>
              </div>
            </div>
          </motion.div>

          {/* Discover links */}
          <motion.div
            custom={1} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="lg:col-span-2 lg:col-start-6 space-y-6"
          >
            <h4 className="font-mono text-xs tracking-[0.22em] uppercase text-[#D0A64E]">Discover</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-sm text-[#B7B0A0] hover:text-[#F4EFE3] transition-colors"
                  >
                    <span className="w-0 h-px bg-[#D0A64E] transition-all duration-300 group-hover:w-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services links */}
          <motion.div
            custom={2} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="lg:col-span-3 space-y-6"
          >
            <h4 className="font-mono text-xs tracking-[0.22em] uppercase text-[#D0A64E]">Services</h4>
            <ul className="space-y-4">
              {SERVICE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-sm text-[#B7B0A0] hover:text-[#F4EFE3] transition-colors"
                  >
                    <span className="w-0 h-px bg-[#D0A64E] transition-all duration-300 group-hover:w-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact col */}
          <motion.div
            custom={3} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="lg:col-span-3 space-y-6"
          >
            <h4 className="font-mono text-xs tracking-[0.22em] uppercase text-[#D0A64E]">Visit Us</h4>
            <ul className="space-y-5">
              <li>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 group"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#D0A64E]/10 text-[#D0A64E] shrink-0 group-hover:bg-[#D0A64E]/20 transition-colors">
                    <MapPin size={15} />
                  </span>
                  <span className="text-sm text-[#B7B0A0] group-hover:text-[#F4EFE3] transition-colors leading-relaxed">
                    Shop No. 1, Ground Floor,<br />
                    Near City Mall, Surat, Gujarat
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3.5 group"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#D0A64E]/10 text-[#D0A64E] shrink-0 group-hover:bg-[#D0A64E]/20 transition-colors">
                    <Phone size={15} />
                  </span>
                  <span className="text-sm text-[#B7B0A0] group-hover:text-[#F4EFE3] transition-colors">
                    +91 98765 43210
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@mrmrsoptical.com"
                  className="flex items-center gap-3.5 group"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#D0A64E]/10 text-[#D0A64E] shrink-0 group-hover:bg-[#D0A64E]/20 transition-colors">
                    <Mail size={15} />
                  </span>
                  <span className="text-sm text-[#B7B0A0] group-hover:text-[#F4EFE3] transition-colors">
                    hello@mrmrsoptical.com
                  </span>
                </a>
              </li>
            </ul>

            {/* CTA */}
            <Link
              href="/book"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#D0A64E] hover:bg-[#C4993E]
                         px-5 py-3 text-[#12160D] text-sm font-bold tracking-wider transition-colors duration-200"
            >
              Book Eye Test <ArrowRight size={15} />
            </Link>
          </motion.div>

        </div>

        {/* ── BOTTOM BAR ───────────────────────────────────────── */}
        <div className="border-t border-[#F4EFE3]/[0.08] py-7 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#847E6F] text-xs font-mono tracking-wider">
            © {new Date().getFullYear()} Mr &amp; Mrs Optical — All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-[#847E6F] font-mono tracking-wider">
            <Link href="/privacy" className="hover:text-[#F4EFE3] transition-colors">Privacy Policy</Link>
            <span className="text-[#D0A64E]/40">·</span>
            <Link href="/terms" className="hover:text-[#F4EFE3] transition-colors">Terms of Service</Link>
            <span className="text-[#D0A64E]/40">·</span>
            <Link href="/sitemap" className="hover:text-[#F4EFE3] transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
