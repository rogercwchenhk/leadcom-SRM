-- Supabase 数据库 Schema
-- 用于系统设置的数据库迁移

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 设置相关表
-- ============================================

-- 系统设置表
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 公司信息表
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    company_logo TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    tax_id TEXT,
    business_license TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI配置表
CREATE TABLE IF NOT EXISTS ai_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enable_ai BOOLEAN NOT NULL DEFAULT true,
    api_endpoint TEXT,
    api_key TEXT,
    model TEXT,
    temperature NUMERIC DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 2048,
    enable_smart_suggestions BOOLEAN NOT NULL DEFAULT true,
    enable_auto_approval BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 通知设置表
CREATE TABLE IF NOT EXISTS notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enable_email BOOLEAN NOT NULL DEFAULT true,
    enable_sms BOOLEAN NOT NULL DEFAULT false,
    enable_in_app BOOLEAN NOT NULL DEFAULT true,
    email_smtp_host TEXT,
    email_smtp_port INTEGER,
    email_smtp_user TEXT,
    email_smtp_password TEXT,
    email_from TEXT,
    sms_api_key TEXT,
    sms_api_secret TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 审批配置表
CREATE TABLE IF NOT EXISTS approval_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    approval_enabled BOOLEAN NOT NULL DEFAULT true,
    amount_threshold NUMERIC NOT NULL DEFAULT 10000,
    require_second_approval BOOLEAN NOT NULL DEFAULT false,
    second_approval_threshold NUMERIC,
    auto_approve_below_threshold BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 审批人员配置表
CREATE TABLE IF NOT EXISTS approval_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    can_approve BOOLEAN NOT NULL DEFAULT true,
    max_approval_amount NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 组织架构表
-- ============================================

-- 部门表
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT,
    description TEXT,
    parent_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    manager_id UUID,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 岗位表
CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT,
    description TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 员工表
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    employee_number TEXT UNIQUE,
    email TEXT,
    phone TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    position_id UUID REFERENCES positions(id) ON DELETE SET NULL,
    hire_date DATE,
    status TEXT NOT NULL DEFAULT 'active',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 权限管理表 (与现有 SQLite schema 保持兼容)
-- ============================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 用户组表
CREATE TABLE IF NOT EXISTS user_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_group_id UUID REFERENCES user_groups(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 权限表
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_permission_id UUID REFERENCES permissions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 用户-用户组关联表
CREATE TABLE IF NOT EXISTS user_group_relations (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES user_groups(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, group_id)
);

-- 用户组-权限关联表
CREATE TABLE IF NOT EXISTS group_permission_relations (
    group_id UUID NOT NULL REFERENCES user_groups(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (group_id, permission_id)
);

-- 用户-权限直接关联表
CREATE TABLE IF NOT EXISTS user_permission_relations (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, permission_id)
);

-- ============================================
-- 设置变更日志表
-- ============================================

CREATE TABLE IF NOT EXISTS settings_change_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_type TEXT NOT NULL,
    setting_key TEXT,
    old_value JSONB,
    new_value JSONB,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

-- ============================================
-- 索引
-- ============================================

-- 系统设置索引
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);

-- 部门索引
CREATE INDEX IF NOT EXISTS idx_departments_parent_id ON departments(parent_id);
CREATE INDEX IF NOT EXISTS idx_departments_is_active ON departments(is_active);

-- 岗位索引
CREATE INDEX IF NOT EXISTS idx_positions_department_id ON positions(department_id);

-- 员工索引
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_position_id ON employees(position_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);

-- 用户组索引
CREATE INDEX IF NOT EXISTS idx_user_groups_parent_id ON user_groups(parent_group_id);

-- 权限索引
CREATE INDEX IF NOT EXISTS idx_permissions_parent_id ON permissions(parent_permission_id);

-- 变更日志索引
CREATE INDEX IF NOT EXISTS idx_settings_change_logs_type ON settings_change_logs(setting_type);
CREATE INDEX IF NOT EXISTS idx_settings_change_logs_changed_by ON settings_change_logs(changed_by);
CREATE INDEX IF NOT EXISTS idx_settings_change_logs_changed_at ON settings_change_logs(changed_at DESC);

-- ============================================
-- Row Level Security (RLS) 策略
-- ============================================

-- 启用 RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_group_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_permission_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permission_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings_change_logs ENABLE ROW LEVEL SECURITY;

-- 示例 RLS 策略（需要根据实际需求调整）
-- 这些策略允许已认证用户读取和写入设置
CREATE POLICY "Allow authenticated users to read system settings"
    ON system_settings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert system settings"
    ON system_settings FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update system settings"
    ON system_settings FOR UPDATE
    TO authenticated
    USING (true);

-- ============================================
-- 自动更新 updated_at 字段的触发器
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有有 updated_at 字段的表创建触发器
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_settings_updated_at BEFORE UPDATE ON ai_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approval_settings_updated_at BEFORE UPDATE ON approval_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approval_users_updated_at BEFORE UPDATE ON approval_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_groups_updated_at BEFORE UPDATE ON user_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
