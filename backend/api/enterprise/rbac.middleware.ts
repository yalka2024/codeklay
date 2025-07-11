import { RBACService } from './rbac.service';
import { Permission } from './rbac.model';

export function requirePermission(permission: Permission) {
  return (req: any, res: any, next: any) => {
    const user = req.user || req.session?.user;
    if (!RBACService.hasPermission(user, permission)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
} 