'use client';

import React, { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Department } from '@/types';

interface DepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: Department[];
  editingDepartment: Department | null;
  isAdding: boolean;
  onSave: (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function DepartmentDialog({
  open,
  onOpenChange,
  departments,
  editingDepartment,
  isAdding,
  onSave
}: DepartmentDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentDepartmentId: undefined as string | undefined
  });

  useEffect(() => {
    if (editingDepartment) {
      setFormData({
        name: editingDepartment.name,
        description: editingDepartment.description || '',
        parentDepartmentId: editingDepartment.parentDepartmentId
      });
    } else {
      setFormData({
        name: '',
        description: '',
        parentDepartmentId: undefined
      });
    }
  }, [editingDepartment]);

  const handleSave = () => {
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  // 检查是否会造成循环引用
  const checkCycle = (parentId: string, currentId: string): boolean => {
    const visited = new Set<string>();
    let checkId: string | undefined = parentId;
    
    while (checkId) {
      if (checkId === currentId) return true;
      if (visited.has(checkId)) return true;
      visited.add(checkId);
      const dept = departments.find(d => d.id === checkId);
      checkId = dept?.parentDepartmentId;
    }
    
    return false;
  };

  const availableParentDepartments = departments.filter(dept => {
    if (!editingDepartment) return true;
    if (dept.id === editingDepartment.id) return false;
    if (formData.parentDepartmentId && 
        checkCycle(formData.parentDepartmentId, editingDepartment.id)) {
      return false;
    }
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {isAdding ? '新增部门' : '编辑部门'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isAdding ? '创建一个新的部门' : '修改部门信息'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="department-name" className="text-xs font-medium">部门名称 *</Label>
            <Input
              id="department-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入部门名称"
              className="text-xs"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="department-description" className="text-xs font-medium">部门描述</Label>
            <Textarea
              id="department-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="请输入部门描述（可选）"
              rows={3}
              className="text-xs"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="parent-department" className="text-xs font-medium">上级部门</Label>
            <Select
              value={formData.parentDepartmentId || 'none'}
              onValueChange={(value) => setFormData({ 
                ...formData, 
                parentDepartmentId: value === 'none' ? undefined : value 
              })}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="无（顶级部门）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="text-xs">无（顶级部门）</SelectItem>
                {availableParentDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id} className="text-xs">
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} className="text-sm">
            取消
          </Button>
          <Button onClick={handleSave} disabled={!formData.name.trim()} className="text-sm">
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
