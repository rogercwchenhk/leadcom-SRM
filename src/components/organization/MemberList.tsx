'use client';

import React from 'react';
import { Edit, Trash2, Plus, Mail, Phone, Calendar, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TeamMember, ROLE_LABELS, ROLE_COLORS } from '@/types';

interface MemberListProps {
  teamMembers: TeamMember[];
  onAddMember: () => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (member: TeamMember) => void;
}

function TeamMemberCard({
  member,
  onEdit,
  onDelete,
  allMembers
}: {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
  allMembers: TeamMember[];
}) {
  const supervisor = member.supervisorId 
    ? allMembers.find(m => m.id === member.supervisorId)
    : null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-start justify-between p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
      <div className="flex items-start gap-4 flex-1">
        <Avatar className="h-12 w-12">
          <AvatarImage src={member.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-slate-900">{member.name}</h4>
            {!member.isActive && (
              <Badge variant="secondary" className="text-xs">已离职</Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {(member.roles || []).map(role => (
              <Badge 
                key={role} 
                className={`text-[10px] ${ROLE_COLORS[role]}`}
              >
                {ROLE_LABELS[role]}
              </Badge>
            ))}
          </div>
          
          <div className="space-y-1">
            {member.position && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Briefcase className="w-3 h-3" />
                <span>{member.position}</span>
              </div>
            )}
            {member.department && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-3 h-3 flex items-center justify-center text-slate-400">🏢</span>
                <span>{member.department}</span>
              </div>
            )}
            {member.email && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="w-3 h-3" />
                <span className="truncate">{member.email}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone className="w-3 h-3" />
                <span>{member.phone}</span>
              </div>
            )}
            {supervisor && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-3 h-3 flex items-center justify-center text-slate-400">👤</span>
                <span>上级: {supervisor.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>入职: {member.joinDate.toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 ml-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => onEdit(member)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(member)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function MemberList({
  teamMembers,
  onAddMember,
  onEditMember,
  onDeleteMember
}: MemberListProps) {
  const activeMembers = teamMembers.filter(m => m.isActive);
  const inactiveMembers = teamMembers.filter(m => !m.isActive);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-1 pt-2 px-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">组织成员</CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              管理公司组织架构和人员信息
            </CardDescription>
          </div>
          <Button size="sm" className="h-8 gap-1" onClick={onAddMember}>
            <Plus className="w-3.5 h-3.5" />
            添加成员
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-3">
          {activeMembers.map((member) => (
            <TeamMemberCard 
              key={member.id} 
              member={member}
              onEdit={onEditMember}
              onDelete={onDeleteMember}
              allMembers={teamMembers}
            />
          ))}
          
          {inactiveMembers.length > 0 && (
            <>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-3">已离职成员 ({inactiveMembers.length})</p>
              </div>
              {inactiveMembers.map((member) => (
                <TeamMemberCard 
                  key={member.id} 
                  member={member}
                  onEdit={onEditMember}
                  onDelete={onDeleteMember}
                  allMembers={teamMembers}
                />
              ))}
            </>
          )}
          
          {teamMembers.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-8">
              暂无成员，点击"添加成员"按钮创建
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
