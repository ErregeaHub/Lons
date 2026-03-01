
'use client';

import { useState, useEffect } from 'react';
import { Feedback } from '@/lib/types';
import { getAllFeedbackAction } from '@/lib/feedback-actions';
import { Ghost, Clock, ChevronRight, X, ArrowLeft } from 'lucide-react';
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
    const text = encodeURIComponent(`"${item.message}" - Anonymous Whisper from Lons 👻`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
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
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedFeedback(null)}
          className="mb-6 text-muted-foreground hover:text-white transition-colors gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Button>

        <Card className="glass-card rounded-[2rem] overflow-hidden border-primary/20 bg-primary/5">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Ghost className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-headline font-bold text-white tracking-tight">
                    {selectedFeedback.isAnonymous ? 'Anonymous Inquiry' : `From ${selectedFeedback.username}`}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground/40 text-xs font-bold uppercase tracking-wider">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(selectedFeedback.createdAt)} ago
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setSelectedFeedback(null)}
                className="rounded-full border-white/10 hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-3xl p-8 space-y-6">
              <p className="text-xl text-foreground/90 leading-relaxed italic">
                "{selectedFeedback.message}"
              </p>
              
              {selectedFeedback.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                  <img 
                    src={selectedFeedback.imageUrl} 
                    alt="Attachment" 
                    className="w-full h-auto max-h-[500px] object-contain" 
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                onClick={() => handleShareToX(selectedFeedback)}
                className="rounded-full bg-white text-black hover:bg-white/90 font-bold h-14 px-10 text-lg gap-3 shadow-xl shadow-white/5"
              >
                <svg width="20" height="20" viewBox="0 0 1200 1227" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                </svg>
                Share to X
              </Button>
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
            className="group relative flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 cursor-pointer"
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
              <Ghost className="h-8 w-8 text-primary/80" />
            </div>

            <div className="flex-grow min-w-0 space-y-1">
              <h3 className="text-lg font-bold text-white/90">
                Inquiry #{feedback.length - index}
              </h3>
              <p className="text-muted-foreground/60 text-sm font-medium line-clamp-1 italic">
                "{item.message}"
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div className="hidden sm:flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-muted-foreground/40 text-xs font-bold uppercase tracking-wider">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(item.createdAt)} ago
                </div>
                {item.imageUrl && (
                  <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 rounded-full px-3 py-0.5 text-[10px] font-bold">
                    Attachment
                  </Badge>
                )}
              </div>

              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-full border-white/10 bg-white/5 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-300"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-[2rem]">
          <p className="text-muted-foreground font-medium">No active conversations found.</p>
        </div>
      )}
    </div>
  );
}
