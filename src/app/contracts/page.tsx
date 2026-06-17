'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Calendar, 
  DollarSign,
  ArrowRight,
  Search,
  Filter,
  Clock,
  CheckCircle,
  FileJson
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';

// 模拟合同数据
const mockContracts = [
  {
    id: 'contract-1',
    contractNumber: 'SC-2024-0015',
    customerName: '北京科技有限公司',
    contractDate: new Date('2024-01-15'),
    totalAmount: 158000,
    status: 'summarized' as const,
    summary: '包含10台笔记本电脑和5台台式机的采购合同'
  },
  {
    id: 'contract-2',
    contractNumber: 'SC-2024-0014',
    customerName: '上海贸易集团',
    contractDate: new Date('2024-01-12'),
    totalAmount: 286500,
    status: 'linked' as const,
    summary: '办公设备年度框架协议'
  },
  {
    id: 'contract-3',
    contractNumber: 'SC-2024-0013',
    customerName: '深圳电子公司',
    contractDate: new Date('2024-01-10'),
    totalAmount: 89600,
    status: 'processing' as const,
    summary: ''
  }
];

const statusConfig = {
  draft: { label: '草稿', color: 'bg-slate-100 text-slate-700' },
  uploaded: { label: '已上传', color: 'bg-blue-100 text-blue-700' },
  processing: { label: '处理中', color: 'bg-orange-100 text-orange-700', icon: Clock },
  summarized: { label: '已摘要', color: 'bg-green-100 text-green-700', icon: FileJson },
  linked: { label: '已关联', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  archived: { label: '已归档', color: 'bg-slate-100 text-slate-600' }
};

export default function ContractsPage() {
  const router = useRouter();

  return (
    <AppLayout initialRole="purchaser">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              合同管理
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              销售合同上传与AI智能摘要
            </p>
          </div>
          <Button onClick={() => router.push('/contracts/new')}>
            <Plus className="w-4 h-4 mr-2" />
            上传合同
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-1 pt-2 px-4">
              <CardTitle className="text-sm font-semibold text-slate-900">实时指标</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border bg-blue-50 border-slate-200 hover:border-slate-300 transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900 leading-none">156</div>
                    <div className="text-xs text-slate-500 mt-1">合同总数</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl border bg-green-50 border-slate-200 hover:border-slate-300 transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <Plus className="w-5 h-5 text-green-600" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900 leading-none">8</div>
                    <div className="text-xs text-slate-500 mt-1">本月新增</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl border bg-orange-50 border-slate-200 hover:border-slate-300 transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <Clock className="w-5 h-5 text-orange-600" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900 leading-none">3</div>
                    <div className="text-xs text-slate-500 mt-1">处理中</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl border bg-emerald-50 border-slate-200 hover:border-slate-300 transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900 leading-none">¥2.3M</div>
                    <div className="text-xs text-slate-500 mt-1">本月金额</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter & Search */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardHeader className="pb-1 pt-2 px-4">
            <CardTitle className="text-sm font-semibold text-slate-900">筛选搜索</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索合同编号、客户名称..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
              <Button variant="outline" className="border-slate-200 h-10">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contract List */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-1 pt-2 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-900">合同列表</CardTitle>
            <span className="text-xs text-slate-500">共 {mockContracts.length} 份合同</span>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="space-y-1.5">
              {mockContracts.map((contract) => {
                const status = statusConfig[contract.status];
                const StatusIcon = status.icon;
                return (
                  <div 
                    key={contract.id}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => router.push(`/contracts/${contract.id}`)}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 text-slate-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-900">
                            {contract.contractNumber}
                          </span>
                          <Badge className={status.color} variant="secondary">
                            {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                            {status.label}
                          </Badge>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">
                        {contract.customerName}
                      </p>
                      {contract.summary && (
                        <p className="text-xs text-slate-500 mt-1">
                          {contract.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {contract.contractDate.toLocaleDateString('zh-CN')}
                        </span>
                        {contract.totalAmount && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ¥{contract.totalAmount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AppLayout>
  );
}
