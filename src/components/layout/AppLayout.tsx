'use client';

import { ReactNode, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { UserRole } from '@/types';
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppLayoutProps {
  children: ReactNode;
  initialRole?: UserRole;
}

const roles: { value: UserRole; label: string }[] = [
  { value: 'requester', label: '需求申请人' },
  { value: 'purchaser', label: '采购专员' },
  { value: 'approver', label: '审批人员' },
  { value: 'finance', label: '财务人员' },
];

export function AppLayout({ children, initialRole = 'requester' }: AppLayoutProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <AppSidebar userRole={currentRole} />
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex h-full w-64">
            <AppSidebar userRole={currentRole} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="搜索..."
                className="w-64 rounded-md border bg-background pl-8 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {roles.find(r => r.value === currentRole)?.label}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role.value}
                    onClick={() => setCurrentRole(role.value)}
                  >
                    {role.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
