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
import { Department, TeamMember, UserRole, PRESET_POSITIONS, ROLE_LABELS } from '@/types';

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
    position: '',
    department: '',
    isActive: true,
    supervisorId: undefined as string | undefined,
    avatar: ''
  });

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name,
        email: editingMember.email,
        phone: editingMember.phone || '',
        roles: editingMember.roles || [],
        position: editingMember.position || '',
        department: editingMember.department || '',
        isActive: editingMember.isActive,
        supervisorId: editingMember.supervisorId,
        avatar: editingMember.avatar || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        roles: [],
        position: '',
        department: '',
        isActive: true,
        supervisorId: undefined,
        avatar: ''
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
          <DialogTitle>
            {isAdding ? '新增成员' : '编辑成员'}
          </DialogTitle>
          <DialogDescription>
            {isAdding ? '添加一个新的团队成员' : '修改团队成员信息'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="member-name">姓名 *</Label>
              <Input
                id="member-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入姓名"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="member-email">邮箱 *</Label>
              <Input
                id="member-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="请输入邮箱"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="member-phone">电话</Label>
              <Input
                id="member-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入电话"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="member-avatar">头像URL</Label>
              <Input
                id="member-avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="请输入头像URL（可选）"
              />
            </div>
          </div>

          {/* 组织信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="member-department">部门</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择部门" />
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="member-position">岗位</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择岗位" />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_POSITIONS.map((pos) => (
                    <SelectItem key={pos.id} value={pos.name}>
                      {pos.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="member-supervisor">上级</Label>
              <Select
                value={formData.supervisorId || 'none'}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  supervisorId: value === 'none' ? undefined : value 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="无上级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无上级</SelectItem>
                  {availableSupervisors.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.position || member.department || '成员'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 角色选择 */}
          <div className="space-y-3">
            <Label>角色</Label>
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
                    className="text-sm font-normal cursor-pointer"
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
              <Label>成员状态</Label>
              <p className="text-xs text-slate-500">
                禁用后该成员将被标记为已离职
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!formData.name.trim() || !formData.email.trim()}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
