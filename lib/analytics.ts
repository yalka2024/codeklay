import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AnalyticsEvent {
  userId?: string;
  event: string;
  category: 'user' | 'api' | 'plugin' | 'system' | 'ai';
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export interface UsageStats {
  totalUsers: number;
  activeUsers: number;
  totalAPIKeys: number;
  totalPlugins: number;
  apiRequests: number;
  aiInteractions: number;
  vectorSearches: number;
}

export interface UserActivity {
  userId: string;
  lastActive: Date;
  totalSessions: number;
  apiRequests: number;
  aiInteractions: number;
}

// Placeholder for notification logic (email, Slack, webhook, etc.)
function sendAnalyticsNotification(message: string) {
  // TODO: Integrate with email, Slack, or webhook
  console.log('[Analytics Notification]', message);
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private isInitialized = false;
  // In-memory error event timestamps for spike detection
  private errorEventTimestamps: number[] = [];

  async initialize() {
    if (this.isInitialized) return;
    
    // Create analytics tables if they don't exist
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id TEXT PRIMARY KEY,
          userId TEXT,
          event TEXT NOT NULL,
          category TEXT NOT NULL,
          metadata TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS user_activity (
          userId TEXT PRIMARY KEY,
          lastActive DATETIME DEFAULT CURRENT_TIMESTAMP,
          totalSessions INTEGER DEFAULT 0,
          apiRequests INTEGER DEFAULT 0,
          aiInteractions INTEGER DEFAULT 0
        )
      `;
    } catch (error) {
      console.warn('Analytics tables may already exist:', error);
    }
    
    this.isInitialized = true;
  }

  async trackEvent(event: AnalyticsEvent) {
    await this.initialize();
    
    const eventData = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: event.userId,
      event: event.event,
      category: event.category,
      metadata: event.metadata ? JSON.stringify(event.metadata) : null,
      timestamp: event.timestamp || new Date(),
    };

    try {
      await prisma.$executeRaw`
        INSERT INTO analytics_events (id, userId, event, category, metadata, timestamp)
        VALUES (${eventData.id}, ${eventData.userId}, ${eventData.event}, ${eventData.category}, ${eventData.metadata}, ${eventData.timestamp})
      `;
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }

    // Automated notification logic
    if (event.event === 'error' || event.event?.includes('error')) {
      const now = Date.now();
      this.errorEventTimestamps.push(now);
      // Remove events older than 10 minutes
      this.errorEventTimestamps = this.errorEventTimestamps.filter(ts => now - ts < 10 * 60 * 1000);
      if (this.errorEventTimestamps.length >= 5) {
        sendAnalyticsNotification('Error spike detected: 5+ errors in 10 minutes');
        // Reset to avoid duplicate alerts
        this.errorEventTimestamps = [];
      }
    }
    if (event.event === 'upgrade_completed') {
      sendAnalyticsNotification(`Upgrade completed by user ${event.userId || 'unknown'}`);
    }

    // Also update user activity
    if (event.userId) {
      await this.updateUserActivity(event.userId, event.event);
    }
  }

  private async updateUserActivity(userId: string, event: string) {
    try {
      const now = new Date();
      
      if (event.includes('api_request')) {
        await prisma.$executeRaw`
          INSERT INTO user_activity (userId, lastActive, apiRequests)
          VALUES (${userId}, ${now}, 1)
          ON CONFLICT(userId) DO UPDATE SET
            lastActive = ${now},
            apiRequests = user_activity.apiRequests + 1
        `;
      } else if (event.includes('ai_interaction')) {
        await prisma.$executeRaw`
          INSERT INTO user_activity (userId, lastActive, aiInteractions)
          VALUES (${userId}, ${now}, 1)
          ON CONFLICT(userId) DO UPDATE SET
            lastActive = ${now},
            aiInteractions = user_activity.aiInteractions + 1
        `;
      } else {
        await prisma.$executeRaw`
          INSERT INTO user_activity (userId, lastActive)
          VALUES (${userId}, ${now})
          ON CONFLICT(userId) DO UPDATE SET
            lastActive = ${now}
        `;
      }
    } catch (error) {
      console.error('Failed to update user activity:', error);
    }
  }

  async getUsageStats(): Promise<UsageStats> {
    await this.initialize();
    
    try {
      const [users, apiKeys, events] = await Promise.all([
        prisma.user.count(),
        prisma.aPIKey.count(),
        prisma.$queryRaw<{ event: string; count: number }[]>`
          SELECT event, COUNT(*) as count
          FROM analytics_events
          WHERE timestamp >= datetime('now', '-7 days')
          GROUP BY event
        `,
      ]);

      const apiRequests = events.find(e => e.event === 'api_request')?.count || 0;
      const aiInteractions = events.find(e => e.event === 'ai_interaction')?.count || 0;
      const vectorSearches = events.find(e => e.event === 'vector_search')?.count || 0;

      // Get active users (users active in last 7 days)
      const activeUsersResult = await prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(DISTINCT userId) as count
        FROM user_activity
        WHERE lastActive >= datetime('now', '-7 days')
      `;
      const activeUsers = activeUsersResult[0]?.count || 0;

      return {
        totalUsers: users,
        activeUsers,
        totalAPIKeys: apiKeys,
        totalPlugins: 8, // Mock for now
        apiRequests,
        aiInteractions,
        vectorSearches,
      };
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalAPIKeys: 0,
        totalPlugins: 0,
        apiRequests: 0,
        aiInteractions: 0,
        vectorSearches: 0,
      };
    }
  }

  async getUserActivity(userId: string): Promise<UserActivity | null> {
    await this.initialize();
    
    try {
      const result = await prisma.$queryRaw<UserActivity[]>`
        SELECT * FROM user_activity WHERE userId = ${userId}
      `;
      
      return result[0] || null;
    } catch (error) {
      console.error('Failed to get user activity:', error);
      return null;
    }
  }

  async getRecentEvents(limit = 50): Promise<AnalyticsEvent[]> {
    await this.initialize();
    
    try {
      const events = await prisma.$queryRaw<Array<{
        id: string;
        userId: string | null;
        event: string;
        category: string;
        metadata: string | null;
        timestamp: Date;
      }>>`
        SELECT * FROM analytics_events
        ORDER BY timestamp DESC
        LIMIT ${limit}
      `;
      
      return events.map(event => ({
        userId: event.userId || undefined,
        event: event.event,
        category: event.category as 'user' | 'api' | 'plugin' | 'system',
        metadata: event.metadata ? JSON.parse(event.metadata) : undefined,
        timestamp: event.timestamp,
      }));
    } catch (error) {
      console.error('Failed to get recent events:', error);
      return [];
    }
  }

  async getEventStats(days = 7): Promise<{ date: string; events: number }[]> {
    await this.initialize();
    
    try {
      const stats = await prisma.$queryRaw<{ date: string; events: number }[]>`
        SELECT 
          DATE(timestamp) as date,
          COUNT(*) as events
        FROM analytics_events
        WHERE timestamp >= datetime('now', '-${days} days')
        GROUP BY DATE(timestamp)
        ORDER BY date
      `;
      
      return stats;
    } catch (error) {
      console.error('Failed to get event stats:', error);
      return [];
    }
  }
}

export const analyticsService = new AnalyticsService();

// Convenience functions
export const trackEvent = (event: AnalyticsEvent) => analyticsService.trackEvent(event);
export const getUsageStats = () => analyticsService.getUsageStats();
export const getUserActivity = (userId: string) => analyticsService.getUserActivity(userId);
export const getRecentEvents = (limit?: number) => analyticsService.getRecentEvents(limit);
export const getEventStats = (days?: number) => analyticsService.getEventStats(days); 