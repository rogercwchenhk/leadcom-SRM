'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UsersRound, Shield, UserPlus, UserMinus, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserManagement } from '@/components/permissions/UserManagement';
import { GroupManagement } from '@/components/permissions/GroupManagement';
import { PermissionTree } from '@/components/permissions/PermissionTree';
import { HierarchyView } from '@/components/permissions/HierarchyView';

export default function PermissionsPage() {
  const [activeTab, setActiveTab] = useState('users');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">权限管理</h1>
        <p className="text-slate-500 mt-1">管理用户、用户组和权限分配</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>权限管理控制台</CardTitle>
          <CardDescription>
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
  );
}
