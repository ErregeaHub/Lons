'use client';

import Link from 'next/link';
import { Ghost, Home, Shield, LogOut, LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

export function LonsNavbar() {
  const pathname = usePathname();
  const { isAdmin, logout } = useAuth();

  return (
    <nav className="z-50 py-6">
      <div className="container mx-auto px-4 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-all">
            <Ghost className="text-primary h-5 w-5" />
          </div>
          <span className="text-xl font-headline font-bold text-foreground/90">Lons</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-white/5",
              pathname === '/' ? "text-white" : "text-muted-foreground"
            )}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-sm font-medium transition-all hover:bg-white/5",
                pathname === '/admin' ? "bg-white/10 text-white" : "text-muted-foreground"
              )}
            >
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          )}

          {isAdmin ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-sm font-medium transition-all hover:bg-white/5",
                pathname === '/login' ? "bg-white/10 text-white" : "text-muted-foreground"
              )}
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}