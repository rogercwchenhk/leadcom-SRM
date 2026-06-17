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
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import type { PurchaseRequestStatus } from '@/types';

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

export default function RequestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const requests = [
    {
      id: 'PR-2024-0120-001',
      productName: '笔记本电脑',
      specifications: '联想ThinkPad X1 Carbon',
      quantity: 5,
      status: 'draft' as PurchaseRequestStatus,
      requester: '张三',
      createdAt: '2024-01-20 10:30:00',
      budget: 50000,
    },
    {
      id: 'PR-2024-0119-002',
      productName: '打印机',
      specifications: '惠普 LaserJet Pro',
      quantity: 2,
      status: 'inquiry' as PurchaseRequestStatus,
      requester: '李四',
      createdAt: '2024-01-19 14:20:00',
      budget: 8000,
    },
    {
      id: 'PR-2024-0118-003',
      productName: '办公用纸',
      specifications: 'A4复印纸 80g',
      quantity: 100,
      status: 'pending_approval' as PurchaseRequestStatus,
      requester: '王五',
      createdAt: '2024-01-18 09:15:00',
      budget: 5000,
    },
    {
      id: 'PR-2024-0117-004',
      productName: '显示器',
      specifications: '戴尔 27英寸 4K',
      quantity: 3,
      status: 'approved' as PurchaseRequestStatus,
      requester: '赵六',
      createdAt: '2024-01-17 16:45:00',
      budget: 12000,
    },
  ];

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requester.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header - 与新建需求页面一致 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-100" aria-label="返回首页">
                <ArrowLeft className="h-5 w-5 text-slate-600" aria-hidden="true" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                采购需求
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                管理所有采购需求，查看进度和状态
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/requests/new">
              <Button className="gap-2 h-10 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-lg">
                <Plus className="h-4 w-4" />
                新建需求
              </Button>
            </Link>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="w-full max-w-6xl mx-auto">
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
                    placeholder="搜索需求ID、产品名称、申请人..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs">
                      <SelectValue placeholder="状态筛选" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="pending_confirmation">待确认</SelectItem>
                      <SelectItem value="inquiry">询价中</SelectItem>
                      <SelectItem value="quoting">报价中</SelectItem>
                      <SelectItem value="comparing">比价中</SelectItem>
                      <SelectItem value="pending_approval">待审批</SelectItem>
                      <SelectItem value="approved">已批准</SelectItem>
                      <SelectItem value="rejected">已拒绝</SelectItem>
                      <SelectItem value="po_created">PO已生成</SelectItem>
                      <SelectItem value="shipped">已发货</SelectItem>
                      <SelectItem value="invoiced">已收票</SelectItem>
                      <SelectItem value="paid">已付款</SelectItem>
                      <SelectItem value="exception">异常</SelectItem>
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
                      <TableHead className="font-semibold text-slate-700">产品名称</TableHead>
                      <TableHead className="font-semibold text-slate-700">数量</TableHead>
                      <TableHead className="font-semibold text-slate-700">申请人</TableHead>
                      <TableHead className="font-semibold text-slate-700">状态</TableHead>
                      <TableHead className="font-semibold text-slate-700">创建时间</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="text-xs font-medium text-slate-900">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-xs text-slate-600 font-medium">{request.productName}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{request.specifications}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">{request.quantity}</TableCell>
                        <TableCell className="text-xs text-slate-600">{request.requester}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[request.status].variant} className="flex items-center gap-1">
                            {statusIcons[request.status]}
                            {statusConfig[request.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-400">{request.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">
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
    </div>
  );
}
