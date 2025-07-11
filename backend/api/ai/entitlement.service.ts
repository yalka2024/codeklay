// EntitlementService: checks AI quota, plugin count, and collab feature access for user tiers
// In-memory store for demo; replace with DB in production
const aiUsage: Record<string, { month: string; count: number }> = {};
const pluginCounts: Record<string, number> = {};

export class EntitlementService {
  static getTier(user: { subscription_tier?: string }) {
    return user.subscription_tier || 'free';
  }

  static getAIQuota(tier: string) {
    if (tier === 'free') return 50;
    if (tier === 'individual') return 1000;
    if (tier === 'team') return 10000;
    return 0;
  }

  static checkAIQuota(userId: string, tier: string) {
    const month = new Date().toISOString().slice(0, 7);
    if (!aiUsage[userId] || aiUsage[userId].month !== month) {
      aiUsage[userId] = { month, count: 0 };
    }
    const quota = this.getAIQuota(tier);
    return aiUsage[userId].count < quota;
  }

  static incrementAIUsage(userId: string) {
    const month = new Date().toISOString().slice(0, 7);
    if (!aiUsage[userId] || aiUsage[userId].month !== month) {
      aiUsage[userId] = { month, count: 0 };
    }
    aiUsage[userId].count++;
  }

  static getPluginLimit(tier: string) {
    if (tier === 'free') return 2;
    if (tier === 'individual') return 10;
    if (tier === 'team') return 50;
    return 0;
  }

  static checkPluginLimit(userId: string, tier: string) {
    const count = pluginCounts[userId] || 0;
    return count < this.getPluginLimit(tier);
  }

  static setPluginCount(userId: string, count: number) {
    pluginCounts[userId] = count;
  }

  static canAccessAdvancedCollab(tier: string) {
    return tier !== 'free';
  }
} 