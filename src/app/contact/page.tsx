'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered slide in from sides
      gsap.fromTo(
        leftRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
      
      gsap.fromTo(
        rightRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent successfully! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24" ref={containerRef}>
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="text-center mb-16">
          <h1 className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">Get in Touch</h1>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-fraunces)] font-bold text-foreground">
            We'd Love to Hear From You
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Info & Map */}
          <div ref={leftRef} className="space-y-12">
            
            <div className="bg-card p-8 rounded-3xl border border-line shadow-lg">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-line text-left">
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

              <div className="space-y-6 text-sm text-muted-foreground text-left">
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

            {/* Google Maps Embed */}
            <div className="rounded-3xl overflow-hidden border border-line h-[300px] shadow-sm relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14668.6496330089!2d72.8123!3d23.1678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e500000000001%3A0x0!2sDahegam%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
            
          </div>

          {/* Right Column: Contact Form */}
          <div ref={rightRef}>
            <div className="bg-card border border-line p-8 md:p-12 rounded-3xl relative overflow-hidden text-foreground">
              {/* Deco pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="contactGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#contactGrid)" />
                </svg>
              </div>

              <div className="relative z-10 text-left">
                <h3 className="text-3xl font-serif font-bold mb-2">Send a Message</h3>
                <p className="text-muted-foreground mb-8 text-sm">Have a question about frames or eye tests? Write to us.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Full Name *</label>
                    <Input required placeholder="John Doe" className="bg-background border-line text-foreground placeholder:text-muted-foreground/50 h-14 rounded-xl focus-visible:ring-primary focus-visible:ring-offset-0" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Phone Number *</label>
                    <Input required type="tel" placeholder="+91 90000 00000" className="bg-background border-line text-foreground placeholder:text-muted-foreground/50 h-14 rounded-xl focus-visible:ring-primary focus-visible:ring-offset-0" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email Address (Optional)</label>
                    <Input type="email" placeholder="john@example.com" className="bg-background border-line text-foreground placeholder:text-muted-foreground/50 h-14 rounded-xl focus-visible:ring-primary focus-visible:ring-offset-0" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your Message *</label>
                    <Textarea required placeholder="How can we help you?" className="bg-background border-line text-foreground placeholder:text-muted-foreground/50 min-h-[120px] rounded-xl focus-visible:ring-primary focus-visible:ring-offset-0 resize-none" />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl gap-2 mt-4 btn-brass-sweep border-none shadow-md cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    ) : (
                      <><Send size={18} /> Send Message</>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
