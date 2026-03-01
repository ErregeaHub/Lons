
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ImagePlus, Send, User, UserCheck, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { submitFeedbackAction } from '@/lib/feedback-actions';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  message: z.string().min(10, { message: "Feedback must be at least 10 characters." }),
  isAnonymous: z.boolean().default(true),
  username: z.string().optional(),
  imageUrl: z.string().optional(),
});

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
      setSubmitted(true);
      form.reset();
      setImagePreview(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Simulate image upload
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      form.setValue('imageUrl', url);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-secondary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Feedback Received!</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Thank you for your valuable input. Your message has been securely transmitted to our administrative team.
        </p>
        <Button 
          onClick={() => setSubmitted(false)} 
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-border bg-card shadow-2xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Secure Channel</span>
        </div>
        <CardTitle className="text-3xl">Compose Feedback</CardTitle>
        <CardDescription>
          Share your thoughts, report issues, or suggest new features securely.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Type your feedback here..." 
                      className="min-h-[150px] bg-background/50 focus:ring-secondary/50 border-border resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide as much detail as possible to help us understand.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 rounded-xl border border-dashed border-border bg-background/20 group hover:border-secondary transition-colors relative">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageSelection}
              />
              <div className="flex flex-col items-center gap-2 text-center">
                {imagePreview ? (
                  <div className="relative inline-block mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-48 rounded-lg shadow-lg border border-border" 
                    />
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        form.setValue('imageUrl', '');
                      }}
                      className="absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full shadow-md"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                      <ImagePlus className="h-6 w-6 text-muted-foreground group-hover:text-secondary" />
                    </div>
                    <p className="text-sm font-medium">Click to attach image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border bg-background/30 p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        {isAnonymous ? (
                          <ShieldCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-secondary" />
                        )}
                        {isAnonymous ? 'Stay Anonymous' : 'Send as Self'}
                      </FormLabel>
                      <FormDescription>
                        {isAnonymous 
                          ? 'Your identity will be hidden from the admin.' 
                          : 'Your username will be visible to the admin.'}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!isAnonymous && (
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="animate-in slide-in-from-top-2 duration-300">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Enter your username" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
