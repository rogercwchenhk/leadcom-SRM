'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UsersRound, Shield, UserPlus, UserMinus, Plus, Trash2, Edit, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserManagement } from '@/components/permissions/UserManagement';
import { GroupManagement } from '@/components/permissions/GroupManagement';
import { PermissionTree } from '@/components/permissions/PermissionTree';
import { HierarchyView } from '@/components/permissions/HierarchyView';
import { TeamPermissionSync } from '@/components/permissions/TeamPermissionSync';
import { AppLayout } from '@/components/layout/AppLayout';

export default function PermissionsPage() {
  const [activeTab, setActiveTab] = useState('users');
  
  return (
    <AppLayout initialRole="purchaser_manager">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-sm font-semibold text-slate-900 tracking-tight">权限管理</h1>
            <p className="text-sm text-slate-500 mt-1">管理用户、用户组和权限分配</p>
          </div>

          {/* 团队-权限同步卡片 */}
          <div className="mb-6">
            <TeamPermissionSync />
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-slate-900">权限管理控制台</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                管理系统用户、用户组、权限分配和层级关系
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="users" className="gap-2">
                    <Users className="h-4 w-4" />
                    用户管理
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="gap-2">
                    <UsersRound className="h-4 w-4" />
                    用户组管理
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="gap-2">
                    <Shield className="h-4 w-4" />
                    权限分配
                  </TabsTrigger>
                  <TabsTrigger value="hierarchy" className="gap-2">
                    <UsersRound className="h-4 w-4" />
                    层级关系
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

                <TabsContent value="hierarchy">
                  <HierarchyView />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
