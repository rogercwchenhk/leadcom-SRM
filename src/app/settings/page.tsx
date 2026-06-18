'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  CheckSquare, 
  Bot, 
  Bell, 
  UsersRound,
  Shield,
  Settings
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CompanySettings } from '@/components/settings/CompanySettings';
import { ApprovalSettings } from '@/components/settings/ApprovalSettings';
import { AISettings } from '@/components/settings/AISettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { OrganizationSettings } from '@/components/organization/OrganizationSettings';
import { PermissionSettings } from '@/components/settings/PermissionSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('organization');
  
  return (
    <AppLayout initialRole="purchaser_manager">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">系统设置</h1>
            <p className="text-sm text-slate-500 mt-1">配置系统参数、组织架构和业务规则</p>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-slate-900">设置控制台</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                管理组织架构、权限、公司信息、审批流程和AI配置
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* 移动端使用可滚动的标签列表，桌面端使用网格 */}
                <div className="mb-6 overflow-x-auto -mx-2 sm:mx-0 pb-2">
                  <TabsList className="grid-cols-3 sm:grid-cols-6 w-full min-w-max sm:w-auto">
                    <TabsTrigger value="organization" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                      <UsersRound className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">组织架构</span>
                      <span className="sm:hidden">架构</span>
                    </TabsTrigger>
                    <TabsTrigger value="permissions" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">权限管理</span>
                      <span className="sm:hidden">权限</span>
                    </TabsTrigger>
                    <TabsTrigger value="company" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">公司信息</span>
                      <span className="sm:hidden">公司</span>
                    </TabsTrigger>
                    <TabsTrigger value="approval" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                      <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">审批配置</span>
                      <span className="sm:hidden">审批</span>
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">AI配置</span>
                      <span className="sm:hidden">AI</span>
                    </TabsTrigger>
                    <TabsTrigger value="notification" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">通知设置</span>
                      <span className="sm:hidden">通知</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="organization" className="mt-2">
                  <div className="px-2 sm:px-0">
                    <OrganizationSettings />
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="mt-2">
                  <div className="px-2 sm:px-0">
                    <PermissionSettings />
                  </div>
                </TabsContent>

                <TabsContent value="company" className="mt-2">
                  <div className="px-2 sm:px-0">
                    <CompanySettings />
                  </div>
                </TabsContent>

                <TabsContent value="approval" className="mt-2">
                  <div className="px-2 sm:px-0">
                    <ApprovalSettings />
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="mt-2">
                  <div className="px-2 sm:px-0">
                    <AISettings />
                  </div>
                </TabsContent>

                <TabsContent value="notification" className="mt-2">
                  <div className="px-2 sm:px-0">
                    <NotificationSettings />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}