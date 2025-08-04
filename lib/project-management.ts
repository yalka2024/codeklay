import { prisma } from "@/lib/prisma";

export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export class ProjectManagement {
  static async createProject(userId: string, name: string, description?: string): Promise<Project | null> {
    try {
      const project = await prisma.project.create({
        data: {
          name,
          description,
          userId,
          status: 'active',
        },
      });
      
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  static async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const projects = await prisma.project.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      });
      
      return projects;
    } catch (error) {
      console.error('Error fetching user projects:', error);
      return [];
    }
  }

  static async getProject(projectId: string, userId: string): Promise<Project | null> {
    try {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId,
        },
      });
      
      return project;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  static async updateProject(projectId: string, userId: string, updates: {
    name?: string;
    description?: string;
    status?: 'active' | 'archived' | 'completed';
  }): Promise<Project | null> {
    try {
      const project = await prisma.project.updateMany({
        where: {
          id: projectId,
          userId,
        },
        data: updates,
      });
      
      if (project.count === 0) {
        return null;
      }
      
      return this.getProject(projectId, userId);
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  static async deleteProject(projectId: string, userId: string): Promise<boolean> {
    try {
      const result = await prisma.project.deleteMany({
        where: {
          id: projectId,
          userId,
        },
      });
      
      return result.count > 0;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }
} 