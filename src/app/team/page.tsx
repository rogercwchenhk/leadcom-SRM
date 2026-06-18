'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UsersRound, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase,
  Building,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  PRESET_TEAM_MEMBERS, 
  PRESET_POSITIONS, 
  ROLE_LABELS, 
  ROLE_COLORS,
  type TeamMember,
  type Position
} from '@/types';

export default function TeamPage() {
  return (
    <AppLayout initialRole="purchaser_manager">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <UsersRound className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                  团队管理
                </h1>
                <p className="text-sm text-slate-500">
                  管理团队成员和岗位职责
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Team Members */}
            <div className="lg:col-span-2 space-y-6">
              {/* Team Members Card */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-1 pt-2 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-900">团队成员</CardTitle>
                    <Badge variant="outline" className="text-[11px] h-5">
                      {PRESET_TEAM_MEMBERS.length} 人
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    采购团队核心成员
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="space-y-3">
                    {PRESET_TEAM_MEMBERS.map((member) => (
                      <TeamMemberCard key={member.id} member={member} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Positions */}
            <div className="space-y-6">
              {/* Positions Card */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-1 pt-2 px-4">
                  <CardTitle className="text-sm font-semibold text-slate-900">岗位职责</CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    各岗位的职责说明
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="space-y-3">
                    {PRESET_POSITIONS.slice(0, 3).map((position) => (
                      <PositionCard key={position.id} position={position} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Card */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-1 pt-2 px-4">
                  <CardTitle className="text-sm font-semibold text-slate-900">采购闭环流程</CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    从询价到付款的完整流程
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="space-y-2">
                    {[
                      { step: 1, title: '对外询价', role: '梁静（采购专员）' },
                      { step: 2, title: '订单生产', role: '梁静（采购专员）' },
                      { step: 3, title: '收货确认', role: '客服 + 梁静' },
                      { step: 4, title: '收发票', role: '梁静（采购专员）' },
                      { step: 5, title: '付款申请', role: '梁静（采购专员）' },
                      { step: 6, title: '审批', role: '钟丽莉（采购负责人）' },
                      { step: 7, title: '付款完成', role: '财务' }
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold">{item.step}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 border-2 border-slate-100">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 truncate">
                  {member.name}
                </h3>
                {member.isActive && (
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px] h-4">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    在职
                  </Badge>
                )}
              </div>
              {member.position && (
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {member.position}
                </p>
              )}
              {member.department && (
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {member.department}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {member.roles.map((role) => (
              <Badge 
                key={role} 
                className={`${ROLE_COLORS[role]} text-[10px] h-5`}
              >
                {ROLE_LABELS[role]}
              </Badge>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Mail className="w-3 h-3" />
              <span className="truncate">{member.email}</span>
            </div>
            {member.phone && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Phone className="w-3 h-3" />
                <span>{member.phone}</span>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function PositionCard({ position }: { position: Position }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
        {position.name}
      </h4>
      <p className="text-xs text-slate-500 mb-2">
        {position.description}
      </p>
      <div className="space-y-1">
        <p className="text-[11px] font-medium text-slate-600">主要职责：</p>
        <ul className="space-y-0.5">
          {position.responsibilities.slice(0, 3).map((resp, index) => (
            <li key={index} className="flex items-start gap-1.5">
              <div className="w-1 h-1 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
              <span className="text-[11px] text-slate-500">{resp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
