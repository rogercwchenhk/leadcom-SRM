import { NextRequest, NextResponse } from 'next/server';
import { db, initDatabase } from '@/db';
import { 
  userGroups, 
  userGroupRelations, 
  groupPermissionRelations,
  UserGroup,
  NewUserGroup
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { GroupWithDetails } from '@/types';

export async function GET(request: NextRequest) {
  await initDatabase();
  
  const searchParams = request.nextUrl.searchParams;
  const groupId = searchParams.get('id');
  
  // 获取所有用户组
  const allGroups = await db.select().from(userGroups).all();
  
  // 对于单个组
  if (groupId) {
    const group = allGroups.find((g) => g.id === parseInt(groupId));
    if (!group) {
      return NextResponse.json(null);
    }
    
    // 获取该组的用户
    const users = await db.select().from(userGroupRelations)
      .where(eq(userGroupRelations.groupId, parseInt(groupId))).all();
    
    // 获取该组的权限
    const groupPerms = await db.select().from(groupPermissionRelations)
      .where(eq(groupPermissionRelations.groupId, parseInt(groupId))).all();
    
    const result: GroupWithDetails = {
      ...group,
      users: users.map((u) => ({ user: u })),
      permissions: groupPerms.map((p) => ({ permission: p })),
    };
    
    return NextResponse.json(result);
  }
  
  // 对于所有组，返回基本信息
  const groupsWithDetails: GroupWithDetails[] = await Promise.all(allGroups.map(async (group) => {
    const users = await db.select().from(userGroupRelations)
      .where(eq(userGroupRelations.groupId, group.id)).all();
    const groupPerms = await db.select().from(groupPermissionRelations)
      .where(eq(groupPermissionRelations.groupId, group.id)).all();
    
    return {
      ...group,
      users: users.map((u) => ({ user: u })),
      permissions: groupPerms.map((p) => ({ permission: p })),
    };
  }));
  
  return NextResponse.json(groupsWithDetails);
}

export async function POST(request: NextRequest) {
  await initDatabase();
  
  const body = await request.json();
  const { name, description, parentGroupId, permissionIds = [] } = body;
  
  // 输入校验
  if (!name || name.trim() === '') {
    return NextResponse.json({ error: '用户组名称不能为空' }, { status: 400 });
  }
  
  try {
    const now = new Date();
    const newGroupData: NewUserGroup = {
      name: name.trim(),
      description: description || null,
      parentGroupId: parentGroupId || null,
      createdAt: now,
      updatedAt: now,
    };
    
    // 插入用户组
    const result = await db.insert(userGroups).values(newGroupData).returning();
    const newGroup = result[0];
    
    if (!newGroup) {
      return NextResponse.json({ error: '创建用户组失败' }, { status: 500 });
    }
    
    // 分配权限
    if (permissionIds.length > 0) {
      await db.insert(groupPermissionRelations).values(
        permissionIds.map((permissionId: number) => ({
          groupId: newGroup.id,
          permissionId,
        }))
      );
    }
    
    return NextResponse.json(newGroup);
  } catch (error: any) {
    if (error?.code === 'SQLITE_CONSTRAINT' && error?.message?.includes('UNIQUE')) {
      return NextResponse.json({ error: '用户组名称已存在' }, { status: 409 });
    }
    return NextResponse.json({ error: '创建用户组失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  await initDatabase();
  
  const body = await request.json();
  const { id, name, description, parentGroupId, permissionIds = [] } = body;
  
  if (!id) {
    return NextResponse.json({ error: '用户组ID不能为空' }, { status: 400 });
  }
  
  if (!name || name.trim() === '') {
    return NextResponse.json({ error: '用户组名称不能为空' }, { status: 400 });
  }
  
  try {
    // 更新用户组基本信息
    await db.update(userGroups)
      .set({
        name: name.trim(),
        description: description || null,
        parentGroupId: parentGroupId || null,
        updatedAt: new Date(),
      })
      .where(eq(userGroups.id, id));
    
    // 更新权限关系
    await db.delete(groupPermissionRelations)
      .where(eq(groupPermissionRelations.groupId, id));
    
    if (permissionIds.length > 0) {
      await db.insert(groupPermissionRelations).values(
        permissionIds.map((permissionId: number) => ({
          groupId: id,
          permissionId,
        }))
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'SQLITE_CONSTRAINT' && error?.message?.includes('UNIQUE')) {
      return NextResponse.json({ error: '用户组名称已存在' }, { status: 409 });
    }
    return NextResponse.json({ error: '更新用户组失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await initDatabase();
  
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: '用户组ID不能为空' }, { status: 400 });
  }
  
  try {
    // 删除权限关系
    await db.delete(groupPermissionRelations)
      .where(eq(groupPermissionRelations.groupId, parseInt(id)));
    
    // 删除用户关系
    await db.delete(userGroupRelations)
      .where(eq(userGroupRelations.groupId, parseInt(id)));
    
    // 删除用户组
    await db.delete(userGroups)
      .where(eq(userGroups.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '删除用户组失败' }, { status: 500 });
  }
}
