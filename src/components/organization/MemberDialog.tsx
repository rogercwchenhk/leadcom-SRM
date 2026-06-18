'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Checkbox
} from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Department, TeamMember, UserRole, ROLE_LABELS } from '@/types';

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: Department[];
  teamMembers: TeamMember[];
  editingMember: TeamMember | null;
  isAdding: boolean;
  onSave: (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const ALL_ROLES: UserRole[] = [
  'requester',
  'request_confirmer',
  'purchaser',
  'purchaser_manager',
  'customer_service',
  'approver',
  'finance',
  'supplier'
];

export function MemberDialog({
  open,
  onOpenChange,
  departments,
  teamMembers,
  editingMember,
  isAdding,
  onSave
}: MemberDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roles: [] as UserRole[],
    department: '',
    isActive: true,
    supervisorId: undefined as string | undefined,
    avatar: '',
    // 系统用户授权相关
    hasSystemAccess: false,
    systemUsername: '',
    tempPassword: ''
  });

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name,
        email: editingMember.email,
        phone: editingMember.phone || '',
        roles: editingMember.roles || [],
        department: editingMember.department || '',
        isActive: editingMember.isActive,
        supervisorId: editingMember.supervisorId,
        avatar: editingMember.avatar || '',
        hasSystemAccess: editingMember.hasSystemAccess || false,
        systemUsername: editingMember.systemUsername || editingMember.email,
        tempPassword: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        roles: [],
        department: '',
        isActive: true,
        supervisorId: undefined,
        avatar: '',
        hasSystemAccess: false,
        systemUsername: '',
        tempPassword: ''
      });
    }
  }, [editingMember]);

  // 从现有成员中提取所有部门
  const availableDepartments = useMemo(() => {
    const deptSet = new Set<string>();
    departments.forEach(dept => deptSet.add(dept.name));
    teamMembers.forEach(member => {
      if (member.department) {
        deptSet.add(member.department);
      }
    });
    return Array.from(deptSet).sort();
  }, [departments, teamMembers]);

  // 可用的上级（排除自己）
  const availableSupervisors = useMemo(() => {
    return teamMembers.filter(m => {
      if (editingMember && m.id === editingMember.id) return false;
      return m.isActive;
    });
  }, [teamMembers, editingMember]);

  // 生成随机临时密码
  const generateTempPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, tempPassword: password }));
  };

  // 当邮箱变化时自动填充系统用户名
  useEffect(() => {
    if (formData.email && !formData.systemUsername) {
      setFormData(prev => ({ ...prev, systemUsername: prev.email }));
    }
  }, [formData.email]);

  const handleRoleToggle = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {isAdding ? '新增成员' : '编辑成员'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isAdding ? '添加一个新的团队成员' : '修改团队成员信息'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="member-name" className="text-xs font-medium">姓名 *</Label>
              <Input
                id="member-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入姓名"
                className="text-xs"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="member-email" className="text-xs font-medium">邮箱 *</Label>
              <Input
                id="member-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="请输入邮箱"
                className="text-xs"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="member-phone" className="text-xs font-medium">电话</Label>
              <Input
                id="member-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入电话"
                className="text-xs"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="member-avatar" className="text-xs font-medium">头像URL</Label>
              <Input
                id="member-avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="请输入头像URL（可选）"
                className="text-xs"
              />
            </div>
          </div>

          {/* 组织信息 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="member-department" className="text-xs font-medium">部门</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="请选择部门" />
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept} className="text-xs">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="member-supervisor" className="text-xs font-medium">上级</Label>
              <Select
                value={formData.supervisorId || 'none'}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  supervisorId: value === 'none' ? undefined : value 
                })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="无上级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-xs">无上级</SelectItem>
                  {availableSupervisors.map((member) => (
                    <SelectItem key={member.id} value={member.id} className="text-xs">
                      {member.name} ({member.department || '成员'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 角色选择 */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">角色</Label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_ROLES.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={formData.roles.includes(role)}
                    onCheckedChange={() => handleRoleToggle(role)}
                  />
                  <Label
                    htmlFor={`role-${role}`}
                    className="text-xs font-normal cursor-pointer"
                  >
                    {ROLE_LABELS[role]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 状态 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium">成员状态</Label>
              <p className="text-[10px] text-slate-500">
                禁用后该成员将被标记为已离职
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          {/* 系统用户授权 */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium">系统授权</Label>
                <p className="text-[10px] text-slate-500">
                  开启后该成员可以登录系统
                </p>
              </div>
              <Switch
                checked={formData.hasSystemAccess}
                onCheckedChange={(checked) => setFormData({ 
                  ...formData, 
                  hasSystemAccess: checked,
                  systemUsername: checked ? (formData.systemUsername || formData.email) : ''
                })}
              />
            </div>

            {formData.hasSystemAccess && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="system-username" className="text-xs font-medium">系统用户名（邮箱）</Label>
                  <Input
                    id="system-username"
                    type="email"
                    value={formData.systemUsername}
                    onChange={(e) => setFormData({ ...formData, systemUsername: e.target.value })}
                    placeholder="请输入系统用户名（邮箱）"
                    className="text-xs"
                  />
                </div>

                <Card className="bg-orange-50 border-orange-200">
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-xs font-medium text-orange-900">初始密码</CardTitle>
                    <CardDescription className="text-[10px] text-orange-700">
                      生成临时密码后可通过邮箱发送给员工
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <div className="flex gap-2">
                      <Input
                        value={formData.tempPassword}
                        onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                        placeholder="点击生成临时密码"
                        className="text-xs font-mono"
                        readOnly
                      />
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={generateTempPassword}
                        className="text-xs whitespace-nowrap"
                      >
                        生成密码
                      </Button>
                    </div>
                    {formData.tempPassword && (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700">
                          密码已生成
                        </Badge>
                        <span className="text-[10px] text-slate-500">
                          请通过邮箱发送给员工
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} className="text-sm">
            取消
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!formData.name.trim() || !formData.email.trim()}
            className="text-sm"
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
