import { NextRequest, NextResponse } from 'next/server';
import { db, initDatabase, sqlite } from '@/db';

export async function GET(request: NextRequest) {
  await initDatabase();
  
  const searchParams = request.nextUrl.searchParams;
  const groupId = searchParams.get('id');
  
  // 获取所有用户组（使用原始SQL）
  const allGroups = sqlite.prepare('SELECT * FROM user_groups').all() as any[];
  
  // 对于单个组
  if (groupId) {
    const group = allGroups.find((g: any) => g.id === parseInt(groupId));
    if (!group) {
      return NextResponse.json(null);
    }
    
    // 获取该组的用户
    const users = sqlite.prepare('SELECT * FROM user_group_relations WHERE group_id = ?').all(parseInt(groupId)) as any[];
    
    // 获取该组的权限
    const permissions = sqlite.prepare('SELECT * FROM group_permission_relations WHERE group_id = ?').all(parseInt(groupId)) as any[];
    
    return NextResponse.json({
      ...group,
      users: users.map((u: any) => ({ user: u })),
      permissions: permissions.map((p: any) => ({ permission: p })),
    });
  }
  
  // 对于所有组，返回基本信息
  const groupsWithDetails = await Promise.all(allGroups.map(async (group: any) => {
    const users = sqlite.prepare('SELECT * FROM user_group_relations WHERE group_id = ?').all(group.id) as any[];
    const permissions = sqlite.prepare('SELECT * FROM group_permission_relations WHERE group_id = ?').all(group.id) as any[];
    
    return {
      ...group,
      users: users.map((u: any) => ({ user: u })),
      permissions: permissions.map((p: any) => ({ permission: p })),
    };
  }));
  
  return NextResponse.json(groupsWithDetails);
}

export async function POST(request: NextRequest) {
  await initDatabase();
  
  const body = await request.json();
  const { name, description, parentGroupId, permissionIds = [] } = body;
  
  // 先插入
  const stmt = sqlite.prepare(`
    INSERT INTO user_groups (name, description, parent_group_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  const now = Date.now();
  const result = stmt.run(name, description || null, parentGroupId || null, now, now);
  
  // 获取刚插入的组
  const newGroup = sqlite.prepare('SELECT * FROM user_groups WHERE id = ?').get((result as any).lastInsertRowid) as any;
  
  // 分配权限
  if (permissionIds.length > 0 && newGroup) {
    const permStmt = sqlite.prepare('INSERT INTO group_permission_relations (group_id, permission_id) VALUES (?, ?)');
    for (const permissionId of permissionIds) {
      permStmt.run(newGroup.id, permissionId);
    }
  }
  
  return NextResponse.json(newGroup || { success: true });
}

export async function PUT(request: NextRequest) {
  await initDatabase();
  
  const body = await request.json();
  const { id, name, description, parentGroupId, permissionIds = [] } = body;
  
  // 更新用户组基本信息
  sqlite.prepare(`
    UPDATE user_groups 
    SET name = ?, description = ?, parent_group_id = ?, updated_at = ?
    WHERE id = ?
  `).run(name, description || null, parentGroupId || null, Date.now(), id);
  
  // 更新权限关系
  sqlite.prepare('DELETE FROM group_permission_relations WHERE group_id = ?').run(id);
  
  if (permissionIds.length > 0) {
    const permStmt = sqlite.prepare('INSERT INTO group_permission_relations (group_id, permission_id) VALUES (?, ?)');
    for (const permissionId of permissionIds) {
      permStmt.run(id, permissionId);
    }
  }
  
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  await initDatabase();
  
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: '用户组ID不能为空' }, { status: 400 });
  }
  
  // 删除权限关系
  sqlite.prepare('DELETE FROM group_permission_relations WHERE group_id = ?').run(parseInt(id));
  
  // 删除用户关系
  sqlite.prepare('DELETE FROM user_group_relations WHERE group_id = ?').run(parseInt(id));
  
  // 删除用户组
  sqlite.prepare('DELETE FROM user_groups WHERE id = ?').run(parseInt(id));
  
  return NextResponse.json({ success: true });
}
