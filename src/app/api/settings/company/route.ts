/**
 * 公司信息设置 API
 * 用于管理公司基本信息
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

// 默认公司设置
const defaultCompanySettings = {
  companyName: '示例公司',
  companyLogo: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  taxId: '',
  businessLicense: ''
};

/**
 * 获取公司信息设置
 */
export async function GET() {
  try {
    const filePath = getSettingsFilePath();
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: true,
        data: defaultCompanySettings
      });
    }

    const yaml = require('yaml');
    const content = fs.readFileSync(filePath, 'utf-8');
    const settings = yaml.parse(content);

    return NextResponse.json({
      success: true,
      data: settings.companySettings || defaultCompanySettings
    });
  } catch (error) {
    console.error('Failed to get company settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get company settings' },
      { status: 500 }
    );
  }
}

/**
 * 更新公司信息设置
 */
export async function PUT(request: NextRequest) {
  try {
    const companySettings = await request.json();
    const filePath = getSettingsFilePath();
    
    const yaml = require('yaml');
    let settings: any = {};
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      settings = yaml.parse(content) || {};
    }

    // 更新公司设置
    settings.companySettings = companySettings;
    
    // 写入文件
    fs.writeFileSync(filePath, yaml.stringify(settings), 'utf-8');

    return NextResponse.json({
      success: true,
      data: companySettings,
      message: '公司信息已保存'
    });
  } catch (error) {
    console.error('Failed to save company settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save company settings' },
      { status: 500 }
    );
  }
}
