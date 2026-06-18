/**
 * 通知设置 API
 * 用于管理通知相关配置
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

// 默认通知设置
const defaultNotificationSettings = {
  enableEmail: true,
  enableSms: false,
  enableInApp: true,
  emailSmtpHost: '',
  emailSmtpPort: 587,
  emailSmtpUser: '',
  emailSmtpPassword: '',
  emailFrom: '',
  smsApiKey: '',
  smsApiSecret: ''
};

/**
 * 获取通知设置
 */
export async function GET() {
  try {
    const filePath = getSettingsFilePath();
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: true,
        data: defaultNotificationSettings
      });
    }

    const yaml = require('yaml');
    const content = fs.readFileSync(filePath, 'utf-8');
    const settings = yaml.parse(content);

    return NextResponse.json({
      success: true,
      data: settings.notificationSettings || defaultNotificationSettings
    });
  } catch (error) {
    console.error('Failed to get notification settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get notification settings' },
      { status: 500 }
    );
  }
}

/**
 * 更新通知设置
 */
export async function PUT(request: NextRequest) {
  try {
    const notificationSettings = await request.json();
    const filePath = getSettingsFilePath();
    
    const yaml = require('yaml');
    let settings: any = {};
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      settings = yaml.parse(content) || {};
    }

    // 更新通知设置
    settings.notificationSettings = notificationSettings;
    
    // 写入文件
    fs.writeFileSync(filePath, yaml.stringify(settings), 'utf-8');

    return NextResponse.json({
      success: true,
      data: notificationSettings,
      message: '通知设置已保存'
    });
  } catch (error) {
    console.error('Failed to save notification settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save notification settings' },
      { status: 500 }
    );
  }
}
