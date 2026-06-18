import { create } from 'zustand';
import { 
  SystemSettings, 
  CompanySettings, 
  AISettings, 
  NotificationSettings, 
  ApprovalSettings,
  ApprovalRule
} from '@/types';

/**
 * 设置状态管理 Store 的接口定义
 * 
 * @interface SettingsStore
 * @description 管理系统设置的状态、加载、保存和更新操作
 */
interface SettingsStore {
  /** 当前加载的系统设置 */
  settings: SystemSettings | null;
  /** 是否正在加载设置 */
  isLoading: boolean;
  /** 是否正在保存设置 */
  isSaving: boolean;
  /** 错误信息，如果有的话 */
  error: string | null;

  /**
   * 加载所有系统设置
   * 
   * @async
   * @function loadSettings
   * @returns {Promise<void>}
   * @throws {Error} 当加载失败时抛出错误
   */
  loadSettings: () => Promise<void>;

  /**
   * 加载单个设置模块
   * 
   * @async
   * @function loadSection
   * @template T - 设置模块的键类型
   * @param {T} section - 要加载的设置模块名称
   * @returns {Promise<SystemSettings[T]>} 返回加载的设置数据
   * @throws {Error} 当加载失败时抛出错误
   */
  loadSection: <T extends keyof SystemSettings>(section: T) => Promise<SystemSettings[T]>;

  /**
   * 保存设置（部分更新）
   * 
   * @async
   * @function saveSettings
   * @param {Partial<SystemSettings>} settings - 要保存的设置部分
   * @returns {Promise<void>}
   * @throws {Error} 当保存失败时抛出错误
   */
  saveSettings: (settings: Partial<SystemSettings>) => Promise<void>;

  /**
   * 保存单个设置模块
   * 
   * @async
   * @function saveSection
   * @template T - 设置模块的键类型
   * @param {T} section - 要保存的设置模块名称
   * @param {SystemSettings[T]} data - 要保存的设置数据
   * @returns {Promise<void>}
   * @throws {Error} 当保存失败时抛出错误
   */
  saveSection: <T extends keyof SystemSettings>(
    section: T, 
    data: SystemSettings[T]
  ) => Promise<void>;

  /**
   * 更新公司设置
   * 
   * @async
   * @function updateCompanySettings
   * @param {Partial<CompanySettings>} settings - 要更新的公司设置部分
   * @returns {Promise<void>}
   * @throws {Error} 当更新失败时抛出错误
   */
  updateCompanySettings: (settings: Partial<CompanySettings>) => Promise<void>;

  /**
   * 更新 AI 设置
   * 
   * @async
   * @function updateAISettings
   * @param {Partial<AISettings>} settings - 要更新的 AI 设置部分
   * @returns {Promise<void>}
   * @throws {Error} 当更新失败时抛出错误
   */
  updateAISettings: (settings: Partial<AISettings>) => Promise<void>;

  /**
   * 更新通知设置
   * 
   * @async
   * @function updateNotificationSettings
   * @param {Partial<NotificationSettings>} settings - 要更新的通知设置部分
   * @returns {Promise<void>}
   * @throws {Error} 当更新失败时抛出错误
   */
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;

  /**
   * 更新审批设置
   * 
   * @async
   * @function updateApprovalSettings
   * @param {Partial<ApprovalSettings>} settings - 要更新的审批设置部分
   * @returns {Promise<void>}
   * @throws {Error} 当更新失败时抛出错误
   */
  updateApprovalSettings: (settings: Partial<ApprovalSettings>) => Promise<void>;

  /**
   * 更新单个审批规则
   * 
   * @async
   * @function updateApprovalRule
   * @param {ApprovalRule} rule - 要更新的审批规则
   * @returns {Promise<void>}
   * @throws {Error} 当更新失败时抛出错误
   */
  updateApprovalRule: (rule: ApprovalRule) => Promise<void>;

