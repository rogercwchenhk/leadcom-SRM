/**
 * Hermes Agent - AI 服务工具函数
 */

// 生成询价单公开链接 token
export function generateInquiryToken(): string {
  return `inq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 生成 PO 编号
export function generatePONumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PO${dateStr}${random}`;
}
