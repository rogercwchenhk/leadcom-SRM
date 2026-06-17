import { NextRequest, NextResponse } from 'next/server';
import { db, initDatabase } from '@/db';
import { 
  userPermissionRelations, 
  groupPermissionRelations, 
  userGroupRelations,
  permissions,
  userGroups,
  Permission
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { UserPermissionsResponse } from '@/types';

// 获取用户的所有权限（包括继承的）
export async function GET(request: NextRequest) {
  await initDatabase();
  
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 });
  }
  
  // 获取用户直接权限
  const directPermissions = await db.select().from(userPermissionRelations)
    .where(eq(userPermissionRelations.userId, parseInt(userId))).all();
  
  // 获取用户所属用户组
  const userGroupsData = await db.select({
    userId: userGroupRelations.userId,
    groupId: userGroupRelations.groupId,
    groupName: userGroups.name,
  })
    .from(userGroupRelations)
    .leftJoin(userGroups, eq(userGroupRelations.groupId, userGroups.id))
    .where(eq(userGroupRelations.userId, parseInt(userId)))
    .all();
  
  // 获取所有权限
  const allPerms: Permission[] = await db.select().from(permissions).all();
  
  // 获取组权限
  const groupPermissions: Array<{
    groupId: number;
    permissionId: number;
    groupName: string;
  }> = [];
  
  for (const ug of userGroupsData) {
    const perms = await db.select().from(groupPermissionRelations)
      .where(eq(groupPermissionRelations.groupId, ug.groupId)).all();
    
    for (const perm of perms) {
      groupPermissions.push({
        ...perm,
        groupName: ug.groupName || '',
      });
    }
  }
  
  // 收集所有权限
  const allPermissionsMap = new Map<number, any>();
  
  // 添加直接权限
  for (const rel of directPermissions) {
    const perm = allPerms.find((p) => p.id === rel.permissionId);
    if (perm) {
      allPermissionsMap.set(perm.id, {
        ...perm,
        source: 'direct',
      });
    }
  }
  
  // 添加组权限
  for (const rel of groupPermissions) {
    const perm = allPerms.find((p) => p.id === rel.permissionId);
    if (perm && !allPermissionsMap.has(perm.id)) {
      allPermissionsMap.set(perm.id, {
        ...perm,
        source: 'group',
        groupName: rel.groupName,
      });
    }
  }
  
  const response: UserPermissionsResponse = {
    permissions: Array.from(allPermissionsMap.values()),
    allPermissions: allPerms as any[],
    directPermissionIds: directPermissions.map((p) => p.permissionId),
  };
  
  return NextResponse.json(response);
}

// 为用户分配直接权限
export async function POST(request: NextRequest) {
  await initDatabase();
  
  const body = await request.json();
  const { userId, permissionIds } = body;
  
  if (!userId || permissionIds === undefined) {
    return NextResponse.json({ error: '参数不完整' }, { status: 400 });
  }
  
  if (typeof userId !== 'number' || userId <= 0) {
    return NextResponse.json({ error: '无效的用户ID' }, { status: 400 });
  }
  
  if (!Array.isArray(permissionIds)) {
    return NextResponse.json({ error: 'permissionIds 必须是数组' }, { status: 400 });
  }
  
  // 删除旧的直接权限
  await db.delete(userPermissionRelations)
    .where(eq(userPermissionRelations.userId, userId));
  
  // 插入新的直接权限
  if (permissionIds.length > 0) {
    await db.insert(userPermissionRelations).values(
      permissionIds.map((permissionId: number) => ({
        userId,
        permissionId,
      }))
    );
  }
  
  return NextResponse.json({ success: true });
}
