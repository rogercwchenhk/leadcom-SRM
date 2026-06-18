import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// JWT Secret - 在生产环境中应该使用环境变量
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// 密码哈希
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// 密码验证
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 生成JWT Token
export function generateToken(userId: number, username: string): string {
  return jwt.sign(
    { userId, username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// 验证JWT Token
export function verifyToken(token: string): { userId: number; username: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

// 设置认证Cookie
export function setAuthCookie(token: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
  }
}

// 获取认证Cookie
export function getAuthCookie(): string | null {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'auth_token') {
        return value;
      }
    }
  }
  return null;
}

// 清除认证Cookie
export function clearAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Strict';
  }
}
