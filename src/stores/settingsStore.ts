import { create } from 'zustand';
import { 
  SystemSettings, 
  CompanySettings, 
  AISettings, 
  NotificationSettings, 
  ApprovalSettings,
  ApprovalRule
} from '@/types';

interface SettingsStore {
  // 状态
  settings: SystemSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions - 加载
  loadSettings: () => Promise<void>;
  loadSection: <T extends keyof SystemSettings>(section: T) => Promise<SystemSettings[T]>;

  // Actions - 保存
  saveSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  saveSection: <T extends keyof SystemSettings>(
    section: T, 
    data: SystemSettings[T]
  ) => Promise<void>;

  // Actions - 单个模块更新
  updateCompanySettings: (settings: Partial<CompanySettings>) => Promise<void>;
  updateAISettings: (settings: Partial<AISettings>) => Promise<void>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  updateApprovalSettings: (settings: Partial<ApprovalSettings>) => Promise<void>;
  updateApprovalRule: (rule: ApprovalRule) => Promise<void>;
  addApprovalRule: (rule: Omit<ApprovalRule, 'id'>) => Promise<void>;
  deleteApprovalRule: (ruleId: number) => Promise<void>;

  // Actions - 重置
  resetError: () => void;
  clearSettings: () => void;
}

// 默认设置
const DEFAULT_SETTINGS: SystemSettings = {
  company: {
    name: '示例科技有限公司',
    logo: '',
    website: 'https://example.com',
    phone: '400-123-4567',
    email: 'contact@example.com',
    address: '北京市朝阳区xxx街道xxx号',
    description: '一家专注于供应链管理的科技公司',
    taxId: '91110000MA001XXXX',
    businessLicense: ''
  },
  ai: {
    enabled: true,
    apiEndpoint: 'https://api.hermes-agent.example.com/v1',
    apiKey: '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: '你是一个专业的采购助手，帮助用户管理采购需求、分析供应商报价、提供决策建议。',
    autoInquiry: true,
    autoDecision: false
  },
  notification: {
    email: {
      enabled: true,
      address: 'admin@example.com',
      contractUpload: true,
      approvalRequired: true,
      approvalCompleted: true,
      poCreated: true,
      supplierResponse: true,
      systemAlert: true
    },
    inApp: {
      enabled: true,
      contractUpload: true,
      approvalRequired: true,
      approvalCompleted: true,
      poCreated: true,
      supplierResponse: true,
      systemAlert: true
    },
    push: {
      enabled: false,
      contractUpload: false,
      approvalRequired: true,
      approvalCompleted: true,
      poCreated: false,
      supplierResponse: true,
      systemAlert: true
    }
  },
  approval: {
    rules: []
  }
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  // 初始状态
  settings: null,
  isLoading: false,
  isSaving: false,
  error: null,

  // 加载所有设置
  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('加载设置失败');
      }
      const data = await response.json();
      set({ settings: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '加载设置失败',
        isLoading: false 
      });
      throw error;
    }
  },

  // 加载单个 section
  loadSection: async (section) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/settings?section=${section}`);
      if (!response.ok) {
        throw new Error(`加载 ${section} 设置失败`);
      }
      const data = await response.json();
      
      set(state => ({
        settings: state.settings 
          ? { ...state.settings, [section]: data }
          : { ...DEFAULT_SETTINGS, [section]: data },
        isLoading: false
      }));
      
      return data;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : `加载 ${section} 设置失败`,
        isLoading: false 
      });
      throw error;
    }
  },

  // 保存设置（部分更新）
  saveSettings: async (partialSettings) => {
    set({ isSaving: true, error: null });
    try {
      const currentSettings = get().settings;
      const newSettings = currentSettings 
        ? { ...currentSettings, ...partialSettings }
        : { ...DEFAULT_SETTINGS, ...partialSettings };

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });

      if (!response.ok) {
        throw new Error('保存设置失败');
      }

      set({ settings: newSettings, isSaving: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '保存设置失败',
        isSaving: false 
      });
      throw error;
    }
  },

  // 保存单个 section
  saveSection: async (section, data) => {
    set({ isSaving: true, error: null });
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data })
      });

      if (!response.ok) {
        throw new Error(`保存 ${section} 设置失败`);
      }

      set(state => ({
        settings: state.settings 
          ? { ...state.settings, [section]: data }
          : { ...DEFAULT_SETTINGS, [section]: data },
        isSaving: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : `保存 ${section} 设置失败`,
        isSaving: false 
      });
      throw error;
    }
  },

  // 更新公司设置
  updateCompanySettings: async (settings) => {
    const currentSettings = get().settings;
    const newCompanySettings = {
      ...(currentSettings?.company || DEFAULT_SETTINGS.company),
      ...settings
    };
    await get().saveSection('company', newCompanySettings);
  },

  // 更新 AI 设置
  updateAISettings: async (settings) => {
    const currentSettings = get().settings;
    const newAISettings = {
      ...(currentSettings?.ai || DEFAULT_SETTINGS.ai),
      ...settings
    };
    await get().saveSection('ai', newAISettings);
  },

  // 更新通知设置
  updateNotificationSettings: async (settings) => {
    const currentSettings = get().settings;
    const newNotificationSettings = {
      ...(currentSettings?.notification || DEFAULT_SETTINGS.notification),
      ...settings
    };
    await get().saveSection('notification', newNotificationSettings);
  },

  // 更新审批设置
  updateApprovalSettings: async (settings) => {
    const currentSettings = get().settings;
    const newApprovalSettings = {
      ...(currentSettings?.approval || DEFAULT_SETTINGS.approval),
      ...settings
    };
    await get().saveSection('approval', newApprovalSettings);
  },

  // 更新单个审批规则
  updateApprovalRule: async (rule) => {
    const currentSettings = get().settings;
    const currentRules = currentSettings?.approval?.rules || DEFAULT_SETTINGS.approval.rules;
    const newRules = currentRules.map(r => r.id === rule.id ? rule : r);
    await get().updateApprovalSettings({ rules: newRules });
  },

  // 添加审批规则
  addApprovalRule: async (rule) => {
    const currentSettings = get().settings;
    const currentRules = currentSettings?.approval?.rules || DEFAULT_SETTINGS.approval.rules;
    const newRule: ApprovalRule = {
      ...rule,
      id: Date.now()
    };
    await get().updateApprovalSettings({ rules: [...currentRules, newRule] });
  },

  // 删除审批规则
  deleteApprovalRule: async (ruleId) => {
    const currentSettings = get().settings;
    const currentRules = currentSettings?.approval?.rules || DEFAULT_SETTINGS.approval.rules;
    const newRules = currentRules.filter(r => r.id !== ruleId);
    await get().updateApprovalSettings({ rules: newRules });
  },

  // 重置错误
  resetError: () => set({ error: null }),

  // 清除设置
  clearSettings: () => set({ settings: null, error: null })
}));
