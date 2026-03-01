import { LonsNavbar } from '@/components/LonsNavbar';
import { PostForm } from '@/components/PostForm';
import { MessageFeed } from '@/components/MessageFeed';
import { Shield, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LonsNavbar />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <header className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Creative Space</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white">Share your <span className="text-primary">story</span></h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            A secure harbor for your thoughts. Choose anonymity or be seen. Your voice, your rules.
          </p>
        </header>

        <div className="space-y-12">
          <PostForm />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-headline font-bold">Recent Musings</h2>
              <div className="h-px flex-1 bg-border/50 mx-6" />
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <MessageFeed />
          </div>
        </div>
      </main>
    </div>
  );
}