// API Client for CodePal Frontend
// Handles all backend communication and data fetching

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('codepal_token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Request failed',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // Authentication
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('codepal_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('codepal_token');
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    name: string;
    githubUsername?: string;
  }) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request<any>('/api/user/profile');
  }

  async updateProfile(profileData: {
    name?: string;
    skillLevel?: string;
    preferredLanguages?: string[];
  }) {
    return this.request<any>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // AI Learning Engine
  async getLearningPaths() {
    return this.request<any[]>('/api/ai/learning/paths');
  }

  async getSkillAssessment() {
    return this.request<any>('/api/ai/learning/assessment');
  }

  async createLearningPath(pathData: {
    title: string;
    description: string;
    difficulty: string;
  }) {
    return this.request<any>('/api/ai/learning/paths', {
      method: 'POST',
      body: JSON.stringify(pathData),
    });
  }

  async updateProgress(moduleId: string, progress: number) {
    return this.request<any>(`/api/ai/learning/progress/${moduleId}`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    });
  }

  async getAIFeedback(code: string, context: string) {
    return this.request<any>('/api/ai/learning/feedback', {
      method: 'POST',
      body: JSON.stringify({ code, context }),
    });
  }

  // Marketplace
  async getSnippets(filters?: {
    search?: string;
    language?: string;
    category?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    return this.request<any[]>(`/api/marketplace/enhanced/snippets?${params}`);
  }

  async getSnippetById(id: string) {
    return this.request<any>(`/api/marketplace/enhanced/snippets/${id}`);
  }

  async createSnippet(snippetData: {
    title: string;
    description: string;
    code: string;
    language: string;
    category: string;
    tags: string[];
    price: number;
    isPublic: boolean;
  }) {
    return this.request<any>('/api/marketplace/enhanced/snippets', {
      method: 'POST',
      body: JSON.stringify(snippetData),
    });
  }

  async createPaymentIntent(snippetId: string) {
    return this.request<any>('/api/marketplace/enhanced/payment-intent', {
      method: 'POST',
      body: JSON.stringify({ snippetId }),
    });
  }

  async getMarketplaceStats() {
    return this.request<any>('/api/marketplace/enhanced/stats');
  }

  // Blockchain Pods
  async getPods() {
    return this.request<any[]>('/api/blockchain/pods');
  }

  async createPod(podData: { name: string; description: string }) {
    return this.request<any>('/api/blockchain/pods', {
      method: 'POST',
      body: JSON.stringify(podData),
    });
  }

  async joinPod(podId: string) {
    return this.request<any>(`/api/blockchain/pods/${podId}/join`, {
      method: 'POST',
    });
  }

  async leavePod(podId: string) {
    return this.request<any>(`/api/blockchain/pods/${podId}/leave`, {
      method: 'POST',
    });
  }

  async getPodDetails(podId: string) {
    return this.request<any>(`/api/blockchain/pods/${podId}`);
  }

  async createProposal(podId: string, proposalData: {
    title: string;
    description: string;
    proposalType: string;
    targetAddress?: string;
    amount?: string;
    codeSnippetId?: string;
  }) {
    return this.request<any>(`/api/blockchain/pods/${podId}/proposals`, {
      method: 'POST',
      body: JSON.stringify(proposalData),
    });
  }

  async voteOnProposal(proposalId: string, vote: 'FOR' | 'AGAINST', reason?: string) {
    return this.request<any>(`/api/blockchain/proposals/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote, reason }),
    });
  }

  async getProposals(podId: string) {
    return this.request<any[]>(`/api/blockchain/pods/${podId}/proposals`);
  }

  async claimReward(podId: string, rewardData: {
    reason: string;
    amount: string;
    codeSnippetId?: string;
  }) {
    return this.request<any>(`/api/blockchain/pods/${podId}/rewards/claim`, {
      method: 'POST',
      body: JSON.stringify(rewardData),
    });
  }

  async getRewards(podId: string, userId?: string) {
    const params = userId ? `?userId=${userId}` : '';
    return this.request<any[]>(`/api/blockchain/pods/${podId}/rewards${params}`);
  }

  async getUserBalance(podId: string) {
    return this.request<any>(`/api/blockchain/pods/${podId}/balance`);
  }

  async getPodLeaderboard(podId: string) {
    return this.request<any[]>(`/api/blockchain/pods/${podId}/leaderboard`);
  }

  // Analytics
  async getAnalytics(timeRange: string = '7d') {
    return this.request<any>(`/api/analytics/dashboard?timeRange=${timeRange}`);
  }

  async getUserMetrics(timeRange: string = '7d') {
    return this.request<any>(`/api/analytics/users?timeRange=${timeRange}`);
  }

  async getProjectMetrics(timeRange: string = '7d') {
    return this.request<any>(`/api/analytics/projects?timeRange=${timeRange}`);
  }

  async getAIMetrics(timeRange: string = '7d') {
    return this.request<any>(`/api/analytics/ai?timeRange=${timeRange}`);
  }

  async getPerformanceMetrics(timeRange: string = '7d') {
    return this.request<any>(`/api/analytics/performance?timeRange=${timeRange}`);
  }

  async getEngagementMetrics(timeRange: string = '7d') {
    return this.request<any>(`/api/analytics/engagement?timeRange=${timeRange}`);
  }

  async getRevenueMetrics(timeRange: string = '7d') {
    return this.request<any>(`/api/analytics/revenue?timeRange=${timeRange}`);
  }

  async getLearningMetrics(timeRange: string = '7d') {
    return this.request<any>(`/api/analytics/learning?timeRange=${timeRange}`);
  }

  async getCollaborationMetrics(timeRange: string = '7d') {
    return this.request<any>(`/api/analytics/collaboration?timeRange=${timeRange}`);
  }

  // Collaboration
  async getProjects() {
    return this.request<any[]>('/api/collaboration/projects');
  }

  // Health check
  async healthCheck() {
    return this.request<any>('/health');
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export interface User {
  id: string;
  name: string;
  email: string;
  githubUsername?: string;
  skillLevel: string;
  preferredLanguages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  progress: number;
  estimatedDuration: number;
  modules: LearningModule[];
}

export interface LearningModule {
  id: string;
  title: string;
  type: string;
  difficulty: number;
  estimatedTime: number;
  completed: boolean;
}

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  price: number;
  isPublic: boolean;
  isVerified: boolean;
  trustScore: number;
  averageRating: number;
  downloadCount: number;
  author: {
    id: string;
    name: string;
    isVerified: boolean;
  };
  createdAt: string;
}

export interface BlockchainPod {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  contractAddress: string;
  tokenSymbol: string;
  totalSupply: string;
  treasuryBalance: string;
  proposalCount: number;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  proposals: Proposal[];
  rewards: TokenReward[];
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposerId: string;
  proposalType: string;
  status: string;
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  endTime: string;
  votes: Vote[];
}

export interface Vote {
  id: string;
  voterId: string;
  vote: string;
  votingPower: string;
  reason?: string;
}

export interface TokenReward {
  id: string;
  recipientId: string;
  amount: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface AnalyticsData {
  users: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userGrowth: number;
  };
  projects: {
    totalProjects: number;
    activeProjects: number;
    averageContributors: number;
    projectGrowth: number;
  };
  ai: {
    totalRequests: number;
    averageResponseTime: number;
    successRate: number;
    popularFeatures: string[];
  };
  performance: {
    averageLoadTime: number;
    uptime: number;
    errorRate: number;
    peakConcurrentUsers: number;
  };
  engagement: {
    averageSessionDuration: number;
    pagesPerSession: number;
    bounceRate: number;
    returningUsers: number;
  };
  revenue: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  learning: {
    totalTutorials: number;
    averageCompletionRate: number;
    popularTopics: string[];
    skillImprovements: number;
  };
  collaboration: {
    totalCollaborations: number;
    averageTeamSize: number;
    successfulProjects: number;
    collaborationGrowth: number;
  };
} 