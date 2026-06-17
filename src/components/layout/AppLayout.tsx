'use client';

import { ReactNode } from 'react';
import { AppSidebar, MobileSidebarSheet } from './AppSidebar';
import type { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Bot, Home, ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface AppLayoutProps {
  children: ReactNode;
  initialRole?: UserRole;
}

export function AppLayout({ children, initialRole }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';

  return (
    <div className="flex h-screen bg-slate-50">
      {/* 桌面端侧边栏 */}
      <AppSidebar initialRole={initialRole} />
      
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 - 桌面端和移动端都显示 */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <MobileSidebarSheet initialRole={initialRole} />
            </div>
            
            {/* Logo - 移动端显示 */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900 text-sm">Hermes SRM</span>
            </div>
          </div>
          
          {/* 返回首页按钮 - 非首页时显示 */}
          {!isHome && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">返回首页</span>
            </Button>
          )}
        </header>
        
        {/* 主内容 */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
