// 核心类型定义

// ========== 系统设置相关类型 ==========

// 公司信息设置
export interface CompanySettings {
  name: string;
  logo: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  taxId: string;
  businessLicense: string;
}

// AI 配置设置
export interface AISettings {
  enabled: boolean;
  apiEndpoint: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  autoInquiry: boolean;
  autoDecision: boolean;
}

// 通知设置 - 单通道配置
export interface NotificationChannelConfig {
  enabled: boolean;
  address?: string;
  contractUpload: boolean;
  approvalRequired: boolean;
  approvalCompleted: boolean;
  poCreated: boolean;
  supplierResponse: boolean;
  systemAlert: boolean;
}

// 完整通知设置
export interface NotificationSettings {
  email: NotificationChannelConfig;
  inApp: NotificationChannelConfig;
  push: NotificationChannelConfig;
}

// 审批人
export interface Approver {
  id: string;
  type: 'user' | 'group' | 'role';
  name: string;
  avatar?: string;
  role?: string;
}

// 审批阶段
export type ApprovalType = 'all' | 'any'; // 会签：all，或签：any

export interface ApprovalStage {
  id: string;
  name: string;
  type: ApprovalType;
  approvers: Approver[];
}

// 审批规则
export interface ApprovalRule {
  id: number;
  name: string;
  minAmount: number;
  maxAmount: number | null; // null 表示无上限
  currency: string;
  stages: ApprovalStage[];
  enabled: boolean;
  description: string;
}

// 审批设置
export interface ApprovalSettings {
  rules: ApprovalRule[];
}

// 完整系统设置
export interface SystemSettings {
  company: CompanySettings;
  ai: AISettings;
  notification: NotificationSettings;
  approval: ApprovalSettings;
}

// ========== 权限管理相关类型 ==========

export interface UserGroupRelation {
  userId: number;
  groupId: number;
}

export interface GroupPermissionRelation {
  groupId: number;
  permissionId: number;
}

export interface UserPermissionRelation {
  userId: number;
  permissionId: number;
}

export interface UserWithGroups {
  id: number;
  username: string;
  email: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userGroups: Array<{
    group: {
      id: number;
      name: string;
    };
  }>;
}

export interface GroupWithDetails {
  id: number;
  name: string;
  description: string | null;
  parentGroupId: number | null;
  createdAt: Date;
  updatedAt: Date;
  users: Array<{ user: UserGroupRelation }>;
  permissions: Array<{ permission: GroupPermissionRelation }>;
}

export interface UserPermissionsResponse {
  permissions: Array<{
    id: number;
    name: string;
    code: string;
    description: string | null;
    parentPermissionId: number | null;
    createdAt: Date;
    source: 'direct' | 'group';
    groupName?: string;
  }>;
  allPermissions: Array<{
    id: number;
    name: string;
    code: string;
    description: string | null;
    parentPermissionId: number | null;
    createdAt: Date;
  }>;
  directPermissionIds: number[];
}

// 用户角色类型
export type UserRole = 'requester' | 'request_confirmer' | 'purchaser' | 'purchaser_manager' | 'customer_service' | 'approver' | 'finance' | 'supplier' | 'admin';

// 岗位信息
export interface Position {
  id: string;
  name: string;
  description: string;
  responsibilities: string[];
}

// 部门
export interface Department {
  id: string;
  name: string;
  description?: string;
  parentDepartmentId?: string;  // 上级部门ID
  createdAt: Date;
  updatedAt: Date;
}

// 团队成员
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  roles: UserRole[];
  position?: string;
  department?: string;
  isActive: boolean;
  supervisorId?: string;  // 上级ID
  createdAt: Date;
  updatedAt: Date;
  // 系统用户授权相关字段
  hasSystemAccess: boolean;  // 是否授权登录系统
  systemUsername?: string;  // 系统用户名（邮箱）
  tempPassword?: string;  // 临时密码（仅在创建时显示）
  passwordSentAt?: Date;  // 密码发送时间
  lastLoginAt?: Date;  // 最后登录时间
}

// ========== 销售合同相关类型 ==========

export type ContractStatus = 'draft' | 'uploaded' | 'processing' | 'summarized' | 'linked' | 'archived';

export type ContractType = 'sales' | 'purchase' | 'other';

export interface ContractItem {
  id: string;
  productName: string;
  specifications?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  deliveryDate?: Date;
  remarks?: string;
}

