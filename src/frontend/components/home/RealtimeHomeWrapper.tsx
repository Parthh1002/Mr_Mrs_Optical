'use client';

import { useEffect } from 'react';
import { useRealtimeContent } from '@/hooks/useRealtimeContent';
import Hero from '@/components/home/Hero';
import TrustStrip from '@/components/home/TrustStrip';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FaceShapeGuide from '@/components/home/FaceShapeGuide';
import LensGuide from '@/components/home/LensGuide';
import BrandsMarquee from '@/components/home/BrandsMarquee';
import VideoSection from '@/components/home/VideoSection';
import PhotoGallery from '@/components/home/PhotoGallery';
import FestivalOffers from '@/components/home/FestivalOffers';

export function RealtimeHomeWrapper({ initialContent }: { initialContent: Record<string, any> }) {
  const content = useRealtimeContent(initialContent);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      const timer = setTimeout(() => window.scrollTo(0, 0), 50);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <div id="top-hero" className="scroll-mt-32" />
      <Hero content={content} />
      <TrustStrip />
      <WhyChooseUs content={content} />
      <CategoryShowcase />
      <FaceShapeGuide />
      <LensGuide />
      <BrandsMarquee />
      <VideoSection content={content} />
      <PhotoGallery />
      <FestivalOffers content={content} />
    </>
  );
}
