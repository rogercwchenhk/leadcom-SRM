'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  ShoppingCart,
  FileSpreadsheet,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// 模拟数据
const contractData = [
  { month: '1月', count: 12, amount: 1850000 },
  { month: '2月', count: 15, amount: 2320000 },
  { month: '3月', count: 18, amount: 2780000 },
  { month: '4月', count: 14, amount: 2150000 },
  { month: '5月', count: 20, amount: 3120000 },
  { month: '6月', count: 16, amount: 2480000 }
];

const requestTypeData = [
  { name: '确定需求', value: 68, color: '#3b82f6' },
  { name: '非确定需求', value: 32, color: '#f97316' }
];

const priceTrendData = [
  { month: '1月', reference: 100, actual: 102 },
  { month: '2月', reference: 98, actual: 97 },
  { month: '3月', reference: 101, actual: 99 },
  { month: '4月', reference: 103, actual: 101 },
  { month: '5月', reference: 102, actual: 100 },
  { month: '6月', reference: 100, actual: 98 }
];

const supplierData = [
  { name: '诚信电子', count: 45, amount: 680000 },
  { name: '科技办公', count: 32, amount: 520000 },
  { name: '现代办公', count: 58, amount: 740000 },
  { name: '数码科技', count: 21, amount: 310000 }
];

const timeRanges = [
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'quarter', label: '本季度' },
  { value: 'year', label: '本年' }
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');

  // 统计数据
  const stats = {
    totalContracts: 95,
    totalRequests: 268,
    totalPOs: 214,
    totalAmount: 14700000,
    contractGrowth: 12,
    requestGrowth: 8,
    amountGrowth: 15
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              数据分析
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              采购数据全方位分析与洞察
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                {stats.contractGrowth > 0 ? (
                  <span className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +{stats.contractGrowth}%
                  </span>
                ) : (
                  <span className="flex items-center text-xs text-red-600">
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                    {stats.contractGrowth}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalContracts}</p>
              <p className="text-xs text-slate-500 mt-1">销售合同</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-orange-600" />
                </div>
                <span className="flex items-center text-xs text-green-600">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +{stats.requestGrowth}%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalRequests}</p>
              <p className="text-xs text-slate-500 mt-1">采购需求</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalPOs}</p>
              <p className="text-xs text-slate-500 mt-1">采购订单</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="flex items-center text-xs text-green-600">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +{stats.amountGrowth}%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                ¥{(stats.totalAmount / 10000).toFixed(1)}万
              </p>
              <p className="text-xs text-slate-500 mt-1">总金额</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Contract Trend */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                销售合同趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contractData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Request Type Distribution */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                需求类型分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={requestTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {requestTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {requestTypeData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-600">{item.name}</span>
                    <span className="text-xs font-medium text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Trend */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                价格趋势对比
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                外销参考价 vs 实际采购价 (指数)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="reference" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="参考价" />
                    <Line type="monotone" dataKey="actual" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} name="实际价" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Ranking */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                供应商排行
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                按订单数量统计
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplierData.map((supplier, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-slate-100 text-slate-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900">{supplier.name}</span>
                        <span className="text-xs text-slate-500">{supplier.count} 单</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                          style={{ width: `${(supplier.count / Math.max(...supplierData.map(s => s.count))) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-600">
                      ¥{(supplier.amount / 10000).toFixed(1)}万
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
