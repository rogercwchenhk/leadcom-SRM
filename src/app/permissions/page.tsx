'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UsersRound, Shield } from 'lucide-react';
import { UserManagement } from '@/components/permissions/UserManagement';
import { GroupManagement } from '@/components/permissions/GroupManagement';
import { PermissionTree } from '@/components/permissions/PermissionTree';

import { AppLayout } from '@/components/layout/AppLayout';

export default function PermissionsPage() {
  const [activeTab, setActiveTab] = useState('users');
  
  return (
    <AppLayout initialRole="purchaser_manager">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-sm font-semibold text-slate-900 tracking-tight">权限管理</h1>
            <p className="text-xs text-slate-500 mt-0.5">管理用户、用户组和权限分配</p>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-slate-900">权限管理控制台</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="users" className="gap-1.5 text-xs">
                    <Users className="h-3.5 w-3.5" />
                    用户管理
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="gap-1.5 text-xs">
                    <UsersRound className="h-3.5 w-3.5" />
                    用户组管理
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="gap-1.5 text-xs">
                    <Shield className="h-3.5 w-3.5" />
                    权限分配
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                  <UserManagement />
                </TabsContent>

                <TabsContent value="groups">
                  <GroupManagement />
                </TabsContent>

                <TabsContent value="permissions">
                  <PermissionTree />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
