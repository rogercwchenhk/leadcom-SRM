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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Trash2, User, Loader2 } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  userGroups?: { group: { id: number; name: string } }[];
}

interface UserGroup {
  id: number;
  name: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    groupIds: [] as number[],
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [usersRes, groupsRes] = await Promise.all([
        fetch('/api/permissions/users'),
        fetch('/api/permissions/groups'),
      ]);
      const usersData = await usersRes.json();
      const groupsData = await groupsRes.json();
      setUsers(usersData);
      setGroups(groupsData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async () => {
    try {
      await fetch('/api/permissions/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setIsCreateDialogOpen(false);
      setFormData({ username: '', email: '', status: 'active', groupIds: [] });
      await loadData();
    } catch (error) {
      console.error('创建用户失败:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedUser) return;
    try {
      await fetch('/api/permissions/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedUser.id,
          ...formData,
        }),
      });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      await loadData();
    } catch (error) {
      console.error('更新用户失败:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await fetch(`/api/permissions/users?id=${selectedUser.id}`, {
        method: 'DELETE',
      });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      await loadData();
    } catch (error) {
      console.error('删除用户失败:', error);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      status: user.status,
      groupIds: user.userGroups?.map(ug => ug.group.id) || [],
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '正常';
      case 'inactive': return '未激活';
      case 'suspended': return '已暂停';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-medium">用户列表</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5 text-xs h-8">
              <Plus className="h-3.5 w-3.5" />
              新建用户
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm">新建用户</DialogTitle>
              <DialogDescription className="text-xs">创建一个新的系统用户</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3">
              <div className="space-y-1.5">
                <Label className="text-xs">用户名</Label>
                <Input
                  className="h-8 text-xs"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="请输入用户名"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">邮箱</Label>
                <Input
                  type="email"
                  className="h-8 text-xs"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入邮箱"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">状态</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active" className="text-xs">正常</SelectItem>
                    <SelectItem value="inactive" className="text-xs">未激活</SelectItem>
                    <SelectItem value="suspended" className="text-xs">已暂停</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">所属用户组</Label>
                <div className="space-y-1.5 border rounded-md p-2.5 max-h-36 overflow-y-auto">
                  {groups.map((group) => (
                    <div key={group.id} className="flex items-center gap-1.5">
                      <Checkbox
                        id={`create-group-${group.id}`}
                        className="h-4 w-4"
                        checked={formData.groupIds.includes(group.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, groupIds: [...formData.groupIds, group.id] });
                          } else {
                            setFormData({ ...formData, groupIds: formData.groupIds.filter(id => id !== group.id) });
                          }
                        }}
                      />
                      <label htmlFor={`create-group-${group.id}`} className="text-xs cursor-pointer">
                        {group.name}
                      </label>
                    </div>
                  ))}
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
              <TableHead className="text-xs py-2">用户名</TableHead>
              <TableHead className="text-xs py-2">邮箱</TableHead>
              <TableHead className="text-xs py-2">状态</TableHead>
              <TableHead className="text-xs py-2">所属用户组</TableHead>
              <TableHead className="text-right text-xs py-2">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="h-10">
                <TableCell className="font-medium text-xs py-2">{user.username}</TableCell>
                <TableCell className="text-xs py-2">{user.email}</TableCell>
                <TableCell className="py-2">
                  <Badge variant={getStatusBadgeVariant(user.status)} className="text-[10px] h-4 px-1">
                    {getStatusText(user.status)}
                  </Badge>
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex flex-wrap gap-0.5">
                    {user.userGroups?.map((ug) => (
                      <Badge key={ug.group.id} variant="outline" className="text-[10px] h-4 px-1">
                        {ug.group.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right py-2">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => openEditDialog(user)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => openDeleteDialog(user)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm">编辑用户</DialogTitle>
            <DialogDescription className="text-xs">修改用户信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <Label className="text-xs">用户名</Label>
              <Input
                className="h-8 text-xs"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">邮箱</Label>
              <Input
                type="email"
                className="h-8 text-xs"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">状态</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active" className="text-xs">正常</SelectItem>
                  <SelectItem value="inactive" className="text-xs">未激活</SelectItem>
                  <SelectItem value="suspended" className="text-xs">已暂停</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">所属用户组</Label>
              <div className="space-y-1.5 border rounded-md p-2.5 max-h-36 overflow-y-auto">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center gap-1.5">
                    <Checkbox
                      id={`edit-group-${group.id}`}
                      className="h-4 w-4"
                      checked={formData.groupIds.includes(group.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, groupIds: [...formData.groupIds, group.id] });
                        } else {
                          setFormData({ ...formData, groupIds: formData.groupIds.filter(id => id !== group.id) });
                        }
                      }}
                    />
                    <label htmlFor={`edit-group-${group.id}`} className="text-xs cursor-pointer">
                      {group.name}
                    </label>
                  </div>
                ))}
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
              确定要删除用户 "{selectedUser?.username}" 吗？此操作不可恢复。
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
