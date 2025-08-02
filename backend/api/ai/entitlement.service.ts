// EntitlementService: checks AI quota, plugin count, and collab feature access for user tiers
// In-memory store for demo; replace with DB in production
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
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

  static async checkAIQuotaDB(userId: string, tier: string) {
    const month = new Date().toISOString().slice(0, 7);
    const quota = this.getAIQuota(tier);
    // Find credits for this user and month
    const credit = await prisma.credit.findFirst({
      where: {
        userId,
        type: 'ai',
        createdAt: {
          gte: new Date(`${month}-01T00:00:00.000Z`),
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    const used = credit ? credit.amount : 0;
    return used < quota;
  }

  static async incrementAIUsageDB(userId: string) {
    const month = new Date().toISOString().slice(0, 7);
    // Find or create credit record for this month
    let credit = await prisma.credit.findFirst({
      where: {
        userId,
        type: 'ai',
        createdAt: {
          gte: new Date(`${month}-01T00:00:00.000Z`),
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (credit) {
      await prisma.credit.update({ where: { id: credit.id }, data: { amount: credit.amount + 1 } });
    } else {
      await prisma.credit.create({ data: { userId, amount: 1, type: 'ai' } });
    }
  }

  static async resetMonthlyCredits(userId: string, tier: string) {
    // Optionally implement monthly reset/top-up logic here
    // For now, credits are tracked by month in DB
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