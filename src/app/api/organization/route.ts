import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { Department, TeamMember } from '@/types';
import { PRESET_DEPARTMENTS, PRESET_TEAM_MEMBERS } from '@/types';
import { db, initDatabase } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';

// 配置文件路径
const CONFIG_FILE_PATH = path.join(process.cwd(), 'data', 'organization.yaml');

// 初始化默认配置文件（仅在文件不存在时）
function initializeDefaultConfigIfNeeded() {
  if (!fs.existsSync(CONFIG_FILE_PATH)) {
    logger.info('配置文件不存在，创建默认配置文件...');
    
    // 转换预设数据为 YAML 格式
    const departmentsForYaml = PRESET_DEPARTMENTS.map((dept) => ({
      ...dept,
      createdAt: dept.createdAt.toISOString(),
      updatedAt: dept.updatedAt.toISOString()
    }));

    const teamMembersForYaml = PRESET_TEAM_MEMBERS.map((member) => ({
      ...member,
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString()
    }));

    // 生成 YAML 内容 - 使用单文档格式
    const yamlData = {
      departments: departmentsForYaml,
      teamMembers: teamMembersForYaml
    };
    
    const yamlContent = `# 组织架构配置文件
# 用途：存储公司组织架构、部门和人员信息
# 说明：此文件由系统自动管理，也可手动编辑
# AI 友好格式：清晰的注释、结构化数据、有意义的字段名

${yaml.dump(yamlData, { indent: 2 })}`;

    // 确保目录存在
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 写入默认配置文件
    fs.writeFileSync(CONFIG_FILE_PATH, yamlContent, 'utf-8');
    logger.info('默认配置文件创建成功');
  }
}

// 读取组织架构配置
export async function GET() {
  try {
    // 确保配置文件存在（如果不存在则初始化）
    initializeDefaultConfigIfNeeded();

    const fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
    const data = yaml.load(fileContent) as any;
    
    // 解析 YAML 文档
    const departments: any[] = data?.departments || [];
    const teamMembers: any[] = data?.teamMembers || [];

    logger.info('读取到数据:', { 
      departmentsCount: departments.length, 
      teamMembersCount: teamMembers.length,
      departments: departments.map((d: any) => d.name)
    });

    // 转换日期字符串为 Date 对象
    const parsedDepartments: Department[] = departments.map((dept: any) => ({
      ...dept,
      createdAt: new Date(dept.createdAt),
      updatedAt: new Date(dept.updatedAt)
    }));

    const parsedTeamMembers: TeamMember[] = teamMembers.map((member: any) => ({
      ...member,
      // 兼容旧格式：如果有 role 字段但没有 roles 字段，转换为 roles 数组
      roles: member.roles || (member.role ? [member.role] : []),
      // 确保 isActive 字段存在
      isActive: member.isActive !== undefined ? member.isActive : true,
      createdAt: new Date(member.createdAt),
      updatedAt: new Date(member.updatedAt)
    }));

    return NextResponse.json({
      departments: parsedDepartments,
      teamMembers: parsedTeamMembers
    });
  } catch (error) {
    logger.error('读取配置文件失败:', error);
    return NextResponse.json(
      { error: '读取配置文件失败' },
      { status: 500 }
    );
  }
}

// 自动为有系统访问权限的成员创建用户账号
async function syncSystemUsers(teamMembers: TeamMember[]) {
  try {
    await initDatabase();
    
    for (const member of teamMembers) {
      if (member.hasSystemAccess && member.systemUsername && member.email) {
        // 检查用户是否已存在
        const existingUsers = await db.select().from(users).where(eq(users.email, member.email)).all();
        
        if (existingUsers.length === 0) {
          // 创建新用户
          const now = new Date();
          await db.insert(users).values({
            username: member.systemUsername || member.email,
            email: member.email,
            status: member.isActive ? 'active' : 'inactive',
            createdAt: now,
            updatedAt: now,
          });
          logger.info(`为成员 ${member.name} 创建了系统用户账号`);
        } else {
          // 更新现有用户
          await db.update(users)
            .set({
              username: member.systemUsername || member.email,
              status: member.isActive ? 'active' : 'inactive',
              updatedAt: new Date(),
            })
            .where(eq(users.email, member.email));
          logger.info(`更新了成员 ${member.name} 的系统用户账号`);
        }
      }
    }
  } catch (error) {
    logger.error('同步系统用户失败:', error);
    // 不抛出错误，让组织架构保存继续进行
  }
}

// 保存组织架构配置
export async function PUT(request: NextRequest) {
  try {
    logger.info('收到保存请求...');
    const body = await request.json();
    logger.info('请求体 - 部门数量:', body.departments?.length, '成员数量:', body.teamMembers?.length);
    logger.info('请求部门:', body.departments?.map((d: any) => d.name));
    
    const { departments, teamMembers } = body;
    
    if (!departments || !teamMembers) {
      logger.error('缺少必要数据:', { departments: !!departments, teamMembers: !!teamMembers });
      return NextResponse.json(
        { error: '缺少必要数据' },
        { status: 400 }
      );
    }

    logger.info('准备转换数据...');
    // 转换 Date 对象为字符串
    const departmentsForYaml = departments.map((dept: Department) => ({
      ...dept,
      createdAt: dept.createdAt instanceof Date ? dept.createdAt.toISOString() : dept.createdAt,
      updatedAt: dept.updatedAt instanceof Date ? dept.updatedAt.toISOString() : dept.updatedAt
    }));

    const teamMembersForYaml = teamMembers.map((member: TeamMember) => ({
      ...member,
      createdAt: member.createdAt instanceof Date ? member.createdAt.toISOString() : member.createdAt,
      updatedAt: member.updatedAt instanceof Date ? member.updatedAt.toISOString() : member.updatedAt
    }));

    logger.info('生成 YAML 内容...');
    // 生成 YAML 内容 - 使用单文档格式
    const yamlData = {
      departments: departmentsForYaml,
      teamMembers: teamMembersForYaml
    };
    
    // 生成完整的 YAML 内容，包含文件头注释
    const yamlContent = `# 组织架构配置文件
# 用途：存储公司组织架构、部门和人员信息
# 说明：此文件由系统自动管理，也可手动编辑
# AI 友好格式：清晰的注释、结构化数据、有意义的字段名

${yaml.dump(yamlData, { indent: 2 })}`;

    logger.info('准备写入文件:', CONFIG_FILE_PATH);
    // 确保目录存在
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      logger.info('创建目录:', dir);
      fs.mkdirSync(dir, { recursive: true });
    }

    // 写入文件
    fs.writeFileSync(CONFIG_FILE_PATH, yamlContent, 'utf-8');
    logger.info('文件写入成功');

    // 同步系统用户
    await syncSystemUsers(teamMembers);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('保存配置文件失败:', error);
    logger.error('错误详情:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: '保存配置文件失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
