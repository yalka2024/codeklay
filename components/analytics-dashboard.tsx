'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Activity, 
  Database, 
  Zap, 
  TrendingUp, 
  Clock, 
  BarChart3,
  RefreshCw,
  Eye,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UsageStats {
  totalUsers: number;
  activeUsers: number;
  totalAPIKeys: number;
  totalPlugins: number;
  apiRequests: number;
  aiInteractions: number;
  vectorSearches: number;
  upgradePromptsShown?: number;
  upgradeClicks?: number;
  upgradesCompleted?: number;
  topPlugin?: string;
  teamsCreated?: number;
  invitesSent?: number;
  activeCollaborations?: number;
  dau?: number;
  wau?: number;
  mau?: number;
  avgSessionDuration?: number;
  retentionRate?: number;
}

interface AnalyticsEvent {
  userId?: string;
  event: string;
  category: 'user' | 'api' | 'plugin' | 'system';
  metadata?: Record<string, any>;
  timestamp: Date;
}

interface EventStats {
  date: string;
  events: number;
}

interface AnalyticsData {
  usageStats: UsageStats;
  recentEvents?: AnalyticsEvent[];
  eventStats?: EventStats[];
  isAdmin: boolean;
}

export function AnalyticsDashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/analytics/stats');
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch analytics data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getEventIcon = (event: string) => {
    if (event.includes('api')) return <Database className="h-4 w-4" />;
    if (event.includes('ai')) return <Zap className="h-4 w-4" />;
    if (event.includes('user')) return <Users className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getEventColor = (category: string) => {
    switch (category) {
      case 'api': return 'bg-blue-100 text-blue-800';
      case 'ai': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Platform usage and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {data.isAdmin && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Admin View
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.usageStats.totalUsers)}</div>
            <p className="text-xs text-muted-foreground">
              {data.usageStats.activeUsers} active this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.usageStats.apiRequests)}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.usageStats.aiInteractions)}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vector Searches</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.usageStats.vectorSearches)}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New: Feature Usage & Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Funnel</CardTitle>
            <CardDescription>Track upgrade prompt engagement and conversions</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder: Replace with real data */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Upgrade Prompts Shown</span>
                <span className="font-bold">{data.usageStats.upgradePromptsShown ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Upgrade Clicks</span>
                <span className="font-bold">{data.usageStats.upgradeClicks ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Upgrades Completed</span>
                <span className="font-bold">{data.usageStats.upgradesCompleted ?? '—'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Plugin Usage</CardTitle>
            <CardDescription>Most popular plugins and usage stats</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder: Replace with real data */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Enabled Plugins</span>
                <span className="font-bold">{data.usageStats.totalPlugins}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Most Popular Plugin</span>
                <span className="font-bold">{data.usageStats.topPlugin ?? '—'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Collaboration</CardTitle>
            <CardDescription>Team and collaboration feature usage</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder: Replace with real data */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Teams Created</span>
                <span className="font-bold">{data.usageStats.teamsCreated ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Invites Sent</span>
                <span className="font-bold">{data.usageStats.invitesSent ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Collaborations</span>
                <span className="font-bold">{data.usageStats.activeCollaborations ?? '—'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>Engagement and retention metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder: Replace with real data */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>DAU</span>
                <span className="font-bold">{data.usageStats.dau ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>WAU</span>
                <span className="font-bold">{data.usageStats.wau ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>MAU</span>
                <span className="font-bold">{data.usageStats.mau ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg. Session Duration</span>
                <span className="font-bold">{data.usageStats.avgSessionDuration ?? '—'} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Retention Rate</span>
                <span className="font-bold">{data.usageStats.retentionRate ?? '—'}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics (Admin Only) */}
      {data.isAdmin && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Metrics</CardTitle>
                  <CardDescription>Platform infrastructure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Keys</span>
                    <Badge variant="outline">{data.usageStats.totalAPIKeys}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Plugins</span>
                    <Badge variant="outline">{data.usageStats.totalPlugins}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Trends</CardTitle>
                  <CardDescription>Event activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.eventStats && data.eventStats.length > 0 ? (
                    <div className="space-y-2">
                      {data.eventStats.slice(-5).map((stat, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{stat.date}</span>
                          <span className="text-sm font-medium">{stat.events} events</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No event data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Latest platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                {data.recentEvents && data.recentEvents.length > 0 ? (
                  <div className="space-y-3">
                    {data.recentEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getEventIcon(event.event)}
                          <div>
                            <p className="text-sm font-medium">{event.event}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getEventColor(event.category)}>
                          {event.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent events</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* User View */}
      {!data.isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Platform Overview
            </CardTitle>
            <CardDescription>
              Basic platform statistics available to all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatNumber(data.usageStats.totalUsers)}</div>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatNumber(data.usageStats.apiRequests)}</div>
                <p className="text-sm text-muted-foreground">API Requests (7d)</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatNumber(data.usageStats.aiInteractions)}</div>
                <p className="text-sm text-muted-foreground">AI Interactions (7d)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 