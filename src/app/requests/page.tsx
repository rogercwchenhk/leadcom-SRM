'use client';

import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FileText,
  Link2,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PurchaseRequestStatus, RequestType, RequestSource } from '@/types';

const statusConfig: Record<PurchaseRequestStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  draft: { label: '草稿', variant: 'outline' },
  pending_confirmation: { label: '待确认', variant: 'secondary' },
  inquiry: { label: '询价中', variant: 'default' },
  quoting: { label: '报价中', variant: 'default' },
  comparing: { label: '比价中', variant: 'default' },
  pending_approval: { label: '待审批', variant: 'secondary' },
  approved: { label: '已批准', variant: 'default' },
  rejected: { label: '已拒绝', variant: 'destructive' },
  po_created: { label: 'PO已生成', variant: 'default' },
  shipped: { label: '已发货', variant: 'default' },
  invoiced: { label: '已收票', variant: 'default' },
  paid: { label: '已付款', variant: 'default' },
  exception: { label: '异常', variant: 'destructive' },
};

const statusIcons: Record<PurchaseRequestStatus, React.ReactNode> = {
  draft: <ShoppingCart className="h-3.5 w-3.5" />,
  pending_confirmation: <Clock className="h-3.5 w-3.5" />,
  inquiry: <ShoppingCart className="h-3.5 w-3.5" />,
  quoting: <Clock className="h-3.5 w-3.5" />,
  comparing: <Search className="h-3.5 w-3.5" />,
  pending_approval: <Clock className="h-3.5 w-3.5" />,
  approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  rejected: <AlertCircle className="h-3.5 w-3.5" />,
  po_created: <CheckCircle2 className="h-3.5 w-3.5" />,
  shipped: <CheckCircle2 className="h-3.5 w-3.5" />,
  invoiced: <CheckCircle2 className="h-3.5 w-3.5" />,
  paid: <CheckCircle2 className="h-3.5 w-3.5" />,
  exception: <AlertCircle className="h-3.5 w-3.5" />,
};

const requestTypeConfig: Record<RequestType, { label: string; color: string }> = {
  determined: { label: '确定需求', color: 'bg-blue-100 text-blue-700' },
  undetermined: { label: '非确定需求', color: 'bg-orange-100 text-orange-700' }
};

const requestSourceConfig: Record<RequestSource, { label: string; icon: React.ReactNode }> = {
  sales_contract: { label: '来自合同', icon: <FileText className="w-3.5 h-3.5" /> },
  manual: { label: '手动创建', icon: <Plus className="w-3.5 h-3.5" /> }
};

// 模拟需求数据
const mockRequests = [
  {
    id: 'PR-2024-0120-001',
    productName: '联想ThinkPad X1 Carbon',
    specifications: 'i7-1360P/16GB/512GB SSD',
    quantity: 10,
    status: 'inquiry' as PurchaseRequestStatus,
    requestType: 'determined' as RequestType,
    requestSource: 'sales_contract' as RequestSource,
    requester: '张三',
    createdAt: new Date('2024-01-20 10:30:00'),
    budget: 118000,
    contractNumber: 'SC-2024-0015',
    contractId: 'contract-1',
    exportPriceReference: {
      referencePrice: 115000,
      confidence: 0.85
    }
  },
  {
    id: 'PR-2024-0119-002',
    productName: '办公打印机',
    specifications: '惠普 LaserJet Pro MFP',
    quantity: 5,
    status: 'draft' as PurchaseRequestStatus,
    requestType: 'undetermined' as RequestType,
    requestSource: 'manual' as RequestSource,
    requester: '李四',
    createdAt: new Date('2024-01-19 14:20:00'),
    budget: 15000,
    exportPriceReference: {
      referencePrice: 12000,
      confidence: 0.72
    }
  },
  {
    id: 'PR-2024-0118-003',
    productName: '戴尔OptiPlex台式机',
    specifications: 'i5-13500/16GB/1TB SSD',
    quantity: 5,
    status: 'pending_approval' as PurchaseRequestStatus,
    requestType: 'determined' as RequestType,
    requestSource: 'sales_contract' as RequestSource,
    requester: '王五',
    createdAt: new Date('2024-01-18 09:15:00'),
    budget: 40000,
    contractNumber: 'SC-2024-0015',
    contractId: 'contract-1'
  },
  {
    id: 'PR-2024-0117-004',
    productName: '会议平板',
    specifications: '华为 IdeaHub 65英寸',
    quantity: 2,
    status: 'quoting' as PurchaseRequestStatus,
    requestType: 'undetermined' as RequestType,
    requestSource: 'manual' as RequestSource,
    requester: '赵六',
    createdAt: new Date('2024-01-17 16:45:00'),
    budget: 50000,
    exportPriceReference: {
      referencePrice: 45000,
      confidence: 0.68
    }
  }
];

