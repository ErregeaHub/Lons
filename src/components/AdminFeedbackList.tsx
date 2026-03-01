
'use client';

import { useState, useEffect } from 'react';
import { Feedback, FeedbackCategory } from '@/lib/types';
import { getAllFeedbackAction } from '@/lib/feedback-actions';
import { 
  Search, 
  Filter, 
  Clock, 
  User, 
  UserX, 
  Sparkles, 
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Lightbulb,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function AdminFeedbackList() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FeedbackCategory | 'all'>('all');

  useEffect(() => {
    async function load() {
      const data = await getAllFeedbackAction();
      setFeedback(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.aiCategories?.includes(filterType as FeedbackCategory);
    return matchesSearch && matchesFilter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bug': return <AlertCircle className="h-3 w-3" />;
      case 'feature request': return <Lightbulb className="h-3 w-3" />;
      default: return <MessageSquare className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'feature request': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-card rounded-xl border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search feedback..." 
            className="pl-10 bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Button 
            variant={filterType === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterType('all')}
          >
            All
          </Button>
          <Button 
            variant={filterType === 'bug' ? 'default' : 'outline'} 
            size="sm"
            className={cn(filterType === 'bug' ? 'bg-red-600 hover:bg-red-700' : '')}
            onClick={() => setFilterType('bug')}
          >
            Bugs
          </Button>
          <Button 
            variant={filterType === 'feature request' ? 'default' : 'outline'} 
            size="sm"
            className={cn(filterType === 'feature request' ? 'bg-amber-600 hover:bg-amber-700' : '')}
            onClick={() => setFilterType('feature request')}
          >
            Features
          </Button>
          <Button 
            variant={filterType === 'general inquiry' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterType('general inquiry')}
          >
            Inquiries
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredFeedback.length > 0 ? (
          filteredFeedback.map((item) => (
            <Card key={item.id} className="border-border bg-card hover:border-secondary/50 transition-all group">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {item.isAnonymous ? (
                      <Badge variant="outline" className="flex items-center gap-1.5 bg-muted/50">
                        <UserX className="h-3 w-3" /> Anonymous
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1.5 bg-secondary/10 text-secondary border-secondary/20">
                        <User className="h-3 w-3" /> {item.username || 'User'}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1 ml-2">
                      <Clock className="h-3 w-3" /> {formatDistanceToNow(item.createdAt)} ago
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Mark as read</DropdownMenuItem>
                    <DropdownMenuItem>Archive feedback</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {item.message}
                </div>

                {item.imageUrl && (
                  <div className="rounded-lg overflow-hidden border border-border w-48 h-32 relative group/img">
                    <img src={item.imageUrl} alt="Feedback Attachment" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="h-8 px-2 text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" /> View Original
                      </Button>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-secondary" />
                      <span className="text-xs font-bold uppercase tracking-wider text-secondary">AI Analysis</span>
                    </div>
                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                      "{item.aiSummary || 'Summary generation in progress...'}"
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {item.aiCategories?.map((cat) => (
                      <Badge 
                        key={cat} 
                        variant="outline" 
                        className={cn("capitalize text-[10px] px-2 py-0", getCategoryColor(cat))}
                      >
                        <span className="mr-1">{getCategoryIcon(cat)}</span>
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">No feedback found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
