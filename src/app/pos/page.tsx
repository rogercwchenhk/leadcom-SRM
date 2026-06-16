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
  FileText, 
  Plus, 
  Search, 
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  FileCheck,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import type { POStatus } from '@/types';

const statusConfig: Record<POStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending_signature: { label: '待签署', variant: 'secondary' },
  signed: { label: '已签署', variant: 'default' },
  shipped: { label: '已发货', variant: 'default' },
  delivered: { label: '已收货', variant: 'default' },
  invoiced: { label: '已收票', variant: 'default' },
  paid: { label: '已付款', variant: 'default' },
  exception: { label: '异常', variant: 'destructive' },
};

const statusIcons: Record<POStatus, React.ReactNode> = {
  pending_signature: <Clock className="h-3.5 w-3.5" />,
  signed: <CheckCircle2 className="h-3.5 w-3.5" />,
  shipped: <Truck className="h-3.5 w-3.5" />,
  delivered: <CheckCircle2 className="h-3.5 w-3.5" />,
  invoiced: <FileCheck className="h-3.5 w-3.5" />,
  paid: <CreditCard className="h-3.5 w-3.5" />,
  exception: <Clock className="h-3.5 w-3.5" />,
};

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const pos = [
    {
      id: 'PO-2024-0120-001',
      requestId: 'PR-2024-0120-001',
      productName: '笔记本电脑',
      supplier: '联想供应商',
      totalAmount: 28500,
      status: 'pending_signature' as POStatus,
      createdAt: '2024-01-20 14:30:00',
      deliveryDate: '2024-01-27',
    },
    {
      id: 'PO-2024-0119-001',
      requestId: 'PR-2024-0119-002',
      productName: '打印机',
      supplier: '惠普供应商',
      totalAmount: 7800,
      status: 'shipped' as POStatus,
      createdAt: '2024-01-19 16:45:00',
      deliveryDate: '2024-01-24',
      trackingNumber: 'SF1234567890',
    },
    {
      id: 'PO-2024-0118-001',
      requestId: 'PR-2024-0118-003',
      productName: '办公用纸',
      supplier: '得力文具',
      totalAmount: 4500,
      status: 'paid' as POStatus,
      createdAt: '2024-01-18 10:20:00',
      deliveryDate: '2024-01-20',
      paidAt: '2024-01-21 15:30:00',
    },
    {
      id: 'PO-2024-0117-001',
      requestId: 'PR-2024-0117-004',
      productName: '显示器',
      supplier: '戴尔供应商',
      totalAmount: 11200,
      status: 'invoiced' as POStatus,
      createdAt: '2024-01-17 11:30:00',
      deliveryDate: '2024-01-22',
    },
  ];

  const filteredPOs = pos.filter(po => {
    const matchesSearch = 
      po.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPOs.reduce((sum, po) => sum + po.totalAmount, 0);

  return (
    <AppLayout initialRole="purchaser">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              采购订单
            </h1>
            <p className="text-muted-foreground text-sm">
              管理所有采购订单，跟踪发货和付款
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="gap-2 h-10">
              <FileText className="h-4 w-4" />
              导出报表
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                总金额
              </CardTitle>
              <FileText className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">¥{totalAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                待签署
              </CardTitle>
              <Clock className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{pos.filter(p => p.status === 'pending_signature').length}</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                运输中
              </CardTitle>
              <Truck className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{pos.filter(p => p.status === 'shipped').length}</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                已付款
              </CardTitle>
              <CreditCard className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{pos.filter(p => p.status === 'paid').length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索PO号、产品名称、供应商..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] h-10">
                    <SelectValue placeholder="状态筛选" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending_signature">待签署</SelectItem>
                    <SelectItem value="signed">已签署</SelectItem>
                    <SelectItem value="shipped">已发货</SelectItem>
                    <SelectItem value="delivered">已收货</SelectItem>
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
        <Card className="border shadow-sm">
          <CardHeader className="px-6 pb-4">
            <CardTitle>订单列表</CardTitle>
            <CardDescription>
              共 {filteredPOs.length} 个采购订单
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pt-0">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-medium">PO号</TableHead>
                    <TableHead className="font-medium">产品名称</TableHead>
                    <TableHead className="font-medium text-muted-foreground">供应商</TableHead>
                    <TableHead className="font-medium">金额</TableHead>
                    <TableHead className="font-medium">交货日期</TableHead>
                    <TableHead className="font-medium">状态</TableHead>
                    <TableHead className="font-medium text-muted-foreground">创建时间</TableHead>
                    <TableHead className="text-right font-medium">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPOs.map((po) => (
                    <TableRow key={po.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{po.id}</TableCell>
                      <TableCell>{po.productName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{po.supplier}</TableCell>
                      <TableCell className="font-medium">¥{po.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>{po.deliveryDate}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[po.status].variant} className="gap-1 h-6 px-2.5">
                          {statusIcons[po.status]}
                          {statusConfig[po.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{po.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
    </AppLayout>
  );
}
