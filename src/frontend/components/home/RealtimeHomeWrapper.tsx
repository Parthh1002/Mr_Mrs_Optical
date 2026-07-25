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
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      const scrollToTopStrict = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      scrollToTopStrict();

      const t1 = setTimeout(scrollToTopStrict, 10);
      const t2 = setTimeout(scrollToTopStrict, 50);
      const t3 = setTimeout(scrollToTopStrict, 150);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
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
