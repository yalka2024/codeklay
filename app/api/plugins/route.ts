import { NextRequest, NextResponse } from 'next/server';
import { PluginSystemService } from '../../../backend/api/ai/plugin-system.service';
import { RBACService } from '../../../backend/api/enterprise/rbac.service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EntitlementService } from '../../../backend/api/ai/entitlement.service';

const pluginSystem = new PluginSystemService(); // In production, use DI

type SessionUser = {
  id?: string;
  subscription_tier?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export async function GET() {
  return NextResponse.json({ plugins: pluginSystem.list() });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser;
  if (!RBACService.hasPermission(user, 'manage_plugins')) {
    return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
  }
  try {
    const plugin = await req.json();
    // Enforce plugin limit for free users
    const userId = user?.id;
    const tier = user?.subscription_tier || 'free';
    const plugins = pluginSystem.list();
    const enabledCount = plugins.filter(p => p.enabled).length;
    if (userId && !EntitlementService.checkPluginLimit(userId, tier) && enabledCount >= EntitlementService.getPluginLimit(tier)) {
      return NextResponse.json({ error: 'Free users can only enable 2 plugins. Upgrade to unlock more.' }, { status: 402 });
    }
    pluginSystem.register(plugin);
    EntitlementService.setPluginCount(userId, enabledCount + 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser;
  if (!RBACService.hasPermission(user, 'manage_plugins')) {
    return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
  }
  try {
    const { id, enabled } = await req.json();
    const plugins = pluginSystem.list();
    const plugin = plugins.find(p => p.id === id);
    if (!plugin) return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
    // Enforce plugin limit for free users
    const userId = user?.id;
    const tier = user?.subscription_tier || 'free';
    const enabledCount = plugins.filter(p => p.enabled).length;
    if (enabled && userId && !EntitlementService.checkPluginLimit(userId, tier) && enabledCount >= EntitlementService.getPluginLimit(tier)) {
      return NextResponse.json({ error: 'Free users can only enable 2 plugins. Upgrade to unlock more.' }, { status: 402 });
    }
    plugin.enabled = enabled;
    EntitlementService.setPluginCount(userId, enabled ? enabledCount + 1 : Math.max(0, enabledCount - 1));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!RBACService.hasPermission(user, 'manage_plugins')) {
    return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
  }
  try {
    const { id } = await req.json();
    pluginSystem.unregister(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 