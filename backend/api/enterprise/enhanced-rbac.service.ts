import { PrismaClient } from '@prisma/client';
import { Permission, UserRole, RolePermissions } from './rbac.model';

export interface RoleHierarchy {
  [role: string]: string[];
}

export interface ResourcePermission {
  resource: string;
  actions: string[];
  conditions?: any;
}

export interface DynamicRole {
  id: string;
  name: string;
  permissions: Permission[];
  resourcePermissions: ResourcePermission[];
  inheritsFrom?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class EnhancedRBACService {
  private static prisma = new PrismaClient();
  private static roleHierarchy: RoleHierarchy = {
    owner: ['admin', 'user', 'auditor'],
    admin: ['user'],
    auditor: [],
    user: []
  };

  static hasPermission(user: any, permission: Permission, resource?: string): boolean {
    if (!user || !user.role) return false;
    
    const userPermissions = this.getUserPermissions(user, resource);
    return userPermissions.includes(permission);
  }

  static getUserPermissions(user: any, resource?: string): Permission[] {
    if (!user || !user.role) return [];
    
    let permissions: Permission[] = [];
    
    const basePermissions = RolePermissions[user.role as UserRole] || [];
    permissions = [...basePermissions];
    
    const inheritedRoles = this.getInheritedRoles(user.role);
    inheritedRoles.forEach(role => {
      const rolePermissions = RolePermissions[role as UserRole] || [];
      permissions = [...permissions, ...rolePermissions];
    });
    
    if (resource && user.resourcePermissions) {
      const resourcePerms = user.resourcePermissions[resource] || [];
      permissions = [...permissions, ...resourcePerms];
    }
    
    return [...new Set(permissions)];
  }

  static getInheritedRoles(role: string): string[] {
    return this.roleHierarchy[role] || [];
  }

  static canAccessResource(user: any, resource: string, action: string): boolean {
    if (!user || !user.role) return false;
    
    const resourcePermission = `${action}_${resource}` as Permission;
    if (this.hasPermission(user, resourcePermission)) {
      return true;
    }
    
    const generalPermission = `manage_${resource}` as Permission;
    if (this.hasPermission(user, generalPermission)) {
      return true;
    }
    
    if (user.resourcePermissions && user.resourcePermissions[resource]) {
      const resourcePerms = user.resourcePermissions[resource];
      return resourcePerms.some((perm: ResourcePermission) => 
        perm.actions.includes(action) && this.evaluateConditions(perm.conditions, user, resource)
      );
    }
    
    return false;
  }

  static async createDynamicRole(roleData: Omit<DynamicRole, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamicRole> {
    try {
      const role = await this.prisma.role.create({
        data: {
          name: roleData.name,
          permissions: JSON.stringify(roleData.permissions),
          resourcePermissions: JSON.stringify(roleData.resourcePermissions),
          inheritsFrom: JSON.stringify(roleData.inheritsFrom || []),
          isActive: roleData.isActive
        }
      });

      return {
        id: role.id,
        name: role.name,
        permissions: JSON.parse(role.permissions),
        resourcePermissions: JSON.parse(role.resourcePermissions),
        inheritsFrom: JSON.parse(role.inheritsFrom || '[]'),
        isActive: role.isActive,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      };
    } catch (error) {
      console.error('Failed to create dynamic role:', error);
      throw new Error('Failed to create role');
    }
  }

  static async updateDynamicRole(roleId: string, updates: Partial<DynamicRole>): Promise<DynamicRole> {
    try {
      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.permissions) updateData.permissions = JSON.stringify(updates.permissions);
      if (updates.resourcePermissions) updateData.resourcePermissions = JSON.stringify(updates.resourcePermissions);
      if (updates.inheritsFrom) updateData.inheritsFrom = JSON.stringify(updates.inheritsFrom);
      if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

      const role = await this.prisma.role.update({
        where: { id: roleId },
        data: updateData
      });

      return {
        id: role.id,
        name: role.name,
        permissions: JSON.parse(role.permissions),
        resourcePermissions: JSON.parse(role.resourcePermissions),
        inheritsFrom: JSON.parse(role.inheritsFrom || '[]'),
        isActive: role.isActive,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      };
    } catch (error) {
      console.error('Failed to update dynamic role:', error);
      throw new Error('Failed to update role');
    }
  }

  static async deleteDynamicRole(roleId: string): Promise<void> {
    try {
      await this.prisma.role.delete({
        where: { id: roleId }
      });
    } catch (error) {
      console.error('Failed to delete dynamic role:', error);
      throw new Error('Failed to delete role');
    }
  }

  static async getDynamicRoles(): Promise<DynamicRole[]> {
    try {
      const roles = await this.prisma.role.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      return roles.map(role => ({
        id: role.id,
        name: role.name,
        permissions: JSON.parse(role.permissions),
        resourcePermissions: JSON.parse(role.resourcePermissions),
        inheritsFrom: JSON.parse(role.inheritsFrom || '[]'),
        isActive: role.isActive,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      }));
    } catch (error) {
      console.error('Failed to get dynamic roles:', error);
      return [];
    }
  }

  static async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    try {
      await this.prisma.userRole.create({
        data: {
          userId,
          roleId
        }
      });
    } catch (error) {
      console.error('Failed to assign role to user:', error);
      throw new Error('Failed to assign role');
    }
  }

