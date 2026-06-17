import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// 用户表
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  status: text('status', { enum: ['active', 'inactive', 'suspended'] }).notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

// 用户组表（支持树形层级）
export const userGroups = sqliteTable('user_groups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  description: text('description'),
  parentGroupId: integer('parent_group_id'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
}, (table) => ({
  parentGroupIdx: index('parent_group_idx').on(table.parentGroupId),
}));

// 权限表（支持树形权限）
export const permissions = sqliteTable('permissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  description: text('description'),
  parentPermissionId: integer('parent_permission_id'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
}, (table) => ({
  parentPermissionIdx: index('parent_permission_idx').on(table.parentPermissionId),
}));

// 用户-用户组关联表
export const userGroupRelations = sqliteTable('user_group_relations', {
  userId: integer('user_id').notNull(),
  groupId: integer('group_id').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.groupId] }),
}));

// 用户组-权限关联表
export const groupPermissionRelations = sqliteTable('group_permission_relations', {
  groupId: integer('group_id').notNull(),
  permissionId: integer('permission_id').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.groupId, table.permissionId] }),
}));

// 用户-权限直接关联表
export const userPermissionRelations = sqliteTable('user_permission_relations', {
  userId: integer('user_id').notNull(),
  permissionId: integer('permission_id').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.permissionId] }),
}));

// 类型导出
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserGroup = typeof userGroups.$inferSelect;
export type NewUserGroup = typeof userGroups.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
