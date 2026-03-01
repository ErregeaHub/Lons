
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Image, SendHorizontal, X, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { submitFeedbackAction } from '@/lib/feedback-actions';
import { Label } from '@/components/ui/label';
import { Feedback } from '@/lib/types';

const formSchema = z.object({
  message: z.string().min(3, { message: "What's on your mind?" }),
  isAnonymous: z.boolean().default(true),
  username: z.string().optional(),
  imageUrl: z.string().optional(),
});

export function PostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<Feedback | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
      isAnonymous: true,
      username: '',
      imageUrl: '',
    },
  });

  const isAnonymous = form.watch('isAnonymous');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await submitFeedbackAction(values);
      if (result.success && result.item) {
        setSubmittedData(result.item);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      form.setValue('imageUrl', url);
    }
  };

  const handleShareToX = () => {
    if (!submittedData) return;
    const text = encodeURIComponent(`"${submittedData.message}" - Sent via Lons 👻`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const resetForm = () => {
    setSubmittedData(null);
    setImagePreview(null);
    form.reset();
  };

  if (submittedData) {
    return (
      <Card className="glass-card rounded-[1.5rem] overflow-hidden border-primary/20 bg-primary/5 animate-in fade-in zoom-in duration-500">
        <CardContent className="p-10 text-center space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Whisper Sent</h2>
            <p className="text-muted-foreground font-medium max-w-sm">
              Your message has been securely sent to the vault. Express yourself elsewhere!
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-left space-y-4">
            <p className="text-foreground/90 font-medium italic">"{submittedData.message}"</p>
            {submittedData.imageUrl && (
              <img src={submittedData.imageUrl} alt="Attached" className="max-h-40 rounded-xl border border-white/10" />
            )}
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
              {submittedData.isAnonymous ? 'Anonymous Expression' : `By ${submittedData.username}`}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={handleShareToX}
              className="flex-1 rounded-xl bg-white text-black hover:bg-white/90 font-bold h-14 text-lg gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 1200 1227" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
              </svg>
              Share to X
            </Button>
            <Button 
              variant="outline"
              onClick={resetForm}
              className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold h-14 px-8"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              New Whisper
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card rounded-[1.5rem] overflow-hidden border-white/5">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-primary font-bold text-lg">New Whisper</h2>
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] px-4 py-2 rounded-full">
                <Label htmlFor="anonymous-mode" className="text-xs font-semibold text-muted-foreground cursor-pointer">
                  Anonymous
                </Label>
                <Switch
                  id="anonymous-mode"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => form.setValue('isAnonymous', checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="What's on your mind? Be bold, be anonymous..." 
                        className="min-h-[160px] bg-black/20 border-white/5 rounded-2xl text-base focus-visible:ring-primary/20 placeholder:text-muted-foreground/30 resize-none p-6"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isAnonymous && (
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <Input 
                        placeholder="Your name or handle" 
                        className="bg-black/10 border-white/5 rounded-xl h-10 text-sm" 
                        {...field} 
                      />
                    </FormItem>
                  )}
                />
              )}

              {imagePreview && (
                <div className="relative inline-block group">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-48 rounded-xl border border-white/10 shadow-xl" 
                  />
                  <button 
                    type="button"
                    onClick={() => { setImagePreview(null); form.setValue('imageUrl', ''); }}
                    className="absolute -top-2 -right-2 bg-destructive text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="relative overflow-hidden group">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={handleImageSelection}
                />
                <Button variant="ghost" size="icon" type="button" className="text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors">
                  <Image className="h-6 w-6" />
                </Button>
              </div>

              <Button 
                type="submit" 
                className="rounded-xl bg-primary hover:bg-primary/90 px-8 py-6 font-bold flex items-center gap-3 transition-all hover:translate-x-1"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Whispering...' : 'Send Whisper'}</span>
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
