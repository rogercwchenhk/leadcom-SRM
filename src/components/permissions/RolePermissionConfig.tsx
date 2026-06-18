'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, 
  User, 
  CheckCircle2, 
  XCircle,
  Lock,
  Unlock,
  FileText,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  DollarSign,
  Cog
} from 'lucide-react';
import { UserRole, ROLE_LABELS } from '@/types';
import { 
  PERMISSION_CODES, 
  PERMISSION_GROUPS, 
  ROLE_PERMISSIONS,
  ROLE_DESCRIPTIONS,
  PermissionCode 
} from '@/config/role-permissions';

// 角色图标映射
const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  requester: <User className="h-4 w-4" />,
  request_confirmer: <CheckCircle2 className="h-4 w-4" />,
  purchaser: <ShoppingCart className="h-4 w-4" />,
  purchaser_manager: <Shield className="h-4 w-4" />,
  customer_service: <Users className="h-4 w-4" />,
  approver: <CheckCircle2 className="h-4 w-4" />,
  finance: <DollarSign className="h-4 w-4" />,
  supplier: <FileText className="h-4 w-4" />,
  admin: <Cog className="h-4 w-4" />
};

// 权限组图标映射
const GROUP_ICONS: Record<string, React.ReactNode> = {
  '合同管理': <FileText className="h-4 w-4" />,
  '需求管理': <ShoppingCart className="h-4 w-4" />,
  '采购订单': <ShoppingCart className="h-4 w-4" />,
  '供应商管理': <Users className="h-4 w-4" />,
  '数据分析': <BarChart3 className="h-4 w-4" />,
  '团队管理': <Users className="h-4 w-4" />,
  '权限管理': <Shield className="h-4 w-4" />,
  '审批流程': <CheckCircle2 className="h-4 w-4" />,
  '财务管理': <DollarSign className="h-4 w-4" />,
  '供应商门户': <FileText className="h-4 w-4" />
};

