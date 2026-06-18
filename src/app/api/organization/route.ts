import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { Department, TeamMember } from '@/types';

// 配置文件路径
const CONFIG_FILE_PATH = path.join(process.cwd(), 'data', 'organization.yaml');

// 读取组织架构配置
export async function GET() {
  try {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      return NextResponse.json(
        { error: '配置文件不存在' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
    const data = yaml.loadAll(fileContent);
    
    // 解析 YAML 文档
    let departments: any[] = [];
    let teamMembers: any[] = [];
    
    data.forEach((doc: any) => {
      if (doc && doc.departments) {
        departments = doc.departments;
      }
      if (doc && doc.teamMembers) {
        teamMembers = doc.teamMembers;
      }
    });

    // 转换日期字符串为 Date 对象
    const parsedDepartments: Department[] = departments.map((dept: any) => ({
      ...dept,
      createdAt: new Date(dept.createdAt),
      updatedAt: new Date(dept.updatedAt)
    }));

    const parsedTeamMembers: TeamMember[] = teamMembers.map((member: any) => ({
      ...member,
      joinDate: new Date(member.joinDate),
      createdAt: new Date(member.createdAt),
      updatedAt: new Date(member.updatedAt)
    }));

    return NextResponse.json({
      departments: parsedDepartments,
      teamMembers: parsedTeamMembers
    });
  } catch (error) {
    console.error('读取配置文件失败:', error);
    return NextResponse.json(
      { error: '读取配置文件失败' },
      { status: 500 }
    );
  }
}

// 保存组织架构配置
export async function PUT(request: NextRequest) {
  try {
    const { departments, teamMembers }: { departments: Department[]; teamMembers: TeamMember[] } = await request.json();

    // 转换 Date 对象为字符串
    const departmentsForYaml = departments.map((dept: Department) => ({
      ...dept,
      createdAt: dept.createdAt.toISOString(),
      updatedAt: dept.updatedAt.toISOString()
    }));

    const teamMembersForYaml = teamMembers.map((member: TeamMember) => ({
      ...member,
      joinDate: member.joinDate.toISOString(),
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString()
    }));

    // 生成 YAML 内容
    const yamlContent = `# 组织架构配置文件
# 用途：存储公司组织架构、部门和人员信息
# 说明：此文件由系统自动管理，也可手动编辑
# AI 友好格式：清晰的注释、结构化数据、有意义的字段名

---
# 部门配置
departments: ${yaml.dump(departmentsForYaml, { indent: 2 })}
---
# 团队成员配置
teamMembers: ${yaml.dump(teamMembersForYaml, { indent: 2 })}`;

    // 确保目录存在
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 写入文件
    fs.writeFileSync(CONFIG_FILE_PATH, yamlContent, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('保存配置文件失败:', error);
    return NextResponse.json(
      { error: '保存配置文件失败' },
      { status: 500 }
    );
  }
}
