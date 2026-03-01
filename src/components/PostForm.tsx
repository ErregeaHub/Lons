'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Image as ImageIcon, SendHorizontal, X, CheckCircle2, RotateCcw, Twitter } from 'lucide-react';
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
      <div className="space-y-12 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 mb-6 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Whisper Vaulted</h2>
          <p className="text-muted-foreground text-base font-medium opacity-60">Transmission encrypted and stored securely.</p>
        </div>

        {/* HIGH-FIDELITY WHISPER CARD - BIGGER & LOW RADIUS */}
        <div className="flex flex-col items-center gap-10">
          <div className="relative w-full max-w-[600px] min-h-[50vh] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-300 cursor-pointer rounded-xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] flex flex-col group">
            
            {/* 1. MESSAGE BLOCK - SEPARATED */}
            <div className="p-10 bg-gradient-to-b from-primary/10 to-transparent">
              <div className="space-y-6">
                <div className="w-12 h-1 bg-primary/40 rounded-full" />
                <p className="text-2xl md:text-3xl font-headline font-bold text-white leading-tight tracking-tight italic">
                  "{submittedData.message}"
                </p>
                <div className="flex items-center gap-2 pt-2">
                   <Badge variant="outline" className="border-primary/20 bg-primary/10 text-[10px] font-bold text-primary/80 rounded-md px-3 py-1 uppercase tracking-widest">
                    {submittedData.isAnonymous ? 'ANON_SECURED' : submittedData.username?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 2. MEDIA BLOCK - AUTO CROP 4:3 */}
            <div className="px-8 pb-8 flex-1">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-white/[0.05] bg-black shadow-2xl h-full">
                <img 
                  src={submittedData.imageUrl || "https://picsum.photos/seed/lons-vault-big/1200/900"} 
                  alt="Vault Asset" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Image Overlay Username - Bottom Right */}
                <div className="absolute bottom-6 right-6">
                  <div className="text-xs md:text-sm font-mono text-white/50 tracking-tighter font-bold drop-shadow-lg">@4ku_rajaa</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[600px] space-y-6">
            <Button 
              onClick={handleShareToX}
              className="w-full rounded-xl bg-white text-black hover:bg-white/90 font-bold h-16 text-lg gap-4 transition-all active:scale-[0.98] shadow-2xl"
            >
              <Twitter className="h-6 w-6 fill-current" />
              Share to X
            </Button>

            <Button 
              variant="ghost"
              onClick={resetForm}
              className="w-full rounded-xl text-muted-foreground/60 hover:text-white transition-all gap-3 h-12"
            >
              <RotateCcw className="h-5 w-5" />
              Reset & Send Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="glass-card rounded-2xl overflow-hidden border-white/[0.03] shadow-2xl shadow-black/60 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      <CardContent className="p-10 md:p-14">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-white font-headline font-bold text-4xl tracking-tight">New Whisper</h2>
                <p className="text-primary/40 text-[10px] font-bold uppercase tracking-[0.4em]">Vault Encryption Status: Active</p>
              </div>
              <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] px-5 py-3 rounded-full">
                <Label htmlFor="anonymous-mode" className="text-[11px] font-bold text-muted-foreground/40 cursor-pointer uppercase tracking-widest">
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

            <div className="space-y-8">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="What's hidden in the vault?" 
                        className="min-h-[250px] bg-black/20 border-white/[0.05] rounded-2xl text-2xl focus-visible:ring-primary/10 placeholder:text-muted-foreground/10 resize-none p-10 font-medium leading-relaxed transition-all focus:bg-black/30"
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
                        placeholder="Identity Alias" 
                        className="bg-black/10 border-white/[0.05] rounded-xl h-16 text-xl px-8 focus-visible:ring-primary/10" 
                        {...field} 
                      />
                    </FormItem>
                  )}
                />
              )}

              {imagePreview && (
                <div className="relative inline-block group animate-in zoom-in duration-300">
                  <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-80 w-auto object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => { setImagePreview(null); form.setValue('imageUrl', ''); }}
                    className="absolute -top-4 -right-4 bg-destructive text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 z-10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-white/[0.03]">
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
                  className="h-20 w-20 rounded-xl text-muted-foreground/30 hover:text-primary hover:bg-primary/5 transition-all active:scale-90"
                >
                  <ImageIcon className="h-10 w-10" />
                </Button>
              </div>

              <Button 
                type="submit" 
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-10 font-bold flex items-center gap-6 transition-all hover:translate-x-1 shadow-2xl shadow-primary/10 active:scale-[0.98]"
                disabled={isSubmitting}
              >
                <span className="text-2xl">{isSubmitting ? 'Vaulting...' : 'Whisper'}</span>
                <SendHorizontal className="h-8 w-8" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
