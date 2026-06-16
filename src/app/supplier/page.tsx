'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  FileText, 
  Upload, 
  Truck, 
  FileCheck, 
  CreditCard,
  CheckCircle2,
  Search,
  Eye,
  Package
} from 'lucide-react';
import type { POStatus } from '@/types';

const statusConfig: Record<POStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending_signature: { label: '待确认', variant: 'secondary' },
  signed: { label: '已确认', variant: 'default' },
  shipped: { label: '已发货', variant: 'default' },
  delivered: { label: '已收货', variant: 'default' },
  invoiced: { label: '已收票', variant: 'default' },
  paid: { label: '已付款', variant: 'default' },
  exception: { label: '异常', variant: 'destructive' },
};

export default function SupplierPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedPO, setSelectedPO] = useState<string | null>(null);
  const [shippingTrackingNumber, setShippingTrackingNumber] = useState('');
  const [invoiceImage, setInvoiceImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const orders = [
    {
      id: 'PO-2024-0120-001',
      productName: '笔记本电脑',
      specifications: '联想ThinkPad X1 Carbon',
      quantity: 5,
      totalAmount: 28500,
      status: 'pending_signature' as POStatus,
      createdAt: '2024-01-20 14:30:00',
      deliveryDate: '2024-01-27',
    },
    {
      id: 'PO-2024-0119-001',
      productName: '打印机',
      specifications: '惠普 LaserJet Pro',
      quantity: 2,
      totalAmount: 7800,
      status: 'signed' as POStatus,
      createdAt: '2024-01-19 16:45:00',
      deliveryDate: '2024-01-24',
    },
    {
      id: 'PO-2024-0118-001',
      productName: '办公用纸',
      specifications: 'A4复印纸 80g',
      quantity: 100,
      totalAmount: 4500,
      status: 'paid' as POStatus,
      createdAt: '2024-01-18 10:20:00',
      deliveryDate: '2024-01-20',
      paidAt: '2024-01-21 15:30:00',
    },
  ];

  const filteredOrders = orders.filter(order => 
    order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOrder = orders.find(o => o.id === selectedPO);

  const handleConfirmOrder = (orderId: string) => {
    // 模拟确认订单
    alert(`订单 ${orderId} 已确认`);
  };

  const handleSubmitShipping = () => {
    if (!shippingTrackingNumber) return;
    // 模拟提交发货单号
    alert(`发货单号 ${shippingTrackingNumber} 已提交`);
    setShippingTrackingNumber('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoiceImage(URL.createObjectURL(file));
    }
  };

  const handleSubmitInvoice = () => {
    if (!invoiceImage) return;
    // 模拟提交发票
    alert('发票照片已提交');
    setInvoiceImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                供应商协作平台
              </h1>
              <p className="text-slate-600">
                查看订单、发货、提交发票和查询付款
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full border-b border-slate-100 bg-transparent px-6 py-4">
              <div className="flex gap-2">
                <TabsTrigger value="orders" className="data-[state=active]:bg-slate-50">
                  <FileText className="h-4 w-4 mr-2" />
                  订单管理
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-slate-50">
                  <FileCheck className="h-4 w-4 mr-2" />
                  历史订单
                </TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-slate-50">
                  <CreditCard className="h-4 w-4 mr-2" />
                  付款查询
                </TabsTrigger>
              </div>
            </TabsList>

            <TabsContent value="orders" className="p-6 space-y-6">
              {!selectedPO ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">待处理订单</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        type="search"
                        placeholder="搜索订单..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="font-medium">PO号</TableHead>
                          <TableHead className="font-medium">产品名称</TableHead>
                          <TableHead className="font-medium">数量</TableHead>
                          <TableHead className="font-medium">金额</TableHead>
                          <TableHead className="font-medium">状态</TableHead>
                          <TableHead className="text-right font-medium">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id} className="hover:bg-slate-50">
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.productName}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>¥{order.totalAmount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={statusConfig[order.status].variant}>
                                {statusConfig[order.status].label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedPO(order.id)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  查看
                                </Button>
                                {order.status === 'pending_signature' && (
                                  <Button 
                                    size="sm"
                                    onClick={() => handleConfirmOrder(order.id)}
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    确认
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedPO(null)}
                    >
                      ← 返回
                    </Button>
                    <h2 className="text-lg font-semibold text-slate-900">
                      订单详情 {selectedPO}
                    </h2>
                  </div>

                  {selectedOrder && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="border-slate-200">
                        <CardHeader>
                          <CardTitle>订单信息</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600">产品名称</span>
                              <span className="font-medium">{selectedOrder.productName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">规格</span>
                              <span className="font-medium">{selectedOrder.specifications}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">数量</span>
                              <span className="font-medium">{selectedOrder.quantity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">总金额</span>
                              <span className="font-semibold text-lg">¥{selectedOrder.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">交货日期</span>
                              <span className="font-medium">{selectedOrder.deliveryDate}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-6">
                        {selectedOrder.status === 'signed' && (
                          <Card className="border-slate-200">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                发货信息
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label>发货单号</Label>
                                <Input
                                  placeholder="请输入发货单号"
                                  value={shippingTrackingNumber}
                                  onChange={(e) => setShippingTrackingNumber(e.target.value)}
                                />
                              </div>
                              <Button 
                                onClick={handleSubmitShipping}
                                disabled={!shippingTrackingNumber}
                                className="w-full"
                              >
                                提交发货单号
                              </Button>
                            </CardContent>
                          </Card>
                        )}

                        {selectedOrder.status === 'shipped' && (
                          <Card className="border-slate-200">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <FileCheck className="h-5 w-5" />
                                提交发票
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label>发票照片</Label>
                                {invoiceImage ? (
                                  <div className="space-y-2">
                                    <img src={invoiceImage} alt="发票预览" className="rounded-lg border border-slate-200 max-h-40 object-cover" />
                                    <Button variant="ghost" size="sm" onClick={() => setInvoiceImage(null)}>
                                      重新上传
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 transition-colors">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleFileUpload}
                                      className="hidden"
                                      id="invoice-upload"
                                    />
                                    <label htmlFor="invoice-upload" className="cursor-pointer">
                                      <Upload className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                                      <p className="text-slate-600">点击上传发票照片</p>
                                      <p className="text-sm text-slate-500">支持 JPG、PNG 格式</p>
                                    </label>
                                  </div>
                                )}
                              </div>
                              {invoiceImage && (
                                <Button 
                                  onClick={handleSubmitInvoice}
                                  className="w-full"
                                >
                                  提交发票
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {selectedOrder.status === 'paid' && (
                          <Card className="border-emerald-200 bg-emerald-50">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-emerald-800">
                                <CreditCard className="h-5 w-5" />
                                付款状态
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex items-center gap-2 text-emerald-700">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">已付款</span>
                              </div>
                              <p className="text-sm text-emerald-600">
                                付款时间：{selectedOrder.paidAt}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="p-6">
              <div className="text-center py-12">
                <FileCheck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">历史订单</h3>
                <p className="text-slate-600">查看您的所有历史订单记录</p>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="p-6">
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">付款查询</h3>
                <p className="text-slate-600">查询所有订单的付款状态和记录</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
