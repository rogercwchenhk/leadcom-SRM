'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UsersRound, Shield, LockKeyhole } from 'lucide-react';
import { UserManagement } from '@/components/permissions/UserManagement';
import { GroupManagement } from '@/components/permissions/GroupManagement';
import { PermissionTree } from '@/components/permissions/PermissionTree';
import { RolePermissionConfig } from '@/components/permissions/RolePermissionConfig';

export function PermissionSettings() {
  const [activeTab, setActiveTab] = useState('users');
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* 移动端使用可滚动标签，桌面端使用网格 */}
        <div className="mb-6 overflow-x-auto -mx-2 sm:mx-0 pb-2">
          <TabsList className="grid-cols-2 sm:grid-cols-4 w-full min-w-max sm:w-auto">
            <TabsTrigger value="users" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">用户管理</span>
              <span className="sm:hidden">用户</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <UsersRound className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">用户组管理</span>
              <span className="sm:hidden">用户组</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">权限分配</span>
              <span className="sm:hidden">分配</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <LockKeyhole className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">角色权限</span>
              <span className="sm:hidden">角色</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="groups">
          <GroupManagement />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionTree />
        </TabsContent>

        <TabsContent value="roles">
          <RolePermissionConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}