  /**
   * 添加新的审批规则
   * 
   * @async
   * @function addApprovalRule
   * @param {Omit<ApprovalRule, 'id'>} rule - 要添加的审批规则（不含ID）
   * @returns {Promise<void>}
   * @throws {Error} 当添加失败时抛出错误
   */
  addApprovalRule: (rule: Omit<ApprovalRule, 'id'>) => Promise<void>;

  /**
   * 删除审批规则
   * 
   * @async
   * @function deleteApprovalRule
   * @param {number} ruleId - 要删除的审批规则ID
   * @returns {Promise<void>}
   * @throws {Error} 当删除失败时抛出错误
   */
  deleteApprovalRule: (ruleId: number) => Promise<void>;

  /**
   * 重置错误状态
   * 
   * @function resetError
   * @returns {void}
   */
  resetError: () => void;

  /**
   * 清除所有设置
   * 
   * @function clearSettings
   * @returns {void}
   */
  clearSettings: () => void;
}

/**
 * 默认系统设置
 * 
 * @constant DEFAULT_SETTINGS
 * @type {SystemSettings}
 * @description 提供完整的默认设置配置
 */
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

/**
 * 设置状态管理 Store
 * 
 * @function useSettingsStore
 * @returns {SettingsStore} 设置状态管理的 store 实例
 * @example
 * ```tsx
 * const { settings, loadSettings, updateCompanySettings } = useSettingsStore();
 * 
 * // 加载设置
 * useEffect(() => {
 *   loadSettings();
 * }, []);
 * 
 * // 更新公司设置
 * const handleSave = async () => {
 *   await updateCompanySettings({ name: '新公司名' });
 * };
 * ```
 */
export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: null,
  isLoading: false,
  isSaving: false,
  error: null,

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

  updateCompanySettings: async (settings) => {
    const currentSettings = get().settings;
    const newCompanySettings = {
      ...(currentSettings?.company || DEFAULT_SETTINGS.company),
      ...settings
    };
    await get().saveSection('company', newCompanySettings);
  },

  updateAISettings: async (settings) => {
    const currentSettings = get().settings;
    const newAISettings = {
      ...(currentSettings?.ai || DEFAULT_SETTINGS.ai),
      ...settings
    };
    await get().saveSection('ai', newAISettings);
  },

  updateNotificationSettings: async (settings) => {
    const currentSettings = get().settings;
    const newNotificationSettings = {
      ...(currentSettings?.notification || DEFAULT_SETTINGS.notification),
      ...settings
    };
    await get().saveSection('notification', newNotificationSettings);
  },

  updateApprovalSettings: async (settings) => {
    const currentSettings = get().settings;
    const newApprovalSettings = {
      ...(currentSettings?.approval || DEFAULT_SETTINGS.approval),
      ...settings
    };
    await get().saveSection('approval', newApprovalSettings);
  },

  updateApprovalRule: async (rule) => {
    const currentSettings = get().settings;
    const currentRules = currentSettings?.approval?.rules || DEFAULT_SETTINGS.approval.rules;
    const newRules = currentRules.map(r => r.id === rule.id ? rule : r);
    await get().updateApprovalSettings({ rules: newRules });
  },

  addApprovalRule: async (rule) => {
    const currentSettings = get().settings;
    const currentRules = currentSettings?.approval?.rules || DEFAULT_SETTINGS.approval.rules;
    const newRule: ApprovalRule = {
      ...rule,
      id: Date.now()
    };
    await get().updateApprovalSettings({ rules: [...currentRules, newRule] });
  },

  deleteApprovalRule: async (ruleId) => {
    const currentSettings = get().settings;
    const currentRules = currentSettings?.approval?.rules || DEFAULT_SETTINGS.approval.rules;
    const newRules = currentRules.filter(r => r.id !== ruleId);
    await get().updateApprovalSettings({ rules: newRules });
  },

  resetError: () => set({ error: null }),

  clearSettings: () => set({ settings: null, error: null })
}));
