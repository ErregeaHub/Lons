
'use client';

import Link from 'next/link';
import { Shield, LayoutDashboard, Send } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function VaultNavbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Shield className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Vault<span className="text-secondary">Feedback</span></span>
        </Link>

        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
              pathname === '/' ? "bg-muted text-primary" : "text-muted-foreground"
            )}
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Submit Feedback</span>
          </Link>
          <Link 
            href="/admin" 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
              pathname === '/admin' ? "bg-muted text-primary" : "text-muted-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Admin Panel</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
