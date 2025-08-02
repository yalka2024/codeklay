import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { PrismaService } from '../database/prisma.service'
// import type { UserService } from "../users/user.service"
// import type { GitService } from "../git/git.service"
// import type { AIService } from "../ai/ai.service"

export interface CreateProjectDto {
  name: string
  description?: string
  template?: string
  gitRepository?: {
    url: string
    branch?: string
    accessToken?: string
  }
  settings?: {
    language: string
    framework: string
    aiEnabled: boolean
    codeReviewEnabled: boolean
    securityScanEnabled: boolean
  }
}

export interface UpdateProjectDto {
  name?: string
  description?: string
  settings?: any
  status?: "ACTIVE" | "ARCHIVED" | "DELETED"
}

export interface ProjectResponse {
  id: string
  name: string
  description: string
  status: string
  createdAt: Date
  updatedAt: Date
  owner: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  team: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    joinedAt: Date
  }>
  repository?: {
    url: string
    branch: string
    lastSync: Date
  }
  settings: any
  stats: {
    filesCount: number
    linesOfCode: number
    lastActivity: Date
    aiSuggestions: number
    codeReviews: number
  }
}

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    // private userService: UserService,
    // private gitService: GitService,
    // private aiService: AIService,
  ) {}

  async createProject(userId: string, dto: CreateProjectDto): Promise<ProjectResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found')
    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description || '',
        ownerId: userId,
        status: 'ACTIVE',
        settings: dto.settings || {},
        template: dto.template,
      },
      include: { owner: true },
    })
    // Add owner as team member
    await this.prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: userId,
        role: 'ADMIN',
        permissions: ['READ', 'WRITE', 'DELETE', 'MANAGE_TEAM', 'MANAGE_SETTINGS'],
      },
    })
    return this.formatProjectResponse(project.id)
  }

  async getProject(userId: string, projectId: string): Promise<ProjectResponse> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { owner: true, members: { include: { user: true } } },
    })
    if (!project) throw new NotFoundException('Project not found')
    // Check access (implement checkProjectAccess as needed)
    // if (!(await this.checkProjectAccess(userId, projectId))) throw new ForbiddenException('Access denied')
    return this.formatProjectResponse(projectId)
  }

  async updateProject(userId: string, projectId: string, dto: UpdateProjectDto): Promise<ProjectResponse> {
    // Check permissions (implement checkProjectPermission as needed)
    // if (!(await this.checkProjectPermission(userId, projectId, 'MANAGE_SETTINGS'))) throw new ForbiddenException('Insufficient permissions')
    const project = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: dto.name,
        description: dto.description,
        settings: dto.settings,
        status: dto.status,
        updatedAt: new Date(),
      },
    })
    return this.formatProjectResponse(projectId)
  }

  async deleteProject(userId: string, projectId: string): Promise<void> {
    // Check permissions (implement checkProjectPermission as needed)
    // if (!(await this.checkProjectPermission(userId, projectId, 'DELETE'))) throw new ForbiddenException('Insufficient permissions')
    await this.prisma.project.delete({ where: { id: projectId } })
  }

  async getUserProjects(userId: string, organizationId?: string): Promise<ProjectResponse[]> {
    const memberships = await this.prisma.projectMember.findMany({
      where: { userId },
      include: { project: true },
    })
    return Promise.all(memberships.map(m => this.formatProjectResponse(m.projectId)))
  }

  async addTeamMember(userId: string, projectId: string, memberEmail: string, role: "VIEWER" | "DEVELOPER" | "ADMIN"): Promise<void> {
    const member = await this.prisma.user.findUnique({ where: { email: memberEmail } })
    if (!member) throw new NotFoundException('User not found')
    const existing = await this.prisma.projectMember.findUnique({ where: { projectId_userId: { projectId, userId: member.id } } })
    if (existing) throw new ForbiddenException('User is already a team member')
    await this.prisma.projectMember.create({
      data: {
        projectId,
        userId: member.id,
        role,
        permissions: role === 'ADMIN' ? ['READ', 'WRITE', 'DELETE', 'MANAGE_TEAM', 'MANAGE_SETTINGS'] : ['READ', 'WRITE'],
      },
    })
  }

  async removeTeamMember(userId: string, projectId: string, memberId: string): Promise<void> {
    // Only allow if user has permission (implement checkProjectPermission as needed)
    await this.prisma.projectMember.delete({ where: { projectId_userId: { projectId, userId: memberId } } })
  }

  async getProjectFiles(userId: string, projectId: string, path?: string): Promise<any[]> {
    // Check access (implement checkProjectAccess as needed)
    // if (!(await this.checkProjectAccess(userId, projectId))) throw new ForbiddenException('Access denied')
    
    const where: any = { projectId }
    if (path) {
      where.path = { startsWith: path }
    }
    
    const files = await this.prisma.projectFile.findMany({
      where,
      include: { user: true },
      orderBy: { path: 'asc' },
    })
    
    return files.map((file: any) => ({
      id: file.id,
      path: file.path,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      modifiedBy: {
        id: file.user.id,
        name: file.user.name,
        email: file.user.email,
      },
    }))
  }

  async getFileContent(userId: string, projectId: string, filePath: string): Promise<string> {
    // Check access (implement checkProjectAccess as needed)
    // if (!(await this.checkProjectAccess(userId, projectId))) throw new ForbiddenException('Access denied')
    
    const file = await this.prisma.projectFile.findUnique({
      where: { projectId_path: { projectId, path: filePath } },
    })
    
    if (!file) throw new NotFoundException('File not found')
    
    return file.content || ''
  }

  async updateFileContent(
    userId: string,
    projectId: string,
    filePath: string,
    content: string,
    commitMessage?: string,
  ): Promise<void> {
    // Check permissions (implement checkProjectPermission as needed)
    // if (!(await this.checkProjectPermission(userId, projectId, 'WRITE'))) throw new ForbiddenException('Insufficient permissions')
    
    const fileName = filePath.split('/').pop() || filePath
    const fileType = fileName.split('.').pop() || 'text'
    
    await this.prisma.projectFile.upsert({
      where: { projectId_path: { projectId, path: filePath } },
      update: {
        content,
        size: Buffer.byteLength(content, 'utf8'),
        lastModified: new Date(),
        modifiedBy: userId,
      },
      create: {
        projectId,
        path: filePath,
        name: fileName,
        content,
        size: Buffer.byteLength(content, 'utf8'),
        type: fileType,
        modifiedBy: userId,
      },
    })
  }

  async deleteFile(userId: string, projectId: string, filePath: string): Promise<void> {
    // Check permissions (implement checkProjectPermission as needed)
    // if (!(await this.checkProjectPermission(userId, projectId, 'DELETE'))) throw new ForbiddenException('Insufficient permissions')
    
    await this.prisma.projectFile.delete({
      where: { projectId_path: { projectId, path: filePath } },
    })
  }

  // Test method to verify file management
  async testFileManagement(userId: string, projectId: string): Promise<any> {
    // Create a test file
    await this.updateFileContent(userId, projectId, 'test.txt', 'Hello World!')
    
    // Get files
    const files = await this.getProjectFiles(userId, projectId)
    
    // Get file content
    const content = await this.getFileContent(userId, projectId, 'test.txt')
    
    // Delete test file
    await this.deleteFile(userId, projectId, 'test.txt')
    
    return {
      filesCreated: files.length,
      contentRetrieved: content,
      testPassed: content === 'Hello World!'
    }
  }

  private async formatProjectResponse(projectId: string): Promise<ProjectResponse> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: true,
        members: {
          include: { user: true },
        },
      },
    })

    if (!project) {
      throw new NotFoundException("Project not found")
    }

    // Get project stats
    const stats = await this.getProjectStats(projectId)

    return {
      id: project.id,
      name: project.name,
      description: project.description || '',
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      owner: {
        id: project.owner.id,
        firstName: project.owner.name?.split(' ')[0] || '',
        lastName: project.owner.name?.split(' ').slice(1).join(' ') || '',
        email: project.owner.email || '',
      },
      team: project.members.map(member => ({
        id: member.user.id,
        firstName: member.user.name?.split(' ')[0] || '',
        lastName: member.user.name?.split(' ').slice(1).join(' ') || '',
        email: member.user.email || '',
        role: member.role,
        joinedAt: member.joinedAt,
      })),
      repository: undefined,
      settings: project.settings as any || {},
      stats,
    }
  }

  private async getProjectStats(projectId: string) {
    // Calculate real stats from the database
    const filesCount = await this.prisma.projectFile.count({
      where: { projectId },
    })
    
    const files = await this.prisma.projectFile.findMany({
      where: { projectId },
      select: { content: true },
    })
    
    const linesOfCode = files.reduce((total, file) => {
      return total + (file.content?.split('\n').length || 0)
    }, 0)
    
    const lastActivity = await this.prisma.projectFile.findFirst({
      where: { projectId },
      orderBy: { lastModified: 'desc' },
      select: { lastModified: true },
    })
    
    return {
      filesCount,
      linesOfCode,
      lastActivity: lastActivity?.lastModified || new Date(),
      aiSuggestions: 0, // TODO: Implement AI suggestions tracking
      codeReviews: 0,   // TODO: Implement code review tracking
    }
  }

  private async checkProjectAccess(userId: string, projectId: string): Promise<boolean> {
    // const project = await this.prisma.project.findUnique({
    //   where: { id: projectId },
    //   include: {
    //     members: true,
    //   },
    // })

    // if (!project) return false

    // return project.ownerId === userId || project.members.some((member: any) => member.userId === userId)
    return true
  }

  private async checkProjectPermission(userId: string, projectId: string, permission: string): Promise<boolean> {
    // const member = await this.prisma.projectMember.findUnique({
    //   where: {
    //     projectId_userId: {
    //       projectId,
    //       userId,
    //     },
    //   },
    // })

    // if (!member) {
    //   // Check if owner
    //   const project = await this.prisma.project.findUnique({
    //     where: { id: projectId },
    //   })
    //   return project?.ownerId === userId
    // }

    // return member.permissions.includes(permission)
    return true
  }

  private getRolePermissions(role: string): string[] {
    switch (role) {
      case "ADMIN":
        return ["READ", "WRITE", "DELETE", "MANAGE_TEAM", "MANAGE_SETTINGS"]
      case "DEVELOPER":
        return ["READ", "WRITE"]
      case "VIEWER":
        return ["READ"]
      default:
        return ["READ"]
    }
  }

  private async createInitialStructure(projectId: string, template?: string): Promise<void> {
    // Create initial project structure based on template
    // This would create default files and folders
  }
}
