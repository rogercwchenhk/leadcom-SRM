'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  FileText, 
  Package, 
  Truck, 
  Receipt, 
  DollarSign, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Upload,
  Eye,
  Calendar,
  Building2,
  User,
  MessageCircle,
  Scan,
  FileImage,
  CreditCard,
  History
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { POStatus } from '@/types';
import { SupplierLayout } from '@/components/layout/SupplierLayout';

const statusConfig: Record<POStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending_signature: { label: '待签署', variant: 'secondary' },
  signed: { label: '已签署', variant: 'default' },
  shipped: { label: '已发货', variant: 'default' },
  delivered: { label: '已收货', variant: 'default' },
  invoiced: { label: '已收票', variant: 'default' },
  paid: { label: '已付款', variant: 'default' },
  exception: { label: '异常', variant: 'destructive' },
};

interface SupplierOrder {
  id: string;
  poNumber: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: POStatus;
  createdAt: string;
  deliveryDate: string;
  customerName: string;
  specifications?: string;
  trackingNumber?: string;
  invoiceNumber?: string;
  invoicePhotoUrl?: string;
  paymentStatus?: 'pending' | 'paid';
  paidAt?: string;
}

export default function SupplierPortalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);
  const [isShipDialogOpen, setIsShipDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoicePhoto, setInvoicePhoto] = useState<File | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isShipping, setIsShipping] = useState(false);
  const [isInvoicing, setIsInvoicing] = useState(false);

  const [orders, setOrders] = useState<SupplierOrder[]>([
    {
      id: 'po-001',
      poNumber: 'PO-2024-0120-001',
      productName: '联想ThinkPad X1 Carbon',
      quantity: 5,
      unitPrice: 5700,
      totalAmount: 28500,
      status: 'pending_signature',
      createdAt: '2024-01-20 14:30:00',
      deliveryDate: '2024-01-27',
      customerName: '北京科技发展有限公司',
      specifications: '配置：i7-1360P, 16GB RAM, 512GB SSD',
    },
    {
      id: 'po-002',
      poNumber: 'PO-2024-0115-003',
      productName: '戴尔显示器 U2720Q',
      quantity: 3,
      unitPrice: 4800,
      totalAmount: 14400,
      status: 'signed',
      createdAt: '2024-01-15 10:20:00',
      deliveryDate: '2024-01-22',
      customerName: '北京科技发展有限公司',
      specifications: '27英寸 4K分辨率',
    },
    {
      id: 'po-003',
      poNumber: 'PO-2024-0110-008',
      productName: '罗技无线键盘鼠标套装',
      quantity: 20,
      unitPrice: 480,
      totalAmount: 9600,
      status: 'shipped',
      createdAt: '2024-01-10 16:45:00',
      deliveryDate: '2024-01-15',
      customerName: '上海办公用品供应商',
      specifications: 'MK275 黑色',
      trackingNumber: 'SF1234567890',
    },
    {
      id: 'po-004',
      poNumber: 'PO-2024-0119-002',
      productName: 'A4复印纸 80g',
      quantity: 100,
      unitPrice: 45,
      totalAmount: 4500,
      status: 'delivered',
      createdAt: '2024-01-19 09:30:00',
      deliveryDate: '2024-01-21',
      customerName: '上海办公用品供应商',
      specifications: '500张/包',
      trackingNumber: 'YT0987654321',
      invoiceNumber: 'INV-2024-0120-001',
      invoicePhotoUrl: '/invoice-sample.jpg',
      paymentStatus: 'pending',
    },
    {
      id: 'po-005',
      poNumber: 'PO-2024-0112-005',
      productName: '得力文件夹套装',
      quantity: 50,
      unitPrice: 45,
      totalAmount: 2250,
      status: 'paid',
      createdAt: '2024-01-12 14:20:00',
      deliveryDate: '2024-01-14',
      customerName: '深圳电子设备厂',
      specifications: 'A4 彩色文件夹',
      trackingNumber: 'ZTO1122334455',
      invoiceNumber: 'INV-2024-0115-002',
      invoicePhotoUrl: '/invoice-sample-2.jpg',
      paymentStatus: 'paid',
      paidAt: '2024-01-18 10:30:00',
    },
  ]);

  const filteredOrders = orders.filter(order => 
    order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingSignatureOrders = filteredOrders.filter(o => o.status === 'pending_signature');
  const activeOrders = filteredOrders.filter(o => ['signed', 'shipped'].includes(o.status));
  const completedOrders = filteredOrders.filter(o => ['delivered', 'invoiced', 'paid', 'exception'].includes(o.status));

  const handleSignOrder = (orderId: string) => {
    setIsSigning(true);
    setTimeout(() => {
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: 'signed' } : o
      ));
      setIsSigning(false);
      setIsViewDialogOpen(false);
    }, 1500);
  };

  const handleShipOrder = () => {
    if (!trackingNumber || !selectedOrder) return;
    setIsShipping(true);
    setTimeout(() => {
      setOrders(orders.map(o => 
        o.id === selectedOrder.id ? { ...o, status: 'shipped', trackingNumber } : o
      ));
      setIsShipping(false);
      setIsShipDialogOpen(false);
      setTrackingNumber('');
      setSelectedOrder(null);
    }, 1500);
  };

  const handleSubmitInvoice = () => {
    if (!invoiceNumber || !selectedOrder) return;
    setIsInvoicing(true);
    setTimeout(() => {
      setOrders(orders.map(o => 
        o.id === selectedOrder.id ? { 
          ...o, 
          status: 'invoiced', 
          invoiceNumber,
          invoicePhotoUrl: invoicePhoto ? '/uploaded-invoice.jpg' : o.invoicePhotoUrl
        } : o
      ));
      setIsInvoicing(false);
      setIsInvoiceDialogOpen(false);
      setInvoiceNumber('');
      setInvoicePhoto(null);
      setSelectedOrder(null);
    }, 1500);
  };

  const openShipDialog = (order: SupplierOrder) => {
    setSelectedOrder(order);
    setTrackingNumber('');
    setIsShipDialogOpen(true);
  };

  const openInvoiceDialog = (order: SupplierOrder) => {
    setSelectedOrder(order);
    setInvoiceNumber('');
    setInvoicePhoto(null);
    setIsInvoiceDialogOpen(true);
  };

  const openViewDialog = (order: SupplierOrder) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const getStatusIcon = (status: POStatus) => {
    switch (status) {
      case 'pending_signature':
        return <FileText className="w-4 h-4" />;
      case 'signed':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <Package className="w-4 h-4" />;
      case 'invoiced':
        return <Receipt className="w-4 h-4" />;
      case 'paid':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <SupplierLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                  供应商协作平台
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  管理订单、发货、发票和付款
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">北京科技发展有限公司</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">待签署</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{pendingSignatureOrders.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">进行中</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{activeOrders.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">已完成</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{completedOrders.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">待收款</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    ¥{orders.filter(o => o.paymentStatus === 'pending').reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="搜索订单号、产品名称或客户名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200">
            <TabsTrigger value="all">全部订单</TabsTrigger>
            <TabsTrigger value="pending">待签署</TabsTrigger>
            <TabsTrigger value="active">进行中</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-900">全部订单</CardTitle>
                <CardDescription>共 {filteredOrders.length} 个订单</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>订单号</TableHead>
                      <TableHead>产品名称</TableHead>
                      <TableHead>客户</TableHead>
                      <TableHead>金额</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>交货日期</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.poNumber}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>¥{order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[order.status].variant}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {statusConfig[order.status].label}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>{order.deliveryDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewDialog(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              查看
                            </Button>
                            {order.status === 'pending_signature' && (
                              <Button
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                                onClick={() => openViewDialog(order)}
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                签署
                              </Button>
                            )}
                            {order.status === 'signed' && (
                              <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={() => openShipDialog(order)}
                              >
                                <Truck className="w-4 h-4 mr-1" />
                                发货
                              </Button>
                            )}
                            {order.status === 'delivered' && !order.invoiceNumber && (
                              <Button
                                size="sm"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                onClick={() => openInvoiceDialog(order)}
                              >
                                <Receipt className="w-4 h-4 mr-1" />
                                开票
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-900">待签署订单</CardTitle>
                <CardDescription>共 {pendingSignatureOrders.length} 个订单待签署</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>订单号</TableHead>
                      <TableHead>产品名称</TableHead>
                      <TableHead>金额</TableHead>
                      <TableHead>交货日期</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingSignatureOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.poNumber}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>¥{order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>{order.deliveryDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewDialog(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              查看
                            </Button>
                            <Button
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                              onClick={() => openViewDialog(order)}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              签署
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-900">进行中订单</CardTitle>
                <CardDescription>共 {activeOrders.length} 个订单进行中</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>订单号</TableHead>
                      <TableHead>产品名称</TableHead>
                      <TableHead>金额</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.poNumber}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>¥{order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[order.status].variant}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {statusConfig[order.status].label}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewDialog(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              查看
                            </Button>
                            {order.status === 'signed' && (
                              <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={() => openShipDialog(order)}
                              >
                                <Truck className="w-4 h-4 mr-1" />
                                发货
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-900">已完成订单</CardTitle>
                <CardDescription>共 {completedOrders.length} 个订单已完成</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>订单号</TableHead>
                      <TableHead>产品名称</TableHead>
                      <TableHead>金额</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>付款状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.poNumber}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>¥{order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[order.status].variant}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {statusConfig[order.status].label}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.paymentStatus && (
                            <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                              {order.paymentStatus === 'paid' ? '已付款' : '待付款'}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewDialog(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              查看
                            </Button>
                            {order.status === 'delivered' && !order.invoiceNumber && (
                              <Button
                                size="sm"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                onClick={() => openInvoiceDialog(order)}
                              >
                                <Receipt className="w-4 h-4 mr-1" />
                                开票
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 查看订单详情对话框 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>订单详情</DialogTitle>
            <DialogDescription>
              {selectedOrder?.poNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-500">产品名称</Label>
                  <p className="text-sm font-medium">{selectedOrder.productName}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">客户名称</Label>
                  <p className="text-sm font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">数量</Label>
                  <p className="text-sm font-medium">{selectedOrder.quantity}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">单价</Label>
                  <p className="text-sm font-medium">¥{selectedOrder.unitPrice.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">总金额</Label>
                  <p className="text-sm font-medium text-orange-600">¥{selectedOrder.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">交货日期</Label>
                  <p className="text-sm font-medium">{selectedOrder.deliveryDate}</p>
                </div>
              </div>

              {selectedOrder.specifications && (
                <div>
                  <Label className="text-xs text-slate-500">规格说明</Label>
                  <p className="text-sm mt-1 text-slate-700">{selectedOrder.specifications}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-500">订单状态</Label>
                  <Badge variant={statusConfig[selectedOrder.status].variant} className="mt-1">
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedOrder.status)}
                      {statusConfig[selectedOrder.status].label}
                    </span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">创建时间</Label>
                  <p className="text-sm mt-1">{selectedOrder.createdAt}</p>
                </div>
              </div>

              {selectedOrder.trackingNumber && (
                <div>
                  <Label className="text-xs text-slate-500">物流单号</Label>
                  <p className="text-sm font-medium mt-1">{selectedOrder.trackingNumber}</p>
                </div>
              )}

              {selectedOrder.invoiceNumber && (
                <div>
                  <Label className="text-xs text-slate-500">发票号码</Label>
                  <p className="text-sm font-medium mt-1">{selectedOrder.invoiceNumber}</p>
                </div>
              )}

              {selectedOrder.paymentStatus && (
                <div>
                  <Label className="text-xs text-slate-500">付款状态</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={selectedOrder.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {selectedOrder.paymentStatus === 'paid' ? '已付款' : '待付款'}
                    </Badge>
                    {selectedOrder.paidAt && (
                      <span className="text-xs text-slate-500">付款时间: {selectedOrder.paidAt}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsViewDialogOpen(false)}>
              关闭
            </Button>
            {selectedOrder?.status === 'pending_signature' && (
              <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => handleSignOrder(selectedOrder.id)}
              disabled={isSigning}
            >
              {isSigning ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  签署中...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  确认签署
                </>
              )}
            </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 发货对话框 */}
      <Dialog open={isShipDialogOpen} onOpenChange={setIsShipDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>发货</DialogTitle>
            <DialogDescription>
              请输入物流单号完成发货
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="trackingNumber">物流单号</Label>
              <Input
                id="trackingNumber"
                placeholder="请输入物流单号"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsShipDialogOpen(false)}>
              取消
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleShipOrder}
              disabled={isShipping || !trackingNumber}
            >
              {isShipping ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 mr-2" />
                  确认发货
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 开票对话框 */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>开具发票</DialogTitle>
            <DialogDescription>
              请输入发票号码并上传发票照片
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="invoiceNumber">发票号码</Label>
              <Input
                id="invoiceNumber"
                placeholder="请输入发票号码"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div>
              <Label>发票照片</Label>
              <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">点击或拖拽上传发票照片</p>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setInvoicePhoto(file);
                  }}
                />
              </div>
              {invoicePhoto && (
                <p className="text-sm text-slate-600 mt-2">
                  已选择: {invoicePhoto.name}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsInvoiceDialogOpen(false)}>
              取消
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleSubmitInvoice}
              disabled={isInvoicing || !invoiceNumber}
            >
              {isInvoicing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4 mr-2" />
                  提交发票
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </SupplierLayout>
  );
}
