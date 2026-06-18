# Leadcom-SRM 安全问题修复指南

## 概述
本文档针对代码审查中发现的安全问题，提供具体的修复步骤和代码示例。

## 🔐 问题1：JWT密钥硬编码默认值

**文件**：`src/lib/auth.ts:5`
**问题**：JWT_SECRET 有默认值 `'your-secret-key-change-in-production'`
**风险**：攻击者可使用已知密钥伪造JWT令牌

### 修复方案
```typescript
// src/lib/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 移除默认值，强制检查环境变量
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 环境变量未设置。请在 .env 文件中配置强随机密钥。');
}

const JWT_EXPIRES_IN = '7d';

// 其余代码保持不变...
```

### 环境变量配置
在 `.env` 文件中添加：
```
JWT_SECRET=your-super-secret-key-here-at-least-32-characters-long
```

---

## 🔐 问题2：硬编码默认密码

**文件**：`src/app/api/auth/login/route.ts:59`
**问题**：用户没有密码哈希时设置默认密码 `'123456'`
**风险**：为无密码用户创建后门凭证

### 修复方案
```typescript
// src/app/api/auth/login/route.ts
// 删除以下代码块（第56-74行）：
/*
if (!user.passwordHash) {
  // 为现有用户设置默认密码
  const defaultPassword = '123456';
  const hashedPassword = await hashPassword(defaultPassword);
  
  await db
    .update(users)
    .set({ passwordHash: hashedPassword, updatedAt: new Date() })
    .where(eq(users.id, user.id));
  
  // 使用默认密码验证
  const isValid = await verifyPassword(defaultPassword, hashedPassword);
  if (!isValid) {
    return NextResponse.json(
      { error: '用户名或密码错误' },
      { status: 401 }
    );
  }
}
*/

// 替换为：
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
```

---

## 🔐 问题3：权限中间件未实现

**文件**：`src/middleware/auth.ts:42-43`
**问题**：临时允许所有请求通过，没有权限检查
**风险**：所有API端点可未授权访问

### 修复方案
```typescript
// src/middleware/auth.ts
export async function checkPermission(
  request: NextRequest,
  requiredPermission?: string
): Promise<NextResponse | null> {
  try {
    // 从请求头中获取会话信息
    const sessionHeader = request.headers.get('x-session');
    
    if (!sessionHeader) {
      return NextResponse.json(
        { success: false, error: '未登录或会话已过期' },
        { status: 401 }
      );
    }

    // 验证JWT令牌
    const token = sessionHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: '无效的认证令牌' },
        { status: 401 }
      );
    }

    // 如果需要特定权限，检查用户权限
    if (requiredPermission) {
      // 这里需要实现从数据库获取用户权限的逻辑
      // const userPermissions = await getUserPermissions(decoded.userId);
      // if (!userPermissions.includes(requiredPermission)) {
      //   return NextResponse.json(
      //     { success: false, error: '权限不足' },
      //     { status: 403 }
      //   );
      // }
    }

    // 将用户信息添加到请求头，供后续处理使用
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId.toString());
    requestHeaders.set('x-username', decoded.username);

    return null; // 允许继续
  } catch (error) {
    console.error('Permission check failed:', error);
    return NextResponse.json(
      { success: false, error: '权限验证失败' },
      { status: 500 }
    );
  }
}
```

---

## 🧹 问题4：清理调试代码

**文件**：多个文件中的 `console.log` 语句
**问题**：生产环境不应有调试日志

### 修复方案
1. 删除所有 `console.log` 语句
2. 或使用日志级别控制：

```typescript
// 创建日志工具 lib/logger.ts
const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  info: (...args: any[]) => {
    if (!isProduction) {
      console.log('[INFO]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
  warn: (...args: any[]) => {
    if (!isProduction) {
      console.warn('[WARN]', ...args);
    }
  },
  debug: (...args: any[]) => {
    if (!isProduction) {
      console.debug('[DEBUG]', ...args);
    }
  }
};

// 使用示例
import { logger } from '@/lib/logger';
logger.info('配置文件不存在，创建默认配置文件...');
```

---

## 📝 问题5：创建环境变量模板

**文件**：`.env.example`
**问题**：新开发者不知道需要配置哪些环境变量

### 修复方案
创建 `.env.example` 文件：
```env
# 应用配置
NODE_ENV=development
PORT=5000
HOSTNAME=localhost

# JWT认证
JWT_SECRET=your-super-secret-key-here-at-least-32-characters-long

# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Hermes Agent配置
HERMES_AGENT_URL=your-hermes-agent-url
HERMES_API_KEY=your-hermes-api-key
HERMES_API_KEY_ALT=your-hermes-api-key-alt
HERMES_ENABLED=true

# 数据库配置（如果使用SQLite）
DATABASE_PATH=./data/leadcom.db
```

---

## 🧪 问题6：添加单元测试

### 测试框架安装
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

### 创建测试文件
```typescript
// __tests__/auth.test.ts
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, generateToken, verifyToken } from '../lib/auth';

describe('认证工具函数', () => {
  it('应该正确哈希和验证密码', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    
    expect(hash).not.toBe(password);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword('wrongPassword', hash)).toBe(false);
  });

  it('应该生成和验证JWT令牌', () => {
    const userId = 1;
    const username = 'testuser';
    const token = generateToken(userId, username);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    
    const decoded = verifyToken(token);
    expect(decoded).toBeDefined();
    expect(decoded?.userId).toBe(userId);
    expect(decoded?.username).toBe(username);
  });

  it('应该拒绝无效的JWT令牌', () => {
    const invalidToken = 'invalid.token.here';
    const decoded = verifyToken(invalidToken);
    expect(decoded).toBeNull();
  });
});
```

---

## 🔒 问题7：添加API速率限制

### 安装依赖
```bash
pnpm add rate-limiter-flexible
```

### 创建速率限制中间件
```typescript
// src/middleware/rate-limit.ts
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextRequest, NextResponse } from 'next/server';

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10个请求
  duration: 15, // 15秒内
});

export async function rateLimit(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  try {
    await rateLimiter.consume(ip);
    return null; // 允许继续
  } catch (error) {
    return NextResponse.json(
      { error: '请求过于频繁，请稍后再试' },
      { status: 429 }
    );
  }
}
```

### 在API路由中使用
```typescript
// src/app/api/auth/login/route.ts
import { rateLimit } from '@/middleware/rate-limit';

export async function POST(request: NextRequest) {
  // 应用速率限制
  const rateLimitResponse = await rateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  // 其余代码...
}
```

---

## 📋 修复顺序建议

1. **立即修复**（安全关键）：
   - JWT密钥硬编码（问题1）
   - 硬编码默认密码（问题2）
   - 权限中间件（问题3）

2. **尽快修复**（重要）：
   - 环境变量模板（问题5）
   - 清理调试代码（问题4）

3. **计划修复**（改进）：
   - 单元测试（问题6）
   - 速率限制（问题7）

---

## ✅ 验证修复

修复后，请运行以下命令验证：

```bash
# 类型检查
pnpm run ts-check

# 代码检查
pnpm run lint

# 运行测试（如果已添加）
pnpm test

# 构建检查
pnpm run build
```

---

**注意**：修复安全问题后，请确保更新所有相关文档，并通知团队成员进行代码审查。