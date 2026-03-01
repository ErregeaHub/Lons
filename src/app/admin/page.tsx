'use client';

import { LonsNavbar } from '@/components/LonsNavbar';
import { AdminFeedbackList } from '@/components/AdminFeedbackList';
import { Shield, Search, SlidersHorizontal, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary font-headline text-2xl">Authenticating</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <LonsNavbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-headline font-bold tracking-tight">Admin Console</h1>
            </div>
            <p className="text-muted-foreground font-medium">Manage direct anonymous conversations with users.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                placeholder="Search chats..."
                className="bg-white/5 border-white/5 rounded-full pl-11 h-12 focus-visible:ring-primary/20"
              />
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 text-muted-foreground/60 mb-8">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Active Conversations</span>
          </div>

          <AdminFeedbackList />
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-muted-foreground/40 text-xs font-medium tracking-wide">
          © 2026 Lons Anonymous. Built with silence.
        </p>
      </footer>
    </div>
  );
}
