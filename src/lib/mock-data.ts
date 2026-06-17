import { 
  User, 
  Supplier, 
  PurchaseRequest, 
  PurchaseOrder,
  ApprovalConfig,
  UserRole
} from '@/types';

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: '张三',
    email: 'zhangsan@company.com',
    role: 'requester',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-2',
    name: '李四',
    email: 'lisi@company.com',
    role: 'purchaser',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-3',
    name: '王五',
    email: 'wangwu@company.com',
    role: 'approver',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-4',
    name: '赵六',
    email: 'zhaoliu@company.com',
    role: 'finance',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// 模拟供应商数据
export const mockSuppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: '诚信电子有限公司',
    registeredAddress: '北京市朝阳区建国路88号',
    businessLicenseNumber: '91110000MA00ABC123',
    businessScope: '技术开发、技术咨询、技术服务；销售电子产品、计算机软硬件及辅助设备',
    contacts: [
      {
        id: 'contact-1',
        name: '陈经理',
        position: '销售总监',
        phone: '13800138001',
        wechat: 'chen_chengxin',
        email: 'chen@chengxin.com',
        isPrimary: true
      }
    ],
    categories: ['电脑', '笔记本', '电子设备', '办公外设'],
    historicalCooperationCount: 15,
    averageDeliveryDays: 5,
    aiVerified: true,
    aiVerificationSource: '企查查',
    aiVerifiedAt: new Date('2024-01-01'),
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'supplier-2',
    name: '科技办公设备有限公司',
    registeredAddress: '上海市浦东新区张江高科技园区创业路288号',
    businessLicenseNumber: '91310000MA00DEF456',
    businessScope: '办公用品、文具用品、日用百货的销售；商务信息咨询',
    contacts: [
      {
        id: 'contact-2',
        name: '刘总',
        position: '总经理',
        phone: '13800138002',
        wechat: 'liu_techoffice',
        email: 'liu@techoffice.com',
        isPrimary: true
      }
    ],
    categories: ['打印机', '显示器', '办公设备', '办公用纸'],
    historicalCooperationCount: 8,
    averageDeliveryDays: 7,
    aiVerified: false,
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'supplier-3',
    name: '现代办公用品批发',
    registeredAddress: '广州市天河区天河路385号',
    businessLicenseNumber: '91440100MA00GHI789',
    businessScope: '办公用品、文具用品批发零售；国内贸易',
    contacts: [
      {
        id: 'contact-3',
        name: '周小姐',
        position: '销售经理',
        phone: '13800138003',
        wechat: 'zhou_modern',
        email: 'zhou@modernoffice.com',
        isPrimary: true
      }
    ],
    categories: ['办公用纸', '办公外设', '文具'],
    historicalCooperationCount: 22,
    averageDeliveryDays: 3,
    aiVerified: true,
    aiVerificationSource: '企查查',
    aiVerifiedAt: new Date('2023-12-01'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'supplier-4',
    name: '数码科技有限公司',
    registeredAddress: '深圳市南山区科技园南区A座15层',
    businessLicenseNumber: '91440300MA00JKL012',
    businessScope: '电子设备、通讯设备的生产与销售；国内贸易；货物及技术进出口',
    contacts: [
      {
        id: 'contact-4',
        name: '吴先生',
        position: '商务总监',
        phone: '13800138004',
        wechat: 'wu_digital',
        email: 'wu@digitaltech.com',
        isPrimary: true
      }
    ],
    categories: ['电脑', '笔记本', '电子设备'],
    historicalCooperationCount: 3,
    averageDeliveryDays: 10,
    aiVerified: false,
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2024-01-05')
  }
];

// 模拟审批配置
export const mockApprovalConfigs: ApprovalConfig[] = [
  {
    id: 'config-1',
    amountThreshold: 10000,
    approverId: 'user-3',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// 模拟采购需求
export const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: 'pr-1',
    status: 'draft',
    requestSource: 'manual',
    requestType: 'undetermined',
    requesterId: 'user-1',
    naturalLanguageInput: '我需要采购5台联想笔记本电脑，用于新员工入职，预算大概3万元，希望一周内能到货',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

// 模拟采购订单
export const mockPurchaseOrders: PurchaseOrder[] = [];

// 获取当前用户（模拟）
export function getCurrentUser(role?: UserRole): User {
  if (role) {
    return mockUsers.find(u => u.role === role) || mockUsers[0];
  }
  return mockUsers[0];
}

// 根据ID获取用户
export function getUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id);
}

// 根据ID获取供应商
export function getSupplierById(id: string): Supplier | undefined {
  return mockSuppliers.find(s => s.id === id);
}
