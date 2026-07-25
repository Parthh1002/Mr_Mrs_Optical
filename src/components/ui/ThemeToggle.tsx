'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Show a placeholder while hydrating to avoid mismatch
  if (!mounted) {
    return (
      <div className="relative w-14 h-7 rounded-full bg-muted/30 border border-border animate-pulse" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative flex items-center w-14 h-7 rounded-full transition-colors duration-500 border ${
        isDark
          ? 'bg-primary border-primary/50'
          : 'bg-secondary border-border'
      }`}
    >
      {/* Sliding circle */}
      <span
        className={`absolute flex items-center justify-center w-5 h-5 rounded-full shadow-md transition-all duration-500 ${
          isDark
            ? 'translate-x-[2.1rem] bg-primary-foreground'
            : 'translate-x-[2px] bg-foreground'
        }`}
      >
        {isDark ? (
          <Moon size={11} className="text-primary" />
        ) : (
          <Sun size={11} className="text-background" />
        )}
      </span>

      {/* Left icon (sun) */}
      <Sun
        size={12}
        className={`absolute left-[5px] transition-opacity duration-300 ${isDark ? 'opacity-30 text-primary-foreground' : 'opacity-0'}`}
      />
      {/* Right icon (moon) */}
      <Moon
        size={12}
        className={`absolute right-[5px] transition-opacity duration-300 ${!isDark ? 'opacity-30 text-foreground' : 'opacity-0'}`}
      />
    </button>
  );
}
