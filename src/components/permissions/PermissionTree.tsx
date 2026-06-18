'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronRight, 
  ChevronDown, 
  Shield, 
  Check, 
  X, 
  Loader2, 
  Save,
  UsersRound
} from 'lucide-react';

interface Permission {
  id: number;
  name: string;
  code: string;
  description: string | null;
  parentPermissionId: number | null;
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserGroup {
  id: number;
  name: string;
}

export function PermissionTree() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetType, setTargetType] = useState<'user' | 'group'>('group');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [userPermissions, setUserPermissions] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedTargetId && targetType) {
      loadTargetPermissions();
    }
  }, [selectedTargetId, targetType]);

  async function loadData() {
    setLoading(true);
    try {
      const [permRes, usersRes, groupsRes] = await Promise.all([
        fetch('/api/permissions/list'),
        fetch('/api/permissions/users'),
        fetch('/api/permissions/groups'),
      ]);
      const permData = await permRes.json();
      const usersData = await usersRes.json();
      const groupsData = await groupsRes.json();
      setPermissions(permData.flat);
      setUsers(usersData);
      setGroups(groupsData);
      
      // 默认展开根节点
      const rootNodes = permData.flat.filter((p: Permission) => !p.parentPermissionId);
      setExpandedNodes(new Set(rootNodes.map((p: Permission) => p.id)));
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTargetPermissions() {
    if (!selectedTargetId) return;
    
    try {
      if (targetType === 'user') {
        const res = await fetch(`/api/permissions/user-permissions?userId=${selectedTargetId}`);
        const data = await res.json();
        setUserPermissions(data.permissions);
        setSelectedPermissionIds(data.directPermissionIds || []);
      } else {
        // 加载用户组权限
        const res = await fetch(`/api/permissions/groups?id=${selectedTargetId}`);
        const data = await res.json();
        const groupPermissionIds = data.permissions?.map((p: any) => p.permission.permissionId) || [];
        setSelectedPermissionIds(groupPermissionIds);
      }
    } catch (error) {
      console.error('加载权限失败:', error);
    }
  }

  // 构建权限树
  const buildPermissionTree = (perms: Permission[], parentId: number | null = null): any[] => {
    return perms
      .filter(p => p.parentPermissionId === parentId)
      .map(p => ({
        ...p,
        children: buildPermissionTree(perms, p.id),
      }));
  };

  const toggleNode = (id: number) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const togglePermission = (id: number, checked: boolean) => {
    setSelectedPermissionIds(prev => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter(pid => pid !== id);
      }
    });
  };

  const selectAll = () => {
    setSelectedPermissionIds(permissions.map(p => p.id));
  };

  const clearAll = () => {
    setSelectedPermissionIds([]);
  };

  const handleSave = async () => {
    if (!selectedTargetId) return;
    
    setSaving(true);
    try {
      if (targetType === 'user') {
        await fetch('/api/permissions/user-permissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: parseInt(selectedTargetId),
            permissionIds: selectedPermissionIds,
          }),
        });
      } else {
        await fetch('/api/permissions/list', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            groupId: parseInt(selectedTargetId),
            permissionIds: selectedPermissionIds,
          }),
        });
      }
      await loadTargetPermissions();
    } catch (error) {
      console.error('保存权限失败:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderPermissionNode = (perm: any, level: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(perm.id);
    const hasChildren = perm.children && perm.children.length > 0;
    
    // 检查是否有继承的权限
    const inheritedPermission = userPermissions.find(
      (p: any) => p.id === perm.id && p.source === 'group'
    );
    
    return (
      <div key={perm.id} className="select-none">
        <div 
          className={`flex items-center gap-1.5 py-1.5 px-2 rounded hover:bg-slate-50 ${level > 0 ? 'ml-5' : ''}`}
        >
          <button
            onClick={() => hasChildren && toggleNode(perm.id)}
            className={`p-0.5 rounded hover:bg-slate-200 ${!hasChildren ? 'invisible' : ''}`}
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            )}
          </button>
          
          <Checkbox
            id={`perm-${perm.id}`}
            checked={selectedPermissionIds.includes(perm.id)}
            onCheckedChange={(checked) => togglePermission(perm.id, !!checked)}
            disabled={!selectedTargetId}
            className="h-4 w-4"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <label 
                htmlFor={`perm-${perm.id}`}
                className="text-xs font-medium cursor-pointer truncate"
              >
                {perm.name}
              </label>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {perm.code}
              </span>
              {inheritedPermission && (
                <Badge variant="outline" className="text-[9px] h-4 px-1 bg-blue-50 text-blue-700 border-blue-200 shrink-0">
                  继承自 {inheritedPermission.groupName}
                </Badge>
              )}
            </div>
            {perm.description && (
              <p className="text-[10px] text-slate-500 mt-0.5">{perm.description}</p>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="border-l-2 border-slate-100 ml-5">
            {perm.children.map((child: any) => renderPermissionNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
      </div>
    );
  }

  const permissionTree = buildPermissionTree(permissions);
  const selectedCount = selectedPermissionIds.length;
  const totalCount = permissions.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* 左侧：选择目标 */}
        <div className="space-y-2">
          <Card>
            <CardHeader className="pb-1.5 pt-2.5 px-3">
              <CardTitle className="text-xs">选择分配目标</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 pb-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500">目标类型</label>
                  <Select
                    value={targetType}
                    onValueChange={(value: 'user' | 'group') => {
                      setTargetType(value);
                      setSelectedTargetId('');
                      setSelectedPermissionIds([]);
                    }}
                  >
                    <SelectTrigger className="text-xs h-7">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group" className="text-xs">
                        <div className="flex items-center gap-1.5">
                          <UsersRound className="h-3 w-3" />
                          用户组
                        </div>
                      </SelectItem>
                      <SelectItem value="user" className="text-xs">
                        <div className="flex items-center gap-1.5">
                          <UsersRound className="h-3 w-3" />
                          用户
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500">
                    选择{targetType === 'group' ? '用户组' : '用户'}
                  </label>
                  <Select
                    value={selectedTargetId}
                    onValueChange={setSelectedTargetId}
                  >
                    <SelectTrigger className="text-xs h-7">
                      <SelectValue placeholder={`请选择${targetType === 'group' ? '用户组' : '用户'}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {targetType === 'group'
                        ? groups.map((group) => (
                            <SelectItem key={group.id} value={group.id.toString()} className="text-xs">
                              {group.name}
                            </SelectItem>
                          ))
                        : users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()} className="text-xs">
                              {user.username} ({user.email})
                            </SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedTargetId && (
                <>
                  <Separator className="my-1.5" />
                  
                  <div className="text-[9px] text-slate-500">
                    <span className="font-medium text-slate-700">
                      {targetType === 'group'
                        ? groups.find(g => g.id.toString() === selectedTargetId)?.name
                        : `${users.find(u => u.id.toString() === selectedTargetId)?.username}`
                      }
                    </span>
                    <span className="ml-0.5">
                      · {selectedCount} 个权限
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {targetType === 'user' && userPermissions.length > 0 && (
            <Card>
              <CardHeader className="pb-1.5 pt-2.5 px-3">
                <CardTitle className="text-[10px]">权限来源说明</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 px-3 pb-2.5">
                <div className="flex items-center gap-1.5 text-[10px]">
                  <Check className="h-2.5 w-2.5 text-orange-600" />
                  <span>直接分配的权限</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <Badge variant="outline" className="text-[8px] h-3.5 px-0.5 bg-blue-50 text-blue-700 border-blue-200">
                    继承
                  </Badge>
                  <span>从用户组继承的权限</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 右侧：权限树 */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-2.5 pt-3 px-4">
              <CardTitle className="text-xs flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-orange-600" />
                权限列表
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-500">
                点击复选框分配权限，支持父子层级关系
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {!selectedTargetId ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <Shield className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <p className="text-[10px] text-slate-500">
                      请在左侧选择用户或用户组后，勾选下方权限进行分配
                    </p>
                  </div>
                  <div className="border rounded-lg p-3 max-h-[500px] overflow-y-auto">
                    {permissionTree.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                        <Shield className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-xs">暂无权限数据</p>
                      </div>
                    ) : (
                      permissionTree.map((perm) => renderPermissionNode(perm))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] h-4 px-1">
                        {targetType === 'group' ? '用户组' : '用户'}
                      </Badge>
                      <span className="text-xs font-medium text-slate-700">
                        {targetType === 'group'
                          ? groups.find(g => g.id.toString() === selectedTargetId)?.name
                          : users.find(u => u.id.toString() === selectedTargetId)?.username
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">
                        已选 <span className="font-medium text-orange-600">{selectedCount}</span>/{totalCount}
                      </span>
                      <div className="flex gap-0.5">
                        <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2" onClick={selectAll}>
                          全选
                        </Button>
                        <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2" onClick={clearAll}>
                          清空
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 max-h-[500px] overflow-y-auto">
                    {permissionTree.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                        <Shield className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-xs">暂无权限数据</p>
                      </div>
                    ) : (
                      permissionTree.map((perm) => renderPermissionNode(perm))
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      className="gap-1.5 text-xs h-7" 
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                      保存权限
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
