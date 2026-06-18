'use client';

import React, { useState, useEffect } from 'react';
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
  X,
  Save,
  Download,
  RefreshCw
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
  const [editingDepartment, setEditingDepartment] = useState<{ id?: string; name: string; description?: string; parentDepartmentId?: string } | null>(null);
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 状态管理 - 初始为空，从 API 加载
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  // 添加一个强制重新渲染的版本号
  const [dataVersion, setDataVersion] = useState(0);

  // 从 API 加载数据
  useEffect(() => {
    loadFromAPI();
  }, []);

  // 强制更新数据版本，触发重新渲染
  const bumpDataVersion = () => {
    setDataVersion(prev => prev + 1);
  };

  // 从 API 加载数据 - API 会自动处理文件是否存在的问题
  const loadFromAPI = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/organization');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.departments);
        setTeamMembers(data.teamMembers);
        bumpDataVersion(); // 加载数据后也更新版本
        console.log('从 YAML 文件加载数据成功');
      } else {
        console.error('API 响应失败:', response.status);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 保存数据到 API
  const saveToAPI = async () => {
    try {
      console.log('正在保存数据到 YAML 文件...');
      console.log('待保存数据:', { departmentsCount: departments.length, teamMembersCount: teamMembers.length });
      
      const response = await fetch('/api/organization', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ departments, teamMembers }),
      });
      
      if (response.ok) {
        console.log('数据保存到 YAML 文件成功');
        // 保存成功后重新加载数据，确保数据同步
        await loadFromAPI();
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: '未知错误' };
        }
        console.error('保存数据失败:', errorData);
      }
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  };

  // 暂时禁用自动保存，只使用手动保存以确保稳定性
  // 当用户点击"保存"按钮时才会保存数据

  // 导出 YAML 功能
  const handleExportYAML = async () => {
    try {
      const response = await fetch('/api/organization');
      if (response.ok) {
        // 为了简单，我们直接从内存数据生成 YAML 用于导出
        const departmentsForYaml = departments.map((dept: any) => ({
          ...dept,
          createdAt: dept.createdAt.toISOString(),
          updatedAt: dept.updatedAt.toISOString()
        }));

        const teamMembersForYaml = teamMembers.map((member: any) => ({
          ...member,
          joinDate: member.joinDate.toISOString(),
          createdAt: member.createdAt.toISOString(),
          updatedAt: member.updatedAt.toISOString()
        }));

        const yamlContent = `# 组织架构配置文件
# 用途：存储公司组织架构、部门和人员信息
# 说明：此文件由系统自动管理，也可手动编辑
# AI 友好格式：清晰的注释、结构化数据、有意义的字段名

---
# 部门配置
departments: ${JSON.stringify(departmentsForYaml, null, 2)}
---
# 团队成员配置
teamMembers: ${JSON.stringify(teamMembersForYaml, null, 2)}`;

        // 创建下载
        const blob = new Blob([yamlContent], { type: 'text/yaml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'organization.yaml';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('导出 YAML 失败:', error);
      alert('导出失败');
    }
  };
  
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

  // 构建部门树形结构用于显示
  const departmentTree = React.useMemo(() => {
    // 找出顶级部门
    const topLevelDepts = departments.filter(d => !d.parentDepartmentId);
    
    // 递归构建树形结构
    const buildTree = (depts: Department[]): Array<{ dept: Department; children: any[]; level: number }> => {
      return depts.map(dept => {
        const children = departments.filter(d => d.parentDepartmentId === dept.id);
        return {
          dept,
          children: buildTree(children),
          level: 0
        };
      });
    };
    
    // 扁平化树形结构用于显示，并添加层级
    const flattenTree = (nodes: any[], level: number = 0): Array<{ dept: Department; level: number }> => {
      let result: Array<{ dept: Department; level: number }> = [];
      nodes.forEach(node => {
        result.push({ dept: node.dept, level });
        result = result.concat(flattenTree(node.children, level + 1));
      });
      return result;
    };
    
    const tree = buildTree(topLevelDepts);
    return flattenTree(tree);
  }, [departments]);

  const handleEditMember = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsEditDialogOpen(true);
  };



  const handleDeleteMember = (member: TeamMember) => {
    // 从成员列表中删除，确保创建全新的数组引用
    setTeamMembers(prev => {
      const filtered = prev.filter(m => m.id !== member.id);
      return [...filtered];
    });
    bumpDataVersion(); // 强制更新数据版本
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
      // 添加新成员，确保创建全新的数组引用
      setTeamMembers(prev => {
        const updated = [...prev];
        updated.push(editingMember);
        return updated;
      });
      console.log('添加新成员:', editingMember);
    } else {
      // 更新成员列表，确保创建全新的数组引用
      setTeamMembers(prev => {
        const updated = prev.map(member => 
          member.id === editingMember.id ? editingMember : member
        );
        return [...updated];
      });
      console.log('保存成员信息:', editingMember);
    }
    
    bumpDataVersion(); // 强制更新数据版本
    setIsEditDialogOpen(false);
    setEditingMember(null);
    setIsAddingMember(false);
  };

  // 部门管理功能
  const handleAddDepartment = () => {
    setEditingDepartment({ name: '', description: '', parentDepartmentId: undefined });
    setIsAddingDepartment(true);
    setIsDepartmentDialogOpen(true);
  };

  const handleEditDepartment = (deptName: string) => {
    const dept = departments.find(d => d.name === deptName);
    setEditingDepartment({
      id: dept?.id,
      name: deptName,
      description: dept?.description,
      parentDepartmentId: dept?.parentDepartmentId
    });
    setIsAddingDepartment(false);
    setIsDepartmentDialogOpen(true);
  };

  const handleDeleteDepartment = (deptName: string) => {
    const dept = departments.find(d => d.name === deptName);
    if (!dept) return;
    
    // 检查该部门下是否有成员
    const hasMembers = teamMembers.some(m => m.department === deptName);
    if (hasMembers) {
      alert('该部门下还有成员，无法删除。请先将成员移动到其他部门。');
      return;
    }
    
    // 检查该部门下是否有子部门
    const hasChildDepts = departments.some(d => d.parentDepartmentId === dept.id);
    if (hasChildDepts) {
      alert('该部门下还有子部门，无法删除。请先删除或移动子部门。');
      return;
    }
    
    // 从部门列表中删除，确保创建全新的数组引用
    setDepartments(prev => {
      const filtered = prev.filter(d => d.id !== dept.id);
      return [...filtered];
    });
    bumpDataVersion(); // 强制更新数据版本
    console.log('删除部门:', deptName);
  };

  const handleSaveDepartment = () => {
    if (!editingDepartment || !editingDepartment.name.trim()) return;
    
    if (isAddingDepartment) {
      // 检查部门名称是否已存在
      if (availableDepartments.includes(editingDepartment.name)) {
        alert('该部门名称已存在');
        return;
      }
      
      // 检查是否会造成循环引用
      if (editingDepartment.parentDepartmentId) {
        const wouldCycle = checkCycle(departments, editingDepartment.parentDepartmentId, editingDepartment.id || `dept-${Date.now()}`);
        if (wouldCycle) {
          alert('不能选择该部门作为上级，会造成循环引用');
          return;
        }
      }
      
      // 添加新部门
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        name: editingDepartment.name,
        description: editingDepartment.description,
        parentDepartmentId: editingDepartment.parentDepartmentId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      console.log('准备添加新部门:', newDept);
      // 确保创建全新的数组引用
      setDepartments(prev => {
        const updated = [...prev];
        updated.push(newDept);
        console.log('部门列表已更新:', updated.map(d => d.name));
        return updated;
      });
      bumpDataVersion(); // 强制更新数据版本
      console.log('添加新部门完成');
    } else {
      // 检查是否会造成循环引用
      if (editingDepartment.parentDepartmentId && editingDepartment.id) {
        const wouldCycle = checkCycle(departments, editingDepartment.parentDepartmentId, editingDepartment.id);
        if (wouldCycle) {
          alert('不能选择该部门作为上级，会造成循环引用');
          return;
        }
      }
      
      // 更新部门 - 使用函数式更新确保获取最新状态
      setDepartments(prev => {
        // 确保创建全新的数组引用
        const updated = prev.map(dept => 
          dept.id === editingDepartment.id 
            ? { 
                ...dept, 
                name: editingDepartment.name, 
                description: editingDepartment.description,
                parentDepartmentId: editingDepartment.parentDepartmentId,
                updatedAt: new Date() 
              }
            : dept
        );
        return [...updated];
      });
      
      // 如果部门名称改了，同时更新成员的部门 - 也需要在状态更新后处理
      setTimeout(() => {
        // 延迟执行以确保我们能获取到最新的部门状态
        setDepartments(currentDepts => {
          const oldDept = currentDepts.find(d => d.id === editingDepartment.id);
          if (oldDept && oldDept.name !== editingDepartment.name) {
            setTeamMembers(prevMembers => 
              prevMembers.map(member => 
                member.department === oldDept.name 
                  ? { ...member, department: editingDepartment.name }
                  : member
              )
            );
          }
          return currentDepts; // 返回不变的部门列表
        });
      }, 0);
      
      bumpDataVersion(); // 强制更新数据版本
      console.log('保存部门信息:', editingDepartment);
    }
    
    setIsDepartmentDialogOpen(false);
    setEditingDepartment(null);
    setIsAddingDepartment(false);
  };

  // 检查循环引用
  const checkCycle = (depts: Department[], parentId: string, currentId: string): boolean => {
    const visited = new Set<string>();
    let checkId: string | undefined = parentId;
    
    while (checkId) {
      if (checkId === currentId) return true;
      if (visited.has(checkId)) return true; // 检测到环
      visited.add(checkId);
      const dept = depts.find(d => d.id === checkId);
      checkId = dept?.parentDepartmentId;
    }
    
    return false;
  };
  
  return (
    <div className="space-y-6">
      {/* 数据管理工具栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">组织架构设置</h2>
          <p className="text-sm text-slate-500">管理公司部门、人员和组织架构</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 gap-1" 
            onClick={loadFromAPI}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button 
            size="sm" 
            className="h-9 gap-1" 
            onClick={saveToAPI}
          >
            <Save className="w-4 h-4" />
            保存
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-1" 
            onClick={handleExportYAML}
          >
            <Download className="w-4 h-4" />
            导出 YAML
          </Button>
        </div>
      </div>

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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* 使用 dataVersion 作为 key，强制在数据变化时重新渲染整个组件 */}
              <OrganizationChart 
                key={`org-chart-${dataVersion}`} 
                members={teamMembers} 
                departments={departments} 
              />
            </div>
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
                    <Button size="sm" className="h-8 gap-1" onClick={handleAddDepartment}>
                      <Plus className="w-3.5 h-3.5" />
                      添加
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="space-y-2">
                    {departmentTree.map(({ dept, level }) => (
                      <div 
                        key={dept.id} 
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                        style={{ paddingLeft: `${level * 16 + 8}px` }}
                      >
                        <div className="flex items-center gap-2">
                          {level > 0 && (
                            <div className="w-3 h-px bg-slate-300" />
                          )}
                          <Building className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-900">{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-[10px] h-5">
                            {teamMembers.filter(m => m.department === dept.name).length} 人
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={() => handleEditDepartment(dept.name)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteDepartment(dept.name)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {departmentTree.length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-4">
                        暂无部门，点击"添加"按钮创建
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
                    <Button size="sm" className="h-8 gap-1" onClick={handleAddDepartment}>
                      <Plus className="w-3.5 h-3.5" />
                      添加
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="space-y-2">
                    {departmentTree.map(({ dept, level }) => (
                      <div 
                        key={dept.id} 
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                        style={{ paddingLeft: `${level * 16 + 8}px` }}
                      >
                        <div className="flex items-center gap-2">
                          {level > 0 && (
                            <div className="w-3 h-px bg-slate-300" />
                          )}
                          <Building className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-900">{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-[10px] h-5">
                            {teamMembers.filter(m => m.department === dept.name).length} 人
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={() => handleEditDepartment(dept.name)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteDepartment(dept.name)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {departmentTree.length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-4">
                        暂无部门，点击"添加"按钮创建
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

      {/* 部门管理对话框 */}
      <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isAddingDepartment ? '添加新部门' : '编辑部门'}</DialogTitle>
            <DialogDescription>
              {isAddingDepartment ? '创建新的组织部门' : '修改部门信息'}
            </DialogDescription>
          </DialogHeader>
          
          {editingDepartment && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="dept-name">部门名称</Label>
                <Input
                  id="dept-name"
                  value={editingDepartment.name}
                  onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="请输入部门名称"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dept-parent">上级部门</Label>
                <Select
                  value={editingDepartment.parentDepartmentId || 'none'}
                  onValueChange={(value) => setEditingDepartment(prev => 
                    prev ? { ...prev, parentDepartmentId: value === 'none' ? undefined : value } : null
                  )}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择上级部门（可选）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无上级部门（顶级部门）</SelectItem>
                    {departments
                      .filter(d => d.id !== editingDepartment.id) // 不能选择自己作为上级
                      .map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  选择上级部门来建立组织层级关系
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dept-description">部门描述</Label>
                <Input
                  id="dept-description"
                  value={editingDepartment.description || ''}
                  onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="请输入部门描述（可选）"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDepartmentDialogOpen(false);
              setEditingDepartment(null);
              setIsAddingDepartment(false);
            }}>
              取消
            </Button>
            <Button onClick={handleSaveDepartment}>
              {isAddingDepartment ? '添加' : '保存'}
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
