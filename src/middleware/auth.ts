/**
 * 权限控制中间件
 * 用于验证用户权限和访问控制
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { logger } from '@/lib/logger';

/**
 * 权限检查中间件
 * @param request Next.js 请求对象
 * @param requiredPermission 需要的权限代码
 * @returns NextResponse 或 null（允许继续）
 */
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
      // TODO: 这里需要实现从数据库获取用户权限的逻辑
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
    logger.error('Permission check failed:', error);
    return NextResponse.json(
      { success: false, error: '权限验证失败' },
      { status: 500 }
    );
  }
}

/**
 * 设置相关的权限代码
 */
export const SETTINGS_PERMISSIONS = {
  VIEW_SETTINGS: 'settings:view',
  EDIT_COMPANY: 'settings:company:edit',
  EDIT_AI: 'settings:ai:edit',
  EDIT_NOTIFICATION: 'settings:notification:edit',
  EDIT_APPROVAL: 'settings:approval:edit',
  EDIT_ORGANIZATION: 'settings:organization:edit',
  MANAGE_PERMISSIONS: 'permissions:manage',
};

/**
 * 检查是否具有设置查看权限
 */
export function canViewSettings(userPermissions: string[]): boolean {
  return userPermissions.includes(SETTINGS_PERMISSIONS.VIEW_SETTINGS) || 
         userPermissions.includes('system:manage');
}

/**
 * 检查是否具有公司信息编辑权限
 */
export function canEditCompanySettings(userPermissions: string[]): boolean {
  return userPermissions.includes(SETTINGS_PERMISSIONS.EDIT_COMPANY) || 
         userPermissions.includes('system:manage');
}

/**
 * 检查是否具有AI配置编辑权限
 */
export function canEditAISettings(userPermissions: string[]): boolean {
  return userPermissions.includes(SETTINGS_PERMISSIONS.EDIT_AI) || 
         userPermissions.includes('system:manage');
}

/**
 * 检查是否具有通知设置编辑权限
 */
export function canEditNotificationSettings(userPermissions: string[]): boolean {
  return userPermissions.includes(SETTINGS_PERMISSIONS.EDIT_NOTIFICATION) || 
         userPermissions.includes('system:manage');
}

/**
 * 检查是否具有审批配置编辑权限
 */
export function canEditApprovalSettings(userPermissions: string[]): boolean {
  return userPermissions.includes(SETTINGS_PERMISSIONS.EDIT_APPROVAL) || 
         userPermissions.includes('system:manage');
}

/**
 * 检查是否具有组织架构编辑权限
 */
export function canEditOrganizationSettings(userPermissions: string[]): boolean {
  return userPermissions.includes(SETTINGS_PERMISSIONS.EDIT_ORGANIZATION) || 
         userPermissions.includes('system:manage');
}
