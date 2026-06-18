import { NextRequest, NextResponse } from 'next/server';
import { db, initDatabase } from '@/db';
import { users } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { verifyPassword, generateToken, hashPassword } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  await initDatabase();

  try {
    const body = await request.json();
    const { usernameOrEmail, password } = body;

    // 输入校验
    if (!usernameOrEmail || usernameOrEmail.trim() === '') {
      return NextResponse.json(
        { error: '请输入用户名或邮箱' },
        { status: 400 }
      );
    }

    if (!password || password.trim() === '') {
      return NextResponse.json(
        { error: '请输入密码' },
        { status: 400 }
      );
    }

    // 查找用户（通过用户名或邮箱）
    const user = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.username, usernameOrEmail.trim()),
          eq(users.email, usernameOrEmail.trim())
        )
      )
      .get();

    if (!user) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: '账户已被禁用，请联系管理员' },
        { status: 403 }
      );
    }

    // 检查用户是否设置了密码
    if (!user.passwordHash) {
      return NextResponse.json(
        { 
          error: '账户未设置密码',
          action: 'reset_password',
          message: '请使用密码重置功能设置新密码'
        },
        { status: 403 }
      );
    }
    
    // 验证密码
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 生成JWT Token
    const token = generateToken(user.id, user.username);

    // 返回用户信息（不包含密码哈希）
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    logger.error('Login error:', error);
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
