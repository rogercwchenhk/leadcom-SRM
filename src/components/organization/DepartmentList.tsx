'use client';

import React from 'react';
import { Building, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Department, TeamMember } from '@/types';

interface DepartmentListProps {
  departments: Department[];
  teamMembers: TeamMember[];
  onAddDepartment: () => void;
  onEditDepartment: (deptId: string) => void;
  onDeleteDepartment: (deptId: string) => void;
}

export function DepartmentList({
  departments,
  teamMembers,
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment
}: DepartmentListProps) {
  // 构建部门树形结构
  const departmentTree = React.useMemo(() => {
    const topLevelDepts = departments.filter(d => !d.parentDepartmentId);
    
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

  const getMemberCount = (deptName: string) => {
    return teamMembers.filter(m => m.department === deptName).length;
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-1 pt-2 px-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">部门管理</CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              组织架构中的可用部门
            </CardDescription>
          </div>
          <Button size="sm" className="h-8 gap-1" onClick={onAddDepartment}>
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
                  {getMemberCount(dept.name)} 人
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => onEditDepartment(dept.id)}
                >
                  <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDeleteDepartment(dept.id)}
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
  );
}
