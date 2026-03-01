
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAdmin: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const auth = localStorage.getItem('lons_admin_auth');
        if (auth === 'true') {
            setIsAdmin(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (password: string): Promise<boolean> => {
        // Simple mock authentication
        // In a real app, this would be a server action or Firebase auth call
        if (password === 'admin123') {
            localStorage.setItem('lons_admin_auth', 'true');
            setIsAdmin(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('lons_admin_auth');
        setIsAdmin(false);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
