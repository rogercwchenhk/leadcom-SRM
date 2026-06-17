'use client';

import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
import { AppLayout } from '@/components/layout/AppLayout';

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
  const [expandedPOs, setExpandedPOs] = useState<Set<string>>(new Set());

  const togglePOExpansion = (poId: string) => {
    const newExpanded = new Set(expandedPOs);
    if (newExpanded.has(poId)) {
      newExpanded.delete(poId);
    } else {
      newExpanded.add(poId);
    }
    setExpandedPOs(newExpanded);
  };

  // 格式化PO号显示：只显示最后8位，前面加省略号
  const formatPONumber = (poId: string) => {
    if (poId.length <= 8) return poId;
    return `...${poId.slice(-8)}`;
  };

  const pos = [
    {
      id: 'PO-2024-0120-001',
      requestId: 'PR-2024-0120-001',
      supplier: '联想供应商',
      items: [
        { productName: 'ThinkPad X1 Carbon 笔记本电脑', quantity: 2, unitPrice: 12000, totalPrice: 24000 },
        { productName: 'ThinkPad 扩展坞', quantity: 2, unitPrice: 2250, totalPrice: 4500 }
      ],
      totalAmount: 28500,
      status: 'pending_signature' as POStatus,
      createdAt: '2024-01-20 14:30:00',
      deliveryDate: '2024-01-27',
    },
    {
      id: 'PO-2024-0119-001',
      requestId: 'PR-2024-0119-002',
      supplier: '惠普供应商',
      items: [
        { productName: 'HP LaserJet Pro MFP 打印机', quantity: 1, unitPrice: 6500, totalPrice: 6500 },
        { productName: 'HP 原装硒鼓', quantity: 2, unitPrice: 650, totalPrice: 1300 }
      ],
      totalAmount: 7800,
      status: 'shipped' as POStatus,
      createdAt: '2024-01-19 16:45:00',
      deliveryDate: '2024-01-24',
      trackingNumber: 'SF1234567890',
    },
    {
      id: 'PO-2024-0118-001',
      requestId: 'PR-2024-0118-003',
      supplier: '得力文具',
      items: [
        { productName: 'A4复印纸 70g', quantity: 100, unitPrice: 25, totalPrice: 2500 },
        { productName: 'A3复印纸 70g', quantity: 50, unitPrice: 35, totalPrice: 1750 },
        { productName: '热敏收银纸', quantity: 10, unitPrice: 25, totalPrice: 250 }
      ],
      totalAmount: 4500,
      status: 'paid' as POStatus,
      createdAt: '2024-01-18 10:20:00',
      deliveryDate: '2024-01-20',
      paidAt: '2024-01-21 15:30:00',
    },
    {
      id: 'PO-2024-0117-001',
      requestId: 'PR-2024-0117-004',
      supplier: '戴尔供应商',
      items: [
        { productName: 'Dell U2723QE 4K显示器', quantity: 2, unitPrice: 5600, totalPrice: 11200 }
      ],
      totalAmount: 11200,
      status: 'invoiced' as POStatus,
      createdAt: '2024-01-17 11:30:00',
      deliveryDate: '2024-01-22',
    },
  ];

  const filteredPOs = pos.filter(po => {
    const matchesSearch = 
      po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPOs.reduce((sum, po) => sum + po.totalAmount, 0);

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 格式化金额
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount);
  };

  const stats = [
    { 
      label: '总金额', 
      value: formatCurrency(totalAmount), 
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
    <AppLayout initialRole="purchaser">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              采购订单
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              管理所有采购订单，跟踪发货和付款
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 h-10 border-slate-200 hover:border-slate-300 whitespace-nowrap">
              <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">导出报表</span>
              <span className="sm:hidden">导出</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid - Top */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-1 pt-2 px-4">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-900">实时指标</CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-100" aria-label={showStats ? "收起指标" : "展开指标"} onClick={() => setShowStats(!showStats)}>
                {showStats ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </Button>
            </div>
          </CardHeader>
          {showStats && (
            <CardContent className="px-4 pb-4 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
            <CardHeader className="pb-1 pt-2 px-4">
              <CardTitle className="text-sm font-semibold text-slate-900">筛选条件</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" aria-hidden="true" />
                  <label htmlFor="po-search" className="sr-only">搜索采购订单</label>
                  <Input
                    id="po-search"
                    type="search"
                    placeholder="搜索PO号、供应商、产品名称…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs"
                    aria-label="搜索PO号、产品名称、供应商"
                  />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="status-filter" className="sr-only">状态筛选</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status-filter" className="w-[180px] h-9 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg text-xs" aria-label="订单状态筛选">
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

          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-1 pt-2 px-4">
                <CardTitle className="text-sm font-semibold text-slate-900">订单列表</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  共 {filteredPOs.length} 个采购订单
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pt-0 pb-4">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-b border-slate-200">
                        <TableHead className="font-semibold text-slate-700">PO号</TableHead>
                        <TableHead className="font-semibold text-slate-700">供应商</TableHead>
                        <TableHead className="font-semibold text-slate-700">总金额</TableHead>
                        <TableHead className="font-semibold text-slate-700">状态</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPOs.map((po) => {
                        const config = statusConfig[po.status];
                        const IconComponent = config.icon;
                        const isExpanded = expandedPOs.has(po.id);
                        
                        return (
                          <React.Fragment key={po.id}>
                            <TableRow className="hover:bg-slate-50/50 transition-colors">
                              <TableCell>
                                <Collapsible open={isExpanded} onOpenChange={() => togglePOExpansion(po.id)} className="w-full">
                                  <div className="flex flex-col">
                                    <CollapsibleTrigger asChild>
                                      <button 
                                        className="flex items-center gap-2 text-left hover:bg-slate-100 rounded px-1 py-0.5 -ml-1 transition-colors"
                                        aria-label={isExpanded ? `收起产品明细 ${po.id}` : `展开产品明细 ${po.id}`}
                                        title={po.id}
                                      >
                                        <Package className="w-4 h-4 text-slate-400" aria-hidden="true" />
                                        <span className="text-xs text-slate-900 font-medium">
                                          {formatPONumber(po.id)}
                                        </span>
                                        {isExpanded ? (
                                          <ChevronUp className="w-3 h-3 text-slate-400" />
                                        ) : (
                                          <ChevronDown className="w-3 h-3 text-slate-400" />
                                        )}
                                      </button>
                                    </CollapsibleTrigger>
                                  </div>
                                </Collapsible>
                              </TableCell>
                              <TableCell className="text-xs text-slate-500">{po.supplier}</TableCell>
                              <TableCell className="text-xs font-medium text-slate-900">{formatCurrency(po.totalAmount)}</TableCell>
                              <TableCell>
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg} border border-slate-200`}>
                                  <IconComponent className={`w-3.5 h-3.5 ${config.color}`} aria-hidden="true" />
                                  <span className={`text-xs font-medium ${config.color}`}>
                                    {config.label}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" aria-label={`查看订单 ${po.id}`}>
                                  <Eye className="h-4 w-4 text-slate-600" />
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={5} className="p-0">
                                <Collapsible open={isExpanded} onOpenChange={() => {}}>
                                  <CollapsibleContent>
                                    <div className="bg-slate-50/30 px-6 py-4">
                                      <div className="pl-6 space-y-3">
                                        <div className="text-xs text-slate-500">
                                          <span className="font-medium text-slate-700">完整PO号：</span>
                                          {po.id}
                                        </div>
                                        <div className="space-y-1.5">
                                          {po.items.map((item, index) => (
                                            <div key={index} className="text-xs text-slate-600">
                                              <div className="flex items-center justify-between gap-2">
                                                <span className="truncate flex-1">{item.productName}</span>
                                                <span className="text-slate-400 whitespace-nowrap">
                                                  {item.quantity} × {formatCurrency(item.unitPrice)} = {formatCurrency(item.totalPrice)}
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900">订单列表</h3>
              <span className="text-xs text-slate-500">共 {filteredPOs.length} 个</span>
            </div>
            {filteredPOs.map((po) => {
              const config = statusConfig[po.status];
              const IconComponent = config.icon;
              const isExpanded = expandedPOs.has(po.id);
              
              return (
                <Card key={po.id} className="border-slate-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-medium text-slate-900">{formatPONumber(po.id)}</div>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${config.bg} border border-slate-200`}>
                        <IconComponent className={`w-3 h-3 ${config.color}`} aria-hidden="true" />
                        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">供应商</span>
                        <span className="text-slate-900">{po.supplier}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">总金额</span>
                        <span className="text-xs font-medium text-slate-900">{formatCurrency(po.totalAmount)}</span>
                      </div>
                    </div>
                    
                    <Collapsible open={isExpanded} onOpenChange={() => togglePOExpansion(po.id)} className="w-full">
                      <CollapsibleTrigger asChild>
                        <button 
                          className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          aria-label={isExpanded ? `收起产品明细 ${po.id}` : `展开产品明细 ${po.id}`}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                          <span>{isExpanded ? '收起产品明细' : '查看产品明细'}</span>
                        </button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                          <div className="text-xs text-slate-500">
                            <span className="font-medium text-slate-700">完整PO号：</span>
                            {po.id}
                          </div>
                          {po.items.map((item, index) => (
                            <div key={index} className="text-xs">
                              <div className="text-slate-900">{item.productName}</div>
                              <div className="flex items-center justify-between text-slate-500 mt-0.5">
                                <span>数量: {item.quantity}</span>
                                <span>单价: {formatCurrency(item.unitPrice)}</span>
                                <span className="font-medium text-slate-700">{formatCurrency(item.totalPrice)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
