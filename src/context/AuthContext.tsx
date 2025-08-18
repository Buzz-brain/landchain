import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { mockUsers } from '../lib/mock-data';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  connectWallet: () => Promise<boolean>;
  isWalletConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - find user by email
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}