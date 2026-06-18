import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// 配置文件路径
const CONFIG_FILE_PATH = path.join(process.cwd(), 'data', 'settings.yaml');

// 默认设置数据
const DEFAULT_SETTINGS = {
  company: {
    name: '示例科技有限公司',
    logo: '',
    website: 'https://example.com',
    phone: '400-123-4567',
    email: 'contact@example.com',
    address: '北京市朝阳区xxx街道xxx号',
    description: '一家专注于供应链管理的科技公司',
    taxId: '91110000MA001XXXX',
    businessLicense: ''
  },
  ai: {
    enabled: true,
    apiEndpoint: 'https://api.hermes-agent.example.com/v1',
    apiKey: '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: '你是一个专业的采购助手，帮助用户管理采购需求、分析供应商报价、提供决策建议。',
    autoInquiry: true,
    autoDecision: false
  },
  notification: {
    email: {
      enabled: true,
      address: 'admin@example.com',
      contractUpload: true,
      approvalRequired: true,
      approvalCompleted: true,
      poCreated: true,
      supplierResponse: true,
      systemAlert: true
    },
    inApp: {
      enabled: true,
      contractUpload: true,
      approvalRequired: true,
      approvalCompleted: true,
      poCreated: true,
      supplierResponse: true,
      systemAlert: true
    },
    push: {
      enabled: false,
      contractUpload: false,
      approvalRequired: true,
      approvalCompleted: true,
      poCreated: false,
      supplierResponse: true,
      systemAlert: true
    }
  },
  approval: {
    rules: [
      {
        id: 1,
        name: '小额采购',
        minAmount: 0,
        maxAmount: 10000,
        currency: 'CNY',
        enabled: true,
        description: '1万元以下的采购订单',
        stages: [
          {
            id: 's1',
            name: '采购负责人审批',
            type: 'any',
            approvers: [
              { id: 'u1', type: 'user', name: '钟丽莉', role: '采购负责人' }
            ]
          }
        ]
      },
      {
        id: 2,
        name: '中额采购',
        minAmount: 10000,
        maxAmount: 50000,
        currency: 'CNY',
        enabled: true,
        description: '1万-5万元的采购订单',
        stages: [
          {
            id: 's1',
            name: '采购负责人审批',
            type: 'any',
            approvers: [
              { id: 'u1', type: 'user', name: '钟丽莉', role: '采购负责人' }
            ]
          },
          {
            id: 's2',
            name: '财务审批',
            type: 'any',
            approvers: [
              { id: 'u3', type: 'user', name: '张财务', role: '财务' }
            ]
          }
        ]
      },
      {
        id: 3,
        name: '大额采购',
        minAmount: 50000,
        maxAmount: 100000,
        currency: 'CNY',
        enabled: true,
        description: '5万-10万元的采购订单',
        stages: [
          {
            id: 's1',
            name: '采购负责人审批',
            type: 'any',
            approvers: [
              { id: 'u1', type: 'user', name: '钟丽莉', role: '采购负责人' }
            ]
          },
          {
            id: 's2',
            name: '财务和管理层审批',
            type: 'all',
            approvers: [
              { id: 'u3', type: 'user', name: '张财务', role: '财务' },
              { id: 'u4', type: 'user', name: '王总', role: '审批人员' }
            ]
          }
        ]
      },
      {
        id: 4,
        name: '特大额采购',
        minAmount: 100000,
        maxAmount: null,
        currency: 'CNY',
        enabled: true,
        description: '10万元以上的采购订单',
        stages: [
          {
            id: 's1',
            name: '采购负责人审批',
            type: 'any',
            approvers: [
              { id: 'u1', type: 'user', name: '钟丽莉', role: '采购负责人' }
            ]
          },
          {
            id: 's2',
            name: '财务审批',
            type: 'any',
            approvers: [
              { id: 'u3', type: 'user', name: '张财务', role: '财务' }
            ]
          },
          {
            id: 's3',
            name: '管理层审批',
            type: 'all',
            approvers: [
              { id: 'u4', type: 'user', name: '王总', role: '审批人员' }
            ]
          }
        ]
      }
    ]
  }
};

// 初始化默认配置文件（仅在文件不存在时）
function initializeDefaultConfigIfNeeded() {
  if (!fs.existsSync(CONFIG_FILE_PATH)) {
    console.log('设置配置文件不存在，创建默认配置文件...');
    
    // 生成 YAML 内容
    const yamlContent = `# 系统设置配置文件
# 用途：存储系统所有配置信息（公司信息、AI配置、通知设置、审批规则等）
# 说明：此文件由系统自动管理

${yaml.dump(DEFAULT_SETTINGS, { indent: 2 })}`;

    // 确保目录存在
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 写入默认配置文件
    fs.writeFileSync(CONFIG_FILE_PATH, yamlContent, 'utf-8');
    console.log('默认设置配置文件创建成功');
  }
}

// 读取设置配置
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section'); // 可选：company, ai, notification, approval

    // 确保配置文件存在
    initializeDefaultConfigIfNeeded();

    const fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
    const data = yaml.load(fileContent) as any;

    // 如果指定了section，只返回该部分数据
    if (section && data[section] !== undefined) {
      return NextResponse.json(data[section]);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('读取设置配置失败:', error);
    return NextResponse.json(
      { error: '读取设置配置失败' },
      { status: 500 }
    );
  }
}

// 保存设置配置
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data: sectionData } = body;

    console.log('收到保存设置请求:', { section, hasData: !!sectionData });

    // 确保配置文件存在
    initializeDefaultConfigIfNeeded();

    // 读取现有配置
    const fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
    const currentData = yaml.load(fileContent) as any || {};

    // 如果指定了section，只更新该部分数据
    if (section && sectionData !== undefined) {
      currentData[section] = sectionData;
      console.log(`更新 ${section} 配置`);
    } else {
      // 全量更新
      Object.assign(currentData, body);
      console.log('全量更新设置配置');
    }

    // 生成 YAML 内容
    const yamlContent = `# 系统设置配置文件
# 用途：存储系统所有配置信息（公司信息、AI配置、通知设置、审批规则等）
# 说明：此文件由系统自动管理

${yaml.dump(currentData, { indent: 2 })}`;

    // 写入文件
    fs.writeFileSync(CONFIG_FILE_PATH, yamlContent, 'utf-8');
    console.log('设置配置保存成功');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('保存设置配置失败:', error);
    return NextResponse.json(
      { error: '保存设置配置失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
