// EntitlementService: checks AI quota, plugin count, and collab feature access for user tiers
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const aiUsage: Record<string, { month: string; count: number }> = {};
const pluginCounts: Record<string, number> = {};

export class EntitlementService {
  static async getTier(userId: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true, subscriptionStatus: true }
      });
      
      if (!user || user.subscriptionStatus !== 'active') {
        return 'free';
      }
      
      return user.subscriptionTier || 'free';
    } catch (error) {
      console.error('Error fetching user tier:', error);
      return 'free';
    }
  }

  static getAIQuota(tier: string) {
    if (tier === 'free') return 50;
    if (tier === 'individual') return 1000;
    if (tier === 'team') return 10000;
    return 0;
  }

  static async checkAIQuota(userId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    const tier = await this.getTier(userId);
    const month = new Date().toISOString().slice(0, 7);
    if (!aiUsage[userId] || aiUsage[userId].month !== month) {
      aiUsage[userId] = { month, count: 0 };
    }
    const quota = this.getAIQuota(tier);
    const remaining = Math.max(0, quota - aiUsage[userId].count);
    return { 
      allowed: aiUsage[userId].count < quota, 
      remaining, 
      limit: quota 
    };
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

  static async checkPluginLimit(userId: string): Promise<{ allowed: boolean; current: number; limit: number }> {
    const tier = await this.getTier(userId);
    const count = pluginCounts[userId] || 0;
    const limit = this.getPluginLimit(tier);
    return { 
      allowed: count < limit, 
      current: count, 
      limit 
    };
  }

  static setPluginCount(userId: string, count: number) {
    pluginCounts[userId] = count;
  }

  static async canAccessAdvancedCollab(userId: string): Promise<boolean> {
    const tier = await this.getTier(userId);
    return tier !== 'free';
  }
}
