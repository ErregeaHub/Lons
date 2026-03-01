'use client';

import { useState, useEffect } from 'react';
import { Feedback } from '@/lib/types';
import { Ghost, Clock, ChevronRight, ArrowLeft, Twitter, Trash2, ExternalLink, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getAllFeedbackAction, deleteFeedbackAction } from '@/lib/feedback-actions';

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

    // Poll every 3 seconds for new whispers
    const interval = setInterval(async () => {
      const data = await getAllFeedbackAction();
      setFeedback(data);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleShareToX = (item: Feedback) => {
    const message = `"${item.message}"\n\n- An anonymous whisper from Lons 👻`;
    const shareUrl = item.imageUrl || window.location.origin;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this whisper?')) return;

    const result = await deleteFeedbackAction(id);
    if (result.success) {
      setFeedback(prev => prev.filter(item => item.id !== id));
      if (selectedFeedback?.id === id) {
        setSelectedFeedback(null);
      }
    } else {
      alert('Failed to delete whisper: ' + (result.error || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (selectedFeedback) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 max-w-4xl mx-auto pb-20 px-4">
        <Button
          variant="ghost"
          onClick={() => setSelectedFeedback(null)}
          className="mb-8 text-muted-foreground hover:text-white transition-colors gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Console
        </Button>

        <div className="flex flex-col items-center gap-8">
          {/* HIGH-FIDELITY WHISPER CARD */}
          <div className={cn(
            "relative w-full max-w-[600px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-300 cursor-pointer rounded-xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] flex flex-col group",
            selectedFeedback.imageUrl ? "min-h-[40vh] md:min-h-[50vh]" : "min-h-[25vh] md:min-h-[30vh]"
          )}>

            {/* 1. MESSAGE BLOCK */}
            <div className={cn(
              "p-6 md:p-10 bg-gradient-to-b from-primary/10 to-transparent flex flex-col",
              !selectedFeedback.imageUrl && "flex-1 justify-center items-center text-center"
            )}>
              <div className="space-y-6 w-full">
                <div className={cn("w-12 h-1 bg-primary/40 rounded-full", !selectedFeedback.imageUrl && "mx-auto")} />
                <p className={cn(
                  "font-headline font-bold text-white leading-tight tracking-tight italic",
                  selectedFeedback.imageUrl ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
                )}>
                  "{selectedFeedback.message}"
                </p>
                <div className={cn("flex items-center gap-2 pt-2", !selectedFeedback.imageUrl && "justify-center")}>
                  <Badge variant="outline" className="border-primary/20 bg-primary/10 text-[10px] font-bold text-primary/80 rounded-md px-3 py-1 uppercase tracking-widest">
                    {selectedFeedback.isAnonymous ? 'ANONYMOUS' : selectedFeedback.username?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 2. MEDIA BLOCK - Only show if image exists */}
            {selectedFeedback.imageUrl && (
              <div className="px-4 md:px-8 pb-6 md:pb-8 flex-1">
                <div className="relative rounded-xl overflow-hidden aspect-[1/1] sm:aspect-[4/3] border border-white/[0.05] bg-black shadow-2xl transition-all h-full">
                  <img
                    src={selectedFeedback.imageUrl}
                    alt="Vault Asset"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Image Overlay Username - Bottom Right */}
                  <div className="absolute bottom-6 right-6">
                    <div className="text-xs md:text-sm font-mono text-white/50 tracking-tighter font-bold drop-shadow-lg">
                      @{selectedFeedback.isAnonymous ? 'anonymous' : (selectedFeedback.username || 'anonymous')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EXTERNAL ACTION BUTTONS */}
          <div className="w-full max-w-[600px] flex flex-col items-center gap-4">
            <Button
              onClick={() => handleShareToX(selectedFeedback)}
              className="w-full rounded-xl bg-white text-black hover:bg-white/90 font-bold h-16 text-lg gap-4 transition-all active:scale-[0.98] shadow-2xl"
            >
              <Twitter className="h-6 w-6 fill-current" />
              Share to X
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleDelete(selectedFeedback.id)}
              className="w-full rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 font-bold h-12 text-sm gap-2 transition-all"
            >
              <Trash2 className="h-4 w-4" />
              Delete Permanently
            </Button>

            <p className="mt-4 text-center text-primary/30 text-[10px] font-mono font-bold uppercase tracking-[0.6em]">
              Lons Secure Protocol // Decrypted Session
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {feedback.length > 0 ? (
        feedback.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setSelectedFeedback(item)}
            className="group relative flex items-center gap-4 md:gap-6 p-4 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] group-hover:scale-105 group-hover:bg-primary/5 transition-all">
              <Ghost className="h-10 w-10 text-primary/40 group-hover:text-primary transition-colors" />
            </div>

            <div className="flex-grow min-w-0 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white/80 group-hover:text-white transition-colors">
                  Whisper #{feedback.length - index}
                </h3>
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-[9px] font-bold text-primary/80 rounded-md px-2 py-0.5 uppercase tracking-widest">
                  {item.isAnonymous ? 'ANONYMOUS' : (item.username || 'UNKNOWN')}
                </Badge>
              </div>
              <p className="text-muted-foreground/70 text-base font-medium line-clamp-2 italic group-hover:text-muted-foreground/90 transition-colors leading-relaxed">
                &ldquo;{item.message}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-10">
              <div className="hidden sm:flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 text-muted-foreground/30 text-[10px] font-bold uppercase tracking-widest">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(item.createdAt)}
                </div>
                {item.imageUrl && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-md px-3 py-0.5 text-[9px] font-bold tracking-tighter">
                    MEDIA_ATTACHED
                  </Badge>
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-white/10 bg-white/5 group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all duration-300"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="h-12 w-12 rounded-full text-muted-foreground/20 hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-32 border border-dashed border-white/[0.05] rounded-2xl bg-white/[0.01]">
          <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-6">
            <Ghost className="h-10 w-10 text-muted-foreground/10" />
          </div>
          <p className="text-muted-foreground/20 font-bold uppercase tracking-widest text-xs">The vault is currently silent.</p>
        </div>
      )}
    </div>
  );
}
