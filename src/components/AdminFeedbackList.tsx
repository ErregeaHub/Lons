'use client';

import { useState, useEffect } from 'react';
import { Feedback } from '@/lib/types';
import { getAllFeedbackAction } from '@/lib/feedback-actions';
import { Ghost, Clock, ChevronRight, X, ArrowLeft, Twitter, ShieldCheck, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function AdminFeedbackList() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getAllFeedbackAction();
      setFeedback(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleShareToX = (item: Feedback) => {
    const message = `"${item.message}"\n\n- An anonymous whisper from Lons 👻`;
    const shareUrl = item.imageUrl || window.location.origin;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-white/5 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (selectedFeedback) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedFeedback(null)}
          className="mb-8 text-muted-foreground hover:text-white transition-colors gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Console
        </Button>

        <div className="flex flex-col items-center">
          {/* THE VAULT TRANSMISSION CARD */}
          <div className="relative w-full max-w-[360px] bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col">
            
            {/* 1. VAULT HEADER */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.3em]">Vault // TRNSMSN_9921</span>
              </div>
              <Ghost className="h-3 w-3 text-primary/40" />
            </div>

            {/* 2. MESSAGE BLOCK - Standalone typographic section */}
            <div className="p-8 pb-6 bg-gradient-to-b from-transparent to-white/[0.01]">
              <div className="space-y-4">
                <div className="w-8 h-1 bg-primary/20 rounded-full" />
                <p className="text-xl md:text-2xl font-headline font-bold text-white leading-[1.15] tracking-tight italic">
                  "{selectedFeedback.message}"
                </p>
                <div className="flex items-center gap-2">
                   <Badge variant="outline" className="border-white/5 bg-white/5 text-[8px] font-bold text-white/30 rounded-sm px-1.5 py-0 h-4">
                    ORIGIN: {selectedFeedback.isAnonymous ? 'ANONYMOUS' : selectedFeedback.username?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 3. MEDIA BLOCK - Strictly separated */}
            {selectedFeedback.imageUrl && (
              <div className="px-6 pb-6">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-white/10 shadow-inner group">
                  <img 
                    src={selectedFeedback.imageUrl} 
                    alt="Transmission Visual" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Floating Metadata on Image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/10">
                      <ShieldCheck className="h-3 w-3 text-primary" />
                      <span className="text-[8px] font-bold text-white uppercase tracking-wider">Encrypted Asset</span>
                    </div>
                    <div className="text-[8px] font-mono text-white/40">TS_{Date.now().toString().slice(-4)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. FOOTER & ACTION */}
            <div className="p-6 pt-2 bg-white/[0.02] border-t border-white/5 mt-auto">
              <Button 
                onClick={() => handleShareToX(selectedFeedback)}
                className="w-full rounded-2xl bg-white text-black hover:bg-white/90 font-bold h-12 text-sm gap-3 transition-all active:scale-[0.98] shadow-xl"
              >
                <Twitter className="h-4 w-4 fill-current" />
                Share Translation to X
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-4 opacity-20">
                <div className="h-px flex-1 bg-white/20" />
                <Zap className="h-3 w-3 text-white" />
                <div className="h-px flex-1 bg-white/20" />
              </div>
            </div>
          </div>

          <p className="mt-6 text-muted-foreground/30 text-[9px] font-mono font-bold uppercase tracking-[0.4em]">
            Captured via Lons // Invisible Protocol
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {feedback.length > 0 ? (
        feedback.map((item, index) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedFeedback(item)}
            className="group relative flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-105 group-hover:bg-primary/10 transition-all">
              <Ghost className="h-8 w-8 text-primary/60" />
            </div>

            <div className="flex-grow min-w-0 space-y-1">
              <h3 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">
                Transmission #{feedback.length - index}
              </h3>
              <p className="text-muted-foreground/50 text-sm font-medium line-clamp-1 italic group-hover:text-muted-foreground/80 transition-colors">
                "{item.message}"
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div className="hidden sm:flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-muted-foreground/40 text-[10px] font-bold uppercase tracking-wider">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(item.createdAt)} ago
                </div>
                {item.imageUrl && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-white/5 rounded-full px-3 py-0.5 text-[9px] font-bold tracking-tighter">
                    VISUAL DETECTED
                  </Badge>
                )}
              </div>

              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-full border-white/10 bg-white/5 group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all duration-300"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-24 border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ghost className="h-8 w-8 text-muted-foreground/20" />
          </div>
          <p className="text-muted-foreground/40 font-bold uppercase tracking-widest text-xs">The vault is currently silent.</p>
        </div>
      )}
    </div>
  );
}
