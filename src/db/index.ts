import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';
import { logger } from '@/lib/logger';

// 确定数据库文件路径
const getDbPath = (): string => {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    return '/tmp/permissions.db';
  }
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'permissions.db');
};

// 初始化数据库连接
const dbPath = getDbPath();
const sqlite = new Database(dbPath);

// 创建 Drizzle ORM 实例
export const db = drizzle(sqlite, { schema });

// 初始化数据库表和初始数据
export async function initDatabase() {
  // 检查表是否存在
  const tables = sqlite.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
  `).all() as { name: string }[];

  const tableNames = tables.map(t => t.name);

  // 如果表不存在，通过 Drizzle 的迁移创建（这里简化处理）
  if (tableNames.length === 0) {
    logger.info('Creating database tables...');
    
    // 使用 raw SQL 创建表（简化版本）
    sqlite.exec(`
      -- 用户表
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      );

      -- 用户组表
      CREATE TABLE user_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        parent_group_id INTEGER,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        FOREIGN KEY (parent_group_id) REFERENCES user_groups(id)
      );

      -- 权限表
      CREATE TABLE permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        description TEXT,
        parent_permission_id INTEGER,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        FOREIGN KEY (parent_permission_id) REFERENCES permissions(id)
      );

      -- 用户-用户组关联表
      CREATE TABLE user_group_relations (
        user_id INTEGER NOT NULL,
        group_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, group_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (group_id) REFERENCES user_groups(id)
      );

      -- 用户组-权限关联表
      CREATE TABLE group_permission_relations (
        group_id INTEGER NOT NULL,
        permission_id INTEGER NOT NULL,
        PRIMARY KEY (group_id, permission_id),
        FOREIGN KEY (group_id) REFERENCES user_groups(id),
        FOREIGN KEY (permission_id) REFERENCES permissions(id)
      );

      -- 用户-权限直接关联表
      CREATE TABLE user_permission_relations (
        user_id INTEGER NOT NULL,
        permission_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, permission_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (permission_id) REFERENCES permissions(id)
      );

      -- 索引
      CREATE INDEX parent_group_idx ON user_groups(parent_group_id);
      CREATE INDEX parent_permission_idx ON permissions(parent_permission_id);
    `);

    // 插入初始数据
    await seedInitialData();
    logger.info('Database initialized successfully!');
  }
}

// 插入初始数据
async function seedInitialData() {
  // 插入默认权限
  const defaultPermissions = [
    { name: '用户管理', code: 'user:manage', description: '管理用户的增删改查' },
    { name: '查看用户', code: 'user:view', description: '查看用户列表和详情', parentPermissionId: 1 },
    { name: '创建用户', code: 'user:create', description: '创建新用户', parentPermissionId: 1 },
    { name: '编辑用户', code: 'user:edit', description: '编辑用户信息', parentPermissionId: 1 },
    { name: '删除用户', code: 'user:delete', description: '删除用户', parentPermissionId: 1 },
    
    { name: '用户组管理', code: 'group:manage', description: '管理用户组的增删改查' },
    { name: '查看用户组', code: 'group:view', description: '查看用户组列表和详情', parentPermissionId: 6 },
    { name: '创建用户组', code: 'group:create', description: '创建新用户组', parentPermissionId: 6 },
    { name: '编辑用户组', code: 'group:edit', description: '编辑用户组信息', parentPermissionId: 6 },
    { name: '删除用户组', code: 'group:delete', description: '删除用户组', parentPermissionId: 6 },
    
    { name: '权限管理', code: 'permission:manage', description: '管理权限分配' },
    { name: '查看权限', code: 'permission:view', description: '查看权限列表', parentPermissionId: 11 },
    { name: '分配权限', code: 'permission:assign', description: '分配用户/用户组权限', parentPermissionId: 11 },
    
    { name: '系统管理', code: 'system:manage', description: '系统级管理功能' },
  ];

  for (const perm of defaultPermissions) {
    const { parentPermissionId, ...rest } = perm;
    sqlite.prepare(`
      INSERT INTO permissions (name, code, description, parent_permission_id)
      VALUES (?, ?, ?, ?)
    `).run(rest.name, rest.code, rest.description, null);
  }

  // 更新父子关系（简化处理）
  const parentUpdates = [
    [2, 1], [3, 1], [4, 1], [5, 1],
    [7, 6], [8, 6], [9, 6], [10, 6],
    [12, 11], [13, 11],
  ];

  for (const [childId, parentId] of parentUpdates) {
    sqlite.prepare(`
      UPDATE permissions SET parent_permission_id = ? WHERE id = ?
    `).run(parentId, childId);
  }

  // 创建默认用户组
  sqlite.prepare(`
    INSERT INTO user_groups (name, description) VALUES (?, ?)
  `).run('管理员', '系统管理员，拥有所有权限');

  sqlite.prepare(`
    INSERT INTO user_groups (name, description) VALUES (?, ?)
  `).run('普通用户', '普通用户组，拥有基础权限');

  // 创建默认用户
  sqlite.prepare(`
    INSERT INTO users (username, email, status) VALUES (?, ?, ?)
  `).run('admin', 'admin@example.com', 'active');

  // 给管理员用户组分配所有权限
  for (let i = 1; i <= defaultPermissions.length; i++) {
    sqlite.prepare(`
      INSERT INTO group_permission_relations (group_id, permission_id) VALUES (?, ?)
    `).run(1, i);
  }

  // 将 admin 用户加入管理员组
  sqlite.prepare(`
    INSERT INTO user_group_relations (user_id, group_id) VALUES (?, ?)
  `).run(1, 1);
}

export { sqlite };
