
import { VaultNavbar } from '@/components/VaultNavbar';
import { FeedbackForm } from '@/components/FeedbackForm';
import { Shield, Lock, MousePointer2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <VaultNavbar />
      
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/20 blur-[120px] rounded-full -z-10" />
          <div className="container mx-auto px-4 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-700">
              <Shield className="h-4 w-4" />
              <span>Military-Grade Encryption</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Your Voice, <span className="text-secondary">Secured</span> & Heard
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
              VaultFeedback provides a safe harbor for your thoughts. Choose to stay anonymous or share your identity. We ensure your data reaches the right hands securely.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="container mx-auto px-4 pb-24">
          <div className="grid lg:grid-cols-[1fr_450px] gap-12 items-start">
            <div className="space-y-8 mt-12 hidden lg:block">
              <div className="grid gap-6">
                {[
                  {
                    icon: <Lock className="h-6 w-6 text-primary" />,
                    title: "End-to-End Encryption",
                    desc: "All feedback is encrypted before transmission to ensure privacy."
                  },
                  {
                    icon: <Shield className="h-6 w-6 text-secondary" />,
                    title: "Identity Protection",
                    desc: "Our toggle system guarantees your choice of anonymity is respected."
                  },
                  {
                    icon: <MousePointer2 className="h-6 w-6 text-primary" />,
                    title: "Intuitive Interface",
                    desc: "Simple, powerful tools designed for seamless communication."
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
                    <div className="bg-background p-3 rounded-xl shadow-inner">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mx-auto w-full max-w-lg">
              <FeedbackForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VaultFeedback Inc. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Security Overview</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