export default function RequestsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = 
      request.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.contractNumber && request.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = typeFilter === 'all' || request.requestType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // 统计数据
  const stats = {
    total: mockRequests.length,
    determined: mockRequests.filter(r => r.requestType === 'determined').length,
    undetermined: mockRequests.filter(r => r.requestType === 'undetermined').length,
    inInquiry: mockRequests.filter(r => r.status === 'inquiry' || r.status === 'quoting').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-100" aria-label="返回首页">
                <ArrowLeft className="h-5 w-5 text-slate-600" aria-hidden="true" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                需求管理
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                管理确定需求和非确定需求，支持外部询价
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/requests/new">
              <Button variant="outline" className="gap-2 h-10 px-6 rounded-lg">
                <Plus className="h-4 w-4" />
                新建需求
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">全部需求</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">确定需求</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.determined}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">非确定需求</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.undetermined}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Search className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">询价中</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.inInquiry}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-slate-200 shadow-sm mb-4">
          <CardHeader className="pb-1 pt-2 px-4">
            <CardTitle className="text-sm font-semibold text-slate-900">筛选条件</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="search"
                  placeholder="搜索需求ID、产品名称、合同编号、申请人..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs"
                />
              </div>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px] h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs">
                    <SelectValue placeholder="需求类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="determined">确定需求</SelectItem>
                    <SelectItem value="undetermined">非确定需求</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs">
                    <SelectValue placeholder="状态筛选" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="inquiry">询价中</SelectItem>
                    <SelectItem value="quoting">报价中</SelectItem>
                    <SelectItem value="pending_approval">待审批</SelectItem>
                    <SelectItem value="approved">已批准</SelectItem>
                    <SelectItem value="po_created">PO已生成</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-1 pt-2 px-4">
            <CardTitle className="text-sm font-semibold text-slate-900">需求列表</CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              共 {filteredRequests.length} 条采购需求
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pt-0 pb-4">
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200">
                    <TableHead className="font-semibold text-slate-700">需求ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">产品信息</TableHead>
                    <TableHead className="font-semibold text-slate-700">类型/来源</TableHead>
                    <TableHead className="font-semibold text-slate-700">数量</TableHead>
                    <TableHead className="font-semibold text-slate-700">外销参考价</TableHead>
                    <TableHead className="font-semibold text-slate-700">状态</TableHead>
                    <TableHead className="font-semibold text-slate-700">创建时间</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow 
                      key={request.id} 
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/requests/${request.id}`)}
                    >
                      <TableCell className="text-xs font-medium text-slate-900">{request.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-600 font-medium">{request.productName}</p>
                          <p className="text-xs text-slate-400">{request.specifications}</p>
                          {request.contractNumber && (
                            <div className="flex items-center gap-1 text-[10px] text-blue-600">
                              <Link2 className="w-3 h-3" />
                              {request.contractNumber}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={requestTypeConfig[request.requestType].color}>
                            {requestTypeConfig[request.requestType].label}
                          </Badge>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            {requestSourceConfig[request.requestSource].icon}
                            {requestSourceConfig[request.requestSource].label}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">{request.quantity}</TableCell>
                      <TableCell>
                        {request.exportPriceReference ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                              <DollarSign className="w-3 h-3" />
                              ¥{request.exportPriceReference.referencePrice.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              置信度 {Math.round(request.exportPriceReference.confidence * 100)}%
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[request.status].variant} className="flex items-center gap-1">
                          {statusIcons[request.status]}
                          {statusConfig[request.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {request.createdAt.toLocaleDateString('zh-CN')}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100"
                          onClick={() => router.push(`/requests/${request.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
