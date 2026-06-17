import { NextRequest, NextResponse } from 'next/server';
import { db, initDatabase } from '@/db';
import { 
  users, 
  userGroupRelations, 
  userGroups,
  User,
  NewUser
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { UserWithGroups } from '@/types';

// 初始化数据库
export async function GET(request: NextRequest) {
  await initDatabase();
  
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('id');
  
  // 获取所有用户
  const allUsers = await db.select().from(users).all();
  
  if (userId) {
    // 获取单个用户详情
    const user = allUsers.find((u) => u.id === parseInt(userId));
    if (!user) {
      return NextResponse.json(null);
    }
    
    // 获取用户组关系，并 JOIN 获取组名
    const groupRelations = await db.select({
      userId: userGroupRelations.userId,
      groupId: userGroupRelations.groupId,
      groupName: userGroups.name,
    })
      .from(userGroupRelations)
      .leftJoin(userGroups, eq(userGroupRelations.groupId, userGroups.id))
      .where(eq(userGroupRelations.userId, parseInt(userId)))
      .all();
    
    const result: UserWithGroups = {
      ...user,
      userGroups: groupRelations.map((g) => ({ 
        group: { 
          id: g.groupId, 
          name: g.groupName || '' 
        } 
      })),
    };
    
    return NextResponse.json(result);
  }
  
  // 获取所有用户及其用户组
  const usersWithGroups: UserWithGroups[] = await Promise.all(allUsers.map(async (user) => {
    const groupRelations = await db.select({
      userId: userGroupRelations.userId,
      groupId: userGroupRelations.groupId,
      groupName: userGroups.name,
    })
      .from(userGroupRelations)
      .leftJoin(userGroups, eq(userGroupRelations.groupId, userGroups.id))
      .where(eq(userGroupRelations.userId, user.id))
      .all();
    
    return {
      ...user,
      userGroups: groupRelations.map((g) => ({ 
        group: { 
          id: g.groupId, 
          name: g.groupName || '' 
        } 
      })),
    };
  }));
  
  return NextResponse.json(usersWithGroups);
}

export async function POST(request: NextRequest) {
  await initDatabase();
  
  const body = await request.json();
  const { username, email, groupIds = [] } = body;
  
  // 输入校验
  if (!username || username.trim() === '') {
    return NextResponse.json({ error: '用户名不能为空' }, { status: 400 });
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 });
  }
  
  try {
    const now = new Date();
    const newUserData: NewUser = {
      username: username.trim(),
      email: email.trim(),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    
    // 创建用户
    const result = await db.insert(users).values(newUserData).returning();
    const newUser = result[0];
    
    if (!newUser) {
      return NextResponse.json({ error: '创建用户失败' }, { status: 500 });
    }
    
    // 分配用户组
    if (groupIds.length > 0) {
      await db.insert(userGroupRelations).values(
        groupIds.map((groupId: number) => ({
          userId: newUser.id,
          groupId,
        }))
      );
    }
    
    return NextResponse.json(newUser);
  } catch (error: any) {
    if (error?.code === 'SQLITE_CONSTRAINT') {
      if (error?.message?.includes('username')) {
        return NextResponse.json({ error: '用户名已存在' }, { status: 409 });
      }
      if (error?.message?.includes('email')) {
        return NextResponse.json({ error: '邮箱已存在' }, { status: 409 });
      }
    }
    return NextResponse.json({ error: '创建用户失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  await initDatabase();
  
  const body = await request.json();
  const { id, username, email, status, groupIds = [] } = body;
  
  if (!id) {
    return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 });
  }
  
  if (!username || username.trim() === '') {
    return NextResponse.json({ error: '用户名不能为空' }, { status: 400 });
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 });
  }
  
  if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
    return NextResponse.json({ error: '无效的用户状态' }, { status: 400 });
  }
  
  try {
    // 更新用户基本信息
    await db.update(users)
      .set({
        username: username.trim(),
        email: email.trim(),
        status: status as 'active' | 'inactive' | 'suspended',
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
    
    // 更新用户组关系
    await db.delete(userGroupRelations)
      .where(eq(userGroupRelations.userId, id));
    
    if (groupIds.length > 0) {
      await db.insert(userGroupRelations).values(
        groupIds.map((groupId: number) => ({
          userId: id,
          groupId,
        }))
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'SQLITE_CONSTRAINT') {
      if (error?.message?.includes('username')) {
        return NextResponse.json({ error: '用户名已存在' }, { status: 409 });
      }
      if (error?.message?.includes('email')) {
        return NextResponse.json({ error: '邮箱已存在' }, { status: 409 });
      }
    }
    return NextResponse.json({ error: '更新用户失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await initDatabase();
  
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 });
  }
  
  try {
    // 删除用户组关系
    await db.delete(userGroupRelations)
      .where(eq(userGroupRelations.userId, parseInt(id)));
    
    // 删除用户
    await db.delete(users)
      .where(eq(users.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '删除用户失败' }, { status: 500 });
  }
}
