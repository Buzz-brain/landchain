import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  connectWallet: () => Promise<boolean>;
  isWalletConnected: boolean;
  walletError?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Error state for wallet mismatch
  const [walletError, setWalletError] = useState<string | null>(null);
  // On mount, check for existing session via /auth/profile
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Use token auth if available (avoids cookie CORS issues)
        const apiBase = import.meta.env.VITE_API_BASE_URL || '';
        const token = window.localStorage.getItem('authToken');
        const headers: any = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${apiBase}/auth/profile`, {
          method: 'GET',
          headers,
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setUser({
            id: data.data._id || data.data.id,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role,
            walletAddress: data.data.walletAddress,
            createdAt: data.data.createdAt || "",
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
      });
      const data = await res.json();
      if (!res.ok) {
        return false;
      }
      // Save token returned from server for Authorization header usage
      if (data?.data?.token) {
        // Lazy import to avoid circular issues
        const { setAuthToken } = await import('../lib/api');
        setAuthToken(data.data.token);
      }
        setUser({
          id: data.data.id || data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role,
          walletAddress: data.data.walletAddress,
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
      await fetch(`${apiBase}/auth/logout`, { method: 'POST' });
      const { setAuthToken } = await import('../lib/api');
      setAuthToken(null);
    } catch (err) {
      // ignore
    }
    setUser(null);
    setIsWalletConnected(false);
  };

  const connectWallet = async (): Promise<boolean> => {
    setWalletError(null);
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const ethereum = (window as any).ethereum;
        // Request account access if needed
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          // Fetch latest profile from server to avoid stale local state
          const apiBase = import.meta.env.VITE_API_BASE_URL || '';
          let registered: string | undefined = undefined;
          try {
            const res = await fetch(`${apiBase}/auth/profile`, { method: 'GET', credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              registered = data?.data?.walletAddress;
            }
          } catch (err) {
            // ignore profile fetch errors and fall back to local user state
            registered = user?.walletAddress;
          }

          const connected = accounts[0].toLowerCase();
          const registeredNormalized = registered?.toLowerCase();
          if (registeredNormalized && connected !== registeredNormalized) {
            setWalletError('Connected wallet does not match your registered wallet address. Please connect the correct wallet.');
            setIsWalletConnected(false);
            return false;
          }
          setIsWalletConnected(true);
          setUser((prev) => prev ? { ...prev, walletAddress: accounts[0] } : prev);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        return false;
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask and try again.');
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    connectWallet,
    isWalletConnected,
    walletError,
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