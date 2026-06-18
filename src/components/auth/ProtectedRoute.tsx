'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const publicPaths = ['/login'];

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      // 未登录且不是公开页面，跳转到登录页
      router.push('/login');
    } else if (user && isPublicPath) {
      // 已登录且是公开页面，跳转到首页
      router.push('/');
    }
  }, [user, isLoading, pathname, router]);

  // 加载中显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-500 mt-2">加载中...</p>
        </div>
      </div>
    );
  }

  const isPublicPath = publicPaths.includes(pathname);

  // 未登录且不是公开页面，不渲染内容（会在useEffect中跳转）
  if (!user && !isPublicPath) {
    return null;
  }

  // 已登录且是公开页面，不渲染内容（会在useEffect中跳转）
  if (user && isPublicPath) {
    return null;
  }

  // 正常渲染子组件
  return <>{children}</>;
}
