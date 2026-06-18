// 角色权限映射配置
// 定义每个业务角色对应的默认权限

import type { UserRole } from '@/types';

// 权限代码映射表
export const PERMISSION_CODES = {
  // 合同管理
  CONTRACT_VIEW: 'contract:view',
  CONTRACT_UPLOAD: 'contract:upload',
  CONTRACT_EDIT: 'contract:edit',
  CONTRACT_DELETE: 'contract:delete',
  CONTRACT_SUMMARY: 'contract:summary',
  CONTRACT_LINK: 'contract:link',

  // 需求管理
  REQUEST_VIEW: 'request:view',
  REQUEST_CREATE: 'request:create',
  REQUEST_EDIT: 'request:edit',
  REQUEST_DELETE: 'request:delete',
  REQUEST_CONFIRM: 'request:confirm',
  REQUEST_INQUIRY: 'request:inquiry',
  REQUEST_COMPARE: 'request:compare',
  REQUEST_GENERATE_PO: 'request:generate_po',

  // 采购订单管理
  PO_VIEW: 'po:view',
  PO_CREATE: 'po:create',
  PO_EDIT: 'po:edit',
  PO_DELETE: 'po:delete',
  PO_APPROVE: 'po:approve',

  // 供应商管理
  SUPPLIER_VIEW: 'supplier:view',
  SUPPLIER_CREATE: 'supplier:create',
  SUPPLIER_EDIT: 'supplier:edit',
  SUPPLIER_DELETE: 'supplier:delete',

  // 数据分析
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',

  // 团队管理
  TEAM_VIEW: 'team:view',
  TEAM_EDIT: 'team:edit',

  // 权限管理
  PERMISSION_VIEW: 'permission:view',
  PERMISSION_EDIT: 'permission:edit',
  PERMISSION_ASSIGN: 'permission:assign',

  // 审批流程
  APPROVAL_VIEW: 'approval:view',
  APPROVAL_APPROVE: 'approval:approve',
  APPROVAL_REJECT: 'approval:reject',

  // 财务管理
  FINANCE_VIEW: 'finance:view',
  FINANCE_PAYMENT: 'finance:payment',
  FINANCE_INVOICE: 'finance:invoice',

  // 供应商协作
  SUPPLIER_PORTAL_VIEW: 'supplier_portal:view',
  SUPPLIER_PORTAL_CONTRACT: 'supplier_portal:contract',
  SUPPLIER_PORTAL_SHIPMENT: 'supplier_portal:shipment',
  SUPPLIER_PORTAL_INVOICE: 'supplier_portal:invoice',
} as const;

export type PermissionCode = typeof PERMISSION_CODES[keyof typeof PERMISSION_CODES];

