// React Hooks for API Integration
// Provides easy-to-use hooks for data fetching and state management

import { useState, useEffect, useCallback } from 'react';
import { apiClient, User, LearningPath, CodeSnippet, BlockchainPod, AnalyticsData } from '../lib/api';

// Generic API hook for data fetching
export function useApi<T>(
  fetchFunction: () => Promise<{ data?: T; error?: string; status: number }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setData(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Authentication hooks
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await apiClient.getProfile();
        if (result.data) {
          setUser(result.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await apiClient.login({ email, password });
    if (result.data) {
      apiClient.setToken(result.data.token);
      setUser(result.data.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    githubUsername?: string;
  }) => {
    const result = await apiClient.register(userData);
    if (result.data) {
      apiClient.setToken(result.data.token);
      setUser(result.data.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  const updateProfile = async (profileData: {
    name?: string;
    skillLevel?: string;
    preferredLanguages?: string[];
  }) => {
    const result = await apiClient.updateProfile(profileData);
    if (result.data) {
      setUser(result.data);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };
}

// Dashboard hooks
export function useDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalContributions: 0,
    learningProgress: 0,
    marketplaceEarnings: 0,
    podMemberships: 0,
    totalRewards: '0',
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, you'd have a dedicated dashboard endpoint
        // For now, we'll simulate the data
        setStats({
          totalProjects: 12,
          totalContributions: 47,
          learningProgress: 68,
          marketplaceEarnings: 1250.50,
          podMemberships: 3,
          totalRewards: '2,450 POD',
        });

        setRecentActivity([
          { type: 'learning', message: 'Completed "Advanced TypeScript" tutorial', timestamp: new Date() },
          { type: 'marketplace', message: 'Earned $45 from marketplace sales', timestamp: new Date() },
          { type: 'pods', message: 'Received 150 POD tokens for contribution', timestamp: new Date() },
          { type: 'collaboration', message: 'Joined "React Masters" coding pod', timestamp: new Date() },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { stats, recentActivity, loading };
}

// Learning Engine hooks
export function useLearningPaths() {
  return useApi(() => apiClient.getLearningPaths());
}

export function useSkillAssessment() {
  return useApi(() => apiClient.getSkillAssessment());
}

export function useLearningActions() {
  const createLearningPath = async (pathData: {
    title: string;
    description: string;
    difficulty: string;
  }) => {
    return await apiClient.createLearningPath(pathData);
  };

  const updateProgress = async (moduleId: string, progress: number) => {
    return await apiClient.updateProgress(moduleId, progress);
  };

  const getAIFeedback = async (code: string, context: string) => {
    return await apiClient.getAIFeedback(code, context);
  };

  return {
    createLearningPath,
    updateProgress,
    getAIFeedback,
  };
}

// Marketplace hooks
export function useMarketplaceSnippets(filters?: {
  search?: string;
  language?: string;
  category?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  return useApi(() => apiClient.getSnippets(filters), [JSON.stringify(filters)]);
}

export function useSnippetDetails(id: string) {
  return useApi(() => apiClient.getSnippetById(id), [id]);
}

export function useMarketplaceStats() {
  return useApi(() => apiClient.getMarketplaceStats());
}

export function useMarketplaceActions() {
  const createSnippet = async (snippetData: {
    title: string;
    description: string;
    code: string;
    language: string;
    category: string;
    tags: string[];
    price: number;
    isPublic: boolean;
  }) => {
    return await apiClient.createSnippet(snippetData);
  };

  const createPaymentIntent = async (snippetId: string) => {
    return await apiClient.createPaymentIntent(snippetId);
  };

  return {
    createSnippet,
    createPaymentIntent,
  };
}

// Blockchain Pods hooks
export function usePods() {
  return useApi(() => apiClient.getPods());
}

export function usePodDetails(id: string) {
  return useApi(() => apiClient.getPodDetails(id), [id]);
}

export function usePodActions() {
  const createPod = async (podData: { name: string; description: string }) => {
    return await apiClient.createPod(podData);
  };

  const joinPod = async (podId: string) => {
    return await apiClient.joinPod(podId);
  };

  const leavePod = async (podId: string) => {
    return await apiClient.leavePod(podId);
  };

  const createProposal = async (podId: string, proposalData: {
    title: string;
    description: string;
    proposalType: string;
    targetAddress?: string;
    amount?: string;
    codeSnippetId?: string;
  }) => {
    return await apiClient.createProposal(podId, proposalData);
  };

  const voteOnProposal = async (proposalId: string, vote: 'FOR' | 'AGAINST', reason?: string) => {
    return await apiClient.voteOnProposal(proposalId, vote, reason);
  };

  const claimReward = async (podId: string, rewardData: {
    reason: string;
    amount: string;
    codeSnippetId?: string;
  }) => {
    return await apiClient.claimReward(podId, rewardData);
  };

  return {
    createPod,
    joinPod,
    leavePod,
    createProposal,
    voteOnProposal,
    claimReward,
  };
}

export function usePodProposals(podId: string) {
  return useApi(() => apiClient.getProposals(podId), [podId]);
}

export function usePodRewards(podId: string, userId?: string) {
  return useApi(() => apiClient.getRewards(podId, userId), [podId, userId]);
}

export function useUserBalance(podId: string) {
  return useApi(() => apiClient.getUserBalance(podId), [podId]);
}

export function usePodLeaderboard(podId: string) {
  return useApi(() => apiClient.getPodLeaderboard(podId), [podId]);
}

// Analytics hooks
export function useAnalytics(timeRange: string = '7d') {
  return useApi(() => apiClient.getAnalytics(timeRange), [timeRange]);
}

export function useUserMetrics(timeRange: string = '7d') {
  return useApi(() => apiClient.getUserMetrics(timeRange), [timeRange]);
}

export function useProjectMetrics(timeRange: string = '7d') {
  return useApi(() => apiClient.getProjectMetrics(timeRange), [timeRange]);
}

export function useAIMetrics(timeRange: string = '7d') {
  return useApi(() => apiClient.getAIMetrics(timeRange), [timeRange]);
}

export function usePerformanceMetrics(timeRange: string = '7d') {
  return useApi(() => apiClient.getPerformanceMetrics(timeRange), [timeRange]);
}

export function useEngagementMetrics(timeRange: string = '7d') {
  return useApi(() => apiClient.getEngagementMetrics(timeRange), [timeRange]);
}

export function useRevenueMetrics(timeRange: string = '7d') {
  return useApi(() => apiClient.getRevenueMetrics(timeRange), [timeRange]);
}

export function useLearningMetrics(timeRange: string = '7d') {
  return useApi(() => apiClient.getLearningMetrics(timeRange), [timeRange]);
}

export function useCollaborationMetrics(timeRange: string = '7d') {
  return useApi(() => apiClient.getCollaborationMetrics(timeRange), [timeRange]);
}

// Collaboration hooks
export function useProjects() {
  return useApi(() => apiClient.getProjects());
}

// Health check hook
export function useHealthCheck() {
  return useApi(() => apiClient.healthCheck());
}

// Custom hook for optimistic updates
export function useOptimisticUpdate<T>(
  initialData: T,
  updateFunction: (data: T) => Promise<{ data?: T; error?: string }>
) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (newData: T) => {
    setLoading(true);
    setError(null);
    
    // Optimistically update the UI
    setData(newData);
    
    try {
      const result = await updateFunction(newData);
      if (result.error) {
        setError(result.error);
        // Revert to original data on error
        setData(initialData);
      } else if (result.data) {
        setData(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      // Revert to original data on error
      setData(initialData);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, update };
}

// Hook for real-time data updates
export function useRealtimeData<T>(
  initialData: T,
  subscribeFunction: (callback: (data: T) => void) => () => void
) {
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    const unsubscribe = subscribeFunction(setData);
    return unsubscribe;
  }, [subscribeFunction]);

  return data;
}

// Hook for pagination
export function usePagination<T>(
  fetchFunction: (page: number, limit: number) => Promise<{ data?: T[]; total?: number; error?: string }>,
  limit: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction(pageNum, limit);
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        if (pageNum === 1) {
          setData(result.data);
        } else {
          setData(prev => [...prev, ...result.data!]);
        }
        setTotal(result.total || 0);
        setHasMore(result.data.length === limit);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, limit]);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPage(nextPage);
    }
  };

  const refresh = () => {
    setPage(1);
    setData([]);
    setHasMore(true);
    fetchPage(1);
  };

  return {
    data,
    loading,
    error,
    page,
    total,
    hasMore,
    loadMore,
    refresh,
  };
} 