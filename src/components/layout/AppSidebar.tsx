'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  ShoppingCart, 
  FileText, 
  Users, 
  Settings,
  Bot,
  Package,
  Shield,
  UsersRound,
  Building2,
  Menu,
  X
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { UserRole } from '@/types';
import { ROLE_LABELS } from '@/types';

const roleNames: Record<UserRole, string> = ROLE_LABELS;

interface AppSidebarProps {
  initialRole?: UserRole;
  isMobile?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ initialRole = 'purchaser', isMobile = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);

  const menuItems = [
    {
      title: '首页',
      icon: Home,
      href: '/',
    },
    {
      title: '合同管理',
      icon: FileText,
      href: '/contracts',
    },
    {
      title: '采购需求',
      icon: ShoppingCart,
      href: '/requests',
    },
    {
      title: '采购订单',
      icon: Package,
      href: '/pos',
    },
    {
      title: '供应商管理',
      icon: Building2,
      href: '/supplier',
    },
    {
      title: '团队管理',
      icon: UsersRound,
      href: '/team',
    },
    {
      title: '权限管理',
      icon: Shield,
      href: '/permissions',
    },
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const SidebarContent = (
    <div className={`flex flex-col h-full ${isMobile ? 'bg-white' : 'bg-slate-50/50'}`}>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-semibold text-slate-900">Hermes SRM</h1>
              <p className="text-xs text-slate-500">智能采购管理系统</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {!isMobile && (
        <div className="p-6 border-b border-slate-200 bg-white/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-semibold text-slate-900">Hermes SRM</h1>
              <p className="text-xs text-slate-500">智能采购管理系统</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-b border-slate-200">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500">当前角色</label>
          <Select 
            value={currentRole} 
            onValueChange={(value) => setCurrentRole(value as UserRole)}
          >
            <SelectTrigger className="h-9 bg-white border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleNames).map(([role, name]) => (
                <SelectItem key={role} value={role}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Button
              key={item.href}
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 h-9 ${
                isActive ? 'bg-white border border-slate-200 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => handleNavigate(item.href)}
            >
              <item.icon className={`h-4 w-4 ${isActive ? 'text-orange-600' : 'text-slate-500'}`} />
              {item.title}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 bg-white/50">
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
              <Package className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">演示用户</p>
              <p className="text-xs text-slate-500 truncate">{roleNames[currentRole]}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-slate-600">
            <Settings className="h-4 w-4" />
            系统设置
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return SidebarContent;
  }

  return (
    <div className="hidden md:flex w-60 border-r border-slate-200 flex-col h-full">
      {SidebarContent}
    </div>
  );
}

// 移动端汉堡菜单组件
export function MobileNavTrigger() {
  return (
    <Button variant="ghost" size="sm" className="md:hidden h-10 w-10 p-0">
      <Menu className="h-5 w-5" />
    </Button>
  );
}

// 移动端侧边栏抽屉
export function MobileSidebarSheet({ initialRole }: { initialRole?: UserRole }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <MobileNavTrigger />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 border-r border-slate-200">
        <AppSidebar initialRole={initialRole} isMobile={true} onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
