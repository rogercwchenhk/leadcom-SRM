import { create } from 'zustand';
import { Department, TeamMember } from '@/types';

interface OrganizationStore {
  // 状态
  departments: Department[];
  teamMembers: TeamMember[];
  originalDepartments: Department[];
  originalTeamMembers: TeamMember[];
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  error: string | null;
  autoSaveTimer: NodeJS.Timeout | null;

  // Actions - 加载
  loadOrganization: () => Promise<void>;
  loadDepartments: () => Promise<void>;
  loadTeamMembers: () => Promise<void>;

  // Actions - 部门管理
  addDepartment: (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDepartment: (department: Department) => Promise<void>;
  deleteDepartment: (departmentId: string) => Promise<void>;

  // Actions - 成员管理
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTeamMember: (member: TeamMember) => Promise<void>;
  deleteTeamMember: (memberId: string) => Promise<void>;

  // Actions - 保存
  saveOrganization: () => Promise<void>;
  markAsSaved: () => void;

  // Actions - 重置
  resetError: () => void;
  clearOrganization: () => void;
}

// 深拷贝函数用于比较
const deepEqual = (a: any, b: any): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

// 防抖函数
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const useOrganizationStore = create<OrganizationStore>((set, get) => {
  // 检查是否有未保存的修改
  const checkDirty = () => {
    const { departments, teamMembers, originalDepartments, originalTeamMembers } = get();
    return !deepEqual(departments, originalDepartments) || !deepEqual(teamMembers, originalTeamMembers);
  };

  // 自动保存函数（防抖）
  const debouncedAutoSave = debounce(async () => {
    const { isDirty, saveOrganization } = get();
    if (isDirty) {
      try {
        await saveOrganization();
      } catch (error) {
        console.error('自动保存失败:', error);
      }
    }
  }, 3000); // 3秒后自动保存

  return {
    // 初始状态
    departments: [],
    teamMembers: [],
    originalDepartments: [],
    originalTeamMembers: [],
    isLoading: false,
    isSaving: false,
    isDirty: false,
    error: null,
    autoSaveTimer: null,

    // 加载组织架构全部数据
    loadOrganization: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch('/api/organization');
        if (!response.ok) {
          throw new Error('加载组织架构数据失败');
        }
        const data = await response.json();
        
        // 转换日期字符串为 Date 对象
        const parsedDepartments = (data.departments || []).map((dept: any) => ({
          ...dept,
          createdAt: new Date(dept.createdAt),
          updatedAt: new Date(dept.updatedAt)
        }));

        const parsedTeamMembers = (data.teamMembers || []).map((member: any) => ({
          ...member,
          roles: member.roles || [],
          joinDate: new Date(member.joinDate),
          createdAt: new Date(member.createdAt),
          updatedAt: new Date(member.updatedAt)
        }));

        set({ 
          departments: parsedDepartments,
          teamMembers: parsedTeamMembers,
          originalDepartments: parsedDepartments,
          originalTeamMembers: parsedTeamMembers,
          isDirty: false,
          isLoading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '加载组织架构数据失败',
          isLoading: false 
        });
        throw error;
      }
    },

    // 仅加载部门
    loadDepartments: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch('/api/organization');
        if (!response.ok) {
          throw new Error('加载部门数据失败');
        }
        const data = await response.json();
        
        const parsedDepartments = (data.departments || []).map((dept: any) => ({
          ...dept,
          createdAt: new Date(dept.createdAt),
          updatedAt: new Date(dept.updatedAt)
        }));

        set({ 
          departments: parsedDepartments, 
          originalDepartments: parsedDepartments,
          isDirty: false,
          isLoading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '加载部门数据失败',
          isLoading: false 
        });
        throw error;
      }
    },

    // 仅加载成员
    loadTeamMembers: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch('/api/organization');
        if (!response.ok) {
          throw new Error('加载成员数据失败');
        }
        const data = await response.json();
        
        const parsedTeamMembers = (data.teamMembers || []).map((member: any) => ({
          ...member,
          roles: member.roles || [],
          joinDate: new Date(member.joinDate),
          createdAt: new Date(member.createdAt),
          updatedAt: new Date(member.updatedAt)
        }));

        set({ 
          teamMembers: parsedTeamMembers, 
          originalTeamMembers: parsedTeamMembers,
          isDirty: false,
          isLoading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '加载成员数据失败',
          isLoading: false 
        });
        throw error;
      }
    },

    // 添加部门
    addDepartment: async (department) => {
      const newDepartment: Department = {
        ...department,
        id: `dept-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      set(state => ({
        departments: [...state.departments, newDepartment],
        isDirty: true
      }));
      
      debouncedAutoSave();
    },

    // 更新部门
    updateDepartment: async (department) => {
      set(state => ({
        departments: state.departments.map(dept => 
          dept.id === department.id 
            ? { ...department, updatedAt: new Date() }
            : dept
        ),
        isDirty: true
      }));
      
      debouncedAutoSave();
    },

    // 删除部门
    deleteDepartment: async (departmentId) => {
      // 检查该部门下是否有成员
      const hasMembers = get().teamMembers.some(m => {
        const dept = get().departments.find(d => d.id === departmentId);
        return dept && m.department === dept.name;
      });
      
      if (hasMembers) {
        throw new Error('该部门下还有成员，无法删除');
      }

      // 检查该部门下是否有子部门
      const hasChildDepts = get().departments.some(d => d.parentDepartmentId === departmentId);
      if (hasChildDepts) {
        throw new Error('该部门下还有子部门，无法删除');
      }

      set(state => ({
        departments: state.departments.filter(dept => dept.id !== departmentId),
        isDirty: true
      }));
      
      debouncedAutoSave();
    },

    // 添加成员
    addTeamMember: async (member) => {
      const newMember: TeamMember = {
        ...member,
        id: `member-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      set(state => ({
        teamMembers: [...state.teamMembers, newMember],
        isDirty: true
      }));
      
      debouncedAutoSave();
    },

    // 更新成员
    updateTeamMember: async (member) => {
      set(state => ({
        teamMembers: state.teamMembers.map(m => 
          m.id === member.id 
            ? { ...member, updatedAt: new Date() }
            : m
        ),
        isDirty: true
      }));
      
      debouncedAutoSave();
    },

    // 删除成员
    deleteTeamMember: async (memberId) => {
      set(state => ({
        teamMembers: state.teamMembers.filter(m => m.id !== memberId),
        isDirty: true
      }));
      
      debouncedAutoSave();
    },

    // 保存全部数据到后端
    saveOrganization: async () => {
      set({ isSaving: true, error: null });
      try {
        const { departments, teamMembers } = get();
        
        const response = await fetch('/api/organization', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ departments, teamMembers })
        });

        if (!response.ok) {
          throw new Error('保存组织架构数据失败');
        }

        // 标记为已保存
        get().markAsSaved();
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '保存组织架构数据失败',
          isSaving: false 
        });
        throw error;
      }
    },

    // 标记为已保存
    markAsSaved: () => {
      set(state => ({
        originalDepartments: [...state.departments],
        originalTeamMembers: [...state.teamMembers],
        isDirty: false,
        isSaving: false
      }));
    },

    // 重置错误
    resetError: () => set({ error: null }),

    // 清除组织架构数据
    clearOrganization: () => set({ 
      departments: [], 
      teamMembers: [], 
      originalDepartments: [],
      originalTeamMembers: [],
      isDirty: false,
      error: null 
    })
  };
});
