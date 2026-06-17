'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  UsersRound, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  ChevronDown,
  Shield,
  ArrowRightLeft,
  Loader2
} from 'lucide-react';
import { 
  PRESET_TEAM_MEMBERS, 
  ROLE_LABELS, 
  ROLE_COLORS,
  type TeamMember,
  type UserRole
} from '@/types';
import { 
  ROLE_PERMISSIONS, 
  PERMISSION_GROUPS,
  type PermissionCode 
} from '@/config/role-permissions';

interface SyncChange {
  type: 'add' | 'remove';
  memberName: string;
  role: UserRole;
  permissionCode: string;
  permissionName: string;
}

export function TeamPermissionSync() {
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [previewChanges, setPreviewChanges] = useState<SyncChange[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);

  // 初始化时选择所有成员
  useEffect(() => {
    setSelectedMembers(PRESET_TEAM_MEMBERS.map(m => m.id));
  }, []);

  // 生成同步预览
  const generatePreview = () => {
    const changes: SyncChange[] = [];
    
    PRESET_TEAM_MEMBERS
      .filter(member => selectedMembers.includes(member.id))
      .forEach(member => {
        member.roles.forEach(role => {
          const rolePermissions = ROLE_PERMISSIONS[role] || [];
          
          // 模拟：这里我们可以显示该角色应该有哪些权限
          // 实际应用中需要对比数据库中的现有权限
          rolePermissions.forEach(permissionCode => {
            const permissionInfo = findPermissionInfo(permissionCode);
            if (permissionInfo) {
              changes.push({
                type: 'add',
                memberName: member.name,
                role,
                permissionCode,
                permissionName: permissionInfo.name,
              });
            }
          });
        });
      });
    
    setPreviewChanges(changes);
    setShowPreview(true);
  };

  // 查找权限信息
  const findPermissionInfo = (code: string) => {
    for (const group of PERMISSION_GROUPS) {
      const found = group.permissions.find(p => p.code === code);
      if (found) return found;
    }
    return null;
  };

  // 执行同步
  const executeSync = async () => {
    setSyncing(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 这里应该调用实际的同步API
      console.log('执行同步:', { selectedMembers, previewChanges });
      
      setIsSyncDialogOpen(false);
      setShowPreview(false);
      setPreviewChanges([]);
    } catch (error) {
      console.error('同步失败:', error);
    } finally {
      setSyncing(false);
    }
  };

  // 切换成员选择
  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // 切换成员展开
  const toggleMemberExpand = (memberId: string) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMembers(newExpanded);
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedMembers.length === PRESET_TEAM_MEMBERS.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(PRESET_TEAM_MEMBERS.map(m => m.id));
    }
  };

  // 按成员分组变更
  const changesByMember = previewChanges.reduce((acc, change) => {
    if (!acc[change.memberName]) {
      acc[change.memberName] = [];
    }
    acc[change.memberName].push(change);
    return acc;
  }, {} as Record<string, SyncChange[]>);

  return (
    <>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-1 pt-2 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  团队-权限自动同步
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  根据团队成员的角色自动分配权限
                </CardDescription>
              </div>
            </div>
            <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 text-xs">
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  开始同步
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-orange-600" />
                    团队-权限自动同步
                  </DialogTitle>
                  <DialogDescription>
                    根据团队成员在团队管理中设置的角色，自动为其分配对应的系统权限。
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto py-4">
                  {!showPreview ? (
                    <div className="space-y-4">
                      {/* 选择成员 */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-slate-900">选择要同步的成员</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={toggleSelectAll}
                          >
                            {selectedMembers.length === PRESET_TEAM_MEMBERS.length 
                              ? '取消全选' 
                              : '全选'}
                          </Button>
                        </div>
                        <div className="space-y-2 border rounded-lg p-3 border-slate-200">
                          {PRESET_TEAM_MEMBERS.map(member => (
                            <div key={member.id} className="space-y-2">
                              <div className="flex items-center gap-3">
                                <Checkbox 
                                  id={`member-${member.id}`}
                                  checked={selectedMembers.includes(member.id)}
                                  onCheckedChange={() => toggleMember(member.id)}
                                />
                                <button
                                  type="button"
                                  className="flex-1 flex items-center gap-3 text-left"
                                  onClick={() => toggleMemberExpand(member.id)}
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-slate-900">
                                        {member.name}
                                      </span>
                                      {member.position && (
                                        <span className="text-xs text-slate-500">
                                          {member.position}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {member.roles.map(role => (
                                        <Badge 
                                          key={role} 
                                          className={`${ROLE_COLORS[role]} text-[10px] h-5`}
                                        >
                                          {ROLE_LABELS[role]}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  {expandedMembers.has(member.id) ? (
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                  )}
                                </button>
                              </div>
                              
                              {/* 展开的权限预览 */}
                              {expandedMembers.has(member.id) && (
                                <div className="ml-7 pl-4 border-l-2 border-slate-100 space-y-2">
                                  {member.roles.map(role => {
                                    const permissions = ROLE_PERMISSIONS[role] || [];
                                    return (
                                      <div key={role} className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <Badge className={`${ROLE_COLORS[role]} text-[10px] h-4`}>
                                            {ROLE_LABELS[role]}
                                          </Badge>
                                          <span className="text-xs text-slate-500">
                                            {permissions.length} 个权限
                                          </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                          {permissions.slice(0, 5).map(code => {
                                            const info = findPermissionInfo(code);
                                            return info ? (
                                              <span 
                                                key={code}
                                                className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                                              >
                                                {info.name}
                                              </span>
                                            ) : null;
                                          })}
                                          {permissions.length > 5 && (
                                            <span className="text-[10px] text-slate-400">
                                              +{permissions.length - 5} 更多
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* 变更预览 */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-slate-900">同步变更预览</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => setShowPreview(false)}
                          >
                            返回修改
                          </Button>
                        </div>
                        <div className="space-y-3 border rounded-lg p-3 border-slate-200">
                          {Object.entries(changesByMember).map(([memberName, changes]) => (
                            <div key={memberName} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-900">
                                  {memberName}
                                </span>
                                <Badge className="text-[10px] h-5 bg-blue-100 text-blue-700">
                                  {changes.length} 项变更
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                {changes.map((change, index) => (
                                  <div 
                                    key={index}
                                    className="flex items-center gap-2 text-xs"
                                  >
                                    {change.type === 'add' ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                    ) : (
                                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                    )}
                                    <Badge 
                                      className={`${ROLE_COLORS[change.role]} text-[10px] h-4 flex-shrink-0`}
                                    >
                                      {ROLE_LABELS[change.role]}
                                    </Badge>
                                    <span className="text-slate-600 flex-1">
                                      {change.type === 'add' ? '+' : '-'}{change.permissionName}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          {Object.keys(changesByMember).length === 0 && (
                            <div className="text-center py-6">
                              <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-sm text-slate-500">没有需要同步的变更</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter className="gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setIsSyncDialogOpen(false);
                      setShowPreview(false);
                      setPreviewChanges([]);
                    }}
                    disabled={syncing}
                  >
                    取消
                  </Button>
                  {!showPreview ? (
                    <Button 
                      onClick={generatePreview}
                      disabled={selectedMembers.length === 0 || syncing}
                    >
                      <RefreshCw className="w-4 h-4 mr-1.5" />
                      预览变更
                    </Button>
                  ) : (
                    <Button 
                      onClick={executeSync}
                      disabled={syncing}
                    >
                      {syncing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                          同步中...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          确认同步
                        </>
                      )}
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-orange-900">
                智能同步说明
              </p>
              <p className="text-xs text-orange-700 mt-1">
                系统会根据团队成员在「团队管理」中设置的角色，自动为其分配对应的系统权限。
                您可以先预览变更，确认无误后再执行同步。
              </p>
            </div>
          </div>
          
          {/* 快速统计 */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <UsersRound className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] text-slate-600">团队成员</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {PRESET_TEAM_MEMBERS.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] text-slate-600">角色类型</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {new Set(PRESET_TEAM_MEMBERS.flatMap(m => m.roles)).size}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] text-slate-600">权限总数</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {PERMISSION_GROUPS.reduce((sum, g) => sum + g.permissions.length, 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
