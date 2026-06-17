// 核心类型定义

export type UserRole = 'requester' | 'request_confirmer' | 'purchaser' | 'approver' | 'finance' | 'supplier';

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

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
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

export interface PurchaseOrder {
  id: string;
  purchaseRequestId: string;
  supplierId: string;
  poNumber: string;
  status: POStatus;
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
