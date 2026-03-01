import { LonsNavbar } from '@/components/LonsNavbar';
import { PostForm } from '@/components/PostForm';

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
            Post your thoughts anonymously or with a name. No tracking, just whispers sent directly to the vault.
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <PostForm />
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
