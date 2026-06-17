'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  FileText, 
  Package, 
  Truck, 
  Receipt, 
  DollarSign, 
  Home,
  ArrowLeft,
  MessageCircle,
  History,
  CreditCard
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface SupplierLayoutProps {
  children: ReactNode;
}

export function SupplierLayout({ children }: SupplierLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      id: 'home',
      title: '首页',
      icon: Home,
      href: '/supplier-portal',
    },
    {
      id: 'orders',
      title: '订单管理',
      icon: Package,
      href: '/supplier-portal',
    },
    {
      id: 'history',
      title: '历史订单',
      icon: History,
      href: '/supplier-portal',
    },
    {
      id: 'payment',
      title: '付款查询',
      icon: CreditCard,
      href: '/supplier-portal',
    },
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* 侧边栏 */}
      <div className="hidden md:flex w-60 border-r border-slate-200 flex-col h-full bg-white">
        {/* Logo区域 */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-semibold text-slate-900">供应商平台</h1>
              <p className="text-xs text-slate-500">Supplier Portal</p>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 h-9 ${
                  isActive ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => handleNavigate(item.href)}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                {item.title}
              </Button>
            );
          })}
        </nav>

        {/* 底部区域 */}
        <div className="p-4 border-t border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">北京科技发展有限公司</p>
                <p className="text-xs text-slate-500 truncate">供应商用户</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 h-9 text-slate-600"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              返回采购系统
            </Button>
          </div>
        </div>
      </div>
      
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            {/* 移动端Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center md:hidden">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900 text-sm md:hidden">供应商平台</span>
            </div>
          </div>
          
          {/* 返回采购系统按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">返回采购系统</span>
          </Button>
        </header>
        
        {/* 主内容 */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
