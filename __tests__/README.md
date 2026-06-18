# 测试策略文档

## 概述

本文档描述了系统设置模块的测试策略。

## 测试范围

### 1. 单元测试

#### Store 测试
- `settingsStore.test.ts` - 测试设置状态管理
- `organizationStore.test.ts` - 测试组织架构状态管理

#### Hooks 测试
- `useSettings.test.ts` - 测试设置相关 hooks

#### 工具函数测试
- `auth.test.ts` - 测试权限控制函数

### 2. 组件测试

#### 组织架构组件
- `DepartmentList.test.tsx`
- `MemberList.test.tsx`
- `DepartmentDialog.test.tsx`
- `MemberDialog.test.tsx`
- `OrganizationSettings.test.tsx`

#### 设置组件
- `CompanySettings.test.tsx`
- `AISettings.test.tsx`
- `NotificationSettings.test.tsx`
- `ApprovalSettings.test.tsx`
- `PermissionSettings.test.tsx`

### 3. API 测试

#### 设置 API
- `company.test.ts`
- `ai.test.ts`
- `notification.test.ts`
- `approval.test.ts`
- `organization.test.ts`

### 4. E2E 测试

#### 设置流程
- 完整的设置保存流程
- 组织架构编辑流程
- 审批规则配置流程

## 测试工具

### 推荐技术栈
- **单元测试**: Vitest
- **组件测试**: React Testing Library
- **E2E 测试**: Playwright
- **Mock**: MSW (Mock Service Worker)

## 测试数据

### Mock 数据
```typescript
// 测试用的设置数据
export const mockSettings: SystemSettings = {
  company: { /* ... */ },
  ai: { /* ... */ },
  notification: { /* ... */ },
  approval: { /* ... */ }
};

// 测试用的组织架构数据
export const mockOrganization: OrganizationData = {
  departments: [ /* ... */ ],
  members: [ /* ... */ ]
};
```

## 测试优先级

### P0 - 核心功能
- 设置保存和加载
- 组织架构基本操作
- 权限检查函数

### P1 - 重要功能
- 审批规则管理
- 通知配置
- AI 配置

### P2 - 增强功能
- 错误处理边界
- 性能测试
- 可访问性测试

## 运行测试

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 运行组件测试
pnpm test:components

# 运行 E2E 测试
pnpm test:e2e

# 生成覆盖率报告
pnpm test:coverage
```

## 持续集成

测试应该在以下情况下自动运行：
- PR 创建时
- PR 更新时
- 合并到主分支前

## 测试覆盖率目标

- 语句覆盖率: ≥ 80%
- 分支覆盖率: ≥ 70%
- 函数覆盖率: ≥ 80%
- 行覆盖率: ≥ 80%
