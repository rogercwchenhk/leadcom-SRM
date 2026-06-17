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
  Building2,
  User,
  CreditCard,
  History,
  Home,
  MessageSquare,
  AlertCircle,
  TrendingUp
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

type ActivityStatus = 'success' | 'warning' | 'info';

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
  const pendingPaymentOrders = orders.filter(o => o.paymentStatus === 'pending');

  const stats = [
    { 
      label: '待签署', 
      value: pendingSignatureOrders.length.toString(), 
      icon: FileText,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    { 
      label: '进行中', 
      value: activeOrders.length.toString(), 
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: '已完成', 
      value: completedOrders.length.toString(), 
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    { 
      label: '待收款', 
      value: `¥${pendingPaymentOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}`, 
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ];

  const recentActivities: Array<{
    id: number;
    action: string;
    title: string;
    time: string;
    status: ActivityStatus;
    icon: any;
  }> = [
    { 
      id: 1, 
      action: '订单已签署', 
      title: 'PO-2024-0115-003 已完成签署', 
      time: '2分钟前', 
      status: 'success',
      icon: CheckCircle
    },
    { 
      id: 2, 
      action: '已发货', 
      title: '罗技键盘鼠标套装 已发货', 
      time: '15分钟前', 
      status: 'info',
      icon: Truck
    },
    { 
      id: 3, 
      action: '待开票', 
      title: 'A4复印纸订单等待开票', 
      time: '32分钟前', 
      status: 'warning',
      icon: AlertCircle
    },
    { 
      id: 4, 
      action: '款项已到账', 
      title: '得力文件夹订单 ¥2,250 已到账', 
      time: '1小时前', 
      status: 'success',
      icon: DollarSign
    },
    { 
      id: 5, 
      action: '新订单', 
      title: '收到新订单 PO-2024-0120-001', 
      time: '2小时前', 
      status: 'info',
      icon: FileText
    }
  ];

  const quickActions = [
    { 
      title: '订单管理', 
      description: '查看全部订单', 
      icon: Package,
      variant: 'outline' as const
    },
    { 
      title: '待签署', 
      description: '立即签署', 
      icon: FileText,
      variant: 'outline' as const
    },
    { 
      title: '发货管理', 
      description: '输入运单号', 
      icon: Truck,
      variant: 'outline' as const
    },
    { 
      title: '发票管理', 
      description: '提交发票', 
      icon: Receipt,
      variant: 'outline' as const
    }
  ];

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
        return <FileText className="w-3.5 h-3.5" />;
      case 'signed':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'shipped':
        return <Truck className="w-3.5 h-3.5" />;
      case 'delivered':
        return <Package className="w-3.5 h-3.5" />;
      case 'invoiced':
        return <Receipt className="w-3.5 h-3.5" />;
      case 'paid':
        return <DollarSign className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                    供应商协作平台
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    管理订单、发货、发票和付款
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">北京科技发展有限公司</span>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-4">
              {/* Left Column - Stats & Quick Actions */}
              <div className="col-span-4 space-y-4">
                {/* Stats Grid */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-1 pt-2 px-4">
                    <CardTitle className="text-sm font-semibold text-slate-900">实时指标</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="grid grid-cols-2 gap-3">
                      {stats.map((stat, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-xl border ${stat.bg} border-slate-200 hover:border-slate-300 transition-all duration-200`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} aria-hidden="true" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-slate-900 leading-none">{stat.value}</div>
                            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-1 pt-2 px-4">
                    <CardTitle className="text-sm font-semibold text-slate-900">快捷操作</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.variant}
                          className="h-auto py-3 flex-col items-start gap-1 text-left border-slate-200 hover:border-slate-300"
                          aria-label={action.title}
                        >
                          <action.icon className="w-5 h-5" aria-hidden="true" />
                          <span className="font-medium text-sm">{action.title}</span>
                          <span className="text-xs text-slate-500">{action.description}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-1 pt-2 px-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-900">实时动态</CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-700 h-8" aria-label="查看全部动态">
                      查看全部 <ArrowRight className="w-3 h-3 ml-1" aria-hidden="true" />
                    </Button>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="space-y-1.5">
                      {recentActivities.map((activity) => {
                        const IconComponent = activity.icon;
                        const statusColors = {
                          success: 'text-green-500 bg-green-50',
                          warning: 'text-orange-500 bg-orange-50',
                          info: 'text-blue-500 bg-blue-50'
                        };
                        
                        return (
                          <div 
                            key={activity.id}
                            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                          >
                            <div className={`w-8 h-8 rounded-full ${statusColors[activity.status]} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <IconComponent className="w-4 h-4" aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-medium text-slate-900">
                                  {activity.action}
                                </span>
                                <span className="text-xs text-slate-400 flex-shrink-0">
                                  {activity.time}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mt-0.5 truncate">
                                {activity.title}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Orders */}
              <div className="col-span-8">
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
                              <TableHead className="w-28">订单号</TableHead>
                              <TableHead>产品名称</TableHead>
                              <TableHead className="w-24">金额</TableHead>
                              <TableHead className="w-24">状态</TableHead>
                              <TableHead className="w-28">交货日期</TableHead>
                              <TableHead className="w-32 text-right">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium text-xs">{order.poNumber}</TableCell>
                                <TableCell className="text-xs">{order.productName}</TableCell>
                                <TableCell className="text-xs font-medium">¥{order.totalAmount.toLocaleString()}</TableCell>
                                <TableCell>
                                  <Badge variant={statusConfig[order.status].variant} className="text-xs">
                                    <span className="flex items-center gap-1">
                                      {getStatusIcon(order.status)}
                                      {statusConfig[order.status].label}
                                    </span>
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs">{order.deliveryDate}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2"
                                      onClick={() => openViewDialog(order)}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                    {order.status === 'pending_signature' && (
                                      <Button
                                        size="sm"
                                        className="h-7 px-2 bg-orange-500 hover:bg-orange-600 text-white"
                                        onClick={() => openViewDialog(order)}
                                      >
                                        <FileText className="w-3.5 h-3.5" />
                                      </Button>
                                    )}
                                    {order.status === 'signed' && (
                                      <Button
                                        size="sm"
                                        className="h-7 px-2 bg-blue-500 hover:bg-blue-600 text-white"
                                        onClick={() => openShipDialog(order)}
                                      >
                                        <Truck className="w-3.5 h-3.5" />
                                      </Button>
                                    )}
                                    {order.status === 'delivered' && !order.invoiceNumber && (
                                      <Button
                                        size="sm"
                                        className="h-7 px-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                                        onClick={() => openInvoiceDialog(order)}
                                      >
                                        <Receipt className="w-3.5 h-3.5" />
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
                              <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingSignatureOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium text-xs">{order.poNumber}</TableCell>
                                <TableCell className="text-xs">{order.productName}</TableCell>
                                <TableCell className="text-xs font-medium">¥{order.totalAmount.toLocaleString()}</TableCell>
                                <TableCell className="text-xs">{order.deliveryDate}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2"
                                      onClick={() => openViewDialog(order)}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="h-7 px-2 bg-orange-500 hover:bg-orange-600 text-white"
                                      onClick={() => openViewDialog(order)}
                                    >
                                      <FileText className="w-3.5 h-3.5" />
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
                              <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activeOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium text-xs">{order.poNumber}</TableCell>
                                <TableCell className="text-xs">{order.productName}</TableCell>
                                <TableCell className="text-xs font-medium">¥{order.totalAmount.toLocaleString()}</TableCell>
                                <TableCell>
                                  <Badge variant={statusConfig[order.status].variant} className="text-xs">
                                    <span className="flex items-center gap-1">
                                      {getStatusIcon(order.status)}
                                      {statusConfig[order.status].label}
                                    </span>
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2"
                                      onClick={() => openViewDialog(order)}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                    {order.status === 'signed' && (
                                      <Button
                                        size="sm"
                                        className="h-7 px-2 bg-blue-500 hover:bg-blue-600 text-white"
                                        onClick={() => openShipDialog(order)}
                                      >
                                        <Truck className="w-3.5 h-3.5" />
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
                              <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {completedOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium text-xs">{order.poNumber}</TableCell>
                                <TableCell className="text-xs">{order.productName}</TableCell>
                                <TableCell className="text-xs font-medium">¥{order.totalAmount.toLocaleString()}</TableCell>
                                <TableCell>
                                  <Badge variant={statusConfig[order.status].variant} className="text-xs">
                                    <span className="flex items-center gap-1">
                                      {getStatusIcon(order.status)}
                                      {statusConfig[order.status].label}
                                    </span>
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {order.paymentStatus && (
                                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="text-xs">
                                      {order.paymentStatus === 'paid' ? '已付款' : '待付款'}
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2"
                                      onClick={() => openViewDialog(order)}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                    {order.status === 'delivered' && !order.invoiceNumber && (
                                      <Button
                                        size="sm"
                                        className="h-7 px-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                                        onClick={() => openInvoiceDialog(order)}
                                      >
                                        <Receipt className="w-3.5 h-3.5" />
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
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            {/* Stats Grid - Mobile */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-1 pt-2 px-4">
                <CardTitle className="text-sm font-semibold text-slate-900">实时指标</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  {stats.map((stat, index) => (
                    <div 
                      key={index} 
                      className={`p-2.5 rounded-lg border ${stat.bg} border-slate-200 hover:border-slate-300 transition-all duration-200`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-base font-bold text-slate-900 leading-tight">{stat.value}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions - Mobile */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-1 pt-2 px-4">
                <CardTitle className="text-sm font-semibold text-slate-900">快捷操作</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant}
                      className="h-auto py-2.5 flex-col items-center gap-1 text-center border-slate-200 hover:border-slate-300"
                      aria-label={action.title}
                    >
                      <action.icon className="w-5 h-5" aria-hidden="true" />
                      <span className="font-medium text-xs">{action.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="搜索订单..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>

            {/* Tabs - Mobile */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200">
                <TabsTrigger value="all" className="text-xs">全部</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs">待签署</TabsTrigger>
                <TabsTrigger value="active" className="text-xs">进行中</TabsTrigger>
                <TabsTrigger value="completed" className="text-xs">已完成</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-200">
                      {filteredOrders.map((order) => (
                        <div key={order.id} className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-medium text-xs text-slate-900">{order.poNumber}</div>
                            <Badge variant={statusConfig[order.status].variant} className="text-xs">
                              {statusConfig[order.status].label}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600 mb-1">{order.productName}</div>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>¥{order.totalAmount.toLocaleString()}</span>
                            <span>{order.deliveryDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
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
                    <p className="font-medium">{selectedOrder.productName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">客户</Label>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">数量</Label>
                    <p className="font-medium">{selectedOrder.quantity}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">单价</Label>
                    <p className="font-medium">¥{selectedOrder.unitPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">总金额</Label>
                    <p className="font-medium text-lg text-orange-600">¥{selectedOrder.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">交货日期</Label>
                    <p className="font-medium">{selectedOrder.deliveryDate}</p>
                  </div>
                </div>
                {selectedOrder.specifications && (
                  <div>
                    <Label className="text-xs text-slate-500">规格说明</Label>
                    <p className="text-sm text-slate-600">{selectedOrder.specifications}</p>
                  </div>
                )}
                {selectedOrder.trackingNumber && (
                  <div>
                    <Label className="text-xs text-slate-500">运单号</Label>
                    <p className="font-medium font-mono">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
                {selectedOrder.invoiceNumber && (
                  <div>
                    <Label className="text-xs text-slate-500">发票号</Label>
                    <p className="font-medium">{selectedOrder.invoiceNumber}</p>
                  </div>
                )}
                {selectedOrder.paymentStatus && (
                  <div>
                    <Label className="text-xs text-slate-500">付款状态</Label>
                    <Badge variant={selectedOrder.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {selectedOrder.paymentStatus === 'paid' ? '已付款' : '待付款'}
                    </Badge>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="flex items-center gap-2">
              {selectedOrder?.status === 'pending_signature' && (
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => handleSignOrder(selectedOrder.id)}
                  disabled={isSigning}
                >
                  {isSigning ? '签署中...' : '签署订单'}
                </Button>
              )}
              {selectedOrder?.status === 'signed' && (
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    openShipDialog(selectedOrder);
                  }}
                >
                  发货
                </Button>
              )}
              {selectedOrder?.status === 'delivered' && !selectedOrder?.invoiceNumber && (
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    openInvoiceDialog(selectedOrder);
                  }}
                >
                  开票
                </Button>
              )}
              <Button variant="ghost" onClick={() => setIsViewDialogOpen(false)}>
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 发货对话框 */}
        <Dialog open={isShipDialogOpen} onOpenChange={setIsShipDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>发货</DialogTitle>
              <DialogDescription>
                请输入运单号完成发货
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="trackingNumber">运单号</Label>
                <Input
                  id="trackingNumber"
                  placeholder="请输入运单号"
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
                disabled={!trackingNumber || isShipping}
              >
                {isShipping ? '提交中...' : '确认发货'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 开票对话框 */}
        <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>提交发票</DialogTitle>
              <DialogDescription>
                请输入发票号并上传发票照片
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="invoiceNumber">发票号</Label>
                <Input
                  id="invoiceNumber"
                  placeholder="请输入发票号"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div>
                <Label>发票照片</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setInvoicePhoto(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsInvoiceDialogOpen(false)}>
                取消
              </Button>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleSubmitInvoice}
                disabled={!invoiceNumber || isInvoicing}
              >
                {isInvoicing ? '提交中...' : '提交发票'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SupplierLayout>
  );
}
