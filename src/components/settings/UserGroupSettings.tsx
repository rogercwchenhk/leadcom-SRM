'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UsersRound, Network } from 'lucide-react';
import { UserManagement } from '@/components/permissions/UserManagement';
import { GroupManagement } from '@/components/permissions/GroupManagement';
import { HierarchyView } from '@/components/permissions/HierarchyView';

export function UserGroupSettings() {
  const [activeTab, setActiveTab] = useState('users');
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6 overflow-x-auto -mx-2 sm:mx-0 pb-2">
          <TabsList className="grid-cols-3 w-full min-w-max sm:w-auto">
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
            <TabsTrigger value="hierarchy" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Network className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">层级视图</span>
              <span className="sm:hidden">层级</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="groups">
          <GroupManagement />
        </TabsContent>

        <TabsContent value="hierarchy">
          <HierarchyView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