export function RolePermissionConfig() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('purchaser');
  const [viewMode, setViewMode] = useState<'role' | 'comparison'>('role');

  // 获取所有角色列表
  const allRoles = useMemo(() => {
    return Object.keys(ROLE_LABELS) as UserRole[];
  }, []);

  // 获取当前选中角色的权限
  const currentRolePermissions = useMemo(() => {
    return new Set(ROLE_PERMISSIONS[selectedRole]);
  }, [selectedRole]);

  // 统计每个角色的权限数量
  const rolePermissionCounts = useMemo(() => {
    const counts: Record<UserRole, number> = {} as Record<UserRole, number>;
    allRoles.forEach(role => {
      counts[role] = ROLE_PERMISSIONS[role].length;
    });
    return counts;
  }, [allRoles]);

  // 权限矩阵数据（用于对比视图）
  const permissionMatrix = useMemo(() => {
    const matrix: Array<{
      permission: { code: PermissionCode; name: string };
      roles: Record<UserRole, boolean>;
    }> = [];

    PERMISSION_GROUPS.forEach(group => {
      group.permissions.forEach(perm => {
        const roleStatus: Record<UserRole, boolean> = {} as Record<UserRole, boolean>;
        allRoles.forEach(role => {
          roleStatus[role] = ROLE_PERMISSIONS[role].includes(perm.code);
        });
        matrix.push({
          permission: perm,
          roles: roleStatus
        });
      });
    });

    return matrix;
  }, [allRoles]);

  return (
    <div className="space-y-6">
      {/* 参考视图说明 */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
        <Shield className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-800">
          <p className="font-medium mb-1">参考视图（只读）</p>
          <p className="text-amber-700">
            以下为系统预设的角色权限配置参考。实际生效的权限以「权限分配」中的设置为准，如需调整用户或用户组的权限，请前往「权限分配」进行操作。
          </p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-600" />
            角色权限配置
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            查看每个业务角色对应的预设权限，以及所有权限的完整列表
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'role' | 'comparison')}>
            <TabsList className="mb-6">
              <TabsTrigger value="role" className="text-xs sm:text-sm">
                单角色权限
              </TabsTrigger>
              <TabsTrigger value="comparison" className="text-xs sm:text-sm">
                权限矩阵对比
              </TabsTrigger>
            </TabsList>

            <TabsContent value="role" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 左侧：角色选择 */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xs font-medium">选择角色</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {allRoles.map((role) => (
                        <button
                          key={role}
                          onClick={() => setSelectedRole(role)}
                          className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                            selectedRole === role
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={selectedRole === role ? 'text-orange-600' : 'text-slate-500'}>
                              {ROLE_ICONS[role]}
                            </span>
                            <span className={`font-medium ${selectedRole === role ? 'text-orange-900' : 'text-slate-700'}`}>
                              {ROLE_LABELS[role]}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mb-1">
                            {ROLE_DESCRIPTIONS[role]}
                          </div>
                          <Badge variant="secondary" className="text-[10px]">
                            {rolePermissionCounts[role]} 个权限
                          </Badge>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* 右侧：权限详情 */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            {ROLE_ICONS[selectedRole]}
                            {ROLE_LABELS[selectedRole]} 权限
                          </CardTitle>
                          <CardDescription className="text-[10px] mt-1">
                            {ROLE_DESCRIPTIONS[selectedRole]}
                          </CardDescription>
                        </div>
                        <Badge className="text-xs">
                          共 {currentRolePermissions.size} 个权限
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-4">
                          {PERMISSION_GROUPS.map((group) => {
                            const groupPermissions = group.permissions.filter(p => 
                              currentRolePermissions.has(p.code)
                            );
                            
                            if (groupPermissions.length === 0) return null;

                            return (
                              <div key={group.name} className="border rounded-lg">
                                <div className="flex items-center gap-2 p-3 bg-slate-50 border-b">
                                  <span className="text-slate-500">
                                    {GROUP_ICONS[group.name] || <Shield className="h-4 w-4" />}
                                  </span>
                                  <span className="font-medium text-xs text-slate-900">
                                    {group.name}
                                  </span>
                                  <Badge variant="secondary" className="text-[10px] ml-auto">
                                    {groupPermissions.length}
                                  </Badge>
                                </div>
                                <div className="p-3 space-y-2">
                                  {groupPermissions.map((perm) => (
                                    <div 
                                      key={perm.code}
                                      className="flex items-center gap-3 p-2 rounded hover:bg-slate-50"
                                    >
                                      <Checkbox checked={true} disabled />
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-xs">
                                            {perm.name}
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-mono">
                                            {perm.code}
                                          </span>
                                        </div>
                                      </div>
                                      <Badge className="text-[10px] bg-green-100 text-green-700">
                                        已授权
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comparison">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">权限矩阵对比</CardTitle>
                  <CardDescription className="text-[10px]">
                    查看所有权限在不同角色之间的分配对比
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b bg-slate-50">
                            <th className="text-left p-3 font-medium text-slate-700 sticky left-0 bg-slate-50 z-10">
                              权限
                            </th>
                            {allRoles.map((role) => (
                              <th key={role} className="text-center p-2 font-medium text-slate-700 min-w-[100px]">
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-slate-500">{ROLE_ICONS[role]}</span>
                                  <span className="text-[10px]">{ROLE_LABELS[role]}</span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {PERMISSION_GROUPS.map((group) => (
                            <React.Fragment key={group.name}>
                              <tr className="bg-slate-100 border-b">
                                <td 
                                  colSpan={allRoles.length + 1} 
                                  className="p-2 font-medium text-slate-700 flex items-center gap-2 sticky left-0 bg-slate-100 z-10"
                                >
                                  {GROUP_ICONS[group.name] || <Shield className="h-4 w-4" />}
                                  {group.name}
                                </td>
                              </tr>
                              {group.permissions.map((perm) => (
                                <tr key={perm.code} className="border-b hover:bg-slate-50">
                                  <td className="p-2 sticky left-0 bg-white hover:bg-slate-50 z-10">
                                    <div className="flex flex-col">
                                      <span className="font-medium">{perm.name}</span>
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {perm.code}
                                      </span>
                                    </div>
                                  </td>
                                  {allRoles.map((role) => {
                                    const hasPermission = ROLE_PERMISSIONS[role].includes(perm.code);
                                    return (
                                      <td key={role} className="text-center p-2">
                                        {hasPermission ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-600 inline" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-slate-300 inline" />
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
