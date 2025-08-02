// Slack API Route (Stub)
import { SlackConfigService } from './slack-config.service';
import { SlackService } from './slack.service';
import { RBACService } from './rbac.service';
import { Permission } from './rbac.model';

// Assume orgId is provided in req.body or req.query for demo

export async function POST(req: any, res: any) {
  const { action, orgId, token } = req.body;
  const user = req.user || req.session?.user;
  if (!RBACService.hasPermission(user, 'manage_integrations')) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  if (action === 'connect') {
    const result = await new SlackService().connectSlack(orgId, token);
    return res.json(result);
  }
  if (action === 'disconnect') {
    SlackConfigService.removeConfig(orgId);
    return res.json({ success: true, message: 'Slack integration disconnected.' });
  }
  if (action === 'test') {
    const config = SlackConfigService.getConfigForOrg(orgId);
    if (!config) return res.json({ error: 'Slack not connected' });
    // TODO: Actually test Slack API
    return res.json({ success: true, message: 'Slack connection test passed (stub).' });
  }
  return res.status(400).json({ error: 'Invalid action' });
}

export async function GET(req: any, res: any) {
  const orgId = req.query.orgId;
  const user = req.user || req.session?.user;
  if (!RBACService.hasPermission(user, 'manage_integrations')) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  const config = SlackConfigService.getConfigForOrg(orgId);
  return res.json({ connected: !!config });
} 