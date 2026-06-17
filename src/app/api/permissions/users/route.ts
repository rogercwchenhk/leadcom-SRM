import { NextRequest, NextResponse } from 'next/server';
import { db, initDatabase, sqlite } from '@/db';

// 初始化数据库
export async function GET(request: NextRequest) {
  await initDatabase();
  
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('id');
  
  // 获取所有用户（使用原始SQL）
  const allUsers = sqlite.prepare('SELECT * FROM users').all() as any[];
  
  if (userId) {
    // 获取单个用户详情
    const user = allUsers.find((u: any) => u.id === parseInt(userId));
    if (!user) {
      return NextResponse.json(null);
    }
    
    // 获取用户组关系
    const groups = sqlite.prepare('SELECT * FROM user_group_relations WHERE user_id = ?').all(parseInt(userId)) as any[];
    
    return NextResponse.json({
      ...user,
      userGroups: groups.map((g: any) => ({ group: { id: g.group_id, name: '' } })),
    });
  }
  
  // 获取所有用户及其用户组
  const usersWithGroups = await Promise.all(allUsers.map(async (user: any) => {
    const groups = sqlite.prepare('SELECT * FROM user_group_relations WHERE user_id = ?').all(user.id) as any[];
    
    return {
      ...user,
      userGroups: groups.map((g: any) => ({ group: { id: g.group_id, name: '' } })),
    };
  }));
  
  return NextResponse.json(usersWithGroups);
}

export async function POST(request: NextRequest) {
  await initDatabase();
  
  const body = await request.json();
  const { username, email, groupIds = [] } = body;
  
  // 创建用户
  const stmt = sqlite.prepare(`
    INSERT INTO users (username, email, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  const now = Date.now();
  const result = stmt.run(username, email, 'active', now, now);
  
  // 获取刚创建的用户
  const newUser = sqlite.prepare('SELECT * FROM users WHERE id = ?').get((result as any).lastInsertRowid) as any;
  
  // 分配用户组
  if (groupIds.length > 0 && newUser) {
    const groupStmt = sqlite.prepare('INSERT INTO user_group_relations (user_id, group_id) VALUES (?, ?)');
    for (const groupId of groupIds) {
      groupStmt.run(newUser.id, groupId);
    }
  }
  
  return NextResponse.json(newUser || { success: true });
}

export async function PUT(request: NextRequest) {
  await initDatabase();
  
  const body = await request.json();
  const { id, username, email, status, groupIds = [] } = body;
  
  // 更新用户基本信息
  sqlite.prepare(`
    UPDATE users 
    SET username = ?, email = ?, status = ?, updated_at = ?
    WHERE id = ?
  `).run(username, email, status, Date.now(), id);
  
  // 更新用户组关系
  sqlite.prepare('DELETE FROM user_group_relations WHERE user_id = ?').run(id);
  
  if (groupIds.length > 0) {
    const groupStmt = sqlite.prepare('INSERT INTO user_group_relations (user_id, group_id) VALUES (?, ?)');
    for (const groupId of groupIds) {
      groupStmt.run(id, groupId);
    }
  }
  
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  await initDatabase();
  
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 });
  }
  
  // 删除用户组关系
  sqlite.prepare('DELETE FROM user_group_relations WHERE user_id = ?').run(parseInt(id));
  
  // 删除用户
  sqlite.prepare('DELETE FROM users WHERE id = ?').run(parseInt(id));
  
  return NextResponse.json({ success: true });
}
