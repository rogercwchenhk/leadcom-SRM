'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UsersRound, 
  User, 
  ChevronDown, 
  ChevronRight, 
  Shield,
  Loader2,
  Plus
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface User {
  id: number;
  username: string;
  email: string;
  status: string;
}

interface UserGroup {
  id: number;
  name: string;
  description: string | null;
  parentGroupId: number | null;
  users?: { user: User }[];
  permissions?: { permission: { id: number; name: string } }[];
}

export function HierarchyView() {
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch('/api/permissions/groups');
      const data = await res.json();
      setGroups(data);
      
      // 默认展开所有根节点
      const rootGroups = data.filter((g: UserGroup) => !g.parentGroupId);
      setExpandedGroups(new Set(rootGroups.map((g: UserGroup) => g.id)));
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }

  // 构建用户组树
  const buildGroupTree = (groupsList: UserGroup[], parentId: number | null = null): any[] => {
    return groupsList
      .filter(g => g.parentGroupId === parentId)
      .map(g => ({
        ...g,
        children: buildGroupTree(groupsList, g.id),
      }));
  };

  const toggleGroup = (id: number) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    return name
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderGroupNode = (group: any, level: number = 0): React.ReactNode => {
    const isExpanded = expandedGroups.has(group.id);
    const hasChildren = group.children && group.children.length > 0;
    const memberCount = group.users?.length || 0;
    const permissionCount = group.permissions?.length || 0;

    return (
      <div key={group.id} className="select-none">
        <div 
          className={`flex items-center gap-3 py-3 px-4 rounded-lg border border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/30 transition-colors ${level > 0 ? 'ml-8' : ''}`}
        >
          <button
            onClick={() => hasChildren && toggleGroup(group.id)}
            className={`p-1.5 rounded-md hover:bg-slate-100 ${!hasChildren ? 'invisible' : ''}`}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            )}
          </button>

          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
              <UsersRound className="h-5 w-5" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-900 truncate">{group.name}</h4>
              {group.parentGroupId && (
                <Badge variant="outline" className="text-xs shrink-0">
                  子组
                </Badge>
              )}
            </div>
            {group.description && (
              <p className="text-sm text-slate-500 truncate">{group.description}</p>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <User className="h-4 w-4" />
              <span>{memberCount} 成员</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Shield className="h-4 w-4" />
              <span>{permissionCount} 权限</span>
            </div>
          </div>
        </div>

        {/* 组成员 */}
        {isExpanded && memberCount > 0 && (
          <div className={`mt-2 ml-8 pl-4 border-l-2 border-slate-100`}>
            <div className="text-xs font-medium text-slate-500 mb-2">成员列表</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {group.users?.map((ug: any) => (
                <div 
                  key={ug.user.id} 
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                      {getInitials(ug.user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{ug.user.username}</p>
                    <p className="text-xs text-slate-500 truncate">{ug.user.email}</p>
                  </div>
                  <Badge variant={ug.user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {ug.user.status === 'active' ? '正常' : '未激活'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 子组 */}
        {hasChildren && isExpanded && (
          <div className="mt-3">
            {group.children.map((child: any) => (
              <React.Fragment key={child.id}>
                {renderGroupNode(child, level + 1)}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  const groupTree = buildGroupTree(groups);
  const totalUsers = groups.reduce((acc, g) => acc + (g.users?.length || 0), 0);
  const totalGroups = groups.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">用户组总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold text-slate-900">{totalGroups}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">用户总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold text-slate-900">{totalUsers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">层级深度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ChevronDown className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold text-slate-900">
                {calculateMaxDepth(groups)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UsersRound className="h-5 w-5 text-orange-600" />
                组织架构视图
              </CardTitle>
              <CardDescription>
                查看用户组的层级关系、成员和权限分布
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groupTree.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <UsersRound className="h-12 w-12 mb-4 opacity-20" />
                <p>暂无用户组</p>
              </div>
            ) : (
              groupTree.map((group) => (
                <React.Fragment key={group.id}>
                  {renderGroupNode(group)}
                </React.Fragment>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 计算最大层级深度
function calculateMaxDepth(groups: UserGroup[], parentId: number | null = null, depth: number = 1): number {
  const children = groups.filter(g => g.parentGroupId === parentId);
  if (children.length === 0) return depth;
  return Math.max(...children.map(g => calculateMaxDepth(groups, g.id, depth + 1)));
}
