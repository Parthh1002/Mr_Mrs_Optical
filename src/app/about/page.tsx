'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EditableText } from '@/components/admin/EditableText';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    name: 'Rajesh Patel',
    role: 'Founder & Master Optometrist',
    bio: 'With over 20 years of clinical optometrist experience, Rajesh Patel personally opened and manages Mr. & Mrs. Optical in Dahegam, bringing computerized eye testing accuracy and handpicked boutique eyewear under one roof.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop'
  }
];

export default function AboutPage() {
  const [content, setContent] = useState<Record<string, any>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    async function loadContent() {
      try {
        const { data } = await supabase.from('site_content').select('*').eq('page', 'about');
        const contentMap: Record<string, any> = {};
        if (data) {
          data.forEach(c => {
            contentMap[c.key] = c.text_content;
          });
        }
        setContent(contentMap);
      } catch (err) {
        console.error('Failed to load about page CMS:', err);
      }
    }
    loadContent();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax for team images
      teamRef.current.forEach((el) => {
        if (!el) return;
        const img = el.querySelector('img');
        if (img) {
          gsap.to(img, {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });

      // Staggered reveal for team members
      gsap.fromTo(
        teamRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.team-section',
            start: 'top 70%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background pt-32 pb-24 text-foreground">
      {/* Story Section */}
      <section className="container mx-auto px-6 md:px-12 mb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Rx eyebrow badge */}
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3">
            Rx +1.50
          </div>
          <h1 className="text-sm uppercase tracking-widest text-primary font-semibold mb-6">Our Story</h1>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-8 leading-tight">
            <EditableText 
              table="site_content" idColumn="section_key" idValue="about_title" updateColumn="text_value"
              value={content['about_title'] || "Precision Eyecare Meets Boutique Luxury in Dahegam."}
            />
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
            <EditableText 
              table="site_content" idColumn="section_key" idValue="about_desc" updateColumn="text_value"
              value={content['about_desc'] || "Founded with a vision to revolutionize optical care, Mr & Mrs Optical brings together computerized clinical precision and curated designer collections. We believe that eyewear is not just a medical necessity, but a defining accessory of your personal style."}
            />
          </p>
        </div>
      </section>

      {/* Meet the Owners - Team Grid */}
      <section className="team-section bg-surface py-24 border-y border-line">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3">
              Rx +1.75
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">Meet Our Founder</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">The vision and passion behind Mr & Mrs Optical.</p>
          </div>

          <div className="flex justify-center max-w-xl mx-auto">
            {team.map((member, idx) => (
              <div 
                key={idx} 
                ref={el => { teamRef.current[idx] = el; }}
                className="flex flex-col group"
              >
                {/* Image aspect 3/4 with caption overlay and gradient scrim */}
                <div className="aspect-[3/4] overflow-hidden rounded-3xl mb-8 relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  {/* Gradient Scrim for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                  
                  {/* Absolute position name & role caption */}
                  <div className="absolute bottom-6 left-6 z-20 text-white text-left">
                    <h3 className="text-2xl font-bold font-serif">{member.name}</h3>
                    <p className="text-xs font-mono uppercase tracking-[0.12em] text-primary mt-1">{member.role}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed font-light">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Dedicated Owner Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-primary mb-3">
              Rx +2.00
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">Get In Touch</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Visit us or drop a message to schedule an eye-test.</p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left: Dedicated Owner Card */}
            <div className="bg-card border border-line rounded-3xl p-8 shadow-lg text-left">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-line">
                {/* Circular image with brass border */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary flex-shrink-0 shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop" 
                    alt="Rajesh Patel"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-2xl font-bold font-serif text-foreground">Rajesh Patel</h4>
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-primary bg-brass-dim px-3 py-1 rounded-full mt-2 inline-block">
                    Founder & Chief Optometrist
                  </span>
                  <p className="text-sm text-muted-foreground mt-3 italic">
                    "Dedicated to providing Dahegam with the highest standard of optical care."
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-sm text-muted-foreground">
                <div>
                  <h5 className="font-bold text-foreground mb-1 uppercase tracking-wider text-xs font-mono">Our Store Address</h5>
                  <p>Shop No. 4, Station Road, Dahegam, Gandhinagar, Gujarat 382305</p>
                </div>
                <div>
                  <h5 className="font-bold text-foreground mb-1 uppercase tracking-wider text-xs font-mono">Phone & Email</h5>
                  <p>+91 98765 43210</p>
                  <p>contact@mrmrsoptical.com</p>
                </div>
                <div>
                  <h5 className="font-bold text-foreground mb-1 uppercase tracking-wider text-xs font-mono">Business Hours</h5>
                  <p>Mon - Sat: 10:00 AM - 8:30 PM</p>
                  <p>Sunday: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>

            {/* Right: Working Contact Form */}
            <div className="bg-card border border-line rounded-3xl p-8 shadow-lg">
              <h4 className="text-2xl font-bold font-serif text-foreground mb-6 text-left">Send us a Message</h4>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Thank you! Your message has been sent successfully.');
      setName('');
      setPhone('');
      setMessage('');
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div>
        <label className="block text-xs font-mono uppercase tracking-[0.1em] text-muted-foreground mb-2">Name *</label>
        <input 
          type="text" 
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Rajesh Kumar" 
          className="w-full bg-background/50 border border-line rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-[0.1em] text-muted-foreground mb-2">Phone Number *</label>
        <input 
          type="tel" 
          required
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+91 98765 43210" 
          className="w-full bg-background/50 border border-line rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-[0.1em] text-muted-foreground mb-2">Message *</label>
        <textarea 
          required
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="How can we help you today?" 
          className="w-full bg-background/50 border border-line rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none"
        />
      </div>
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full h-12 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl btn-brass-sweep border-none shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
