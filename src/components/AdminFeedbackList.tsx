
'use client';

import { useState, useEffect } from 'react';
import { Feedback } from '@/lib/types';
import { getAllFeedbackAction } from '@/lib/feedback-actions';
import { Ghost, Clock, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function AdminFeedbackList() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllFeedbackAction();
      setFeedback(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-white/5 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {feedback.length > 0 ? (
        feedback.map((item, index) => (
          <div 
            key={item.id} 
            className="group relative flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 cursor-pointer"
          >
            {/* Ghost Icon Circle */}
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
              <Ghost className="h-8 w-8 text-primary/80" />
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0 space-y-1">
              <h3 className="text-lg font-bold text-white/90">
                Inquiry #{feedback.length - index}
              </h3>
              <p className="text-muted-foreground/60 text-sm font-medium line-clamp-1 italic">
                "{item.message}"
              </p>
            </div>

            {/* Right Side Info */}
            <div className="flex items-center gap-8">
              <div className="hidden sm:flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-muted-foreground/40 text-xs font-bold uppercase tracking-wider">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(item.createdAt)} ago
                </div>
                <Badge variant="secondary" className="bg-white/5 text-muted-foreground/60 hover:bg-white/10 border-white/5 rounded-full px-3 py-0.5 text-[10px] font-bold">
                  {item.messageCount || 0} messages
                </Badge>
              </div>

              {/* Action Button */}
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
