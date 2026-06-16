'use client';

import React, { useState, useEffect } from 'react';

type ActivityStatus = 'success' | 'warning' | 'info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign,
  ArrowRight,
  Package,
  ClipboardList,
  BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { 
      label: '待处理需求', 
      value: '12', 
      trend: '+3', 
      trendUp: true, 
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: '询价中', 
      value: '8', 
      trend: '+2', 
      trendUp: true, 
      icon: MessageSquare,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    { 
      label: '待审批', 
      value: '3', 
      trend: '-1', 
      trendUp: false, 
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      label: '本月订单', 
      value: '45', 
      trend: '+8', 
      trendUp: true, 
      icon: FileText,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    { 
      label: '本月金额', 
      value: '¥28.6K', 
      trend: '+12%', 
      trendUp: true, 
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      label: '活跃供应商', 
      value: '24', 
      trend: '+2', 
      trendUp: true, 
      icon: Package,
      color: 'text-slate-600',
      bg: 'bg-slate-50'
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
      action: '需求已提交', 
      title: '办公设备采购', 
      time: '2分钟前', 
      status: 'success',
      icon: CheckCircle
    },
    { 
      id: 2, 
      action: '收到报价', 
      title: 'IT服务供应商A报价 ¥15,000', 
      time: '5分钟前', 
      status: 'info',
      icon: MessageSquare
    },
    { 
      id: 3, 
      action: '待审批', 
      title: '超过5万元的采购订单', 
      time: '12分钟前', 
      status: 'warning',
      icon: AlertCircle
    },
    { 
      id: 4, 
      action: 'PO已生成', 
      title: '采购合同 #PO20240115', 
      time: '15分钟前', 
      status: 'success',
      icon: FileText
    },
    { 
      id: 5, 
      action: '发货通知', 
      title: '供应商B已发货', 
      time: '28分钟前', 
      status: 'info',
      icon: TrendingUp
    },
    { 
      id: 6, 
      action: '发票已收到', 
      title: '发票 #INV20240089', 
      time: '35分钟前', 
      status: 'success',
      icon: CheckCircle
    }
  ];

  const quickActions = [
    { 
      title: '新建需求', 
      description: 'AI智能分析', 
      icon: ShoppingCart,
      action: () => router.push('/requests/new'),
      variant: 'default' as const
    },
    { 
      title: '查看需求', 
      description: '全部采购需求', 
      icon: ClipboardList,
      action: () => router.push('/requests'),
      variant: 'outline' as const
    },
    { 
      title: 'PO管理', 
      description: '采购订单', 
      icon: FileText,
      action: () => router.push('/pos'),
      variant: 'outline' as const
    },
    { 
      title: '数据分析', 
      description: '采购数据', 
      icon: BarChart3,
      action: () => {},
      variant: 'outline' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              采购管理系统
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Hermes Agent 智能驱动 · {currentTime}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" aria-hidden="true" />
              <span className="text-sm font-medium text-orange-700">Hermes 在线</span>
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
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {stat.trend}
                          </span>
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
                        onClick={action.action}
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
            </div>

            {/* Right Column - Recent Activity */}
            <div className="col-span-8">
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
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {stat.trend}
                      </span>
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
                    onClick={action.action}
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

          {/* Recent Activity - Mobile */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-1 pt-2 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-900">实时动态</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-700 h-7" aria-label="查看全部动态">
                查看全部
              </Button>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="space-y-2">
                {recentActivities.slice(0, 4).map((activity) => {
                  const IconComponent = activity.icon;
                  const statusColors = {
                    success: 'text-green-500 bg-green-50',
                    warning: 'text-orange-500 bg-orange-50',
                    info: 'text-blue-500 bg-blue-50'
                  };
                  
                  return (
                    <div 
                      key={activity.id}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                    >
                      <div className={`w-7 h-7 rounded-full ${statusColors[activity.status]} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-medium text-slate-900">
                            {activity.action}
                          </span>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 truncate">
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
      </div>
    </div>
  );
}
