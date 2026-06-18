'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  PRESET_TEAM_MEMBERS, 
  ROLE_LABELS, 
  ROLE_COLORS,
  type TeamMember
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
}

export function OrganizationChart({ members }: OrganizationChartProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // 直接使用 useMemo 来构建组织架构树，而不是 useState + useEffect
  const orgData = React.useMemo(() => {
    return buildOrgTree(members);
  }, [members]);

  function buildOrgTree(members: TeamMember[]): OrgNode {
    // 按部门分组
    const departments: Record<string, TeamMember[]> = {};
    members.forEach(member => {
      const dept = member.department || '未分配';
      if (!departments[dept]) {
        departments[dept] = [];
      }
      departments[dept].push(member);
    });

    const root: OrgNode = {
      id: 'root',
      name: '公司',
      title: '组织架构',
      department: '',
      children: [],
      isExpanded: true, // 默认值，会被外部状态覆盖
      type: 'root'
    };

    // 为每个部门创建节点
    Object.entries(departments).forEach(([deptName, deptMembers]) => {
      const deptNode: OrgNode = {
        id: `dept-${deptName}`,
        name: deptName,
        title: `${deptName}`,
        department: deptName,
        children: [],
        isExpanded: true, // 默认值，会被外部状态覆盖
        type: 'department'
      };

      // 找出部门负责人（没有上级的成员）
      const supervisors = deptMembers.filter(m => !m.supervisorId);
      
      // 为每个负责人构建下属树
      supervisors.forEach(supervisor => {
        const supervisorNode = buildPersonTree(supervisor, deptMembers);
        deptNode.children.push(supervisorNode);
      });

      root.children.push(deptNode);
    });

    return root;
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
      isExpanded: true, // 默认值，会被外部状态覆盖
      type: 'person'
    };

    // 递归构建下属树
    subordinates.forEach(subordinate => {
      node.children.push(buildPersonTree(subordinate, allMembers));
    });

    return node;
  }

  // 添加展开状态的管理
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

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

  // 辅助函数：检查节点是否展开
  const isNodeExpanded = (nodeId: string) => {
    return expandedNodes.has(nodeId);
  };

  // 修改 orgData，添加展开状态
  const orgDataWithExpandedState = React.useMemo(() => {
    const applyExpandedState = (node: OrgNode): OrgNode => {
      return {
        ...node,
        isExpanded: isNodeExpanded(node.id),
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

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-1 pt-2 px-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">组织架构图</CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              基于上级关系自动构建的组织架构
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
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
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="overflow-auto rounded-lg border border-slate-200 bg-slate-50" style={{ minHeight: '500px' }}>
          <div 
            className="p-8 transition-transform duration-200 origin-top-left"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <OrgTreeNode node={orgDataWithExpandedState} onToggleExpand={handleToggleExpand} level={0} />
          </div>
        </div>
      </CardContent>
    </Card>
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
                  {node.member.roles.map((role) => (
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
