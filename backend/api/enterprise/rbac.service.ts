import { UserRole, Permission, RolePermissions } from './rbac.model';

export class RBACService {
  static hasRole(user: any, role: UserRole): boolean {
    return user && user.role === role;
  }

  static hasPermission(user: any, permission: Permission): boolean {
    if (!user || !user.role) return false;
    return RolePermissions[user.role]?.includes(permission) || false;
  }
} 