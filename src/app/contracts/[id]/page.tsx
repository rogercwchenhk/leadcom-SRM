'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  ArrowLeft, 
  Calendar, 
  DollarSign,
  User,
  ShoppingCart,
  Sparkles,
  FileJson,
  Link2
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

// 模拟合同详情数据
const mockContractDetail = {
  id: 'contract-1',
  contractNumber: 'SC-2024-0015',
  customerName: '北京科技有限公司',
  customerContact: '张经理',
  contractDate: new Date('2024-01-15'),
  deliveryDate: new Date('2024-02-15'),
  totalAmount: 158000,
  status: 'summarized' as const,
  pdfUrl: '#',
  summary: {
    summary: '这是一份关于办公设备采购的销售合同，包含笔记本电脑和台式机的采购。合同总金额为158,000元，约定于2024年2月15日前交货。',
    keyPoints: [
      '采购10台联想ThinkPad X1 Carbon笔记本电脑',
      '采购5台戴尔OptiPlex台式电脑',
      '合同总金额：158,000元',
      '交货日期：2024年2月15日',
      '付款方式：货到验收合格后30天内付款'
    ]
  },
  items: [
    {
      id: 'item-1',
      productName: '联想ThinkPad X1 Carbon',
      specifications: 'i7-1360P/16GB/512GB SSD/14英寸',
      quantity: 10,
      unitPrice: 11800,
      totalPrice: 118000,
      deliveryDate: new Date('2024-02-10')
    },
    {
      id: 'item-2',
      productName: '戴尔OptiPlex 7010',
      specifications: 'i5-13500/16GB/1TB SSD/23.8英寸显示器',
      quantity: 5,
      unitPrice: 8000,
      totalPrice: 40000,
      deliveryDate: new Date('2024-02-10')
    }
  ],
  linkedRequests: [
    {
      id: 'pr-101',
      title: '联想笔记本电脑采购需求',
      status: 'inquiry' as const,
      createdAt: new Date('2024-01-16')
    }
  ]
};

const statusConfig = {
  draft: { label: '草稿', color: 'bg-slate-100 text-slate-700' },
  uploaded: { label: '已上传', color: 'bg-blue-100 text-blue-700' },
  processing: { label: '处理中', color: 'bg-orange-100 text-orange-700' },
  summarized: { label: '已摘要', color: 'bg-green-100 text-green-700' },
  linked: { label: '已关联', color: 'bg-emerald-100 text-emerald-700' },
  archived: { label: '已归档', color: 'bg-slate-100 text-slate-600' }
};

export default function ContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contract = mockContractDetail;
  const status = statusConfig[contract.status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                  {contract.contractNumber}
                </h1>
                <Badge className={status.color}>
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {contract.customerName}
              </p>
            </div>
          </div>
          <Button onClick={() => router.push(`/requests/new?contractId=${contract.id}`)}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            创建需求
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contract Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900">基本信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">客户名称</p>
                    <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {contract.customerName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">联系人</p>
                    <p className="text-sm text-slate-600">{contract.customerContact}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">签订日期</p>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {contract.contractDate.toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">约定交货</p>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {contract.deliveryDate.toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs text-slate-500">合同金额</p>
                    <p className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      ¥{contract.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Summary Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    AI合同摘要
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    自动生成
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {contract.summary.summary}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-900 mb-2">关键要点</h4>
                  <ul className="space-y-2">
                    {contract.summary.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contract Items Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-slate-500" />
                  合同明细
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">产品名称</th>
                        <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">规格</th>
                        <th className="text-center text-xs font-medium text-slate-500 px-4 py-3">数量</th>
                        <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">单价</th>
                        <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">小计</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {contract.items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-slate-900">{item.productName}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-slate-500">{item.specifications}</p>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <p className="text-sm text-slate-600">{item.quantity}</p>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <p className="text-sm text-slate-600">¥{item.unitPrice?.toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <p className="text-sm font-medium text-slate-900">¥{item.totalPrice?.toLocaleString()}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-right">
                          <p className="text-sm font-medium text-slate-900">总计</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm font-semibold text-emerald-600">
                            ¥{contract.totalAmount.toLocaleString()}
                          </p>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* PDF Preview Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  合同文件
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">PDF预览</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 border-slate-200">
                  下载PDF
                </Button>
              </CardContent>
            </Card>

            {/* Linked Requests */}
            {contract.linkedRequests.length > 0 && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-slate-500" />
                    关联需求
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-200">
                    {contract.linkedRequests.map((request) => (
                      <div 
                        key={request.id}
                        className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/requests/${request.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {request.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {request.createdAt.toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                          <Badge className="flex-shrink-0 ml-2 bg-blue-100 text-blue-700">
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
