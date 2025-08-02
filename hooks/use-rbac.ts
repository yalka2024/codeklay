import { useMemo } from 'react';

// Example user hook (replace with your actual user context/hook)
function useCurrentUser() {
  // Replace with real user context/provider
  // Example user: { id, email, role }
  if (typeof window === 'undefined') return null;
  return (window as any).CURRENT_USER || null;
}

const RolePermissions: Record<string, string[]> = {
  user: ['view_dashboard'],
  admin: ['view_dashboard', 'manage_users', 'manage_integrations', 'manage_settings', 'view_audit_logs', 'manage_plugins'],
  owner: ['view_dashboard', 'manage_users', 'manage_integrations', 'manage_settings', 'view_audit_logs', 'manage_plugins'],
  auditor: ['view_dashboard', 'view_audit_logs'],
};

export function useRBAC() {
  const user = useCurrentUser();

  const hasRole = (role: string) => {
    return user && user.role === role;
  };

  const hasPermission = (permission: string) => {
    if (!user || !user.role) return false;
    return RolePermissions[user.role]?.includes(permission) || false;
  };

  return useMemo(() => ({ user, hasRole, hasPermission }), [user]);
} 