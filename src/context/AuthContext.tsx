import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { mockUsers } from '../lib/mock-data';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  connectWallet: () => Promise<boolean>;
  isWalletConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // On mount, check for existing session via /auth/profile
  useEffect(() => {
    const checkSession = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${apiBase}/auth/profile`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setUser({
            id: data.data._id || data.data.id,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role,
            createdAt: data.data.createdAt || '',
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        return false;
      }
      setUser({
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        createdAt: '', // Optionally fetch from profile endpoint if needed
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      await fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      // ignore
    }
    setUser(null);
    setIsWalletConnected(false);
  };

  const connectWallet = async (): Promise<boolean> => {
    // Mock wallet connection
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        // Simulate wallet connection
        setIsWalletConnected(true);
        return true;
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        return false;
      }
    }
    return false;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    connectWallet,
    isWalletConnected,
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading...</div>;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}