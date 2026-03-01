'use client';

import { useState, useEffect } from 'react';
import { Feedback } from '@/lib/types';
import { getAllFeedbackAction } from '@/lib/feedback-actions';
import { User, UserX, Clock, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export function MessageFeed() {
  const [messages, setMessages] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllFeedbackAction();
      setMessages(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-card/50 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((item) => (
        <Card key={item.id} className="glass-card rounded-3xl border-white/5 group hover:border-accent/30 transition-all duration-500">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.isAnonymous ? 'bg-muted' : 'bg-accent/20 text-accent'}`}>
                  {item.isAnonymous ? <UserX className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {item.isAnonymous ? 'Anonymous' : (item.username || 'Mysterious User')}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(item.createdAt)} ago
                  </div>
                </div>
              </div>
              <MessageSquare className="h-4 w-4 text-muted-foreground/30" />
            </div>

            <p className="text-foreground/90 leading-relaxed font-medium">
              {item.message}
            </p>

            {item.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/20">
                <img src={item.imageUrl} alt="Attachment" className="w-full h-auto max-h-96 object-contain" />
              </div>
            )}

            {item.aiCategories && item.aiCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {item.aiCategories.map(cat => (
                  <Badge key={cat} variant="outline" className="text-[10px] uppercase tracking-tighter bg-accent/5 border-accent/20 text-accent rounded-full">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}