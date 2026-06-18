'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthCookie, setAuthCookie, clearAuthCookie, verifyToken } from '@/lib/auth';
import type { User } from '@/db/schema';

interface AuthContextType {
  user: Omit<User, 'passwordHash'> | null;
  isLoading: boolean;
  login: (token: string, user: Omit<User, 'passwordHash'>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'passwordHash'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初始化时检查认证状态
    const token = getAuthCookie();
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        // 这里可以从API获取完整用户信息，暂时使用token中的信息
        setUser({
          id: decoded.userId,
          username: decoded.username,
          email: '', // 暂时留空
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        clearAuthCookie();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: Omit<User, 'passwordHash'>) => {
    setAuthCookie(token);
    setUser(userData);
  };

  const logout = () => {
    clearAuthCookie();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
