'use client';

import { useState, useEffect } from 'react';
import { Feedback } from '@/lib/types';
import { getAllFeedbackAction } from '@/lib/feedback-actions';
import { Ghost, Clock, ChevronRight, X, ArrowLeft, Twitter, ShieldCheck, Zap, Share2 } from 'lucide-react';
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
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 max-w-2xl mx-auto pb-20">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedFeedback(null)}
          className="mb-10 text-muted-foreground hover:text-white transition-colors gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Console
        </Button>

        <div className="flex flex-col items-center">
          {/* HIGH-FIDELITY VAULT CARD - DARK PURPLE THEME */}
          <div className="relative w-full max-w-[340px] bg-[#0c0614] border border-primary/20 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] flex flex-col group">
            
            {/* 1. HEADER METADATA */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.03] bg-primary/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[8px] font-mono font-bold text-primary/40 uppercase tracking-[0.3em]">TRNS_ID: {selectedFeedback.id.toUpperCase()}</span>
              </div>
              <Ghost className="h-3 w-3 text-primary/20" />
            </div>

            {/* 2. MESSAGE BLOCK */}
            <div className="p-7 pb-6 bg-gradient-to-b from-transparent to-primary/[0.05]">
              <div className="space-y-4">
                <div className="w-6 h-0.5 bg-primary/30 rounded-full" />
                <p className="text-xl md:text-2xl font-headline font-bold text-white leading-tight tracking-tight italic">
                  "{selectedFeedback.message}"
                </p>
                <div className="flex items-center gap-2 pt-2">
                   <Badge variant="outline" className="border-primary/10 bg-primary/5 text-[7px] font-bold text-primary/60 rounded-full px-2 py-0 h-4 uppercase tracking-widest">
                    {selectedFeedback.isAnonymous ? 'ANON_SECURED' : selectedFeedback.username?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 3. MEDIA BLOCK - AUTO CROP 4:3 */}
            <div className="px-6 pb-6">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-white/[0.05] bg-black shadow-2xl group-hover:border-primary/20 transition-colors">
                <img 
                  src={selectedFeedback.imageUrl || "https://picsum.photos/seed/lons-admin/800/600"} 
                  alt="Vault Asset" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Image Overlay Metadata */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                    <ShieldCheck className="h-3 w-3 text-primary" />
                    <span className="text-[7px] font-bold text-white/60 uppercase tracking-widest">Asset_Encrypted</span>
                  </div>
                  <div className="text-[8px] font-mono text-white/40 tracking-tighter font-bold">@4ku_rajaa</div>
                </div>
              </div>
            </div>

            {/* 4. FOOTER ACTIONS */}
            <div className="p-6 pt-2 bg-primary/[0.02] border-t border-white/[0.03] mt-auto">
              <Button 
                onClick={() => handleShareToX(selectedFeedback)}
                className="w-full rounded-2xl bg-white text-black hover:bg-white/90 font-bold h-12 text-sm gap-3 transition-all active:scale-[0.97] shadow-[0_10px_30px_-5px_rgba(255,255,255,0.1)]"
              >
                <Twitter className="h-4 w-4 fill-current" />
                Share to X
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-3 opacity-10">
                <div className="h-px flex-1 bg-white" />
                <Zap className="h-3 w-3 text-white" />
                <div className="h-px flex-1 bg-white" />
              </div>
            </div>
          </div>

          <p className="mt-8 text-primary/20 text-[8px] font-mono font-bold uppercase tracking-[0.5em]">
            Decrypted via Lons Protocol // Admin Session
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
            className="group relative flex items-center gap-6 p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] group-hover:scale-105 group-hover:bg-primary/5 transition-all">
              <Ghost className="h-8 w-8 text-primary/40 group-hover:text-primary transition-colors" />
            </div>

            <div className="flex-grow min-w-0 space-y-1">
              <h3 className="text-lg font-bold text-white/80 group-hover:text-white transition-colors">
                Whisper #{feedback.length - index}
              </h3>
              <p className="text-muted-foreground/40 text-sm font-medium line-clamp-1 italic group-hover:text-muted-foreground/60 transition-colors">
                "{item.message}"
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div className="hidden sm:flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground/30 text-[9px] font-bold uppercase tracking-widest">
                  <Clock className="h-2.5 w-2.5" />
                  {formatDistanceToNow(item.createdAt)}
                </div>
                {item.imageUrl && (
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-none rounded-full px-2 py-0 text-[8px] font-bold tracking-tighter">
                    VISUAL
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
        <div className="text-center py-24 border border-dashed border-white/[0.05] rounded-[3rem] bg-white/[0.01]">
          <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4">
            <Ghost className="h-8 w-8 text-muted-foreground/10" />
          </div>
          <p className="text-muted-foreground/20 font-bold uppercase tracking-widest text-[10px]">Vault session silent.</p>
        </div>
      )}
    </div>
  );
}
