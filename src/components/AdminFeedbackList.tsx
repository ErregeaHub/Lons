'use client';

import { useState, useEffect } from 'react';
import { Feedback } from '@/lib/types';
import { getAllFeedbackAction } from '@/lib/feedback-actions';
import { Ghost, Clock, ChevronRight, X, ArrowLeft, Twitter, ShieldCheck } from 'lucide-react';
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
          className="mb-6 text-muted-foreground hover:text-white transition-colors gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Conversations
        </Button>

        <Card className="glass-card rounded-[2.5rem] overflow-hidden border-white/10 bg-[#1e1a22] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <CardContent className="p-0">
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2c2630] flex items-center justify-center border border-white/5">
                  <Ghost className="h-6 w-6 text-[#E1BDFF]" />
                </div>
                <div>
                  <h2 className="text-xl font-headline font-bold text-white tracking-tight">
                    {selectedFeedback.isAnonymous ? 'Anonymous Whisper' : `Whisper by ${selectedFeedback.username}`}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(selectedFeedback.createdAt)} ago
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedFeedback(null)}
                className="rounded-full text-muted-foreground hover:text-white hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Compact High-Fidelity Mockup Area */}
            <div className="px-8 pb-8 flex flex-col items-center">
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl flex flex-col w-full max-w-[320px]">
                
                {/* 1. Header Branding */}
                <div className="px-5 py-3 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                    <Ghost className="h-3 w-3 text-[#E1BDFF]" />
                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.3em]">Vault Transmission</span>
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#E1BDFF]/40" />
                </div>

                {/* 2. Message Block (Text) - SEPARATED */}
                <div className="p-7 bg-[#141414] border-b border-white/5">
                  <p className="text-base font-headline font-bold text-white leading-tight italic">
                    "{selectedFeedback.message}"
                  </p>
                </div>

                {/* 3. Image Block - SEPARATED */}
                <div className="w-full bg-black relative overflow-hidden aspect-[4/3]">
                  <img 
                    src={selectedFeedback.imageUrl || "https://picsum.photos/seed/lons-nature/800/1000"} 
                    alt="Mockup Visual" 
                    className="w-full h-full object-cover opacity-90"
                    data-ai-hint="atmospheric landscape"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {/* Subtle Overlay Badge */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10">
                    <ShieldCheck className="h-3 w-3 text-[#E1BDFF]" />
                    <span className="text-[7px] font-bold text-white uppercase tracking-wider">Secured</span>
                  </div>
                </div>

                {/* 4. Integrated Share Action */}
                <div className="p-4 bg-[#0d0d0d]">
                  <Button 
                    onClick={() => handleShareToX(selectedFeedback)}
                    className="w-full rounded-xl bg-white text-black hover:bg-white/90 font-bold h-11 text-sm gap-3 transition-all active:scale-[0.98]"
                  >
                    <Twitter className="h-4 w-4 fill-current" />
                    Share to X
                  </Button>
                </div>
              </div>

              <p className="mt-4 text-center text-muted-foreground/20 text-[7px] font-bold uppercase tracking-[0.3em]">
                Metadata Stripped • Lons Anonymous
              </p>
            </div>
          </CardContent>
        </Card>
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
            className="group relative flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#E1BDFF]/20 hover:shadow-lg hover:shadow-[#E1BDFF]/5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-105 group-hover:bg-[#E1BDFF]/10 transition-all">
              <Ghost className="h-8 w-8 text-[#E1BDFF]/60" />
            </div>

            <div className="flex-grow min-w-0 space-y-1">
              <h3 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">
                Inquiry #{feedback.length - index}
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
                  <Badge variant="secondary" className="bg-[#E1BDFF]/10 text-[#E1BDFF] hover:bg-[#E1BDFF]/20 border-white/5 rounded-full px-3 py-0.5 text-[9px] font-bold tracking-tighter">
                    VISUAL ATTACHED
                  </Badge>
                )}
              </div>

              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-full border-white/10 bg-white/5 group-hover:bg-[#E1BDFF] group-hover:border-[#E1BDFF] group-hover:text-black transition-all duration-300"
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
