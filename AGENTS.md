# 项目上下文

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
│   ├── build.sh            # 构建脚本
│   ├── dev.sh              # 开发环境启动脚本
│   ├── prepare.sh          # 预处理脚本
│   └── start.sh            # 生产环境启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   │   └── api/hermes/    # Hermes Agent API路由
│   │       └── chat/route.ts  # AI聊天API
│   ├── components/        # 自定义组件
│   │   ├── chat/          # AI聊天组件
│   │   │   └── AIChatWindow.tsx  # AI聊天窗口组件
│   │   ├── layout/        # 布局组件
│   │   ├── permissions/   # 权限管理组件
│   │   ├── settings/      # 系统设置组件
│   │   │   ├── OrganizationSettings.tsx  # 组织架构设置
│   │   │   ├── PermissionSettings.tsx    # 权限管理设置
│   │   │   ├── CompanySettings.tsx       # 公司信息设置
│   │   │   ├── ApprovalSettings.tsx      # 审批配置
│   │   │   ├── AISettings.tsx            # AI配置
│   │   │   └── NotificationSettings.tsx  # 通知设置
│   │   └── ui/            # Shadcn UI 组件库
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   └── utils.ts        # 通用工具函数 (cn)
│   └── server.ts           # 自定义服务端入口
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

- 项目文件（如 app 目录、pages 目录、components 等）默认初始化到 `src/` 目录下。

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 开发规范

### 编码规范

- 默认按 TypeScript `strict` 心智写代码；优先复用当前作用域已声明的变量、函数、类型和导入，禁止引用未声明标识符或拼错变量名。
- 禁止隐式 `any` 和 `as any`；函数参数、返回值、解构项、事件对象、`catch` 错误在使用前应有明确类型或先完成类型收窄，并清理未使用的变量和导入。

### next.config 配置规范

- 配置的路径不要写死绝对路径，必须使用 path.resolve(__dirname, ...)、import.meta.dirname 或 process.cwd() 动态拼接。

### Hydration 问题防范

1. 严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。**必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染**；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。
2. **禁止使用 head 标签**，优先使用 metadata，详见文档：https://nextjs.org/docs/app/api-reference/functions/generate-metadata
   1. 三方 CSS、字体等资源可在 `globals.css` 中顶部通过 `@import` 引入或使用 next/font
   2. preload, preconnect, dns-prefetch 通过 ReactDOM 的 preload、preconnect、dns-prefetch 方法引入
   3. json-ld 可阅读 https://nextjs.org/docs/app/guides/json-ld

## UI 设计与组件规范 (UI & Styling Standards)

- 模板默认预装核心组件库 `shadcn/ui`，位于`src/components/ui/`目录下
- Next.js 项目**必须默认**采用 shadcn/ui 组件、风格和规范，**除非用户指定用其他的组件和规范。**

## AI聊天功能

### 功能概述
- 在每个页面底部都有一个可展开的AI聊天窗口
- 用户可以通过自然语言与Hermes Agent交互来操作软件
- 支持流式输出，提供打字机效果的实时响应

### 组件位置
- **聊天窗口组件**: `src/components/chat/AIChatWindow.tsx`
- **API路由**: `src/app/api/hermes/chat/route.ts`

### 核心特性
1. **可折叠窗口**: 点击右下角的"AI助手"按钮展开/收起聊天窗口
2. **消息历史**: 保持对话历史记录
3. **流式输出**: 使用SSE协议实现实时打字机效果
4. **专业界面**: 采用与系统一致的设计风格

### 使用方式
- 用户可以用自然语言描述需求，如："帮我创建一个采购需求"、"查询供应商信息"等
- AI助手会理解用户意图并协助完成相应的系统操作

### Hermes Agent集成
- API路由设计为可对接真实的Hermes Agent gateway/api
- 当前使用模拟响应演示功能
- 在生产环境中需要配置环境变量和真实的API端点

## 功能模块

### 1. 合同管理模块
- **页面路由**: `/contracts` - 合同列表
- **页面路由**: `/contracts/new` - 合同上传
- **页面路由**: `/contracts/[id]` - 合同详情
- **API路由**: `/api/contracts/*` - 合同相关API
- **功能**: PDF上传、AI摘要生成、合同信息提取、与需求关联

### 2. 需求管理模块
- **页面路由**: `/requests` - 需求列表
- **页面路由**: `/requests/new` - 创建需求
- **页面路由**: `/requests/[id]` - 需求详情
- **需求类型**:
  - 确定需求: 来自销售合同，自动填充数据
  - 非确定需求: 独立创建，支持外部询价
- **功能**: 需求创建、询价管理、外销参考价格、生成PO

### 3. PO管理模块
- **页面路由**: `/pos` - PO列表
- **功能**: PO管理、状态跟踪、与需求和合同关联

### 4. 供应商管理模块
- **页面路由**: `/supplier` - 供应商管理
- **功能**: 供应商信息管理、历史合作记录

### 5. 数据分析模块
- **页面路由**: `/analytics` - 数据分析
- **功能**: 合同分析、需求分析、PO分析、价格趋势分析

### 6. 系统设置模块
- **页面路由**: `/settings` - 系统设置
- **功能模块**:
  - **组织架构**: 管理公司组织架构、部门、岗位和人员信息
  - **权限管理**: 管理用户、用户组、权限分配和层级关系
  - **公司信息**: 配置公司基本信息
  - **审批配置**: 设置审批流程和金额阈值
  - **AI配置**: 配置AI相关参数
  - **通知设置**: 配置系统通知规则
- **组件位置**: `src/components/settings/` - 系统设置相关组件

## 核心类型定义
- **位置**: `src/types/index.ts`
- **新增类型**:
  - `SalesContract`: 销售合同
  - `ContractSummary`: 合同摘要
  - `ContractItem`: 合同明细项
  - `ExternalInquiry`: 外部询价
  - `ExportPriceReference`: 外销参考价格
- **扩展类型**:
  - `PurchaseRequest`: 增加需求来源、类型、合同关联等字段