// 角色到权限的映射
export const ROLE_PERMISSIONS: Record<UserRole, PermissionCode[]> = {
  // 需求提出者
  requester: [
    PERMISSION_CODES.CONTRACT_VIEW,
    PERMISSION_CODES.REQUEST_VIEW,
    PERMISSION_CODES.REQUEST_CREATE,
    PERMISSION_CODES.REQUEST_EDIT,
    PERMISSION_CODES.PO_VIEW,
    PERMISSION_CODES.SUPPLIER_VIEW,
    PERMISSION_CODES.ANALYTICS_VIEW,
    PERMISSION_CODES.TEAM_VIEW,
  ],

  // 需求确认者
  request_confirmer: [
    PERMISSION_CODES.CONTRACT_VIEW,
    PERMISSION_CODES.REQUEST_VIEW,
    PERMISSION_CODES.REQUEST_CONFIRM,
    PERMISSION_CODES.REQUEST_EDIT,
    PERMISSION_CODES.PO_VIEW,
    PERMISSION_CODES.SUPPLIER_VIEW,
    PERMISSION_CODES.ANALYTICS_VIEW,
    PERMISSION_CODES.TEAM_VIEW,
  ],

  // 采购专员
  purchaser: [
    PERMISSION_CODES.CONTRACT_VIEW,
    PERMISSION_CODES.CONTRACT_UPLOAD,
    PERMISSION_CODES.CONTRACT_EDIT,
    PERMISSION_CODES.CONTRACT_SUMMARY,
    PERMISSION_CODES.CONTRACT_LINK,
    PERMISSION_CODES.REQUEST_VIEW,
    PERMISSION_CODES.REQUEST_CREATE,
    PERMISSION_CODES.REQUEST_EDIT,
    PERMISSION_CODES.REQUEST_INQUIRY,
    PERMISSION_CODES.REQUEST_COMPARE,
    PERMISSION_CODES.REQUEST_GENERATE_PO,
    PERMISSION_CODES.PO_VIEW,
    PERMISSION_CODES.PO_CREATE,
    PERMISSION_CODES.PO_EDIT,
    PERMISSION_CODES.SUPPLIER_VIEW,
    PERMISSION_CODES.SUPPLIER_CREATE,
    PERMISSION_CODES.SUPPLIER_EDIT,
    PERMISSION_CODES.ANALYTICS_VIEW,
    PERMISSION_CODES.TEAM_VIEW,
    PERMISSION_CODES.APPROVAL_VIEW,
  ],

  // 采购负责人
  purchaser_manager: [
    PERMISSION_CODES.CONTRACT_VIEW,
    PERMISSION_CODES.CONTRACT_UPLOAD,
    PERMISSION_CODES.CONTRACT_EDIT,
    PERMISSION_CODES.CONTRACT_DELETE,
    PERMISSION_CODES.CONTRACT_SUMMARY,
    PERMISSION_CODES.CONTRACT_LINK,
    PERMISSION_CODES.REQUEST_VIEW,
    PERMISSION_CODES.REQUEST_CREATE,
    PERMISSION_CODES.REQUEST_EDIT,
    PERMISSION_CODES.REQUEST_DELETE,
    PERMISSION_CODES.REQUEST_INQUIRY,
    PERMISSION_CODES.REQUEST_COMPARE,
    PERMISSION_CODES.REQUEST_GENERATE_PO,
    PERMISSION_CODES.PO_VIEW,
    PERMISSION_CODES.PO_CREATE,
    PERMISSION_CODES.PO_EDIT,
    PERMISSION_CODES.PO_DELETE,
    PERMISSION_CODES.PO_APPROVE,
    PERMISSION_CODES.SUPPLIER_VIEW,
    PERMISSION_CODES.SUPPLIER_CREATE,
    PERMISSION_CODES.SUPPLIER_EDIT,
    PERMISSION_CODES.SUPPLIER_DELETE,
    PERMISSION_CODES.ANALYTICS_VIEW,
    PERMISSION_CODES.ANALYTICS_EXPORT,
    PERMISSION_CODES.TEAM_VIEW,
    PERMISSION_CODES.TEAM_EDIT,
    PERMISSION_CODES.PERMISSION_VIEW,
    PERMISSION_CODES.PERMISSION_ASSIGN,
    PERMISSION_CODES.APPROVAL_VIEW,
    PERMISSION_CODES.APPROVAL_APPROVE,
    PERMISSION_CODES.APPROVAL_REJECT,
  ],

  // 客服
  customer_service: [
    PERMISSION_CODES.CONTRACT_VIEW,
    PERMISSION_CODES.REQUEST_VIEW,
    PERMISSION_CODES.PO_VIEW,
    PERMISSION_CODES.SUPPLIER_VIEW,
    PERMISSION_CODES.ANALYTICS_VIEW,
    PERMISSION_CODES.TEAM_VIEW,
  ],

  // 审批人员
  approver: [
    PERMISSION_CODES.CONTRACT_VIEW,
    PERMISSION_CODES.REQUEST_VIEW,
    PERMISSION_CODES.PO_VIEW,
    PERMISSION_CODES.ANALYTICS_VIEW,
    PERMISSION_CODES.TEAM_VIEW,
    PERMISSION_CODES.APPROVAL_VIEW,
    PERMISSION_CODES.APPROVAL_APPROVE,
    PERMISSION_CODES.APPROVAL_REJECT,
  ],

  // 财务
  finance: [
    PERMISSION_CODES.CONTRACT_VIEW,
    PERMISSION_CODES.REQUEST_VIEW,
    PERMISSION_CODES.PO_VIEW,
    PERMISSION_CODES.SUPPLIER_VIEW,
    PERMISSION_CODES.ANALYTICS_VIEW,
    PERMISSION_CODES.ANALYTICS_EXPORT,
    PERMISSION_CODES.TEAM_VIEW,
    PERMISSION_CODES.FINANCE_VIEW,
    PERMISSION_CODES.FINANCE_PAYMENT,
    PERMISSION_CODES.FINANCE_INVOICE,
  ],

  // 供应商
  supplier: [
    PERMISSION_CODES.SUPPLIER_PORTAL_VIEW,
    PERMISSION_CODES.SUPPLIER_PORTAL_CONTRACT,
    PERMISSION_CODES.SUPPLIER_PORTAL_SHIPMENT,
    PERMISSION_CODES.SUPPLIER_PORTAL_INVOICE,
  ],

  // 系统管理员 - 拥有所有权限
  admin: getAllPermissionCodes(),
};

// 角色名称映射
export const ROLE_LABELS: Record<UserRole, string> = {
  requester: '需求提出者',
  request_confirmer: '需求确认者',
  purchaser: '采购专员',
  purchaser_manager: '采购负责人',
  customer_service: '客服',
  approver: '审批人员',
  finance: '财务',
  supplier: '供应商',
  admin: '系统管理员',
};

// 角色描述
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  requester: '可以创建和查看采购需求，查看相关合同和订单',
  request_confirmer: '可以确认采购需求，确保需求的准确性',
  purchaser: '负责日常采购工作，包括上传合同、创建需求、对外询价等',
  purchaser_manager: '负责采购团队管理，可以审批订单、分配权限、查看分析报表',
  customer_service: '可以查看采购相关信息，协助处理客户问题',
  approver: '负责审批采购订单，确保采购合规',
  finance: '负责财务管理，处理付款和发票',
  supplier: '供应商门户权限，可以签署合同、提交发货和发票信息',
  admin: '系统超级管理员，拥有系统所有功能的访问权限',
};

