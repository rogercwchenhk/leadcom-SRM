/**
 * Supabase 客户端配置
 * 用于与 Supabase 数据库交互
 */

import { createClient } from '@supabase/supabase-js';

// 环境变量配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 检查环境变量是否配置
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are not configured. ' +
    'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

/**
 * Supabase 客户端实例
 * 用于前端调用 Supabase API
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * 服务端 Supabase 客户端（用于 API Routes）
 * 使用服务端密钥进行管理员操作
 */
export function createServerClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * 检查 Supabase 是否配置
 */
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey;
}

/**
 * 获取 Supabase 配置状态
 */
export function getSupabaseConfigStatus() {
  return {
    urlConfigured: !!supabaseUrl,
    anonKeyConfigured: !!supabaseAnonKey,
    serviceKeyConfigured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    fullyConfigured: !!supabaseUrl && !!supabaseAnonKey,
  };
}

export default supabase;
