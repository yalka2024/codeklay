// Jira API Route (Stub)
import { JiraConfigService } from './jira-config.service';
import { JiraService } from './jira.service';
import { RBACService } from './rbac.service';
import { Permission } from './rbac.model';

// Assume orgId is provided in req.body or req.query for demo

export async function POST(req: any, res: any) {
  const { action, orgId, apiKey } = req.body;
  const user = req.user || req.session?.user;
  if (!RBACService.hasPermission(user, 'manage_integrations')) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  if (action === 'connect') {
    const result = await new JiraService().connectJira(orgId, apiKey);
    return res.json(result);
  }
  if (action === 'disconnect') {
    JiraConfigService.removeConfig(orgId);
    return res.json({ success: true, message: 'Jira integration disconnected.' });
  }
  if (action === 'test') {
    const config = JiraConfigService.getConfigForOrg(orgId);
    if (!config) return res.json({ error: 'Jira not connected' });
    // TODO: Actually test Jira API
    return res.json({ success: true, message: 'Jira connection test passed (stub).' });
  }
  return res.status(400).json({ error: 'Invalid action' });
}

export async function GET(req: any, res: any) {
  const orgId = req.query.orgId;
  const user = req.user || req.session?.user;
  if (!RBACService.hasPermission(user, 'manage_integrations')) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  const config = JiraConfigService.getConfigForOrg(orgId);
  return res.json({ connected: !!config });
} 