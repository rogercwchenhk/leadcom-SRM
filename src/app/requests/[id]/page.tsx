'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  FileText, 
  ShoppingCart,
  Calendar,
  DollarSign,
  User,
  Link2,
  TrendingUp,
  FileJson,
  Plus
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// 模拟需求详情数据
const mockRequestDetail = {
  id: 'PR-2024-0120-001',
  productName: '联想ThinkPad X1 Carbon',
  specifications: 'i7-1360P/16GB/512GB SSD/14英寸',
  quantity: 10,
  budget: 118000,
  status: 'inquiry' as const,
  requestType: 'determined' as const,
  requestSource: 'sales_contract' as const,
  requester: '张三',
  createdAt: new Date('2024-01-20 10:30:00'),
  deliveryDate: new Date('2024-02-15'),
  salesContract: {
    id: 'contract-1',
    contractNumber: 'SC-2024-0015',
    customerName: '北京科技有限公司'
  },
  exportPriceReference: {
    referencePrice: 115000,
    currency: 'CNY',
    priceSource: '市场数据分析',
    confidence: 0.85,
    generatedAt: new Date('2024-01-20 10:35:00')
  },
  externalInquiries: [
    {
      id: 'inquiry-1',
      supplierName: '诚信电子有限公司',
      quotedPrice: 116000,
      deliveryDays: 10,
      currency: 'CNY',
      quotedAt: new Date('2024-01-21 09:15:00'),
      remarks: '含原厂保修3年'
    },
    {
      id: 'inquiry-2',
      supplierName: '科技办公设备有限公司',
      quotedPrice: 114500,
      deliveryDays: 14,
      currency: 'CNY',
      quotedAt: new Date('2024-01-21 11:30:00'),
      remarks: '含鼠标和背包'
    },
    {
      id: 'inquiry-3',
      supplierName: '现代办公用品批发',
      quotedPrice: 118000,
      deliveryDays: 7,
      currency: 'CNY',
      quotedAt: new Date('2024-01-21 14:20:00'),
      remarks: '次日达'
    }
  ]
};

const statusConfig = {
  draft: { label: '草稿', color: 'bg-slate-100 text-slate-700' },
  inquiry: { label: '询价中', color: 'bg-blue-100 text-blue-700' },
  quoting: { label: '报价中', color: 'bg-orange-100 text-orange-700' },
  pending_approval: { label: '待审批', color: 'bg-purple-100 text-purple-700' },
  approved: { label: '已批准', color: 'bg-green-100 text-green-700' },
  po_created: { label: 'PO已生成', color: 'bg-emerald-100 text-emerald-700' }
};

const requestTypeConfig = {
  determined: { label: '确定需求', color: 'bg-blue-100 text-blue-700' },
  undetermined: { label: '非确定需求', color: 'bg-orange-100 text-orange-700' }
};

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const request = mockRequestDetail;

  // 按价格排序的询价
  const sortedInquiries = [...request.externalInquiries].sort((a, b) => 
    (a.quotedPrice || Infinity) - (b.quotedPrice || Infinity)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/requests">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                  {request.id}
                </h1>
                <Badge className={statusConfig[request.status].color}>
                  {statusConfig[request.status].label}
                </Badge>
                <Badge className={requestTypeConfig[request.requestType].color}>
                  {requestTypeConfig[request.requestType].label}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {request.productName}
              </p>
            </div>
          </div>
          {request.status === 'inquiry' && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              生成PO
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Request Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900">需求信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">产品名称</p>
                    <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-slate-400" />
                      {request.productName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">规格</p>
                    <p className="text-sm text-slate-600">{request.specifications}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">数量</p>
                    <p className="text-sm text-slate-600">{request.quantity} 台</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">预算</p>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      ¥{request.budget.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">期望交货</p>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {request.deliveryDate.toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">申请人</p>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {request.requester}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Linked Contract */}
            {request.salesContract && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    关联销售合同
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors"
                    onClick={() => router.push(`/contracts/${request.salesContract!.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{request.salesContract.contractNumber}</p>
                          <p className="text-sm text-slate-500">{request.salesContract.customerName}</p>
                        </div>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Export Price Reference */}
            {request.exportPriceReference && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    外销参考价格
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-emerald-700">参考价格</p>
                        <p className="text-2xl font-bold text-emerald-800">
                          ¥{request.exportPriceReference.referencePrice.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-700">价格来源</p>
                        <p className="text-sm text-emerald-700">{request.exportPriceReference.priceSource}</p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-700">置信度</p>
                        <p className="text-sm font-medium text-emerald-700">
                          {Math.round(request.exportPriceReference.confidence * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* External Inquiries */}
            {request.externalInquiries.length > 0 && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-slate-500" />
                    外部询价
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    共 {request.externalInquiries.length} 家供应商报价
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-200">
                    {sortedInquiries.map((inquiry, index) => (
                      <div 
                        key={inquiry.id}
                        className={`p-4 ${index === 0 ? 'bg-green-50' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-slate-900">{inquiry.supplierName}</p>
                              {index === 0 && (
                                <Badge className="bg-green-500">最优报价</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                              <div>
                                <p className="text-xs text-slate-500">报价</p>
                                <p className="text-sm font-semibold text-slate-900">
                                  ¥{inquiry.quotedPrice?.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">货期</p>
                                <p className="text-sm text-slate-600">{inquiry.deliveryDays} 天</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">报价时间</p>
                                <p className="text-sm text-slate-600">
                                  {inquiry.quotedAt?.toLocaleDateString('zh-CN')}
                                </p>
                              </div>
                              {inquiry.remarks && (
                                <div className="col-span-2">
                                  <p className="text-xs text-slate-500">备注</p>
                                  <p className="text-sm text-slate-600">{inquiry.remarks}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Timeline & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900">报价对比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">预算</span>
                    <span className="text-sm font-medium text-slate-900">¥{request.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">参考价</span>
                    <span className="text-sm font-medium text-emerald-600">
                      ¥{request.exportPriceReference?.referencePrice.toLocaleString()}
                    </span>
                  </div>
                  {sortedInquiries.length > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">最低报价</span>
                        <span className="text-sm font-semibold text-green-600">
                          ¥{sortedInquiries[0].quotedPrice?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">最高报价</span>
                        <span className="text-sm text-slate-600">
                          ¥{sortedInquiries[sortedInquiries.length - 1].quotedPrice?.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
