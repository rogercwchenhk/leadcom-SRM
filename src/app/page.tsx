'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  FileText, 
  Users, 
  TrendingUp,
  Plus,
  ArrowRight,
  Bot,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    title: '待处理需求',
    value: '12',
    change: '+3 本周',
    icon: ShoppingCart,
    trend: 'up',
  },
  {
    title: '进行中的PO',
    value: '8',
    change: '+2 本周',
    icon: FileText,
    trend: 'up',
  },
  {
    title: '活跃供应商',
    value: '24',
    change: '无变化',
    icon: Users,
    trend: 'neutral',
  },
  {
    title: '本月采购额',
    value: '¥128,500',
    change: '+15% 环比',
    icon: TrendingUp,
    trend: 'up',
  },
];

const recentActivity = [
  { id: 1, type: '需求', title: '笔记本电脑采购申请', time: '2分钟前', status: '待确认' },
  { id: 2, type: '审批', title: 'PO-20240120001 审批通过', time: '15分钟前', status: '已完成' },
  { id: 3, type: '发货', title: '办公用纸已发货', time: '1小时前', status: '运输中' },
  { id: 4, type: '发票', title: '收到打印机采购发票', time: '2小时前', status: '待付款' },
];

export default function Home() {
  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              采购管理系统
            </h1>
            <p className="text-muted-foreground">
              基于 Hermes Agent 的智能采购平台
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/requests/new">
              <Button className="gap-2 h-10 px-5">
                <Plus className="h-4 w-4" />
                新建采购需求
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-muted rounded-lg">
                  <stat.icon className="h-4 w-4 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                <p className={`text-xs mt-1 ${
                  stat.trend === 'up' ? 'text-emerald-600' : 
                  stat.trend === 'down' ? 'text-rose-600' : 'text-muted-foreground'
                }`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Bot className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle>AI 智能助手</CardTitle>
                  <CardDescription>
                    Hermes Agent 为您提供智能采购辅助
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Link href="/requests/new">
                  <Button variant="secondary" className="w-full justify-start gap-3 h-11 border shadow-sm hover:shadow transition-all duration-200">
                    <div className="p-1.5 bg-orange-50 rounded-md">
                      <Sparkles className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="font-medium">用自然语言描述采购需求</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
                <Link href="/requests">
                  <Button variant="secondary" className="w-full justify-start gap-3 h-11 border shadow-sm hover:shadow transition-all duration-200">
                    <div className="p-1.5 bg-muted rounded-md">
                      <ShoppingCart className="h-4 w-4 text-foreground" />
                    </div>
                    <span className="font-medium">查看所有采购需求</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
                <Link href="/pos">
                  <Button variant="secondary" className="w-full justify-start gap-3 h-11 border shadow-sm hover:shadow transition-all duration-200">
                    <div className="p-1.5 bg-muted rounded-md">
                      <FileText className="h-4 w-4 text-foreground" />
                    </div>
                    <span className="font-medium">管理采购订单</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle>最近动态</CardTitle>
              <CardDescription>
                系统最新的采购活动记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-1">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.type} · {activity.time}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      activity.status === '已完成' ? 'bg-emerald-50 text-emerald-700' :
                      activity.status === '待确认' || activity.status === '待付款' ? 'bg-amber-50 text-amber-700' :
                      'bg-sky-50 text-sky-700'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
