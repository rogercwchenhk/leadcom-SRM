'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  FileText, 
  Search, 
  Eye,
  Truck,
  FileCheck,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { POStatus } from '@/types';

const statusConfig: Record<POStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: '待确认', variant: 'outline' },
  confirmed: { label: '已确认', variant: 'secondary' },
  shipped: { label: '已发货', variant: 'default' },
  invoiced: { label: '已收票', variant: 'default' },
  paid: { label: '已付款', variant: 'default' },
  completed: { label: '已完成', variant: 'default' },
  cancelled: { label: '已取消', variant: 'destructive' },
};

const statusIcons: Record<POStatus, React.ReactNode> = {
  pending: <FileText className="h-4 w-4" />,
  confirmed: <CheckCircle2 className="h-4 w-4" />,
  shipped: <Truck className="h-4 w-4" />,
  invoiced: <FileCheck className="h-4 w-4" />,
  paid: <CreditCard className="h-4 w-4" />,
  completed: <CheckCircle2 className="h-4 w-4" />,
  cancelled: <CheckCircle2 className="h-4 w-4" />,
};

export default function POPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const pos = [
    {
      id: 'PO202401200001',
      purchaseRequestId: 'PR-2024-0118-003',
      supplierName: '现代办公用品批发',
      productName: '办公用纸',
      specifications: 'A4复印纸 80g',
      quantity: 100,
      totalAmount: 4800,
      status: 'pending' as POStatus,
      createdAt: '2024-01-20 11:00:00',
    },
    {
      id: 'PO202401190002',
      purchaseRequestId: 'PR-2024-0117-004',
      supplierName: '科技办公设备有限公司',
      productName: '显示器',
      specifications: '戴尔 27英寸 4K',
      quantity: 3,
      totalAmount: 11500,
      status: 'shipped' as POStatus,
      createdAt: '2024-01-19 15:30:00',
    },
    {
      id: 'PO202401180003',
      purchaseRequestId: 'PR-2024-0116-005',
      supplierName: '诚信电子有限公司',
      productName: '笔记本电脑',
      specifications: '联想ThinkPad X1 Carbon',
      quantity: 2,
      totalAmount: 24000,
      status: 'completed' as POStatus,
      createdAt: '2024-01-18 10:20:00',
    },
  ];

  const filteredPOs = pos.filter(po => 
    po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout initialRole="purchaser">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">采购订单 (PO)</h1>
            <p className="text-muted-foreground">
              管理所有采购订单，跟踪发货和付款状态
            </p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索PO编号、供应商、产品名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                待确认
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {pos.filter(p => p.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                运输中
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {pos.filter(p => p.status === 'shipped').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                待付款
              </CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {pos.filter(p => p.status === 'invoiced').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                已完成
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {pos.filter(p => p.status === 'completed' || p.status === 'paid').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="px-6">
            <CardTitle>采购订单列表</CardTitle>
            <CardDescription>
              共 {filteredPOs.length} 个采购订单
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO编号</TableHead>
                  <TableHead>供应商</TableHead>
                  <TableHead>产品名称</TableHead>
                  <TableHead>规格</TableHead>
                  <TableHead>数量</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.id}</TableCell>
                    <TableCell>{po.supplierName}</TableCell>
                    <TableCell>{po.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{po.specifications}</TableCell>
                    <TableCell>{po.quantity}</TableCell>
                    <TableCell>¥{po.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[po.status].variant} className="gap-1">
                        {statusIcons[po.status]}
                        {statusConfig[po.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{po.createdAt}</TableCell>
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
