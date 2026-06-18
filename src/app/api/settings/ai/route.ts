/**
 * AI配置 API
 * 用于管理AI相关配置
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

// 默认AI设置
const defaultAISettings = {
  enableAI: true,
  apiEndpoint: '',
  apiKey: '',
  model: '',
  temperature: 0.7,
  maxTokens: 2048,
  enableSmartSuggestions: true,
  enableAutoApproval: false
};

/**
 * 获取AI配置
 */
export async function GET() {
  try {
    const filePath = getSettingsFilePath();
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: true,
        data: defaultAISettings
      });
    }

    const yaml = require('yaml');
    const content = fs.readFileSync(filePath, 'utf-8');
    const settings = yaml.parse(content);

    return NextResponse.json({
      success: true,
      data: settings.aiSettings || defaultAISettings
    });
  } catch (error) {
    console.error('Failed to get AI settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get AI settings' },
      { status: 500 }
    );
  }
}

/**
 * 更新AI配置
 */
export async function PUT(request: NextRequest) {
  try {
    const aiSettings = await request.json();
    const filePath = getSettingsFilePath();
    
    const yaml = require('yaml');
    let settings: any = {};
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      settings = yaml.parse(content) || {};
    }

    // 更新AI设置
    settings.aiSettings = aiSettings;
    
    // 写入文件
    fs.writeFileSync(filePath, yaml.stringify(settings), 'utf-8');

    return NextResponse.json({
      success: true,
      data: aiSettings,
      message: 'AI配置已保存'
    });
  } catch (error) {
    console.error('Failed to save AI settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save AI settings' },
      { status: 500 }
    );
  }
}
