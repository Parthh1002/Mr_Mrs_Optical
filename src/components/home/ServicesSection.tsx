'use client';

import { motion } from 'framer-motion';
import { Eye, ShieldCheck, Zap, Scissors, Glasses, ScanFace } from 'lucide-react';

const services = [
  {
    title: 'Computerized Testing',
    description: 'State-of-the-art digital eye examination for perfect accuracy.',
    icon: ScanFace,
  },
  {
    title: 'Contact Lenses',
    description: 'Premium soft and RGP lenses for all prescriptions.',
    icon: Eye,
  },
  {
    title: 'Blue Cut Glasses',
    description: 'Protect your eyes from digital screen glare and fatigue.',
    icon: Zap,
  },
  {
    title: 'UV Protection',
    description: '100% UV blocking sunglasses for optimal outdoor care.',
    icon: ShieldCheck,
  },
  {
    title: 'Progressive Lenses',
    description: 'Seamless transition for near, intermediate, and far vision.',
    icon: Glasses,
  },
  {
    title: 'Frame Repair',
    description: 'Expert adjustment and repair for your favorite frames.',
    icon: Scissors,
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Premium Eye Care Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience world-class optometry combined with luxurious fashion. Your vision is our priority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/30 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
