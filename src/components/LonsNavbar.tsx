'use client';

import Link from 'next/link';
import { Sparkles, LayoutDashboard, Send } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function LonsNavbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
            <Sparkles className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="text-2xl font-headline font-bold text-foreground">Lons</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-white/5",
              pathname === '/' ? "bg-white/10 text-primary" : "text-muted-foreground"
            )}
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Feed</span>
          </Link>
          <Link 
            href="/admin" 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-white/5",
              pathname === '/admin' ? "bg-white/10 text-primary" : "text-muted-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}