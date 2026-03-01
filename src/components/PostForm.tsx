'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Image as ImageIcon, SendHorizontal, X, CheckCircle2, RotateCcw } from 'lucide-react';
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
import { cn } from '@/lib/utils';

const formSchema = z.object({
  message: z.string().min(3, { message: "What's on your mind?" }),
  isAnonymous: z.boolean().default(true),
  username: z.string().optional(),
  imageUrl: z.string().optional(),
});

export function PostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
      if (result.success) {
        setSubmitted(true);
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

  const resetForm = () => {
    setSubmitted(false);
    setImagePreview(null);
    form.reset();
  };

  if (submitted) {
    return (
      <div className="space-y-12 animate-in fade-in zoom-in duration-500 py-20">
        <div className="text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 mb-8 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tight">Whisper Vaulted</h2>
            <p className="text-muted-foreground text-lg font-medium opacity-60">Transmission encrypted and stored securely.</p>
          </div>
          
          <div className="pt-12">
            <Button 
              variant="outline"
              onClick={resetForm}
              className="rounded-full border-white/10 text-muted-foreground hover:text-white transition-all gap-3 h-14 px-10 hover:bg-white/5 font-bold"
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
                  className="h-14 w-14 rounded-xl text-muted-foreground/30 hover:text-primary hover:bg-primary/5 transition-all active:scale-90"
                >
                  <ImageIcon className="h-6 w-6" />
                </Button>
              </div>

              <Button 
                type="submit" 
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-14 font-bold flex items-center gap-4 transition-all hover:translate-x-1 shadow-xl shadow-primary/10 active:scale-[0.98]"
                disabled={isSubmitting}
              >
                <span className="text-lg">{isSubmitting ? 'Vaulting...' : 'Whisper'}</span>
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