// 权限分组（用于展示）
export const PERMISSION_GROUPS: {
  name: string;
  permissions: { code: PermissionCode; name: string }[];
}[] = [
  {
    name: '合同管理',
    permissions: [
      { code: PERMISSION_CODES.CONTRACT_VIEW, name: '查看合同' },
      { code: PERMISSION_CODES.CONTRACT_UPLOAD, name: '上传合同' },
      { code: PERMISSION_CODES.CONTRACT_EDIT, name: '编辑合同' },
      { code: PERMISSION_CODES.CONTRACT_DELETE, name: '删除合同' },
      { code: PERMISSION_CODES.CONTRACT_SUMMARY, name: 'AI摘要' },
      { code: PERMISSION_CODES.CONTRACT_LINK, name: '关联需求' },
    ],
  },
  {
    name: '需求管理',
    permissions: [
      { code: PERMISSION_CODES.REQUEST_VIEW, name: '查看需求' },
      { code: PERMISSION_CODES.REQUEST_CREATE, name: '创建需求' },
      { code: PERMISSION_CODES.REQUEST_EDIT, name: '编辑需求' },
      { code: PERMISSION_CODES.REQUEST_DELETE, name: '删除需求' },
      { code: PERMISSION_CODES.REQUEST_CONFIRM, name: '确认需求' },
      { code: PERMISSION_CODES.REQUEST_INQUIRY, name: '对外询价' },
      { code: PERMISSION_CODES.REQUEST_COMPARE, name: '比价分析' },
      { code: PERMISSION_CODES.REQUEST_GENERATE_PO, name: '生成PO' },
    ],
  },
  {
    name: '采购订单',
    permissions: [
      { code: PERMISSION_CODES.PO_VIEW, name: '查看订单' },
      { code: PERMISSION_CODES.PO_CREATE, name: '创建订单' },
      { code: PERMISSION_CODES.PO_EDIT, name: '编辑订单' },
      { code: PERMISSION_CODES.PO_DELETE, name: '删除订单' },
      { code: PERMISSION_CODES.PO_APPROVE, name: '审批订单' },
    ],
  },
  {
    name: '供应商管理',
    permissions: [
      { code: PERMISSION_CODES.SUPPLIER_VIEW, name: '查看供应商' },
      { code: PERMISSION_CODES.SUPPLIER_CREATE, name: '创建供应商' },
      { code: PERMISSION_CODES.SUPPLIER_EDIT, name: '编辑供应商' },
      { code: PERMISSION_CODES.SUPPLIER_DELETE, name: '删除供应商' },
    ],
  },
  {
    name: '数据分析',
    permissions: [
      { code: PERMISSION_CODES.ANALYTICS_VIEW, name: '查看分析' },
      { code: PERMISSION_CODES.ANALYTICS_EXPORT, name: '导出数据' },
    ],
  },
  {
    name: '团队管理',
    permissions: [
      { code: PERMISSION_CODES.TEAM_VIEW, name: '查看团队' },
      { code: PERMISSION_CODES.TEAM_EDIT, name: '编辑团队' },
    ],
  },
  {
    name: '权限管理',
    permissions: [
      { code: PERMISSION_CODES.PERMISSION_VIEW, name: '查看权限' },
      { code: PERMISSION_CODES.PERMISSION_EDIT, name: '编辑权限' },
      { code: PERMISSION_CODES.PERMISSION_ASSIGN, name: '分配权限' },
    ],
  },
  {
    name: '审批流程',
    permissions: [
      { code: PERMISSION_CODES.APPROVAL_VIEW, name: '查看审批' },
      { code: PERMISSION_CODES.APPROVAL_APPROVE, name: '审批通过' },
      { code: PERMISSION_CODES.APPROVAL_REJECT, name: '审批拒绝' },
    ],
  },
  {
    name: '财务管理',
    permissions: [
      { code: PERMISSION_CODES.FINANCE_VIEW, name: '查看财务' },
      { code: PERMISSION_CODES.FINANCE_PAYMENT, name: '处理付款' },
      { code: PERMISSION_CODES.FINANCE_INVOICE, name: '管理发票' },
    ],
  },
  {
    name: '供应商门户',
    permissions: [
      { code: PERMISSION_CODES.SUPPLIER_PORTAL_VIEW, name: '查看门户' },
      { code: PERMISSION_CODES.SUPPLIER_PORTAL_CONTRACT, name: '签署合同' },
      { code: PERMISSION_CODES.SUPPLIER_PORTAL_SHIPMENT, name: '提交发货' },
      { code: PERMISSION_CODES.SUPPLIER_PORTAL_INVOICE, name: '提交发票' },
    ],
  },
];

// 获取所有权限代码的工具函数
function getAllPermissionCodes(): PermissionCode[] {
  return Object.values(PERMISSION_CODES) as PermissionCode[];
}
