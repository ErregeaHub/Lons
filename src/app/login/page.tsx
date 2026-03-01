
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { LonsNavbar } from '@/components/LonsNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const success = await login(password);
        if (success) {
            router.push('/admin');
        } else {
            setError('Invalid admin credentials');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <LonsNavbar />

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-4">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Admin Login</h1>
                        <p className="text-muted-foreground">Access the anonymous feedback vault</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    className="bg-white/5 border-white/5 h-14 pl-12 rounded-xl focus-visible:ring-primary/20"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-4 rounded-xl border border-destructive/20">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Verifying...' : 'Unlock Vault'}
                        </Button>
                    </form>
                </div>
            </main>

            <footer className="py-8 text-center">
                <p className="text-muted-foreground/40 text-xs font-medium tracking-wide">
                    © 2026 Lons Anonymous. Built with silence.
                </p>
            </footer>
        </div>
    );
}
