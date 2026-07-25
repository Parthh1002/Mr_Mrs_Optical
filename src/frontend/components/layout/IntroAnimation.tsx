'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function IntroAnimation() {
  const [isDone, setIsDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if intro has already played in this session
    const hasPlayed = sessionStorage.getItem('mrmrs_intro_played');
    if (hasPlayed) {
      setIsDone(true);
      return;
    }

    // Lock scroll during intro
    document.body.classList.add('overlay-open');

    let animationFrameId: number;
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const dpr = window.devicePixelRatio || 1;
        const isMobile = window.innerWidth < 640;

        const logicalW = isMobile ? 220 : 340;
        const logicalH = isMobile ? 130 : 200;

        canvas.width  = logicalW * dpr;
        canvas.height = logicalH * dpr;

        canvas.style.width  = `${logicalW}px`;
        canvas.style.height = `${logicalH}px`;

        ctx.scale(dpr, dpr);
        const sf = isMobile ? 0.62 : 1;

        let angleY    = -Math.PI / 4;
        let angleX    = -0.15;
        const angleZ  = 0;
        let pulseVal  = 0;
        let shimmerPos = -50;

        const leftRimPoints:   Point3D[] = [];
        const rightRimPoints:  Point3D[] = [];
        const bridgePoints:    Point3D[] = [];
        const leftTemplePoints:  Point3D[] = [];
        const rightTemplePoints: Point3D[] = [];

        for (let i = 0; i < 36; i++) {
          const angle = (i * 10 * Math.PI) / 180;
          leftRimPoints.push({
            x: (-36 + Math.cos(angle) * 23) * sf,
            y:  (Math.sin(angle) * 19) * sf,
            z: 0,
          });
          rightRimPoints.push({
            x: (36 + Math.cos(angle) * 23) * sf,
            y:  (Math.sin(angle) * 19) * sf,
            z: 0,
          });
        }

        for (let i = 0; i <= 10; i++) {
          const t = i / 10;
          bridgePoints.push({
            x: (-13 + t * 26) * sf,
            y: (3 + Math.sin(t * Math.PI) * 5) * sf,
            z: 0,
          });
        }

        for (let i = 0; i <= 20; i++) {
          const t  = i / 20;
          const z  = -t * 65 * sf;
          const bend = t > 0.75 ? Math.pow((t - 0.75) / 0.25, 2) * 14 * sf : 0;
          leftTemplePoints.push({
            x: (-59 - Math.sin(t * Math.PI * 0.5) * 4) * sf,
            y: -bend,
            z,
          });
          rightTemplePoints.push({
            x: (59 + Math.sin(t * Math.PI * 0.5) * 4) * sf,
            y: -bend,
            z,
          });
        }

        const rotate = (p: Point3D, rX: number, rY: number, rZ: number): Point3D => {
          let cos = Math.cos(rY), sin = Math.sin(rY);
          const x1 = p.x * cos - p.z * sin;
          const z1 = p.x * sin + p.z * cos;

          cos = Math.cos(rX); sin = Math.sin(rX);
          const y2 = p.y * cos - z1 * sin;
          const z2 = p.y * sin + z1 * cos;

          cos = Math.cos(rZ); sin = Math.sin(rZ);
          const x3 = x1 * cos - y2 * sin;
          const y3 = x1 * sin + y2 * cos;

          return { x: x3, y: y3, z: z2 };
        };

        const project = (p: Point3D, w: number, h: number) => {
          const distance = 160;
          const scale    = (250 * sf) / (distance + p.z);
          return {
            x: w / 2 + p.x * scale,
            y: h / 2 + p.y * scale,
          };
        };

        const drawLens = (points: { x: number; y: number }[], w: number, h: number) => {
          if (points.length < 2) return;
          ctx.beginPath();
          points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
          ctx.closePath();
          const grad = ctx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0,   'rgba(208,166,78,0.09)');
          grad.addColorStop(0.5, 'rgba(13,21,18,0.16)');
          grad.addColorStop(1,   'rgba(208,166,78,0.04)');
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.save();
          ctx.clip();
          ctx.beginPath();
          ctx.moveTo(shimmerPos - 30, 0);
          ctx.lineTo(shimmerPos + 10, 0);
          ctx.lineTo(shimmerPos + 50, h);
          ctx.lineTo(shimmerPos + 10, h);
          ctx.closePath();
          ctx.fillStyle = 'rgba(255,255,255,0.11)';
          ctx.fill();
          ctx.restore();
        };

        const drawPath = (
          points: { x: number; y: number }[],
          close = false,
          lineWidth = 2.5,
        ) => {
          if (points.length < 2) return;
          ctx.beginPath();
          points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
          if (close) ctx.closePath();
          ctx.lineWidth   = lineWidth * (isMobile ? 0.85 : 1);
          ctx.strokeStyle = '#D0A64E';
          ctx.shadowColor = 'rgba(208,166,78,0.55)';
          ctx.shadowBlur  = isMobile ? 6 : 10;
          ctx.stroke();
          ctx.shadowBlur  = 0;
        };

        const renderLoop = () => {
          angleY     += 0.011;
          angleX      = -0.15 + Math.sin(pulseVal) * 0.07;
          pulseVal   += 0.014;
          shimmerPos += 1.6;
          if (shimmerPos > logicalW + 50) shimmerPos = -80;

          ctx.clearRect(0, 0, logicalW, logicalH);

          const allRotate = (pts: Point3D[]) =>
            pts.map(p => project(rotate(p, angleX, angleY, angleZ), logicalW, logicalH));

          const lr2d = allRotate(leftRimPoints);
          const rr2d = allRotate(rightRimPoints);
          const br2d = allRotate(bridgePoints);
          const lt2d = allRotate(leftTemplePoints);
          const rt2d = allRotate(rightTemplePoints);

          drawLens(lr2d, logicalW, logicalH);
          drawLens(rr2d, logicalW, logicalH);

          drawPath(lr2d, true,  isMobile ? 2.4 : 3);
          drawPath(rr2d, true,  isMobile ? 2.4 : 3);
          drawPath(br2d, false, isMobile ? 1.8 : 2.5);
          drawPath(lt2d, false, isMobile ? 1.3 : 1.8);
          drawPath(rt2d, false, isMobile ? 1.3 : 1.8);

          animationFrameId = requestAnimationFrame(renderLoop);
        };

        renderLoop();
      }
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('mrmrs_intro_played', 'true');
        document.body.classList.remove('overlay-open');
        setIsDone(true);
      },
    });

    gsap.set(logoWrapperRef.current, { opacity: 0, scale: 1.25, filter: 'blur(18px) saturate(0.1)' });
    gsap.set(wordmarkRef.current,    { opacity: 0, y: 24 });
    gsap.set(lineRef.current,        { scaleX: 0 });
    gsap.set('#intro-grid',          { opacity: 0 });
    gsap.set('#intro-glow',          { opacity: 0, scale: 0.75 });

    tl
      .to('#intro-grid', { opacity: 0.06, duration: 0.8, ease: 'power2.out' })
      .to('#intro-glow', { opacity: 1, scale: 1, duration: 1.0, ease: 'expo.out' }, '-=0.6')
      .to(logoWrapperRef.current, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px) saturate(1)',
        duration: 1.1,
        ease: 'expo.out',
      }, '-=0.7')
      .to(wordmarkRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .to(lineRef.current, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, '-=0.3')
      .to({}, { duration: 0.5 })
      .to('#intro-door-left', {
        xPercent: -100,
        duration: 1.0,
        ease: 'power3.inOut',
      })
      .to('#intro-door-right', {
        xPercent: 100,
        duration: 1.0,
        ease: 'power3.inOut',
      }, '<')
      .to('#intro-grid, #intro-glow, #intro-content', {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      }, '-=0.8');

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      tl.kill();
      document.body.classList.remove('overlay-open');
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#0D1512]"
    >
      {/* Left Shutter Door */}
      <div
        id="intro-door-left"
        className="absolute inset-y-0 left-0 w-1/2 bg-[#0D1512] border-r border-[#D0A64E]/10 z-10"
      />
      {/* Right Shutter Door */}
      <div
        id="intro-door-right"
        className="absolute inset-y-0 right-0 w-1/2 bg-[#0D1512] z-10"
      />

      {/* Snellen Grid Texture */}
      <div
        id="intro-grid"
        className="absolute inset-0 select-none pointer-events-none mix-blend-screen text-[#D0A64E]/30 z-20"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="intro-snellen-grid" width="120" height="120" patternUnits="userSpaceOnUse">
              <rect width="120" height="120" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.07" />
              <text x="30" y="45" fontFamily="var(--font-serif)" fontSize="18" fill="currentColor" fillOpacity="0.35">E</text>
              <text x="75" y="45" fontFamily="var(--font-sans)" fontSize="12" fill="currentColor" fillOpacity="0.25">F P</text>
              <text x="30" y="85" fontFamily="var(--font-sans)" fontSize="9"  fill="currentColor" fillOpacity="0.18">T O Z</text>
              <text x="75" y="85" fontFamily="var(--font-sans)" fontSize="7"  fill="currentColor" fillOpacity="0.10">L P E D</text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#intro-snellen-grid)" />
        </svg>
      </div>

      {/* Radial Gold Glow */}
      <div
        id="intro-glow"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
        style={{
          width: 'min(600px, 90vw)',
          height: 'min(600px, 90vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(208,166,78,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Center Logo Content */}
      <div
        id="intro-content"
        className="relative z-30 flex flex-col items-center gap-5 px-4"
      >
        {/* 3D Canvas */}
        <div
          ref={logoWrapperRef}
          className="flex justify-center items-center"
          style={{ filter: 'drop-shadow(0 0 30px rgba(208,166,78,0.3))' }}
        >
          <canvas
            ref={canvasRef}
            className="block"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>

        {/* Wordmark */}
        <div className="flex flex-col items-center text-center">
          <div ref={wordmarkRef} className="flex flex-col items-center">
            <span className="font-[family-name:var(--font-serif)] font-medium tracking-[0.2em] text-[#F4EFE3] text-2xl sm:text-3xl md:text-4xl leading-none">
              MR. &amp; MRS.
            </span>
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.45em] uppercase leading-none mt-3 text-[#D0A64E]">
              OPTICAL
            </span>
          </div>

          {/* Separator Line */}
          <div
            ref={lineRef}
            className="w-28 sm:w-36 h-px mt-5 origin-center"
            style={{
              background: 'linear-gradient(90deg, transparent, #D0A64E, transparent)',
              transform: 'scaleX(0)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
