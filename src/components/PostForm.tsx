'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Image as ImageIcon, SendHorizontal, X, CheckCircle2, RotateCcw, Twitter, Ghost } from 'lucide-react';
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
    const message = `"${submittedData.message}"\n\n- Expressed anonymously via Lons 👻`;
    const shareUrl = submittedData.imageUrl || window.location.origin;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const resetForm = () => {
    setSubmittedData(null);
    setImagePreview(null);
    form.reset();
  };

  if (submittedData) {
    return (
      <Card className="glass-card rounded-[2.5rem] overflow-hidden border-white/10 bg-[#1e1a22] animate-in fade-in zoom-in duration-500 shadow-2xl">
        <CardContent className="p-8 text-center space-y-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-[#E1BDFF]/20 rounded-full flex items-center justify-center border border-[#E1BDFF]/30 shadow-inner">
              <CheckCircle2 className="h-7 w-7 text-[#E1BDFF]" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-xl font-headline font-bold text-white tracking-tight">Whisper Vaulted</h2>
              <p className="text-muted-foreground text-[11px] font-medium max-w-xs mx-auto">
                Ready to be shared with the world.
              </p>
            </div>
          </div>

          {/* Compact Screenshot-Friendly Mockup */}
          <div className="relative group rounded-[1.5rem] overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl mx-auto max-w-[320px] flex flex-col">
             {/* Header Branding */}
             <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Ghost className="h-2.5 w-2.5 text-[#E1BDFF]" />
                  <span className="text-[7px] font-bold text-white/50 uppercase tracking-[0.3em]">Lons Vault</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#E1BDFF]/60 animate-pulse" />
             </div>

            {/* Message Area (Top - Separated) */}
            <div className="p-5 bg-[#141414] border-b border-white/5 text-left">
              <p className="text-base font-headline font-bold text-white leading-tight italic">
                "{submittedData.message}"
              </p>
            </div>
            
            {/* Image Area (Bottom - Controlled Height) */}
            <div className="w-full bg-black overflow-hidden h-[240px]">
              <img 
                src={submittedData.imageUrl || "https://picsum.photos/seed/lons-nature/800/1000"} 
                alt="Mockup Preview" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              onClick={handleShareToX}
              className="flex-1 rounded-2xl bg-white text-black hover:bg-white/90 font-bold h-12 text-sm gap-3 shadow-xl transition-all active:scale-[0.98]"
            >
              <Twitter className="h-4 w-4 fill-current" />
              Share to X
            </Button>
            <Button 
              variant="outline"
              onClick={resetForm}
              className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold h-12 px-6 text-sm transition-all"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card rounded-[2rem] overflow-hidden border-white/5 shadow-2xl shadow-black/40">
      <CardContent className="p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-white font-headline font-bold text-2xl tracking-tight">New Whisper</h2>
                <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em]">Vault Encryption Active</p>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] px-5 py-2.5 rounded-full shadow-inner">
                <Label htmlFor="anonymous-mode" className="text-xs font-bold text-muted-foreground/60 cursor-pointer uppercase tracking-wider">
                  Anonymous
                </Label>
                <Switch
                  id="anonymous-mode"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => form.setValue('isAnonymous', checked)}
                  className="data-[state=checked]:bg-[#E1BDFF]"
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
                        className="min-h-[200px] bg-black/30 border-white/5 rounded-[1.5rem] text-lg focus-visible:ring-[#E1BDFF]/20 placeholder:text-muted-foreground/20 resize-none p-8 font-medium leading-relaxed"
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
                        className="bg-black/20 border-white/5 rounded-xl h-12 text-base px-5 focus-visible:ring-[#E1BDFF]/20" 
                        {...field} 
                      />
                    </FormItem>
                  )}
                />
              )}

              {imagePreview && (
                <div className="relative inline-block group animate-in zoom-in duration-300">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-56 w-auto object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => { setImagePreview(null); form.setValue('imageUrl', ''); }}
                    className="absolute -top-3 -right-3 bg-destructive text-white p-2 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="relative overflow-hidden group">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={handleImageSelection}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button" 
                  className="h-14 w-14 rounded-2xl text-muted-foreground/40 hover:text-[#E1BDFF] hover:bg-[#E1BDFF]/10 transition-all active:scale-90"
                >
                  <ImageIcon className="h-7 w-7" />
                </Button>
              </div>

              <Button 
                type="submit" 
                className="rounded-2xl bg-[#E1BDFF] text-black hover:bg-[#E1BDFF]/90 px-10 py-7 font-bold flex items-center gap-4 transition-all hover:translate-x-1 shadow-xl shadow-[#E1BDFF]/20 active:scale-[0.98]"
                disabled={isSubmitting}
              >
                <span className="text-lg">{isSubmitting ? 'Vaulting...' : 'Send Whisper'}</span>
                <SendHorizontal className="h-6 w-6" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
