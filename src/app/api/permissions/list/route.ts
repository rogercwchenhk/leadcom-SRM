import { NextRequest, NextResponse } from 'next/server';
import { db, initDatabase } from '@/db';
import { permissions, groupPermissionRelations, userPermissionRelations } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  await initDatabase();
  
  // 获取所有权限（树形结构）
  const allPermissions = await db.query.permissions.findMany({
    orderBy: (permissions, { asc }) => [asc(permissions.id)],
  });
  
  // 构建树形结构
  const buildTree = (perms: typeof allPermissions, parentId: number | null = null): any[] => {
    return perms
      .filter(p => p.parentPermissionId === parentId)
      .map(p => ({
        ...p,
        children: buildTree(perms, p.id),
      }));
  };
  
  const permissionTree = buildTree(allPermissions);
  
  return NextResponse.json({
    flat: allPermissions,
    tree: permissionTree,
  });
}

// 为用户组分配权限
export async function POST(request: NextRequest) {
  await initDatabase();
  
  const body = await request.json();
  const { groupId, permissionIds } = body;
  
  if (!groupId || !permissionIds) {
    return NextResponse.json({ error: '参数不完整' }, { status: 400 });
  }
  
  // 删除旧的权限关系
  await db.delete(groupPermissionRelations).where(eq(groupPermissionRelations.groupId, groupId));
  
  // 插入新的权限关系
  if (permissionIds.length > 0) {
    await db.insert(groupPermissionRelations).values(
      permissionIds.map((permissionId: number) => ({
        groupId,
        permissionId,
      }))
    );
  }
  
  return NextResponse.json({ success: true });
}
