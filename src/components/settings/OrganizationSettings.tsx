'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UsersRound, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  Plus,
  Edit,
  Trash2,
  Users,
  Layout,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  PRESET_TEAM_MEMBERS, 
  PRESET_POSITIONS, 
  PRESET_DEPARTMENTS,
  ROLE_LABELS, 
  ROLE_COLORS,
  type TeamMember,
  type Position,
  type Department
} from '@/types';
import { OrganizationChart } from './OrganizationChart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Checkbox
} from '@/components/ui/checkbox';

export function OrganizationSettings() {
  const [activeTab, setActiveTab] = useState('chart');
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  
  // 使用 useMemo 确保初始数据只被初始化一次
  const initialMembers = React.useMemo(() => {
    // 深拷贝预设数据，避免修改原始数据
    return PRESET_TEAM_MEMBERS.map(member => ({
      ...member,
      joinDate: new Date(member.joinDate),
      createdAt: new Date(member.createdAt),
      updatedAt: new Date(member.updatedAt)
    }));
  }, []);
  
  const initialDepartments = React.useMemo(() => {
    // 深拷贝预设部门数据
    return PRESET_DEPARTMENTS.map(dept => ({
      ...dept,
      createdAt: new Date(dept.createdAt),
      updatedAt: new Date(dept.updatedAt)
    }));
  }, []);
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialMembers);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  
  // 从现有成员中提取所有部门（包括预设部门和成员中使用的部门）
  const availableDepartments = React.useMemo(() => {
    const deptSet = new Set<string>();
    departments.forEach(dept => deptSet.add(dept.name));
    teamMembers.forEach(member => {
      if (member.department) {
        deptSet.add(member.department);
      }
    });
    return Array.from(deptSet).sort();
  }, [departments, teamMembers]);

  const handleEditMember = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsEditDialogOpen(true);
  };



  const handleDeleteMember = (member: TeamMember) => {
    // 从成员列表中删除
    setTeamMembers(prev => prev.filter(m => m.id !== member.id));
    console.log('删除成员:', member);
  };

  const handleAddMember = () => {
    // 创建新成员的默认数据
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: '',
      email: '',
      phone: '',
      roles: [],
      position: '',
      department: '',
      joinDate: new Date(),
      isActive: true,
      supervisorId: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setEditingMember(newMember);
    setIsAddingMember(true);
    setIsEditDialogOpen(true);
  };

  const handleSaveMember = () => {
    if (!editingMember) return;
    
    if (isAddingMember) {
      // 添加新成员
      setTeamMembers(prev => [...prev, editingMember]);
      console.log('添加新成员:', editingMember);
    } else {
      // 更新成员列表
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === editingMember.id ? editingMember : member
        )
      );
      console.log('保存成员信息:', editingMember);
    }
    
    setIsEditDialogOpen(false);
    setEditingMember(null);
    setIsAddingMember(false);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="chart" className="gap-2">
            <Layout className="h-4 w-4" />
            组织架构图
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <Users className="h-4 w-4" />
            详细列表
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="mt-6">
          <OrganizationChart members={teamMembers} />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Organization Members */}
            <div className="lg:col-span-2 space-y-6">
              {/* Organization Members Card */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-1 pt-2 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-900">组织成员</CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1">
                        管理公司组织架构和人员信息
                      </CardDescription>
                    </div>
                    <Button size="sm" className="h-8 gap-1" onClick={handleAddMember}>
                      <Plus className="w-3.5 h-3.5" />
                      添加成员
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <TeamMemberCard 
                        key={member.id} 
                        member={member}
                        onEdit={handleEditMember}
                        onDelete={handleDeleteMember}
                        allMembers={teamMembers}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Positions & Departments */}
            <div className="space-y-6">
              {/* Departments Card */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-1 pt-2 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-900">部门管理</CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1">
                        组织架构中的可用部门
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="space-y-2">
                    {availableDepartments.map((dept) => (
                      <div 
                        key={dept} 
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-900">{dept}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] h-5">
                          {teamMembers.filter(m => m.department === dept).length} 人
                        </Badge>
                      </div>
                    ))}
                    {availableDepartments.length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-4">
                        暂无部门，请先在组织架构图中添加
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Positions Card */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-1 pt-2 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-900">岗位职责</CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1">
                        各岗位的职责说明
                      </CardDescription>
                    </div>
                  </div>
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
        </TabsContent>
      </Tabs>

      {/* 编辑成员对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isAddingMember ? '添加新成员' : '编辑成员信息'}</DialogTitle>
            <DialogDescription>
              {isAddingMember ? '添加新的组织成员' : '修改组织成员的基本信息和设置'}
            </DialogDescription>
          </DialogHeader>
          
          {editingMember && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingMember.email}
                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, email: e.target.value } : null)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">职位</Label>
                  <Input
                    id="position"
                    value={editingMember.position || ''}
                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, position: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">部门</Label>
                  <Select
                    value={editingMember.department || ''}
                    onValueChange={(value) => setEditingMember(prev => 
                      prev ? { ...prev, department: value } : null
                    )}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    部门需在组织架构中先创建，或从已有成员的部门中选择
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">电话</Label>
                <Input
                  id="phone"
                  value={editingMember.phone || ''}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, phone: e.target.value } : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supervisor">上级</Label>
                <Select
                  value={editingMember.supervisorId || 'none'}
                  onValueChange={(value) => setEditingMember(prev => 
                    prev ? { ...prev, supervisorId: value === 'none' ? undefined : value } : null
                  )}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择上级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无上级</SelectItem>
                    {teamMembers
                      .filter(m => m.id !== editingMember.id)
                      .map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.position}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label>角色权限</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(ROLE_LABELS).map(([role, label]) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={editingMember.roles.includes(role as any)}
                        onCheckedChange={(checked) => {
                          setEditingMember(prev => {
                            if (!prev) return null;
                            const newRoles = checked
                              ? [...prev.roles, role as any]
                              : prev.roles.filter(r => r !== role);
                            return { ...prev, roles: newRoles };
                          });
                        }}
                      />
                      <label
                        htmlFor={`role-${role}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={editingMember.isActive}
                  onCheckedChange={(checked) => setEditingMember(prev => 
                    prev ? { ...prev, isActive: checked } : null
                  )}
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium leading-none"
                >
                  在职状态
                </label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingMember(null);
              setIsAddingMember(false);
            }}>
              取消
            </Button>
            <Button onClick={handleSaveMember}>
              {isAddingMember ? '添加' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
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
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const supervisor = allMembers.find(m => m.id === member.supervisorId);
  const subordinates = allMembers.filter(m => m.supervisorId === member.id);

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
              <div className="flex items-center gap-2 flex-wrap">
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
              {/* 上级信息 */}
              {supervisor && (
                <p className="text-xs text-orange-600 mt-0.5 flex items-center gap-1">
                  <UsersRound className="w-3 h-3" />
                  上级：{supervisor.name}
                </p>
              )}
            </div>
            <div className="flex gap-1">
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

          {/* 下属信息 */}
          {subordinates.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] font-medium text-slate-600 mb-1.5">下属：</p>
              <div className="flex flex-wrap gap-1.5">
                {subordinates.map(sub => (
                  <Badge key={sub.id} variant="outline" className="text-[10px] h-5">
                    {sub.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 col-span-2">
              <Calendar className="w-3 h-3" />
              <span>入职时间：{member.joinDate.toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PositionCard({ position }: { position: Position }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
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
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
