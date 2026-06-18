'use client';

import { useSettingsStore } from '@/stores/settingsStore';
import { useOrganizationStore } from '@/stores/organizationStore';
import { useEffect } from 'react';

// 简化版的设置 Hook，提供常用操作
export function useSettings() {
  const {
    settings,
    isLoading,
    isSaving,
    error,
    loadSettings,
    loadSection,
    saveSettings,
    saveSection,
    updateCompanySettings,
    updateAISettings,
    updateNotificationSettings,
    updateApprovalSettings,
    resetError
  } = useSettingsStore();

  // 初始化加载（可选）
  const initialize = async () => {
    if (!settings && !isLoading) {
      try {
        await loadSettings();
      } catch {
        // 错误已在 store 中处理
      }
    }
  };

  return {
    // 状态
    settings,
    isLoading,
    isSaving,
    error,
    
    // 公司设置
    companySettings: settings?.company,
    
    // AI 设置
    aiSettings: settings?.ai,
    
    // 通知设置
    notificationSettings: settings?.notification,
    
    // 审批设置
    approvalSettings: settings?.approval,
    
    // Actions
    initialize,
    loadSettings,
    loadSection,
    saveSettings,
    saveSection,
    updateCompanySettings,
    updateAISettings,
    updateNotificationSettings,
    updateApprovalSettings,
    resetError
  };
}

// 组织架构 Hook
export function useOrganization() {
  const {
    departments,
    teamMembers,
    isLoading,
    isSaving,
    isDirty,
    error,
    loadOrganization,
    loadDepartments,
    loadTeamMembers,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    saveOrganization,
    resetError
  } = useOrganizationStore();

  // 初始化加载（可选）
  const initialize = async () => {
    if (departments.length === 0 && teamMembers.length === 0 && !isLoading) {
      try {
        await loadOrganization();
      } catch {
        // 错误已在 store 中处理
      }
    }
  };

  // 计算属性：部门树形结构
  const departmentTree = () => {
    // 使用简单的迭代方法避免递归类型问题
    const result: Array<{ dept: typeof departments[0]; level: number }> = [];
    
    // 先处理顶级部门
    const topLevelDepts = departments.filter(d => !d.parentDepartmentId);
    
    // 使用队列进行广度优先遍历
    const queue: Array<{ dept: typeof departments[0]; level: number }> = 
      topLevelDepts.map(dept => ({ dept, level: 0 }));
    
    while (queue.length > 0) {
      const { dept, level } = queue.shift()!;
      result.push({ dept, level });
      
      // 添加子部门到队列
      const children = departments.filter(d => d.parentDepartmentId === dept.id);
      children.forEach(child => {
        queue.push({ dept: child, level: level + 1 });
      });
    }
    
    return result;
  };

  // 获取某个部门的成员数量
  const getDepartmentMemberCount = (departmentName: string) => {
    return teamMembers.filter(m => m.department === departmentName).length;
  };

  // 获取成员的上级
  const getMemberSupervisor = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member?.supervisorId) return null;
    return teamMembers.find(m => m.id === member.supervisorId);
  };

  // 获取成员的下属
  const getMemberSubordinates = (memberId: string) => {
    return teamMembers.filter(m => m.supervisorId === memberId);
  };

  return {
    // 状态
    departments,
    teamMembers,
    isLoading,
    isSaving,
    isDirty,
    error,
    
    // 计算属性
    departmentTree,
    getDepartmentMemberCount,
    getMemberSupervisor,
    getMemberSubordinates,
    
    // Actions
    initialize,
    loadOrganization,
    loadDepartments,
    loadTeamMembers,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    saveOrganization,
    resetError
  };
}

// 自动初始化 Hook（在组件挂载时自动加载数据）
export function useAutoInitializeSettings() {
  const { initialize, isLoading } = useSettings();
  
  useEffect(() => {
    initialize();
  }, []);
  
  return { isLoading };
}

export function useAutoInitializeOrganization() {
  const { initialize, isLoading } = useOrganization();
  
  useEffect(() => {
    initialize();
  }, []);
  
  return { isLoading };
}
