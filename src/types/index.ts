// 核心类型定义

export type UserRole = 'requester' | 'request_confirmer' | 'purchaser' | 'approver' | 'finance' | 'supplier';

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
