'use client';

import React, { useState, useEffect } from 'react';
import { Users, RefreshCw, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrganization } from '@/hooks/useSettings';
import { DepartmentList } from './DepartmentList';
import { MemberList } from './MemberList';
import { DepartmentDialog } from './DepartmentDialog';
import { MemberDialog } from './MemberDialog';
import { toast } from 'sonner';

export function OrganizationSettings() {
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);

  const {
    departments,
    teamMembers,
    isLoading,
    isSaving,
    isDirty,
    error,
    initialize,
    loadOrganization,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    saveOrganization,
    resetError
  } = useOrganization();

  // 初始化加载
  useEffect(() => {
    initialize();
  }, []);

  // 错误提示
  useEffect(() => {
    if (error) {
      toast.error(error);
      resetError();
    }
  }, [error, resetError]);

  // 部门操作
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setIsAddingDepartment(true);
    setIsDepartmentDialogOpen(true);
  };

  const handleEditDepartment = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    if (dept) {
      setEditingDepartment(dept);
      setIsAddingDepartment(false);
      setIsDepartmentDialogOpen(true);
    }
  };

  const handleDeleteDepartment = async (deptId: string) => {
    try {
      await deleteDepartment(deptId);
      toast.success('部门删除成功');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败');
    }
  };

  const handleSaveDepartment = async (deptData: any) => {
    try {
      if (isAddingDepartment) {
        await addDepartment(deptData);
        toast.success('部门创建成功');
      } else if (editingDepartment) {
        await updateDepartment({ ...editingDepartment, ...deptData });
        toast.success('部门更新成功');
      }
      setIsDepartmentDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败');
    }
  };

  // 成员操作
  const handleAddMember = () => {
    setEditingMember(null);
    setIsAddingMember(true);
    setIsMemberDialogOpen(true);
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setIsAddingMember(false);
    setIsMemberDialogOpen(true);
  };

  const handleDeleteMember = async (member: any) => {
    try {
      await deleteTeamMember(member.id);
      toast.success('成员删除成功');
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleSaveMember = async (memberData: any) => {
    try {
      if (isAddingMember) {
        await addTeamMember(memberData);
        toast.success('成员创建成功');
      } else if (editingMember) {
        await updateTeamMember({ ...editingMember, ...memberData });
        toast.success('成员更新成功');
      }
      setIsMemberDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败');
    }
  };

  // 保存全部
  const handleSaveAll = async () => {
    try {
      await saveOrganization();
      toast.success('组织架构保存成功');
    } catch (error) {
      toast.error('保存失败');
    }
  };

  // 导出 YAML
  const handleExportYAML = async () => {
    try {
      const response = await fetch('/api/organization');
      if (response.ok) {
        const data = await response.json();
        
        const yamlContent = `# 组织架构配置文件
# 用途：存储公司组织架构、部门和人员信息
# 说明：此文件由系统自动管理，也可手动编辑

---
departments: ${JSON.stringify(data.departments, null, 2)}
---
teamMembers: ${JSON.stringify(data.teamMembers, null, 2)}`;

        const blob = new Blob([yamlContent], { type: 'text/yaml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'organization.yaml';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('导出成功');
      }
    } catch (error) {
      toast.error('导出失败');
    }
  };

  return (
    <div className="space-y-6">
      {/* 数据管理工具栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">组织架构设置</h2>
            {isDirty && (
              <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                未保存
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            管理公司部门、人员和组织架构 
            {!isLoading && (
              <span className="ml-2 text-xs bg-slate-100 px-2 py-1 rounded">
                部门: {departments.length} | 成员: {teamMembers.length}
              </span>
            )}
            {isDirty && (
              <span className="ml-2 text-xs text-orange-500">
                · 3秒后自动保存
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 gap-1" 
            onClick={loadOrganization}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">刷新</span>
          </Button>
          <Button 
            size="sm" 
            className={`h-9 gap-1 ${isDirty ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
            onClick={handleSaveAll}
            disabled={isLoading || isSaving}
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isSaving ? '保存中...' : isDirty ? '立即保存' : '保存'}
            </span>
            <span className="sm:hidden">
              {isSaving ? '...' : isDirty ? '保存' : ''}
            </span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-1" 
            onClick={handleExportYAML}
            disabled={isLoading}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">导出 YAML</span>
          </Button>
        </div>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-slate-600">正在加载组织架构数据...</p>
          </div>
        </div>
      )}

      {/* 主要内容 - 只显示详细列表 */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <MemberList
              teamMembers={teamMembers}
              onAddMember={handleAddMember}
              onEditMember={handleEditMember}
              onDeleteMember={handleDeleteMember}
            />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <DepartmentList
              departments={departments}
              teamMembers={teamMembers}
              onAddDepartment={handleAddDepartment}
              onEditDepartment={handleEditDepartment}
              onDeleteDepartment={handleDeleteDepartment}
            />
          </div>
        </div>
      )}

      {/* 对话框 */}
      <DepartmentDialog
        open={isDepartmentDialogOpen}
        onOpenChange={setIsDepartmentDialogOpen}
        departments={departments}
        editingDepartment={editingDepartment}
        isAdding={isAddingDepartment}
        onSave={handleSaveDepartment}
      />

      <MemberDialog
        open={isMemberDialogOpen}
        onOpenChange={setIsMemberDialogOpen}
        departments={departments}
        teamMembers={teamMembers}
        editingMember={editingMember}
        isAdding={isAddingMember}
        onSave={handleSaveMember}
      />
    </div>
  );
}
