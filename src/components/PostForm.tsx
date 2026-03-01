'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ImagePlus, Send, UserX, User, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { submitFeedbackAction } from '@/lib/feedback-actions';

const formSchema = z.object({
  message: z.string().min(3, { message: "What's on your mind? (min 3 characters)" }),
  isAnonymous: z.boolean().default(true),
  username: z.string().optional(),
  imageUrl: z.string().optional(),
});

export function PostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      await submitFeedbackAction(values);
      form.reset();
      setImagePreview(null);
      window.location.reload(); // Refresh to see the new message in mock store
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

  return (
    <Card className="glass-card overflow-hidden rounded-3xl">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Whisper something to the world..." 
                      className="min-h-[120px] bg-transparent border-none text-lg focus-visible:ring-0 placeholder:text-muted-foreground/50 resize-none p-0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {imagePreview && (
              <div className="relative inline-block group">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-64 rounded-2xl border border-white/10 shadow-2xl" 
                />
                <button 
                  type="button"
                  onClick={() => { setImagePreview(null); form.setValue('imageUrl', ''); }}
                  className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-full hover:bg-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/5 gap-4">
              <div className="flex items-center gap-4">
                <div className="relative overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageSelection}
                  />
                  <Button variant="ghost" size="icon" type="button" className="rounded-full hover:bg-accent/10 hover:text-accent">
                    <ImagePlus className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="h-6 w-px bg-white/5" />

                <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <span className="text-xs font-medium text-muted-foreground">
                    {isAnonymous ? <UserX className="h-3.5 w-3.5 inline mr-1" /> : <User className="h-3.5 w-3.5 inline mr-1" />}
                    {isAnonymous ? 'Anonymous' : 'Public'}
                  </span>
                  <Switch
                    checked={isAnonymous}
                    onCheckedChange={(checked) => form.setValue('isAnonymous', checked)}
                  />
                </div>

                {!isAnonymous && (
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <Input 
                        placeholder="Your name" 
                        className="h-8 w-32 bg-transparent border-white/10 text-xs rounded-full" 
                        {...field} 
                      />
                    )}
                  />
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full sm:w-auto rounded-full bg-accent hover:bg-accent/90 px-8 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : <><Send className="mr-2 h-4 w-4" /> Post</>}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}