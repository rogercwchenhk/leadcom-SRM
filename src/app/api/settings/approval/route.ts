/**
 * 审批配置 API
 * 用于管理审批相关配置
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 设置文件路径
const getSettingsFilePath = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'settings.yaml');
};

// 默认审批设置
const defaultApprovalSettings = {
  approvalEnabled: true,
  amountThreshold: 10000,
  requireSecondApproval: false,
  secondApprovalThreshold: 50000,
  autoApproveBelowThreshold: false,
  approvalUsers: []
};

/**
 * 获取审批配置
 */
export async function GET() {
  try {
    const filePath = getSettingsFilePath();
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: true,
        data: defaultApprovalSettings
      });
    }

    const yaml = require('yaml');
    const content = fs.readFileSync(filePath, 'utf-8');
    const settings = yaml.parse(content);

    return NextResponse.json({
      success: true,
      data: settings.approvalSettings || defaultApprovalSettings
    });
  } catch (error) {
    console.error('Failed to get approval settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get approval settings' },
      { status: 500 }
    );
  }
}

/**
 * 更新审批配置
 */
export async function PUT(request: NextRequest) {
  try {
    const approvalSettings = await request.json();
    const filePath = getSettingsFilePath();
    
    const yaml = require('yaml');
    let settings: any = {};
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      settings = yaml.parse(content) || {};
    }

    // 更新审批设置
    settings.approvalSettings = approvalSettings;
    
    // 写入文件
    fs.writeFileSync(filePath, yaml.stringify(settings), 'utf-8');

    return NextResponse.json({
      success: true,
      data: approvalSettings,
      message: '审批配置已保存'
    });
  } catch (error) {
    console.error('Failed to save approval settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save approval settings' },
      { status: 500 }
    );
  }
}
