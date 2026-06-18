import { create } from 'zustand';
import { Department, TeamMember } from '@/types';

interface OrganizationStore {
  // 状态
  departments: Department[];
  teamMembers: TeamMember[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

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

  // Actions - 保存全部
  saveOrganization: () => Promise<void>;

  // Actions - 重置
  resetError: () => void;
  clearOrganization: () => void;
}

export const useOrganizationStore = create<OrganizationStore>((set, get) => ({
  // 初始状态
  departments: [],
  teamMembers: [],
  isLoading: false,
  isSaving: false,
  error: null,

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

      set({ departments: parsedDepartments, isLoading: false });
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

      set({ teamMembers: parsedTeamMembers, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '加载成员数据失败',
        isLoading: false 
      });
      throw error;
    }
  },

  // 添加部门（本地状态，调用 saveOrganization 才会持久化）
  addDepartment: async (department) => {
    const newDepartment: Department = {
      ...department,
      id: `dept-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set(state => ({
      departments: [...state.departments, newDepartment]
    }));
  },

  // 更新部门（本地状态）
  updateDepartment: async (department) => {
    set(state => ({
      departments: state.departments.map(dept => 
        dept.id === department.id 
          ? { ...department, updatedAt: new Date() }
          : dept
      )
    }));
  },

  // 删除部门（本地状态）
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
      departments: state.departments.filter(dept => dept.id !== departmentId)
    }));
  },

  // 添加成员（本地状态）
  addTeamMember: async (member) => {
    const newMember: TeamMember = {
      ...member,
      id: `member-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set(state => ({
      teamMembers: [...state.teamMembers, newMember]
    }));
  },

  // 更新成员（本地状态）
  updateTeamMember: async (member) => {
    set(state => ({
      teamMembers: state.teamMembers.map(m => 
        m.id === member.id 
          ? { ...member, updatedAt: new Date() }
          : m
      )
    }));
  },

  // 删除成员（本地状态）
  deleteTeamMember: async (memberId) => {
    set(state => ({
      teamMembers: state.teamMembers.filter(m => m.id !== memberId)
    }));
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

      set({ isSaving: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '保存组织架构数据失败',
        isSaving: false 
      });
      throw error;
    }
  },

  // 重置错误
  resetError: () => set({ error: null }),

  // 清除组织架构数据
  clearOrganization: () => set({ 
    departments: [], 
    teamMembers: [], 
    error: null 
  })
}));
