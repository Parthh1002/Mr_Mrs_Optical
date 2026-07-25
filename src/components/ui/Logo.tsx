import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'horizontal' | 'stacked';
  color?: string;
}

export function Logo({ className = '', variant = 'full', color = 'currentColor' }: LogoProps) {
  // The M&M monogram where the middle crosses form a subtle glasses bridge
  const IconMark = (
    <svg viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      {/* Left 'M' */}
      <path d="M 20 80 L 20 20 L 40 50 L 50 35" />
      {/* Right 'M' */}
      <path d="M 80 80 L 80 20 L 60 50 L 50 35" />
      {/* The bridge (glasses reference) */}
      <path d="M 35 40 Q 50 25 65 40" strokeWidth="3" />
      {/* Ampersand subtle dot/link */}
      <circle cx="50" cy="55" r="2" fill={color} stroke="none" />
    </svg>
  );

  const Wordmark = (
    <div className="flex flex-col">
      <span className="font-[family-name:var(--font-fraunces)] font-bold tracking-widest uppercase leading-none">
        Mr. & Mrs.
      </span>
      <span className="font-[family-name:var(--font-manrope)] text-[0.65em] tracking-[0.3em] uppercase leading-none mt-1 opacity-80">
        Optical
      </span>
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`relative ${className}`} style={{ width: '1em', height: '1em' }}>
        {IconMark}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <div className="w-16 h-16">{IconMark}</div>
        <div className="text-center">{Wordmark}</div>
      </div>
    );
  }

  // Default: Horizontal lockup
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-8 h-8 shrink-0">{IconMark}</div>
      {Wordmark}
    </div>
  );
}