export interface ContractSummary {
  id: string;
  contractId: string;
  summary: string;
  keyPoints: string[];
  extractedItems: ContractItem[];
  totalAmount?: number;
  customerName?: string;
  contractDate?: Date;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesContract {
  id: string;
  contractNumber: string;
  contractType: ContractType;
  status: ContractStatus;
  customerName: string;
  customerContact?: string;
  contractDate?: Date;
  totalAmount?: number;
  currency?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  summaryId?: string;
  summary?: ContractSummary;
  linkedRequestIds?: string[];
  uploadedBy: string;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ========== 需求管理扩展类型 ==========

export type RequestSource = 'sales_contract' | 'manual';

export type RequestType = 'determined' | 'undetermined';

export interface ExternalInquiry {
  id: string;
  purchaseRequestId: string;
  supplierName?: string;
  quotedPrice?: number;
  deliveryDays?: number;
  currency?: string;
  quotedAt?: Date;
  remarks?: string;
  createdAt: Date;
}

export interface ExportPriceReference {
  id: string;
  purchaseRequestId: string;
  referencePrice: number;
  currency: string;
  priceSource: string;
  confidence: number;
  generatedAt: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierContact {
  id: string;
  name: string;
  position?: string;
  phone?: string;
  wechat?: string;
  email?: string;
  isPrimary?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  // 原有字段保持向后兼容
  contactPerson?: string;
  phone?: string;
  email?: string;
  // 新增字段
  registeredAddress?: string;
  businessLicenseNumber?: string;
  businessScope?: string;
  contacts?: SupplierContact[];
  // AI验证相关
  aiVerified?: boolean;
  aiVerificationSource?: string;
  aiVerifiedAt?: Date;
  // 原有字段
  categories: string[];
  historicalCooperationCount: number;
  averageDeliveryDays?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PurchaseRequestStatus = 
  | 'draft' 
  | 'pending_confirmation' 
  | 'inquiry' 
  | 'quoting' 
  | 'comparing' 
  | 'pending_approval' 
  | 'approved' 
  | 'rejected' 
  | 'po_created' 
  | 'shipped' 
  | 'invoiced' 
  | 'paid' 
  | 'exception';

export interface PurchaseRequest {
  id: string;
  status: PurchaseRequestStatus;
  requestSource: RequestSource;
  requestType: RequestType;
  requesterId: string;
  confirmerId?: string;
  naturalLanguageInput?: string;
  productName?: string;
  specifications?: string;
  quantity?: number;
  deliveryDate?: Date;
  budget?: number;
  aiAnalysisResult?: Record<string, any>;
  confirmedAt?: Date;
  // 关联销售合同
  salesContractId?: string;
  salesContract?: SalesContract;
  contractItemId?: string;
  // 非确定需求相关
  externalInquiries?: ExternalInquiry[];
  exportPriceReference?: ExportPriceReference;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIAnalysisResult {
  productName: string;
  specifications: string;
  quantity: number;
  deliveryDate: string;
  confidence: number;
  rawAnalysis: string;
}

export interface InquirySheet {
  id: string;
  purchaseRequestId: string;
  supplierId: string;
  publicLinkToken: string;
  status: 'pending' | 'responded' | 'expired';
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierQuote {
  id: string;
  inquirySheetId: string;
  supplierId: string;
  price: number;
  deliveryDays: number;
  remarks?: string;
  quotedAt: Date;
  createdAt: Date;
}

export interface SupplierRecommendation {
  supplier: Supplier;
  quote?: SupplierQuote;
  score: number;
  priceScore: number;
  deliveryScore: number;
  cooperationScore: number;
  reason: string;
}

export type POStatus = 
  | 'pending_signature' 
  | 'signed' 
  | 'shipped' 
  | 'delivered'
  | 'invoiced' 
  | 'paid' 
  | 'exception';

export interface POItem {
  id: string;
  purchaseOrderId: string;
  productName: string;
  specifications?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDate?: Date;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrder {
  id: string;
  purchaseRequestId: string;
  supplierId: string;
  poNumber: string;
  status: POStatus;
  items: POItem[];
  totalAmount: number;
  confirmedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Approval {
  id: string;
  purchaseRequestId: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalConfig {
  id: string;
  amountThreshold: number;
  approverId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shipment {
  id: string;
  purchaseOrderId: string;
  trackingNumber: string;
  carrier?: string;
  shippedAt?: Date;
  estimatedDelivery?: Date;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  purchaseOrderId: string;
  invoiceNumber: string;
  amount: number;
  photoUrl?: string;
  receivedAt: Date;
  createdAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod?: string;
  paidAt?: Date;
  createdAt: Date;
}

export type ExceptionType = 'return' | 'exchange';
export type ExceptionStatus = 'pending' | 'processing' | 'resolved';

export interface Exception {
  id: string;
  purchaseOrderId: string;
  type: ExceptionType;
  description?: string;
  status: ExceptionStatus;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ========== 岗位配置 ==========

// 预设岗位定义
export const PRESET_POSITIONS: Position[] = [
  {
    id: 'purchaser',
    name: '采购专员',
    description: '负责对外询价、订单跟进、收货确认到付款的整个采购闭环',
    responsibilities: [
      '对外询价和供应商沟通',
      '订单生产进度跟踪',
      '收货确认和验收',
      '付款申请和跟进',
      '供应商关系维护'
    ]
  },
  {
    id: 'purchaser_manager',
    name: '采购负责人',
    description: '负责采购团队管理和采购决策',
    responsibilities: [
      '采购团队管理和协调',
      '重要采购决策审批',
      '供应商战略管理',
      '采购流程优化',
      '跨部门协作'
    ]
  },
  {
    id: 'customer_service',
    name: '客服',
    description: '负责确认收货和提出实际确定需求',
    responsibilities: [
      '确认收货和验收反馈',
      '提出实际确定需求',
      '内部客户沟通',
      '问题反馈和跟踪',
      '需求确认和变更'
    ]
  },
  {
    id: 'requester',
    name: '需求提出者',
    description: '负责初步需求提出',
    responsibilities: [
      '初步需求提出',
      '需求描述和说明',
      '相关资料提供'
    ]
  },
  {
    id: 'request_confirmer',
    name: '需求确认者',
    description: '负责确认需求的真实性和准确性',
    responsibilities: [
      '需求真实性确认',
      '需求内容审核',
      '需求优先级评估'
    ]
  },
  {
    id: 'approver',
    name: '审批人员',
    description: '负责采购审批',
    responsibilities: [
      '采购申请审批',
      '价格合理性审核',
      '预算控制'
    ]
  },
  {
    id: 'finance',
    name: '财务',
    description: '负责付款和财务管理',
    responsibilities: [
      '付款处理',
      '财务记录',
      '预算管理',
      '发票处理'
    ]
  }
];

// 预设部门
export const PRESET_DEPARTMENTS: Department[] = [
  {
    id: 'dept-headquarters',
    name: '总部',
    description: '公司总部',
    parentDepartmentId: undefined,
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01')
  },
  {
    id: 'dept-purchase',
    name: '采购部',
    description: '负责采购相关工作',
    parentDepartmentId: 'dept-headquarters',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01')
  },
  {
    id: 'dept-customer-service',
    name: '客服部',
    description: '负责客服相关工作',
    parentDepartmentId: 'dept-headquarters',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01')
  },
  {
    id: 'dept-finance',
    name: '财务部',
    description: '负责财务相关工作',
    parentDepartmentId: 'dept-headquarters',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01')
  }
];

// 预设团队成员
export const PRESET_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    name: '梁静',
    email: 'liangjing@company.com',
    phone: '138-0000-0001',
    roles: ['purchaser'],
    position: '采购专员',
    department: '采购部',
    supervisorId: 'member-2',  // 上级是钟丽莉
    isActive: true,
    hasSystemAccess: true,
    systemUsername: 'liangjing@company.com',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-15')
  },
  {
    id: 'member-2',
    name: '钟丽莉',
    email: 'zhonglili@company.com',
    phone: '138-0000-0002',
    roles: ['purchaser_manager', 'approver'],
    position: '采购负责人',
    department: '采购部',
    supervisorId: undefined,  // 没有上级，是部门负责人
    isActive: true,
    hasSystemAccess: true,
    systemUsername: 'zhonglili@company.com',
    createdAt: new Date('2022-03-20'),
    updatedAt: new Date('2022-03-20')
  },
  {
    id: 'member-3',
    name: '客服代表',
    email: 'service@company.com',
    phone: '138-0000-0003',
    roles: ['customer_service', 'request_confirmer'],
    position: '客服',
    department: '客服部',
    supervisorId: undefined,  // 没有上级，是部门负责人
    isActive: true,
    hasSystemAccess: true,
    systemUsername: 'service@company.com',
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-09-01')
  },
  {
    id: 'member-4',
    name: '财务人员',
    email: 'finance@company.com',
    phone: '138-0000-0004',
    roles: ['finance'],
    position: '财务',
    department: '财务部',
    supervisorId: undefined,  // 没有上级，是部门负责人
    isActive: true,
    hasSystemAccess: false,
    createdAt: new Date('2022-01-10'),
    updatedAt: new Date('2022-01-10')
  }
];

// 角色显示名称映射
export const ROLE_LABELS: Record<UserRole, string> = {
  requester: '需求提出者',
  request_confirmer: '需求确认者',
  purchaser: '采购专员',
  purchaser_manager: '采购负责人',
  customer_service: '客服',
  approver: '审批人员',
  finance: '财务',
  supplier: '供应商',
  admin: '系统管理员'
};

// 角色颜色映射
export const ROLE_COLORS: Record<UserRole, string> = {
  requester: 'bg-blue-100 text-blue-700',
  request_confirmer: 'bg-cyan-100 text-cyan-700',
  purchaser: 'bg-orange-100 text-orange-700',
  purchaser_manager: 'bg-red-100 text-red-700',
  customer_service: 'bg-purple-100 text-purple-700',
  approver: 'bg-yellow-100 text-yellow-700',
  finance: 'bg-emerald-100 text-emerald-700',
  supplier: 'bg-slate-100 text-slate-700',
  admin: 'bg-slate-800 text-white'
};
