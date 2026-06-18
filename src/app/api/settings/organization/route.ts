/**
 * 组织架构 API
 * 用于管理部门、岗位和员工信息
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

// 默认组织架构数据
const defaultOrganizationData = {
  departments: [
    {
      id: '1',
      name: '总公司',
      code: 'HQ',
      description: '公司总部',
      parentId: null,
      managerId: null,
      sortOrder: 0,
      isActive: true
    }
  ],
  positions: [],
  employees: []
};

/**
 * 获取组织架构数据
 */
export async function GET() {
  try {
    const filePath = getSettingsFilePath();
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: true,
        data: defaultOrganizationData
      });
    }

    const yaml = require('yaml');
    const content = fs.readFileSync(filePath, 'utf-8');
    const settings = yaml.parse(content);

    return NextResponse.json({
      success: true,
      data: {
        departments: settings.departments || defaultOrganizationData.departments,
        positions: settings.positions || defaultOrganizationData.positions,
        employees: settings.employees || defaultOrganizationData.employees
      }
    });
  } catch (error) {
    console.error('Failed to get organization data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get organization data' },
      { status: 500 }
    );
  }
}

/**
 * 更新组织架构数据
 */
export async function PUT(request: NextRequest) {
  try {
    const organizationData = await request.json();
    const filePath = getSettingsFilePath();
    
    const yaml = require('yaml');
    let settings: any = {};
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      settings = yaml.parse(content) || {};
    }

    // 更新组织架构数据
    settings.departments = organizationData.departments;
    settings.positions = organizationData.positions;
    settings.employees = organizationData.employees;
    
    // 写入文件
    fs.writeFileSync(filePath, yaml.stringify(settings), 'utf-8');

    return NextResponse.json({
      success: true,
      data: organizationData,
      message: '组织架构已保存'
    });
  } catch (error) {
    console.error('Failed to save organization data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save organization data' },
      { status: 500 }
    );
  }
}
