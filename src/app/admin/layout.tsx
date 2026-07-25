'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, LogOut, ArrowLeft } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/admin';

  return (
    <div className="min-h-screen bg-[#f3f7f4] dark:bg-[#111814] flex flex-col">
      {/* Super Simple Top Nav - Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-emerald-900/10 dark:border-white/10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isHome && (
              <Link href="/admin" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "mr-2 h-9 w-9")}>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            <div>
              <h1 className="text-lg font-bold font-[family-name:var(--font-fraunces)] text-primary">
                Mr & Mrs Optical
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Store Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:flex gap-2")}>
              <Store className="w-4 h-4" />
              View Live Site
            </Link>
            <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
