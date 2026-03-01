'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Image as ImageIcon, SendHorizontal, X, CheckCircle2, RotateCcw, Twitter, Ghost, ShieldCheck, Zap, Share2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

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
      <div className="space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 mb-4 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Whisper Vaulted</h2>
          <p className="text-muted-foreground text-sm font-medium opacity-60">Your transmission has been encrypted and stored.</p>
        </div>

        {/* HIGH-FIDELITY VAULT CARD */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[340px] bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] flex flex-col group">
            
            {/* 1. HEADER METADATA */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.03] bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-[0.3em]">TRNS_ID: {submittedData.id.toUpperCase()}</span>
              </div>
              <Ghost className="h-3 w-3 text-primary/20" />
            </div>

            {/* 2. MESSAGE BLOCK - Isolated Typographic Section */}
            <div className="p-7 pb-6 bg-gradient-to-b from-transparent to-primary/[0.02]">
              <div className="space-y-4">
                <div className="w-6 h-0.5 bg-primary/30 rounded-full" />
                <p className="text-xl md:text-2xl font-headline font-bold text-white leading-tight tracking-tight italic">
                  "{submittedData.message}"
                </p>
                <div className="flex items-center gap-2 pt-2">
                   <Badge variant="outline" className="border-white/5 bg-white/[0.03] text-[7px] font-bold text-white/40 rounded-full px-2 py-0 h-4 uppercase tracking-widest">
                    {submittedData.isAnonymous ? 'ANON_SECURED' : submittedData.username?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 3. MEDIA BLOCK - Strictly Framed */}
            <div className="px-6 pb-6">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border border-white/[0.05] bg-black shadow-2xl group-hover:border-primary/20 transition-colors">
                <img 
                  src={submittedData.imageUrl || "https://picsum.photos/seed/lons-vault/800/1000"} 
                  alt="Vault Asset" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Image Overlay Metadata */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                    <ShieldCheck className="h-3 w-3 text-primary" />
                    <span className="text-[7px] font-bold text-white/60 uppercase tracking-widest">Asset_Encrypted</span>
                  </div>
                  <div className="text-[7px] font-mono text-white/20 tracking-tighter">TIMESTAMP_{Date.now().toString().slice(-4)}</div>
                </div>
              </div>
            </div>

            {/* 4. FOOTER ACTIONS */}
            <div className="p-6 pt-2 bg-white/[0.02] border-t border-white/[0.03] mt-auto">
              <Button 
                onClick={handleShareToX}
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

          <div className="mt-8 flex gap-4">
            <Button 
              variant="ghost"
              onClick={resetForm}
              className="rounded-2xl text-muted-foreground/60 hover:text-white transition-all gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset & Send Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="glass-card rounded-[2.5rem] overflow-hidden border-white/[0.03] shadow-2xl shadow-black/60 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      <CardContent className="p-8 md:p-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-white font-headline font-bold text-3xl tracking-tight">New Whisper</h2>
                <p className="text-primary/40 text-[9px] font-bold uppercase tracking-[0.3em]">End-to-End Encryption Enabled</p>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] px-4 py-2 rounded-full">
                <Label htmlFor="anonymous-mode" className="text-[10px] font-bold text-muted-foreground/40 cursor-pointer uppercase tracking-widest">
                  Private
                </Label>
                <Switch
                  id="anonymous-mode"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => form.setValue('isAnonymous', checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Type your secret here..." 
                        className="min-h-[200px] bg-black/20 border-white/[0.05] rounded-[2rem] text-xl focus-visible:ring-primary/10 placeholder:text-muted-foreground/10 resize-none p-8 font-medium leading-relaxed transition-all focus:bg-black/30"
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
                        placeholder="Alias or Name" 
                        className="bg-black/10 border-white/[0.05] rounded-2xl h-14 text-lg px-6 focus-visible:ring-primary/10" 
                        {...field} 
                      />
                    </FormItem>
                  )}
                />
              )}

              {imagePreview && (
                <div className="relative inline-block group animate-in zoom-in duration-300">
                  <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-64 w-auto object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => { setImagePreview(null); form.setValue('imageUrl', ''); }}
                    className="absolute -top-3 -right-3 bg-destructive text-white p-2.5 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/[0.03]">
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
                  className="h-16 w-16 rounded-[1.5rem] text-muted-foreground/30 hover:text-primary hover:bg-primary/5 transition-all active:scale-90"
                >
                  <ImageIcon className="h-8 w-8" />
                </Button>
              </div>

              <Button 
                type="submit" 
                className="rounded-[1.5rem] bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-8 font-bold flex items-center gap-4 transition-all hover:translate-x-1 shadow-xl shadow-primary/10 active:scale-[0.98]"
                disabled={isSubmitting}
              >
                <span className="text-xl">{isSubmitting ? 'Vaulting...' : 'Whisper'}</span>
                <SendHorizontal className="h-6 w-6" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
