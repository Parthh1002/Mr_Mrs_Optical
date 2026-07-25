'use client';

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

  return (
    <>
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
