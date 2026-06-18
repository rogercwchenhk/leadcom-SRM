'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersRound, Shield, Settings } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
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
            <h1 className="text-sm font-semibold text-slate-900 tracking-tight">系统设置</h1>
            <p className="text-sm text-slate-500 mt-1">管理组织架构和权限配置</p>
          </div>

          <div className="space-y-6">
            {/* 组织架构和权限管理部分 */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold text-slate-900">组织与权限</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  管理组织架构和权限配置
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  {/* 移动端使用可滚动的标签列表，桌面端使用网格 */}
                  <div className="mb-6 overflow-x-auto -mx-2 sm:mx-0 pb-2">
                    <TabsList className="grid-cols-3 w-full min-w-max sm:w-auto">
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
                </Tabs>
              </CardContent>
            </Card>

            {/* 权限管理控制台 */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold text-slate-900">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    权限管理控制台
                  </div>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  管理系统用户、用户组和权限分配
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <div className="px-2 sm:px-0">
                  {/* 这里直接展示权限管理的内容，不嵌套Tabs */}
                  <PermissionSettings />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
