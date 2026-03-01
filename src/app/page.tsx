import { LonsNavbar } from '@/components/LonsNavbar';
import { PostForm } from '@/components/PostForm';
import { MessageFeed } from '@/components/MessageFeed';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LonsNavbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center space-y-4 mb-16">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-white tracking-tight">
            Share <span className="text-gradient-secrets">Secrets</span>. Stay <span className="text-gradient-invisible">Invisible</span>.
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            Post your thoughts anonymously or with a name. No tracking, just whispers.
          </p>
        </header>

        <div className="max-w-2xl mx-auto space-y-16">
          <PostForm />
          
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/50">Recent Whispers</span>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <MessageFeed />
          </div>
        </div>

        <footer className="mt-24 pb-12 text-center">
          <p className="text-muted-foreground/40 text-xs font-medium tracking-wide">
            © 2026 Lons Anonymous. Built with silence.
          </p>
        </footer>
      </main>
    </div>
  );
}