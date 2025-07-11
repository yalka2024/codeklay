export type UserRole = 'user' | 'admin' | 'owner' | 'auditor';
export type Permission =
  | 'view_dashboard'
  | 'manage_users'
  | 'manage_integrations'
  | 'manage_settings'
  | 'view_audit_logs'
  | 'manage_plugins';

export const RolePermissions: Record<UserRole, Permission[]> = {
  user: ['view_dashboard'],
  admin: ['view_dashboard', 'manage_users', 'manage_integrations', 'manage_settings', 'view_audit_logs', 'manage_plugins'],
  owner: ['view_dashboard', 'manage_users', 'manage_integrations', 'manage_settings', 'view_audit_logs', 'manage_plugins'],
  auditor: ['view_dashboard', 'view_audit_logs'],
}; 