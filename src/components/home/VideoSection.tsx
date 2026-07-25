'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Volume2, VolumeX, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableText } from '@/components/admin/EditableText';

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

gsap.registerPlugin(ScrollTrigger);

const DEMO_REELS = [
  {
    id: 'reel-1',
    title: 'How to Choose the Perfect Frame for Your Face Shape',
    category: 'Expert Advice',
    badge_color: 'bg-[#D0A64E]',
    video_url: 'https://videos.pexels.com/video-files/8538740/8538740-hd_1080_1920_25fps.mp4',
    thumbnail_url: '/generated/reel-frame-guide.jpg',
    duration: '2:34',
    views: '12.4K',
  },
  {
    id: 'reel-2',
    title: 'New Summer 2025 Collection — First Look',
    category: 'New Collection',
    badge_color: 'bg-emerald-600',
    video_url: 'https://videos.pexels.com/video-files/3195394/3195394-hd_1080_1920_25fps.mp4',
    thumbnail_url: '/generated/reel-summer.jpg',
    duration: '1:12',
    views: '8.1K',
  },
  {
    id: 'reel-3',
    title: 'Blue Cut Lenses — Why You Need Them Right Now',
    category: 'Health Tips',
    badge_color: 'bg-blue-600',
    video_url: 'https://videos.pexels.com/video-files/8538741/8538741-hd_1080_1920_25fps.mp4',
    thumbnail_url: '/generated/reel-blue-cut.jpg',
    duration: '0:58',
    views: '6.7K',
  },
  {
    id: 'reel-4',
    title: 'Inside the Optical Lab — Behind the Scenes',
    category: 'Behind The Scenes',
    badge_color: 'bg-rose-600',
    video_url: 'https://videos.pexels.com/video-files/3209752/3209752-hd_1080_1920_24fps.mp4',
    thumbnail_url: '/generated/reel-behind-scenes.jpg',
    duration: '1:45',
    views: '5.3K',
  },
];

function ReelCard({ reel }: { reel: (typeof DEMO_REELS)[0] }) {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div
      className="reel-card relative flex-shrink-0 w-[240px] sm:w-[270px] md:w-[300px] h-[380px] sm:h-[420px] overflow-hidden group cursor-pointer rounded-3xl bg-card border border-line shadow-lg hover:shadow-2xl transition-all duration-500 snap-start"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handlePlay}
    >
      {/* Background Poster Image */}
      <img
        src={reel.thumbnail_url}
        alt={reel.title}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${
          hovered ? 'scale-105' : 'scale-100'
        } ${playing ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Video Element */}
      <video
        ref={videoRef}
        src={reel.video_url}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          playing ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 z-10 pointer-events-none" />

      {/* Top Bar: Category Pill & Mute Button */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <span className={`text-[10px] font-mono uppercase tracking-widest text-white px-3 py-1 rounded-full font-bold shadow-md ${reel.badge_color}`}>
          {reel.category}
        </span>

        {playing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMuted(!muted);
            }}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer"
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        )}
      </div>

      {/* Center Play Button Overlay */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
            <Play size={22} className="ml-1 fill-white" />
          </div>
        </div>
      )}

      {/* Bottom Info Section */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white pointer-events-none">
        <div className="flex items-center gap-2 text-[11px] text-white/70 font-mono mb-1.5">
          <span>{reel.duration}</span>
          <span>•</span>
          <span>{reel.views} views</span>
        </div>
        <h4 className="text-sm sm:text-base font-semibold leading-snug line-clamp-2 drop-shadow-md text-white">
          {reel.title}
        </h4>
      </div>
    </div>
  );
}

export default function VideoSection({ content = {} }: { content?: Record<string, any> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        scrollContainerRef.current?.children as unknown as Element[],
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 82%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section ref={containerRef} className="py-16 sm:py-20 bg-background text-foreground border-t border-line relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">

        {/* Section Header with Left/Right Arrows */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles size={13} />
              Reel Guides &amp; Tips
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">
              <EditableText
                table="site_content"
                idColumn="section_key"
                idValue="home_video_title"
                updateColumn="text_value"
                value={content['home_video_title']?.text || 'Style Inspiration & Expert Advice'}
              />
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Watch short styling guides, behind-the-scenes laboratory craftsmanship, and eye care tips.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border border-line bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center transition-all cursor-pointer shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full border border-line bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center transition-all cursor-pointer shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Slider */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-1 -mx-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DEMO_REELS.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>

        {/* Social Follow Strip */}
        <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            New video guides uploaded every week — Follow our social channels
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold text-foreground hover:text-primary transition-colors group"
            >
              <InstagramIcon />
              @MrandMrsOptical
              <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold text-foreground hover:text-primary transition-colors group"
            >
              <YoutubeIcon />
              YouTube
              <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