  static async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    try {
      await this.prisma.userRole.deleteMany({
        where: {
          userId,
          roleId
        }
      });
    } catch (error) {
      console.error('Failed to remove role from user:', error);
      throw new Error('Failed to remove role');
    }
  }

  static async getUserRoles(userId: string): Promise<DynamicRole[]> {
    try {
      const userRoles = await this.prisma.userRole.findMany({
        where: { userId },
        include: {
          role: true
        }
      });

      return userRoles.map(ur => ({
        id: ur.role.id,
        name: ur.role.name,
        permissions: JSON.parse(ur.role.permissions),
        resourcePermissions: JSON.parse(ur.role.resourcePermissions),
        inheritsFrom: JSON.parse(ur.role.inheritsFrom || '[]'),
        isActive: ur.role.isActive,
        createdAt: ur.role.createdAt,
        updatedAt: ur.role.updatedAt
      }));
    } catch (error) {
      console.error('Failed to get user roles:', error);
      return [];
    }
  }

  private static evaluateConditions(conditions: any, user: any, resource: string): boolean {
    if (!conditions) return true;
    
    if (conditions.owner && user.id !== conditions.owner) {
      return false;
    }
    
    if (conditions.department && user.department !== conditions.department) {
      return false;
    }
    
    if (conditions.timeRestriction) {
      const now = new Date();
      const startTime = new Date(conditions.timeRestriction.start);
      const endTime = new Date(conditions.timeRestriction.end);
      if (now < startTime || now > endTime) {
        return false;
      }
    }
    
    return true;
  }

  static setRoleHierarchy(hierarchy: RoleHierarchy) {
    this.roleHierarchy = hierarchy;
  }

  static getRoleHierarchy(): RoleHierarchy {
    return this.roleHierarchy;
  }

  static async cacheUserPermissions(userId: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          userRoles: {
            include: {
              role: true
            }
          }
        }
      });

      if (!user) return;

      const allPermissions = new Set<Permission>();
      
      user.userRoles.forEach(ur => {
        const rolePermissions = JSON.parse(ur.role.permissions);
        rolePermissions.forEach((perm: Permission) => allPermissions.add(perm));
        
        const inheritedRoles = JSON.parse(ur.role.inheritsFrom || '[]');
        inheritedRoles.forEach((inheritedRole: string) => {
          const inheritedPermissions = RolePermissions[inheritedRole as UserRole] || [];
          inheritedPermissions.forEach(perm => allPermissions.add(perm));
        });
      });

      await this.prisma.userPermissionCache.upsert({
        where: { userId },
        update: {
          permissions: JSON.stringify(Array.from(allPermissions)),
          updatedAt: new Date()
        },
        create: {
          userId,
          permissions: JSON.stringify(Array.from(allPermissions))
        }
      });
    } catch (error) {
      console.error('Failed to cache user permissions:', error);
    }
  }
}
