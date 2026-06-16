'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Package,
  ShoppingCart,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types';

const quickActions = [
  { 
    title: '新建采购需求', 
    description: '用自然语言描述您的采购需求', 
    icon: Plus, 
    href: '/requests/new',
    color: 'text-orange-500 bg-orange-50'
  },
  { 
    title: '查看采购订单', 
    description: '跟踪和管理所有采购订单', 
    icon: FileText, 
    href: '/pos',
    color: 'text-blue-500 bg-blue-50'
  },
  { 
    title: '供应商协作', 
    description: '与供应商进行订单协作', 
    icon: Users, 
    href: '/supplier',
    color: 'text-green-500 bg-green-50'
  },
];

const recentActivities = [
  { 
    type: 'request',
    title: '新采购需求提交', 
    description: '市场部提交了办公用品采购需求', 
    time: '2分钟前',
    icon: ShoppingCart,
    status: 'pending'
  },
  { 
    type: 'approval',
    title: '审批通过', 
    description: 'IT设备采购订单已通过审批', 
    time: '15分钟前',
    icon: CheckCircle2,
    status: 'approved'
  },
  { 
    type: 'po',
    title: 'PO生成', 
    description: '采购订单 #PO2024001 已生成', 
    time: '1小时前',
    icon: FileText,
    status: 'generated'
  },
  { 
    type: 'ai',
    title: 'AI推荐供应商', 
    description: 'Hermes Agent 已为您推荐3家供应商', 
    time: '2小时前',
    icon: MessageSquare,
    status: 'recommended'
  },
];

const stats = [
  { 
    title: '待处理需求', 
    value: '12', 
    change: '+3',
    icon: Package,
    color: 'text-orange-500'
  },
  { 
    title: '进行中订单', 
    value: '28', 
    change: '+5',
    icon: ShoppingCart,
    color: 'text-blue-500'
  },
  { 
    title: '本月采购额', 
    value: '¥128,500', 
    change: '+12.5%',
    icon: DollarSign,
    color: 'text-green-500'
  },
  { 
    title: '活跃供应商', 
    value: '45', 
    change: '+2',
    icon: Users,
    color: 'text-purple-500'
  },
];

export default function DashboardPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>('purchaser');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-3">
              采购管理系统
            </h1>
            <p className="text-slate-600 text-lg">
              由 Hermes Agent 驱动的智能采购平台
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-none shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                      <Badge variant="secondary" className="font-normal text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm mb-2">{stat.title}</p>
                      <p className="text-3xl font-semibold text-slate-900 tracking-tight">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6">快捷操作</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link key={index} href={action.href}>
                        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer h-full">
                          <CardContent className="p-8">
                            <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200`}>
                              <Icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-3">{action.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{action.description}</p>
                            <div className="mt-6 flex items-center text-slate-500 text-sm group-hover:text-orange-500 transition-colors">
                              开始操作 <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="mt-12">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">最近动态</h2>
                <Card className="border-none shadow-sm">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {recentActivities.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <div key={index} className="flex items-start gap-5 p-5 rounded-2xl hover:bg-slate-50 transition-colors duration-200">
                            <div className="mt-1 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="font-medium text-slate-900 text-base">{activity.title}</p>
                                  <p className="text-slate-600 text-sm mt-1">{activity.description}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-slate-500 text-sm flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {activity.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI Assistant Panel */}
            <div className="lg:col-span-1">
              <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-amber-50 h-full">
                <CardHeader className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">Hermes Agent</CardTitle>
                      <CardDescription className="text-slate-600 text-base">AI 采购助手</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="space-y-5">
                    <div className="bg-white/70 backdrop-blur rounded-2xl p-5">
                      <p className="text-slate-700 text-sm leading-relaxed">
                        👋 您好！我可以帮助您：
                      </p>
                      <ul className="mt-4 space-y-3 text-sm text-slate-600">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span>理解自然语言需求</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span>智能推荐供应商</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span>辅助决策建议</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Link href="/requests/new">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-6">
                        <Plus className="w-5 h-5 mr-2" />
                        开始智能采购
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
