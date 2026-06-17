'use client';

import { ReactNode } from 'react';
import { AppSidebar, MobileSidebarSheet } from './AppSidebar';
import type { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  initialRole?: UserRole;
}

export function AppLayout({ children, initialRole }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* 桌面端侧边栏 */}
      <AppSidebar initialRole={initialRole} />
      
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 移动端顶部导航栏 */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <MobileSidebarSheet initialRole={initialRole} />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900 text-sm">Hermes SRM</span>
            </div>
          </div>
        </header>
        
        {/* 主内容 */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
