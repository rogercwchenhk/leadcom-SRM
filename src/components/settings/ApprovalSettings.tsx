'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, Save, Plus, Trash2, Users, AlertCircle } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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

interface ApprovalRule {
  id: number;
  name: string;
  threshold: number;
  currency: string;
  approverRole: string;
  enabled: boolean;
  description: string;
}

interface Approver {
  id: number;
  role: string;
  name: string;
}

const availableRoles = [
  { value: 'ceo', label: 'CEO' },
  { value: 'cfo', label: 'CFO' },
  { value: 'purchasing_manager', label: '采购经理' },
  { value: 'finance_manager', label: '财务经理' },
  { value: 'department_head', label: '部门负责人' },
];

export function ApprovalSettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rules, setRules] = useState<ApprovalRule[]>([]);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadApprovalRules();
  }, []);

  async function loadApprovalRules() {
    setLoading(true);
    try {
      // 模拟加载数据
      setRules([
        {
          id: 1,
          name: '小额采购',
          threshold: 10000,
          currency: 'CNY',
          approverRole: 'purchasing_manager',
          enabled: true,
          description: '1万元以下的采购订单',
        },
        {
          id: 2,
          name: '中额采购',
          threshold: 50000,
          currency: 'CNY',
          approverRole: 'finance_manager',
          enabled: true,
          description: '1万-5万元的采购订单',
        },
        {
          id: 3,
          name: '大额采购',
          threshold: 100000,
          currency: 'CNY',
          approverRole: 'cfo',
          enabled: true,
          description: '5万-10万元的采购订单',
        },
        {
          id: 4,
          name: '特大额采购',
          threshold: Infinity,
          currency: 'CNY',
          approverRole: 'ceo',
          enabled: true,
          description: '10万元以上的采购订单',
        },
      ]);
    } catch (error) {
      console.error('加载审批规则失败:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleAddRule() {
    setEditingRule({
      id: 0,
      name: '',
      threshold: 0,
      currency: 'CNY',
      approverRole: '',
      enabled: true,
      description: '',
    });
    setIsDialogOpen(true);
  }

  function handleEditRule(rule: ApprovalRule) {
    setEditingRule({ ...rule });
    setIsDialogOpen(true);
  }

  function handleDeleteRule(id: number) {
    setRules(rules.filter(r => r.id !== id));
  }

  function handleSaveRule() {
    if (!editingRule) return;
    
    if (editingRule.id === 0) {
      // 新增
      setRules([...rules, { ...editingRule, id: Date.now() }]);
    } else {
      // 更新
      setRules(rules.map(r => r.id === editingRule.id ? editingRule : r));
    }
    
    setIsDialogOpen(false);
    setEditingRule(null);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('保存成功！');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  }

  function getRoleLabel(role: string) {
    return availableRoles.find(r => r.value === role)?.label || role;
  }

  if (loading) {
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
                根据采购订单金额设置不同的审批人
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
            {rules.map((rule, index) => (
              <div key={rule.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
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
                        金额阈值: {rule.threshold === Infinity ? '无上限' : `¥${rule.threshold.toLocaleString()}`}
                      </span>
                      <span className="text-xs text-slate-500">
                        审批人: {getRoleLabel(rule.approverRole)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditRule(rule)}>
                    编辑
                  </Button>
                  {rules.length > 1 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要删除审批规则 "{rule.name}" 吗？此操作不可恢复。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteRule(rule.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            确认删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 编辑/新增对话框 */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{editingRule?.id === 0 ? '新增审批规则' : '编辑审批规则'}</AlertDialogTitle>
            <AlertDialogDescription>
              配置审批规则的金额阈值和审批人
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>规则名称 *</Label>
              <Input
                value={editingRule?.name || ''}
                onChange={(e) => setEditingRule(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="例如：小额采购"
              />
            </div>
            <div className="space-y-2">
              <Label>金额阈值 (CNY) *</Label>
              <Input
                type="number"
                value={editingRule?.threshold === Infinity ? '' : editingRule?.threshold || ''}
                onChange={(e) => setEditingRule(prev => prev ? { ...prev, threshold: e.target.value === '' ? Infinity : Number(e.target.value) } : null)}
                placeholder="留空表示无上限"
              />
            </div>
            <div className="space-y-2">
              <Label>审批角色 *</Label>
              <Select
                value={editingRule?.approverRole || ''}
                onValueChange={(value) => setEditingRule(prev => prev ? { ...prev, approverRole: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择审批角色" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>规则描述</Label>
              <Input
                value={editingRule?.description || ''}
                onChange={(e) => setEditingRule(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="简要描述此规则的适用场景"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>启用规则</Label>
                <p className="text-xs text-slate-500">禁用后此规则暂不生效</p>
              </div>
              <Switch
                checked={editingRule?.enabled || false}
                onCheckedChange={(checked) => setEditingRule(prev => prev ? { ...prev, enabled: checked } : null)}
              />
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