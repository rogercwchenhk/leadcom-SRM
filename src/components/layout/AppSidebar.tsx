'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings,
  Bot,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

interface AppSidebarProps {
  userRole: UserRole;
}

const navigation = {
  requester: [
    { name: '首页', href: '/', icon: Home },
    { name: '我的需求', href: '/requests', icon: ShoppingCart },
    { name: 'AI助手', href: '/ai-assistant', icon: Bot },
  ],
  purchaser: [
    { name: '首页', href: '/', icon: Home },
    { name: '采购需求', href: '/requests', icon: ShoppingCart },
    { name: '供应商管理', href: '/suppliers', icon: Users },
    { name: 'PO管理', href: '/pos', icon: FileText },
    { name: 'AI助手', href: '/ai-assistant', icon: Bot },
  ],
  approver: [
    { name: '首页', href: '/', icon: Home },
    { name: '待审批', href: '/approvals', icon: FileText },
    { name: 'AI助手', href: '/ai-assistant', icon: Bot },
  ],
  finance: [
    { name: '首页', href: '/', icon: Home },
    { name: '发票管理', href: '/invoices', icon: FileText },
    { name: '付款记录', href: '/payments', icon: FileText },
    { name: 'AI助手', href: '/ai-assistant', icon: Bot },
  ],
};

export function AppSidebar({ userRole }: AppSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = navigation[userRole] || navigation.requester;

  return (
    <div className={cn(
      'flex flex-col border-r bg-card transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <h1 className="text-xl font-bold text-foreground">
            AI采购系统
          </h1>
        )}
        {collapsed && (
          <Bot className="h-6 w-6 text-primary" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1 hover:bg-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                {userRole === 'requester' && '需求申请人'}
                {userRole === 'purchaser' && '采购专员'}
                {userRole === 'approver' && '审批人员'}
                {userRole === 'finance' && '财务人员'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
