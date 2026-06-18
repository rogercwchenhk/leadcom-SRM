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
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Header */}
          <div className="mb-6">
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
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-6 mb-6">
                  <TabsTrigger value="organization" className="gap-2">
                    <UsersRound className="h-4 w-4" />
                    组织架构
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="gap-2">
                    <Shield className="h-4 w-4" />
                    权限管理
                  </TabsTrigger>
                  <TabsTrigger value="company" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    公司信息
                  </TabsTrigger>
                  <TabsTrigger value="approval" className="gap-2">
                    <CheckSquare className="h-4 w-4" />
                    审批配置
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="gap-2">
                    <Bot className="h-4 w-4" />
                    AI配置
                  </TabsTrigger>
                  <TabsTrigger value="notification" className="gap-2">
                    <Bell className="h-4 w-4" />
                    通知设置
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="organization">
                  <OrganizationSettings />
                </TabsContent>

                <TabsContent value="permissions">
                  <PermissionSettings />
                </TabsContent>

                <TabsContent value="company">
                  <CompanySettings />
                </TabsContent>

                <TabsContent value="approval">
                  <ApprovalSettings />
                </TabsContent>

                <TabsContent value="ai">
                  <AISettings />
                </TabsContent>

                <TabsContent value="notification">
                  <NotificationSettings />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}