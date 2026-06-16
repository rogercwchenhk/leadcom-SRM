'use client';

import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import type { UserRole } from '@/types';

interface AppLayoutProps {
  children: ReactNode;
  initialRole?: UserRole;
}

export function AppLayout({ children, initialRole }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <AppSidebar initialRole={initialRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
