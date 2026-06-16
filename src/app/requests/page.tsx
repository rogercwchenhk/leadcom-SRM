'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
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
  Filter, 
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { PurchaseRequestStatus } from '@/types';
import { mockPurchaseRequests } from '@/lib/mock-data';

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
  draft: <ShoppingCart className="h-4 w-4" />,
  pending_confirmation: <Clock className="h-4 w-4" />,
  inquiry: <ShoppingCart className="h-4 w-4" />,
  quoting: <Clock className="h-4 w-4" />,
  comparing: <Filter className="h-4 w-4" />,
  pending_approval: <Clock className="h-4 w-4" />,
  approved: <CheckCircle2 className="h-4 w-4" />,
  rejected: <AlertCircle className="h-4 w-4" />,
  po_created: <CheckCircle2 className="h-4 w-4" />,
  shipped: <CheckCircle2 className="h-4 w-4" />,
  invoiced: <CheckCircle2 className="h-4 w-4" />,
  paid: <CheckCircle2 className="h-4 w-4" />,
  exception: <AlertCircle className="h-4 w-4" />,
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
      budget: 30000,
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
    <AppLayout initialRole="purchaser">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">采购需求</h1>
            <p className="text-muted-foreground">
              管理所有采购需求，查看进度和状态
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/requests/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                新建需求
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索需求ID、产品名称、申请人..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
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
        <Card>
          <CardHeader className="px-6">
            <CardTitle>需求列表</CardTitle>
            <CardDescription>
              共 {filteredRequests.length} 条采购需求
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>需求ID</TableHead>
                  <TableHead>产品名称</TableHead>
                  <TableHead>规格</TableHead>
                  <TableHead>数量</TableHead>
                  <TableHead>预算</TableHead>
                  <TableHead>申请人</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{request.specifications}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>¥{request.budget.toLocaleString()}</TableCell>
                    <TableCell>{request.requester}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[request.status].variant} className="gap-1">
                        {statusIcons[request.status]}
                        {statusConfig[request.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{request.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
