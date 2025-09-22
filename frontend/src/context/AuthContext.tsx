"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "cookies-next";
import Auth from "@/api/Auth";

// Constants
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
} as const;

const COOKIE_CONFIG = {
  TOKEN_NAME: 'auth_token',
  MAX_AGE: 60 * 60 * 24 * 7, // 7 days
  SAME_SITE: 'strict' as const,
} as const;

// Types
type UserRole = 'super_admin' | 'system_manager' | 'station_owner' | 'employee_garage' | 'client_garage';

interface User {
  id: number;
  username: string;
  firstname?: string;
  lastname?: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  Authlogin: (token: string, userData: User) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

// Error class
class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuthentication = useCallback(async () => {
    if (typeof window === "undefined") return;
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      
      // Si pas de token, on déconnecte
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Vérifier la validité du token
      const userData = await Auth.fetchMe(token);
      
      if (!userData) {
        throw new AuthError('Invalid token');
      }
      console.log('Authenticated user:', userData?.data?.user);
      // Mettre à jour les données utilisateur
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData?.data?.user));
      setUser(userData?.data?.user);

      // Mettre à jour le cookie
      setCookie(COOKIE_CONFIG.TOKEN_NAME, token, { 
        maxAge: COOKIE_CONFIG.MAX_AGE,
        sameSite: COOKIE_CONFIG.SAME_SITE,
        secure: process.env.NODE_ENV === "production",
      });
    } catch (error) {
      console.error('Authentication check failed:', error);
      // En cas d'erreur, on déconnecte
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      deleteCookie(COOKIE_CONFIG.TOKEN_NAME);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const Authlogin = useCallback((token: string, userData: User) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      // localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
      setCookie(COOKIE_CONFIG.TOKEN_NAME, token, { 
        maxAge: COOKIE_CONFIG.MAX_AGE,
        sameSite: COOKIE_CONFIG.SAME_SITE,
        secure: process.env.NODE_ENV === "production",
      });
      
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw new AuthError('Failed to set authentication data');
    }
  }, []);

  const logout = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        await Auth.logout(token).catch(error => {
          console.error('Logout request failed:', error);
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Nettoyer le stockage quoi qu'il arrive
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      deleteCookie(COOKIE_CONFIG.TOKEN_NAME);
      setUser(null);
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    // Vérifier s'il y a un token avant d'appeler checkAuthentication
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        checkAuthentication();
      } else {
        setIsLoading(false);
      }
    }
  }, [checkAuthentication]);

  const contextValue: AuthContextType = {
    // user,
    isLoading,
    isAuthenticated: !!user,
    Authlogin,
    logout,
    refreshAuth: checkAuthentication,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new AuthError('useAuth must be used within an AuthProvider');
  }
  return context;
};