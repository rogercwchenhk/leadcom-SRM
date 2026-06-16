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
import { 
  FileText, 
  Search, 
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  FileCheck,
  CreditCard,
  FileSpreadsheet,
  Package,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { POStatus } from '@/types';

type ActivityStatus = 'success' | 'warning' | 'info';

const statusConfig: Record<POStatus, { label: string; color: string; bg: string; icon: any }> = {
  pending_signature: { label: '待签署', color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock },
  signed: { label: '已签署', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
  shipped: { label: '已发货', color: 'text-blue-600', bg: 'bg-blue-50', icon: Truck },
  delivered: { label: '已收货', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  invoiced: { label: '已收票', color: 'text-purple-600', bg: 'bg-purple-50', icon: FileCheck },
  paid: { label: '已付款', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CreditCard },
  exception: { label: '异常', color: 'text-red-600', bg: 'bg-red-50', icon: Clock },
};

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showStats, setShowStats] = useState(true);

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

  const stats = [
    { 
      label: '总金额', 
      value: `¥${totalAmount.toLocaleString()}`, 
      icon: FileText,
      color: 'text-slate-600',
      bg: 'bg-slate-50'
    },
    { 
      label: '待签署', 
      value: pos.filter(p => p.status === 'pending_signature').length.toString(), 
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    { 
      label: '运输中', 
      value: pos.filter(p => p.status === 'shipped').length.toString(), 
      icon: Truck,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: '已付款', 
      value: pos.filter(p => p.status === 'paid').length.toString(), 
      icon: CreditCard,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              采购订单
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              管理所有采购订单，跟踪发货和付款
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 h-10 border-slate-200 hover:border-slate-300">
              <FileSpreadsheet className="w-4 h-4" />
              导出报表
            </Button>
          </div>
        </div>

        {/* Stats Grid - Top */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader 
            className="pb-2 pt-3 px-4 flex flex-row items-center justify-between cursor-pointer select-none"
            onClick={() => setShowStats(!showStats)}
          >
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold text-slate-900">实时指标</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-100">
              {showStats ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </Button>
          </CardHeader>
          {showStats && (
            <CardContent className="px-4 pb-4 pt-0">
              <div className="grid grid-cols-4 gap-2">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className={`p-2.5 rounded-lg border ${stat.bg} border-slate-200 hover:border-slate-300 transition-all duration-200`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-xs text-slate-500">{stat.label}</span>
                    </div>
                    <div className="text-base font-bold text-slate-900 leading-tight">{stat.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Filters & Table - Bottom */}
        <div className="space-y-4">
          {/* Filters */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6 px-4 pb-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="搜索PO号、产品名称、供应商..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 bg-white border-slate-200"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] h-10 bg-white border-slate-200">
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
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">订单列表</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  共 {filteredPOs.length} 个采购订单
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-200">
                      <TableHead className="font-semibold text-slate-700">PO号</TableHead>
                      <TableHead className="font-semibold text-slate-700">产品名称</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-slate-500">供应商</TableHead>
                      <TableHead className="font-semibold text-slate-700">金额</TableHead>
                      <TableHead className="font-semibold text-slate-700">交货日期</TableHead>
                      <TableHead className="font-semibold text-slate-700">状态</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-slate-500">创建时间</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPOs.map((po) => {
                      const config = statusConfig[po.status];
                      const IconComponent = config.icon;
                      
                      return (
                        <TableRow key={po.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-medium text-slate-900">{po.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-900">{po.productName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">{po.supplier}</TableCell>
                          <TableCell className="font-medium text-slate-900">¥{po.totalAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-slate-600">{po.deliveryDate}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg} border border-slate-200`}>
                              <IconComponent className={`w-3.5 h-3.5 ${config.color}`} />
                              <span className={`text-xs font-medium ${config.color}`}>
                                {config.label}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">{po.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                              <Eye className="h-4 w-4 text-slate-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
