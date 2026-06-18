'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Trash2, UsersRound, Loader2 } from 'lucide-react';

interface UserGroup {
  id: number;
  name: string;
  description: string | null;
  parentGroupId: number | null;
  users?: { user: { id: number; username: string } }[];
  permissions?: { permission: { id: number; name: string; code: string } }[];
}

interface Permission {
  id: number;
  name: string;
  code: string;
  parentPermissionId: number | null;
}

export function GroupManagement() {
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentGroupId: null as number | null,
    permissionIds: [] as number[],
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [groupsRes, permRes] = await Promise.all([
        fetch('/api/permissions/groups'),
        fetch('/api/permissions/list'),
      ]);
      const groupsData = await groupsRes.json();
      const permData = await permRes.json();
      setGroups(groupsData);
      setPermissions(permData.flat);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async () => {
    try {
      await fetch('/api/permissions/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '', parentGroupId: null, permissionIds: [] });
      await loadData();
    } catch (error) {
      console.error('创建用户组失败:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedGroup) return;
    try {
      await fetch('/api/permissions/groups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedGroup.id,
          ...formData,
        }),
      });
      setIsEditDialogOpen(false);
      setSelectedGroup(null);
      await loadData();
    } catch (error) {
      console.error('更新用户组失败:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedGroup) return;
    try {
      await fetch(`/api/permissions/groups?id=${selectedGroup.id}`, {
        method: 'DELETE',
      });
      setIsDeleteDialogOpen(false);
      setSelectedGroup(null);
      await loadData();
    } catch (error) {
      console.error('删除用户组失败:', error);
    }
  };

  const openEditDialog = (group: UserGroup) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      parentGroupId: group.parentGroupId,
      permissionIds: group.permissions?.map(p => p.permission.id) || [],
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (group: UserGroup) => {
    setSelectedGroup(group);
    setIsDeleteDialogOpen(true);
  };

  // 构建权限树
  const buildPermissionTree = (perms: Permission[], parentId: number | null = null): any[] => {
    return perms
      .filter(p => p.parentPermissionId === parentId)
      .map(p => ({
        ...p,
        children: buildPermissionTree(perms, p.id),
      }));
  };

  const renderPermissionCheckbox = (perm: any, level: number = 0): React.ReactNode => (
    <div key={perm.id}>
      <div className={`flex items-center gap-1.5 py-1 ${level > 0 ? 'ml-5' : ''}`}>
        <Checkbox
          id={`perm-${perm.id}`}
          className="h-4 w-4"
          checked={formData.permissionIds.includes(perm.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setFormData({ ...formData, permissionIds: [...formData.permissionIds, perm.id] });
            } else {
              setFormData({ ...formData, permissionIds: formData.permissionIds.filter(id => id !== perm.id) });
            }
          }}
        />
        <label htmlFor={`perm-${perm.id}`} className="text-xs cursor-pointer">
          {perm.name}
          <span className="text-[10px] text-slate-400 ml-1.5">({perm.code})</span>
        </label>
      </div>
      {perm.children?.map((child: any) => renderPermissionCheckbox(child, level + 1))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
      </div>
    );
  }

  const permissionTree = buildPermissionTree(permissions);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-medium">用户组列表</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5 text-xs h-8">
              <Plus className="h-3.5 w-3.5" />
              新建用户组
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-sm">新建用户组</DialogTitle>
              <DialogDescription className="text-xs">创建一个新的用户组</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3">
              <div className="space-y-1.5">
                <Label className="text-xs">用户组名称</Label>
                <Input
                  className="h-8 text-xs"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入用户组名称"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">描述</Label>
                <Textarea
                  className="text-xs"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入用户组描述"
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">上级用户组（可选）</Label>
                <Select
                  value={formData.parentGroupId?.toString() || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, parentGroupId: value === 'none' ? null : parseInt(value) })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="无上级用户组" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-xs">无上级用户组</SelectItem>
                    {groups
                      .filter(g => !selectedGroup || g.id !== selectedGroup.id)
                      .map((group) => (
                        <SelectItem key={group.id} value={group.id.toString()} className="text-xs">
                          {group.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">权限分配</Label>
                <div className="border rounded-md p-2.5 max-h-48 overflow-y-auto">
                  {permissionTree.map((perm) => renderPermissionCheckbox(perm))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" size="sm" className="text-xs h-8" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button size="sm" className="text-xs h-8" onClick={handleCreate}>
                创建
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="h-10">
              <TableHead className="text-xs py-2">用户组名称</TableHead>
              <TableHead className="text-xs py-2">描述</TableHead>
              <TableHead className="text-xs py-2">上级用户组</TableHead>
              <TableHead className="text-xs py-2">成员数量</TableHead>
              <TableHead className="text-xs py-2">权限数量</TableHead>
              <TableHead className="text-right text-xs py-2">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => {
              const parentGroup = groups.find(g => g.id === group.parentGroupId);
              return (
                <TableRow key={group.id} className="h-10">
                  <TableCell className="font-medium text-xs py-2">{group.name}</TableCell>
                  <TableCell className="text-slate-500 text-xs py-2">{group.description || '-'}</TableCell>
                  <TableCell className="py-2">
                    {parentGroup ? (
                      <Badge variant="outline" className="text-[10px] h-4 px-1">
                        {parentGroup.name}
                      </Badge>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge variant="secondary" className="text-[10px] h-4 px-1">
                      {group.users?.length || 0} 人
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className="text-[10px] h-4 px-1">
                      {group.permissions?.length || 0} 项
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => openEditDialog(group)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => openDeleteDialog(group)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-sm">编辑用户组</DialogTitle>
            <DialogDescription className="text-xs">修改用户组信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <Label className="text-xs">用户组名称</Label>
              <Input
                className="h-8 text-xs"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">描述</Label>
              <Textarea
                className="text-xs"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">上级用户组（可选）</Label>
              <Select
                value={formData.parentGroupId?.toString() || 'none'}
                onValueChange={(value) => setFormData({ ...formData, parentGroupId: value === 'none' ? null : parseInt(value) })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="无上级用户组" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-xs">无上级用户组</SelectItem>
                  {groups
                    .filter(g => !selectedGroup || g.id !== selectedGroup.id)
                    .map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()} className="text-xs">
                        {group.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">权限分配</Label>
              <div className="border rounded-md p-2.5 max-h-48 overflow-y-auto">
                {permissionTree.map((perm) => renderPermissionCheckbox(perm))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" size="sm" className="text-xs h-8" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button size="sm" className="text-xs h-8" onClick={handleEdit}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">确认删除</DialogTitle>
            <DialogDescription className="text-xs">
              确定要删除用户组 "{selectedGroup?.name}" 吗？此操作不可恢复。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" size="sm" className="text-xs h-8" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" size="sm" className="text-xs h-8" onClick={handleDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
