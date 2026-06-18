'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, Save, Plus, Trash2, Users, UsersRound, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// 审批阶段类型
type ApprovalType = 'all' | 'any'; // 会签：all，或签：any

interface Approver {
  id: string;
  type: 'user' | 'group' | 'role';
  name: string;
  avatar?: string;
  role?: string;
}

interface ApprovalStage {
  id: string;
  name: string;
  type: ApprovalType;
  approvers: Approver[];
}

interface ApprovalRule {
  id: number;
  name: string;
  minAmount: number;
  maxAmount: number | null; // null 表示无上限
  currency: string;
  stages: ApprovalStage[];
  enabled: boolean;
  description: string;
}

// 模拟角色数据
const mockRoles = [
  { value: 'purchaser_manager', label: '采购负责人' },
  { value: 'finance', label: '财务' },
  { value: 'approver', label: '审批人员' },
];

export function ApprovalSettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rules, setRules] = useState<ApprovalRule[]>([]);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedRule, setExpandedRule] = useState<number | null>(null);
  const [orgUsers, setOrgUsers] = useState<any[]>([]);
  const [orgGroups, setOrgGroups] = useState<any[]>([]);
  const [orgLoading, setOrgLoading] = useState(true);

  useEffect(() => {
    loadApprovalRules();
    loadOrganizationData();
  }, []);

  async function loadOrganizationData() {
    setOrgLoading(true);
    try {
      // 从真实API加载用户数据
      const usersRes = await fetch('/api/permissions/users');
      const usersData = await usersRes.json();
      setOrgUsers(usersData);

      // 从真实API加载用户组数据
      const groupsRes = await fetch('/api/permissions/groups');
      const groupsData = await groupsRes.json();
      setOrgGroups(groupsData);
    } catch (error) {
      console.error('加载组织架构数据失败:', error);
    } finally {
      setOrgLoading(false);
    }
  }

  async function loadApprovalRules() {
    setLoading(true);
    try {
      // 从API加载数据
      const response = await fetch('/api/settings?section=approval');
      if (response.ok) {
        const data = await response.json();
        setRules(data.rules || []);
      } else {
        console.error('加载审批规则失败:', response.status);
        setRules([]);
      }
    } catch (error) {
      console.error('加载审批规则失败:', error);
      setRules([]);
    } finally {
      setLoading(false);
    }
  }

  function handleAddRule() {
    setEditingRule({
      id: 0,
      name: '',
      minAmount: 0,
      maxAmount: null,
      currency: 'CNY',
      stages: [],
      enabled: true,
      description: '',
    });
    setIsDialogOpen(true);
  }

  function handleEditRule(rule: ApprovalRule) {
    setEditingRule(JSON.parse(JSON.stringify(rule)));
    setIsDialogOpen(true);
  }

  function handleDeleteRule(id: number) {
    setRules(rules.filter(r => r.id !== id));
  }

  function handleSaveRule() {
    if (!editingRule) return;
    
    if (editingRule.id === 0) {
      setRules([...rules, { ...editingRule, id: Date.now() }]);
    } else {
      setRules(rules.map(r => r.id === editingRule.id ? editingRule : r));
    }
    
    setIsDialogOpen(false);
    setEditingRule(null);
  }

  // 添加审批阶段
  function addStage() {
    if (!editingRule) return;
    const newStage: ApprovalStage = {
      id: `stage-${Date.now()}`,
      name: `审批阶段 ${editingRule.stages.length + 1}`,
      type: 'any',
      approvers: [],
    };
    setEditingRule({
      ...editingRule,
      stages: [...editingRule.stages, newStage]
    });
  }

  // 删除审批阶段
  function removeStage(stageId: string) {
    if (!editingRule) return;
    setEditingRule({
      ...editingRule,
      stages: editingRule.stages.filter(s => s.id !== stageId)
    });
  }

  // 更新阶段
  function updateStage(stageId: string, updates: Partial<ApprovalStage>) {
    if (!editingRule) return;
    setEditingRule({
      ...editingRule,
      stages: editingRule.stages.map(s => 
        s.id === stageId ? { ...s, ...updates } : s
      )
    });
  }

  // 添加审批人到阶段
  function addApproverToStage(stageId: string, approver: Approver) {
    if (!editingRule) return;
    setEditingRule({
      ...editingRule,
      stages: editingRule.stages.map(s => 
        s.id === stageId 
          ? { ...s, approvers: [...s.approvers, approver] }
          : s
      )
    });
  }

  // 从阶段移除审批人
  function removeApproverFromStage(stageId: string, approverId: string) {
    if (!editingRule) return;
    setEditingRule({
      ...editingRule,
      stages: editingRule.stages.map(s => 
        s.id === stageId 
          ? { ...s, approvers: s.approvers.filter(a => a.id !== approverId) }
          : s
      )
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      // 保存到API
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section: 'approval', data: { rules } }),
      });
      
      if (response.ok) {
        alert('保存成功！');
      } else {
        alert('保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  function formatAmountRange(rule: ApprovalRule) {
    if (rule.maxAmount === null) {
      return `¥${rule.minAmount.toLocaleString()} 以上`;
    }
    return `¥${rule.minAmount.toLocaleString()} - ¥${rule.maxAmount.toLocaleString()}`;
  }

  if (loading || orgLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 审批总开关 */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <CheckSquare className="h-4 w-4 text-orange-600" />
            审批流程设置
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            全局审批流程开关和基础配置
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-slate-900">启用审批流程</h4>
              <p className="text-xs text-slate-500">
                关闭后所有采购订单将无需审批直接生效
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* 审批规则列表 */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900">金额审批规则</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                根据采购订单金额配置多级审批流程，支持会签和或签
              </CardDescription>
            </div>
            <Button onClick={handleAddRule} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              新增规则
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div 
                key={rule.id} 
                className="rounded-lg border border-slate-200 bg-white overflow-hidden"
              >
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
                  onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <CheckSquare className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-900">{rule.name}</h4>
                        <Badge variant={rule.enabled ? 'default' : 'secondary'} className="text-xs">
                          {rule.enabled ? '已启用' : '已禁用'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">{rule.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-slate-500">
                          金额范围: {formatAmountRange(rule)}
                        </span>
                        <span className="text-xs text-slate-500">
                          审批阶段: {rule.stages.length} 级
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); handleEditRule(rule); }}
                    >
                      编辑
                    </Button>
                    {expandedRule === rule.id ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* 展开的审批流程 */}
                {expandedRule === rule.id && (
                  <div className="border-t border-slate-200 p-4 bg-slate-50/50">
                    <div className="flex items-start gap-4">
                      {rule.stages.map((stage, index) => (
                        <div key={stage.id} className="flex-1">
                          <div className="bg-white rounded-lg border border-slate-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  阶段 {index + 1}
                                </Badge>
                                <span className="text-sm font-medium text-slate-900">{stage.name}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {stage.type === 'all' ? '会签' : '或签'}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {stage.approvers.map((approver) => (
                                <div key={approver.id} className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                                      {getInitials(approver.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="text-xs font-medium text-slate-900">{approver.name}</p>
                                    {approver.role && (
                                      <p className="text-[10px] text-slate-500">{approver.role}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          {index < rule.stages.length - 1 && (
                            <div className="flex justify-center -mt-12 relative z-10">
                              <div className="bg-white rounded-full p-1 border border-slate-200">
                                <ArrowRight className="h-4 w-4 text-slate-400" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 编辑/新增对话框 */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>{editingRule?.id === 0 ? '新增审批规则' : '编辑审批规则'}</AlertDialogTitle>
            <AlertDialogDescription>
              配置审批规则的金额范围和多级审批流程
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-6 py-4">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>规则名称 *</Label>
                <Input
                  value={editingRule?.name || ''}
                  onChange={(e) => setEditingRule(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="例如：小额采购"
                />
              </div>
              <div className="space-y-2">
                <Label>规则描述</Label>
                <Input
                  value={editingRule?.description || ''}
                  onChange={(e) => setEditingRule(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="简要描述此规则"
                />
              </div>
            </div>

            {/* 金额范围 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>最低金额 (CNY)</Label>
                <Input
                  type="number"
                  value={editingRule?.minAmount || 0}
                  onChange={(e) => setEditingRule(prev => prev ? { ...prev, minAmount: Number(e.target.value) } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>最高金额 (CNY)</Label>
                <Input
                  type="number"
                  value={editingRule?.maxAmount === null ? '' : editingRule?.maxAmount || ''}
                  onChange={(e) => setEditingRule(prev => prev ? { ...prev, maxAmount: e.target.value === '' ? null : Number(e.target.value) } : null)}
                  placeholder="留空表示无上限"
                />
              </div>
            </div>

            <Separator />

            {/* 审批阶段 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>审批阶段</Label>
                <Button onClick={addStage} size="sm" variant="secondary" className="gap-2">
                  <Plus className="h-4 w-4" />
                  添加阶段
                </Button>
              </div>

              <div className="space-y-4">
                {editingRule?.stages.map((stage, stageIndex) => (
                  <div key={stage.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">阶段 {stageIndex + 1}</Badge>
                        <Input
                          value={stage.name}
                          onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                          className="h-8 w-48"
                          placeholder="阶段名称"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={stage.type}
                          onValueChange={(value: ApprovalType) => updateStage(stage.id, { type: value })}
                        >
                          <SelectTrigger className="h-8 w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">或签</SelectItem>
                            <SelectItem value="all">会签</SelectItem>
                          </SelectContent>
                        </Select>
                        {editingRule.stages.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeStage(stage.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-500">审批人</Label>
                        <ApproverSelector
                          onSelect={(approver) => addApproverToStage(stage.id, approver)}
                          existingApprovers={stage.approvers}
                          orgUsers={orgUsers}
                          orgGroups={orgGroups}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stage.approvers.map((approver) => (
                          <div key={approver.id} className="flex items-center gap-2 bg-slate-100 rounded-full pl-2 pr-1 py-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px] bg-slate-300 text-slate-700">
                                {getInitials(approver.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-slate-700">{approver.name}</span>
                            <button
                              onClick={() => removeApproverFromStage(stage.id, approver.id)}
                              className="h-5 w-5 rounded-full hover:bg-slate-200 flex items-center justify-center"
                            >
                              <Trash2 className="h-3 w-3 text-slate-500" />
                            </button>
                          </div>
                        ))}
                        {stage.approvers.length === 0 && (
                          <span className="text-xs text-slate-400">暂未添加审批人</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingRule?.enabled || false}
                  onCheckedChange={(checked) => setEditingRule(prev => prev ? { ...prev, enabled: checked } : null)}
                />
                <Label>启用规则</Label>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveRule}>
              保存
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? '保存中...' : '保存设置'}
        </Button>
      </div>
    </div>
  );
}

// 审批人选择器组件
function ApproverSelector({ 
  onSelect, 
  existingApprovers,
  orgUsers,
  orgGroups 
}: { 
  onSelect: (approver: Approver) => void;
  existingApprovers: Approver[];
  orgUsers: any[];
  orgGroups: any[];
}) {
  const [open, setOpen] = useState(false);
  const existingIds = new Set(existingApprovers.map(a => a.id));

  const handleSelect = (approver: Approver) => {
    onSelect(approver);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1">
          <Plus className="h-3 w-3" />
          添加
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <Command>
          <CommandInput placeholder="搜索用户、用户组或角色..." />
          <CommandEmpty>未找到结果</CommandEmpty>
          
          {/* 用户 */}
          {orgUsers.length > 0 && (
            <CommandGroup heading="用户">
              {orgUsers
                .filter((u: any) => !existingIds.has(String(u.id)))
                .map((user: any) => (
                  <CommandItem 
                    key={user.id} 
                    onSelect={() => handleSelect({
                      id: String(user.id),
                      type: 'user',
                      name: user.username,
                      role: user.userGroups?.map((g: any) => g.group?.name).join(', ') || undefined
                    })}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                          {(user.username || 'U').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">{user.username}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          )}
          
          {/* 用户组 */}
          {orgGroups.length > 0 && (
            <CommandGroup heading="用户组">
              {orgGroups
                .filter((g: any) => !existingIds.has(String(g.id)))
                .map((group: any) => (
                  <CommandItem 
                    key={group.id} 
                    onSelect={() => handleSelect({
                      id: String(group.id),
                      type: 'group',
                      name: `${group.name} (${group.users?.length || 0}人)`,
                    })}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center">
                        <UsersRound className="h-3 w-3 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm">{group.name}</p>
                        <p className="text-xs text-slate-500">
                          {group.users?.length || 0} 成员
                        </p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          )}
          
          {/* 角色 */}
          <CommandGroup heading="角色">
            {mockRoles
              .filter(r => !existingIds.has(r.value))
              .map(role => (
                <CommandItem 
                  key={role.value} 
                  onSelect={() => handleSelect({
                    id: role.value,
                    type: 'role',
                    name: role.label,
                    role: '按角色'
                  })}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center">
                      <Users className="h-3 w-3 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm">{role.label}</p>
                      <p className="text-xs text-slate-500">所有此角色的用户</p>
                    </div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}