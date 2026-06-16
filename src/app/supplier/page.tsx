'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Truck, 
  FileCheck, 
  CreditCard,
  Upload,
  Send,
  Eye
} from 'lucide-react';

export default function SupplierPortal() {
  const [activeTab, setActiveTab] = useState('orders');

  const orders = [
    {
      id: 'PO202401200001',
      productName: '办公用纸',
      specifications: 'A4复印纸 80g',
      quantity: 100,
      totalAmount: 4800,
      status: 'pending_confirmation',
      createdAt: '2024-01-20 11:00:00',
    },
    {
      id: 'PO202401190002',
      productName: '显示器',
      specifications: '戴尔 27英寸 4K',
      quantity: 3,
      totalAmount: 11500,
      status: 'shipped',
      trackingNumber: 'SF1234567890',
      createdAt: '2024-01-19 15:30:00',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">供应商协作平台</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">诚信电子有限公司</span>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>欢迎，诚信电子</CardTitle>
              <CardDescription>
                管理您的订单、发货和发票
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="orders">订单管理</TabsTrigger>
              <TabsTrigger value="shipments">发货管理</TabsTrigger>
              <TabsTrigger value="invoices">发票管理</TabsTrigger>
              <TabsTrigger value="payments">付款查询</TabsTrigger>
            </TabsList>

            {/* 订单管理 */}
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>订单列表</CardTitle>
                  <CardDescription>查看和确认采购订单</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-foreground">{order.id}</h3>
                                <Badge variant="outline">
                                  {order.status === 'pending_confirmation' ? '待确认' : 
                                   order.status === 'shipped' ? '已发货' : '已完成'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.productName} - {order.specifications}
                              </p>
                              <div className="flex gap-6 text-sm text-muted-foreground">
                                <span>数量：{order.quantity}</span>
                                <span>金额：¥{order.totalAmount.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {order.status === 'pending_confirmation' && (
                                <Button>
                                  确认订单
                                </Button>
                              )}
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 发货管理 */}
            <TabsContent value="shipments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>输入发货单号</CardTitle>
                  <CardDescription>为已确认的订单输入发货信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="poNumber">PO编号</Label>
                      <Input id="poNumber" placeholder="输入PO编号" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trackingNumber">发货单号</Label>
                      <Input id="trackingNumber" placeholder="输入快递单号" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carrier">物流公司</Label>
                      <Input id="carrier" placeholder="如：顺丰、圆通等" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedDelivery">预计送达日期</Label>
                      <Input id="estimatedDelivery" type="date" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="gap-2">
                      <Send className="h-4 w-4" />
                      提交发货信息
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>发货记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-center py-8">
                    暂无发货记录
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 发票管理 */}
            <TabsContent value="invoices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>提交发票</CardTitle>
                  <CardDescription>上传发票照片</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="invoicePoNumber">PO编号</Label>
                      <Input id="invoicePoNumber" placeholder="输入PO编号" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoiceNumber">发票号码</Label>
                      <Input id="invoiceNumber" placeholder="输入发票号码" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="invoiceAmount">发票金额</Label>
                      <Input id="invoiceAmount" type="number" placeholder="输入发票金额" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>发票照片</Label>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">点击或拖拽上传发票照片</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="gap-2">
                      <Upload className="h-4 w-4" />
                      提交发票
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>发票记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-center py-8">
                    暂无发票记录
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 付款查询 */}
            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>付款查询</CardTitle>
                  <CardDescription>查询订单的付款状态</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="输入PO编号查询" />
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      查询
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>付款记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-center py-8">
                    暂无付款记录
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
