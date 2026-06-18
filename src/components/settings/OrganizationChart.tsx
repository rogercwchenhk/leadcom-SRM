'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UsersRound, 
  Briefcase,
  Building,
  ChevronDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  User,
  ListTree,
  Grid3X3,
  List as ListIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  ROLE_LABELS, 
  ROLE_COLORS,
  type TeamMember,
  type Department
} from '@/types';

interface OrgNode {
  id: string;
  name: string;
  title: string;
  department: string;
  member?: TeamMember;
  children: OrgNode[];
  isExpanded: boolean;
  type: 'root' | 'department' | 'person';
}

interface OrganizationChartProps {
  members: TeamMember[];
  departments: Department[];
}

export function OrganizationChart({ members, departments }: OrganizationChartProps) {
  const [viewMode, setViewMode] = useState<'tree' | 'list' | 'matrix'>('list');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

  // 每次组件接收到新props时，重置展开状态并记录日志
  React.useEffect(() => {
    console.log('=== OrganizationChart 收到新数据 ===');
    console.log('部门数量:', departments.length);
    console.log('部门列表:', departments.map(d => ({ id: d.id, name: d.name, parent: d.parentDepartmentId })));
    console.log('成员数量:', members.length);
    setExpandedNodes(new Set(['root']));
  }, [members, departments]);

  // 构建组织架构树
  const orgData = useMemo(() => {
    console.log('=== 重新构建组织架构树 ===');
    
    function buildOrgTree(members: TeamMember[], depts: Department[]): OrgNode {
      const root: OrgNode = {
        id: 'root',
        name: '公司',
        title: '组织架构',
        department: '',
        children: [],
        isExpanded: true,
        type: 'root'
      };

      // 找出顶级部门（没有上级部门的）
      const topLevelDepts = depts.filter(d => !d.parentDepartmentId);
      console.log('顶级部门:', topLevelDepts.map(d => d.name));
      
      // 递归构建部门树
      topLevelDepts.forEach(dept => {
        const deptNode = buildDepartmentTree(dept, depts, members);
        root.children.push(deptNode);
      });

      // 处理没有部门的成员
      const membersWithoutDept = members.filter(m => !m.department);
      if (membersWithoutDept.length > 0) {
        const unassignedDeptNode: OrgNode = {
          id: 'dept-unassigned',
          name: '未分配',
          title: '未分配部门',
          department: '未分配',
          children: [],
          isExpanded: true,
          type: 'department'
        };
        
        const supervisors = membersWithoutDept.filter(m => !m.supervisorId);
        supervisors.forEach(supervisor => {
          const supervisorNode = buildPersonTree(supervisor, membersWithoutDept);
          unassignedDeptNode.children.push(supervisorNode);
        });
        
        root.children.push(unassignedDeptNode);
      }

      console.log('构建完成的根节点:', root);
      return root;
    }

    function buildDepartmentTree(dept: Department, allDepts: Department[], allMembers: TeamMember[]): OrgNode {
      const deptNode: OrgNode = {
        id: dept.id,
        name: dept.name,
        title: dept.description || dept.name,
        department: dept.name,
        children: [],
        isExpanded: true,
        type: 'department'
      };

      // 添加子部门
      const childDepts = allDepts.filter(d => d.parentDepartmentId === dept.id);
      console.log(`部门 ${dept.name} 的子部门:`, childDepts.map(d => d.name));
      childDepts.forEach(childDept => {
        const childDeptNode = buildDepartmentTree(childDept, allDepts, allMembers);
        deptNode.children.push(childDeptNode);
      });

      // 添加该部门的成员
      const deptMembers = allMembers.filter(m => m.department === dept.name);
      console.log(`部门 ${dept.name} 的成员:`, deptMembers.map(m => m.name));
      if (deptMembers.length > 0) {
        // 找出部门负责人（没有上级的成员，或上级不在本部门的）
        const supervisors = deptMembers.filter(m => {
          if (!m.supervisorId) return true;
          const supervisor = allMembers.find(mm => mm.id === m.supervisorId);
          return !supervisor || supervisor.department !== dept.name;
        });
        
        supervisors.forEach(supervisor => {
          const supervisorNode = buildPersonTree(supervisor, deptMembers);
          deptNode.children.push(supervisorNode);
        });
      }

      return deptNode;
    }

    function buildPersonTree(person: TeamMember, allMembers: TeamMember[]): OrgNode {
      // 找出这个人的直接下属
      const subordinates = allMembers.filter(m => m.supervisorId === person.id);
      
      const node: OrgNode = {
        id: person.id,
        name: person.name,
        title: person.position || '员工',
        department: person.department || '',
        member: person,
        children: [],
        isExpanded: true,
        type: 'person'
      };

      // 递归构建下属树
      subordinates.forEach(subordinate => {
        node.children.push(buildPersonTree(subordinate, allMembers));
      });

      return node;
    }

    return buildOrgTree(members, departments);
  }, [members, departments]);

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // 应用展开状态 - 直接在 useMemo 内实现逻辑，避免依赖问题
  const orgDataWithExpandedState = useMemo(() => {
    const applyExpandedState = (node: OrgNode): OrgNode => {
      return {
        ...node,
        isExpanded: expandedNodes.has(node.id),
        children: node.children.map(applyExpandedState)
      };
    };
    return applyExpandedState(orgData);
  }, [orgData, expandedNodes]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleRefresh = () => {
    setZoomLevel(1);
    setExpandedNodes(new Set(['root']));
  };

  // 构建部门树用于列表视图
  const departmentTree = useMemo(() => {
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

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-1 pt-2 px-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">组织架构图</CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              基于上级关系自动构建的组织架构 (部门数: {departments.length}, 成员数: {members.length})
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {viewMode === 'tree' && (
              <>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  {Math.round(zoomLevel * 100)}%
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleResetZoom}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList className="grid grid-cols-3 w-[400px] mb-4">
            <TabsTrigger value="list" className="gap-2">
              <ListIcon className="h-4 w-4" />
              层级列表
            </TabsTrigger>
            <TabsTrigger value="matrix" className="gap-2">
              <Grid3X3 className="h-4 w-4" />
              部门矩阵
            </TabsTrigger>
            <TabsTrigger value="tree" className="gap-2">
              <ListTree className="h-4 w-4" />
              树形图
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-0">
            <ListView 
              orgData={orgDataWithExpandedState} 
              onToggleExpand={handleToggleExpand}
              members={members}
            />
          </TabsContent>

          <TabsContent value="matrix" className="mt-0">
            <MatrixView 
              departments={departments} 
              members={members}
              departmentTree={departmentTree}
            />
          </TabsContent>

          <TabsContent value="tree" className="mt-0">
            <div className="overflow-auto rounded-lg border border-slate-200 bg-slate-50" style={{ minHeight: '500px' }}>
              <div 
                className="p-8 transition-transform duration-200 origin-top-left"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <OrgTreeNode node={orgDataWithExpandedState} onToggleExpand={handleToggleExpand} level={0} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// 层级列表视图
function ListView({ 
  orgData, 
  onToggleExpand, 
  members 
}: { 
  orgData: OrgNode; 
  onToggleExpand: (id: string) => void;
  members: TeamMember[];
}) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // 扁平化树结构用于列表显示
  const flattenTree = (node: OrgNode, level: number = 0): Array<{ node: OrgNode; level: number }> => {
    let result: Array<{ node: OrgNode; level: number }> = [{ node, level }];
    if (node.isExpanded) {
      node.children.forEach(child => {
        result = result.concat(flattenTree(child, level + 1));
      });
    }
    return result;
  };

  const flatList = flattenTree(orgData);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50" style={{ minHeight: '500px', maxHeight: '600px', overflow: 'auto' }}>
      <div className="divide-y divide-slate-200">
        {flatList.map(({ node, level }) => {
          const isRoot = node.type === 'root';
          const isDepartment = node.type === 'department';
          const isPerson = node.type === 'person';
          
          return (
            <div 
              key={node.id}
              className="flex items-center gap-3 p-3 hover:bg-slate-100 transition-colors"
              style={{ paddingLeft: `${level * 24 + 12}px` }}
            >
              {/* 展开/折叠按钮 */}
              <div className="w-6">
                {node.children.length > 0 && (
                  <button
                    onClick={() => onToggleExpand(node.id)}
                    className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded transition-colors"
                  >
                    {node.isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                )}
              </div>

              {/* 图标 */}
              <div className="w-10 h-10 flex-shrink-0">
                {isRoot ? (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                ) : isDepartment ? (
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-sm">
                    <Building className="w-5 h-5 text-slate-600" />
                  </div>
                ) : isPerson && node.member ? (
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={node.member.avatar} alt={node.name} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold">
                      {getInitials(node.name)}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900 truncate">{node.name}</span>
                  {isPerson && node.member && (
                    <div className="flex flex-wrap gap-1">
                      {(node.member.roles || []).map((role) => (
                        <Badge 
                          key={role} 
                          className={`${ROLE_COLORS[role]} text-[10px] h-4`}
                        >
                          {ROLE_LABELS[role]}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-sm text-slate-500 truncate">
                  {node.title}
                  {isPerson && node.department && (
                    <span className="ml-2 text-slate-400">· {node.department}</span>
                  )}
                </div>
              </div>

              {/* 子项数量 */}
              {node.children.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {node.children.length} 项
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 部门矩阵视图
function MatrixView({ 
  departments, 
  members,
  departmentTree
}: { 
  departments: Department[]; 
  members: TeamMember[];
  departmentTree: Array<{ dept: Department; level: number }>;
}) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // 获取每个部门的成员
  const getDepartmentMembers = (deptName: string) => {
    return members.filter(m => m.department === deptName);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50" style={{ minHeight: '500px', maxHeight: '600px', overflow: 'auto' }}>
      <div className="p-4 grid gap-6">
        {departmentTree.map(({ dept, level }) => {
          const deptMembers = getDepartmentMembers(dept.name);
          
          return (
            <div 
              key={dept.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              style={{ marginLeft: `${level * 24}px` }}
            >
              {/* 部门标题 */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <Building className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{dept.name}</h3>
                    {dept.description && (
                      <p className="text-xs text-slate-500">{dept.description}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {deptMembers.length} 人
                  </Badge>
                </div>
              </div>

              {/* 部门成员 */}
              <div className="p-4">
                {deptMembers.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">暂无成员</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {deptMembers.map((member) => (
                      <div 
                        key={member.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 truncate">{member.name}</h4>
                          <p className="text-xs text-slate-500 truncate">{member.position || '员工'}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(member.roles || []).map((role) => (
                              <Badge 
                                key={role} 
                                className={`${ROLE_COLORS[role]} text-[10px] h-3.5`}
                              >
                                {ROLE_LABELS[role]}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* 未分配部门 */}
        {(() => {
          const unassignedMembers = members.filter(m => !m.department);
          if (unassignedMembers.length === 0) return null;
          
          return (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-dashed border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-700">未分配部门</h3>
                    <p className="text-xs text-slate-500">尚未分配到任何部门的成员</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {unassignedMembers.length} 人
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {unassignedMembers.map((member) => (
                    <div 
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-600 text-white font-semibold">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">{member.name}</h4>
                        <p className="text-xs text-slate-500 truncate">{member.position || '员工'}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(member.roles || []).map((role) => (
                            <Badge 
                              key={role} 
                              className={`${ROLE_COLORS[role]} text-[10px] h-3.5`}
                            >
                              {ROLE_LABELS[role]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

interface OrgTreeNodeProps {
  node: OrgNode;
  onToggleExpand: (nodeId: string) => void;
  level: number;
}

function OrgTreeNode({ node, onToggleExpand, level }: OrgTreeNodeProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isRoot = node.type === 'root';
  const isDepartment = node.type === 'department';
  const isPerson = node.type === 'person';

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        {isRoot ? (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg mb-3">
              <Building className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">{node.name}</h3>
              <p className="text-xs text-slate-500">{node.title}</p>
            </div>
          </div>
        ) : isDepartment ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-sm mb-2">
              <Building className="w-8 h-8 text-slate-600" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-semibold text-slate-900">{node.name}</h4>
              <p className="text-xs text-slate-500">{node.title}</p>
            </div>
          </div>
        ) : isPerson ? (
          <div className="flex flex-col items-center min-w-[180px]">
            <div className="relative group">
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg ring-2 ring-slate-200">
                <AvatarImage src={node.member?.avatar} alt={node.name} />
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold text-lg">
                  {getInitials(node.name)}
                </AvatarFallback>
              </Avatar>
              {node.children.length > 0 && (
                <button
                  onClick={() => onToggleExpand(node.id)}
                  className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
                >
                  {node.isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </button>
              )}
            </div>
            <div className="mt-3 text-center px-2">
              <h4 className="text-sm font-semibold text-slate-900">{node.name}</h4>
              <p className="text-xs text-slate-500 mb-1.5">{node.title}</p>
              {node.member && (
                <div className="flex flex-wrap justify-center gap-1">
                  {(node.member.roles || []).map((role) => (
                    <Badge 
                      key={role} 
                      className={`${ROLE_COLORS[role]} text-[10px] h-4`}
                    >
                      {ROLE_LABELS[role]}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {node.children.length > 0 && node.isExpanded && (
        <>
          <div className="w-px h-6 bg-slate-300" />
          <div className="flex gap-8">
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-4 bg-slate-300" />
                <OrgTreeNode 
                  node={child} 
                  onToggleExpand={onToggleExpand} 
                  level={level + 1} 
                />
              </div>
            ))}
          </div>
          {node.children.length > 1 && (
            <div className="flex gap-8 mt-1">
              {node.children.map((_, index) => (
                <div key={index} className="flex-1 flex justify-center">
                  {index === 0 && (
                    <div className="w-1/2 h-px bg-slate-300 ml-auto" />
                  )}
                  {index > 0 && index < node.children.length - 1 && (
                    <div className="w-full h-px bg-slate-300" />
                  )}
                  {index === node.children.length - 1 && (
                    <div className="w-1/2 h-px bg-slate-300 mr-auto" />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
