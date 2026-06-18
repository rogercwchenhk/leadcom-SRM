'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, LockKeyhole } from 'lucide-react';
import { PermissionTree } from '@/components/permissions/PermissionTree';
import { RolePermissionConfig } from '@/components/permissions/RolePermissionConfig';

export function PermissionSettings() {
  const [activeTab, setActiveTab] = useState('assignment');
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6 overflow-x-auto -mx-2 sm:mx-0 pb-2">
          <TabsList className="grid-cols-2 w-full min-w-max sm:w-auto">
            <TabsTrigger value="assignment" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">权限分配</span>
              <span className="sm:hidden">分配</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <LockKeyhole className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">角色权限参考</span>
              <span className="sm:hidden">角色</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="assignment">
          <PermissionTree />
        </TabsContent>

        <TabsContent value="roles">
          <RolePermissionConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}
