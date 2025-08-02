// apps/api/src/marketplace/enhanced-marketplace.ts
// Enhanced Social Marketplace for CodePal

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { LearningEngine } from '@codepal/ai-utils';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const prisma = new PrismaClient();
const learningEngine = new LearningEngine();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Initialize Supabase for full-text search
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// Enhanced interfaces
export interface EnhancedCodeSnippet {
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
  authorId: string;
  author: {
    id: string;
    name: string;
    githubUsername: string;
    reputation: number;
    avatarUrl: string;
  };
  license: License;
  downloads: number;
  purchases: number;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  aiAnalysis: any;
  metadata: SnippetMetadata;
  versions: SnippetVersion[];
  dependencies: Dependency[];
  compatibility: CompatibilityInfo;
  usageExamples: UsageExample[];
  documentation: Documentation;
  support: SupportInfo;
}

export interface License {
  id: string;
  name: string;
  type: 'MIT' | 'Apache' | 'GPL' | 'BSD' | 'Custom';
  description: string;
  terms: string;
  restrictions: string[];
  attribution: boolean;
  commercial: boolean;
  modification: boolean;
  distribution: boolean;
}

export interface SnippetMetadata {
  linesOfCode: number;
  complexity: number;
  maintainability: number;
  testCoverage: number;
  securityScore: number;
  performanceScore: number;
  lastAudit: Date;
  vulnerabilities: Vulnerability[];
  dependencies: string[];
  frameworks: string[];
  platforms: string[];
  browsers: string[];
}

export interface Vulnerability {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  cve?: string;
  fixed: boolean;
  fixDate?: Date;
}

export interface SnippetVersion {
  id: string;
  version: string;
  changes: string[];
  releaseDate: Date;
  downloads: number;
  isLatest: boolean;
  breakingChanges: boolean;
}

export interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'development' | 'peer';
  description: string;
  license: string;
  vulnerabilities: number;
}

export interface CompatibilityInfo {
  nodeVersion: string;
  npmVersion: string;
  browsers: string[];
  frameworks: string[];
  platforms: string[];
  tested: boolean;
  testResults: TestResult[];
}

export interface TestResult {
  framework: string;
  version: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
}

export interface UsageExample {
  id: string;
  title: string;
  description: string;
  code: string;
  output: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Documentation {
  overview: string;
  installation: string;
  api: ApiDocumentation[];
  examples: DocumentationExample[];
  troubleshooting: TroubleshootingItem[];
  changelog: ChangelogEntry[];
}

export interface ApiDocumentation {
  method: string;
  description: string;
  parameters: Parameter[];
  returns: string;
  example: string;
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

export interface DocumentationExample {
  title: string;
  description: string;
  code: string;
  explanation: string;
}

export interface TroubleshootingItem {
  problem: string;
  solution: string;
  code?: string;
}

export interface ChangelogEntry {
  version: string;
  date: Date;
  changes: string[];
  breaking: boolean;
}

export interface SupportInfo {
  email: string;
  documentation: string;
  issues: string;
  responseTime: number; // hours
  supportLevel: 'basic' | 'premium' | 'enterprise';
}

export interface MarketplaceStats {
  totalSnippets: number;
  totalDownloads: number;
  totalRevenue: number;
  activeAuthors: number;
  averageRating: number;
  topCategories: CategoryStats[];
  topLanguages: LanguageStats[];
  recentActivity: ActivityItem[];
}

export interface CategoryStats {
  category: string;
  count: number;
  downloads: number;
  revenue: number;
  averageRating: number;
}

export interface LanguageStats {
  language: string;
  count: number;
  downloads: number;
  averageRating: number;
}

export interface ActivityItem {
  id: string;
  type: 'purchase' | 'review' | 'download' | 'update';
  snippetId: string;
  snippetTitle: string;
  userId: string;
  userName: string;
  timestamp: Date;
  details: any;
}

export interface SearchFilters {
  language?: string[];
  category?: string[];
  priceRange?: { min: number; max: number };
  rating?: number;
  trustScore?: number;
  license?: string[];
  dateRange?: { start: Date; end: Date };
  tags?: string[];
  author?: string;
  verified?: boolean;
  hasDocumentation?: boolean;
  hasTests?: boolean;
  sortBy?: 'relevance' | 'price' | 'rating' | 'downloads' | 'date' | 'trust';
  sortOrder?: 'asc' | 'desc';
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

export class EnhancedMarketplace {
  private prisma: PrismaClient;
  private learningEngine: LearningEngine;
  private stripe: Stripe;

  constructor() {
    this.prisma = new PrismaClient();
    this.learningEngine = new LearningEngine();
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Advanced search with full-text search and filters
   */
  async searchSnippets(
    query: string,
    filters: SearchFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    snippets: EnhancedCodeSnippet[];
    total: number;
    pagination: any;
    facets: any;
  }> {
    try {
      // Build search query
      const searchQuery = this.buildSearchQuery(query, filters);
      
      // Execute search with Supabase full-text search
      const { data: searchResults, error } = await supabase
        .from('code_snippets')
        .select('*')
        .textSearch('fts', searchQuery)
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      // Get snippet IDs from search results
      const snippetIds = searchResults.map((result: any) => result.id);

      // Fetch full snippet data with relations
      const snippets = await this.prisma.codeSnippet.findMany({
        where: {
          id: { in: snippetIds },
          isPublic: true,
          isVerified: true,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              githubUsername: true,
              reputation: true,
              avatarUrl: true,
            },
          },
          reviews: {
            select: { rating: true },
          },
          purchases: {
            select: { userId: true },
          },
          license: true,
          metadata: true,
          versions: true,
          dependencies: true,
          compatibility: true,
          usageExamples: true,
          documentation: true,
          support: true,
        },
        orderBy: this.getSortOrder(filters.sortBy, filters.sortOrder),
      });

      // Get total count for pagination
      const total = await this.prisma.codeSnippet.count({
        where: {
          isPublic: true,
          isVerified: true,
        },
      });

      // Get facets for filtering
      const facets = await this.getSearchFacets();

      return {
        snippets: this.enhanceSnippets(snippets),
        total,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        facets,
      };
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Search failed');
    }
  }

  /**
   * Create payment intent for snippet purchase
   */
  async createPaymentIntent(
    snippetId: string,
    userId: string,
    currency: string = 'usd'
  ): Promise<PaymentIntent> {
    try {
      const snippet = await this.prisma.codeSnippet.findUnique({
        where: { id: snippetId },
        include: { author: true },
      });

      if (!snippet) {
        throw new Error('Snippet not found');
      }

      if (snippet.authorId === userId) {
        throw new Error('Cannot purchase your own snippet');
      }

      // Check if already purchased
      const existingPurchase = await this.prisma.snippetPurchase.findUnique({
        where: {
          userId_snippetId: {
            userId,
            snippetId,
          },
        },
      });

      if (existingPurchase) {
        throw new Error('Already purchased this snippet');
      }

      // Create Stripe payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(snippet.price * 100), // Convert to cents
        currency,
        metadata: {
          snippetId,
          userId,
          snippetTitle: snippet.title,
        },
        application_fee_amount: Math.round(snippet.price * 20), // 20% platform fee
        transfer_data: {
          destination: snippet.author.stripeAccountId || '',
        },
      });

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret || '',
      };
    } catch (error) {
      console.error('Payment intent creation error:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Process successful payment and create purchase record
   */
  async processPayment(
    paymentIntentId: string,
    userId: string
  ): Promise<any> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not successful');
      }

      const { snippetId } = paymentIntent.metadata;

      // Create purchase record
      const purchase = await this.prisma.snippetPurchase.create({
        data: {
          userId,
          snippetId,
          amount: paymentIntent.amount / 100,
          transactionId: paymentIntentId,
          status: 'completed',
        },
      });

      // Update snippet statistics
      await this.prisma.codeSnippet.update({
        where: { id: snippetId },
        data: {
          purchases: { increment: 1 },
          downloads: { increment: 1 },
        },
      });

      // Update author earnings
      const snippet = await this.prisma.codeSnippet.findUnique({
        where: { id: snippetId },
        include: { author: true },
      });

      if (snippet) {
        await this.prisma.user.update({
          where: { id: snippet.authorId },
          data: {
            earnings: {
              increment: (paymentIntent.amount / 100) * 0.8, // 80% to author
            },
          },
        });
      }

      return purchase;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw new Error('Failed to process payment');
    }
  }

  /**
   * Get marketplace statistics and analytics
   */
  async getMarketplaceStats(): Promise<MarketplaceStats> {
    try {
      const [
        totalSnippets,
        totalDownloads,
        totalRevenue,
        activeAuthors,
        averageRating,
        topCategories,
        topLanguages,
        recentActivity,
      ] = await Promise.all([
        this.prisma.codeSnippet.count({
          where: { isPublic: true, isVerified: true },
        }),
        this.prisma.codeSnippet.aggregate({
          where: { isPublic: true, isVerified: true },
          _sum: { downloads: true },
        }),
        this.prisma.snippetPurchase.aggregate({
          where: { status: 'completed' },
          _sum: { amount: true },
        }),
        this.prisma.user.count({
          where: {
            codeSnippets: {
              some: {
                isPublic: true,
                isVerified: true,
              },
            },
          },
        }),
        this.prisma.codeSnippet.aggregate({
          where: { isPublic: true, isVerified: true },
          _avg: { averageRating: true },
        }),
        this.getTopCategories(),
        this.getTopLanguages(),
        this.getRecentActivity(),
      ]);

      return {
        totalSnippets,
        totalDownloads: totalDownloads._sum.downloads || 0,
        totalRevenue: totalRevenue._sum.amount || 0,
        activeAuthors,
        averageRating: averageRating._avg.averageRating || 0,
        topCategories,
        topLanguages,
        recentActivity,
      };
    } catch (error) {
      console.error('Marketplace stats error:', error);
      throw new Error('Failed to get marketplace statistics');
    }
  }

  /**
   * Create enhanced snippet with comprehensive metadata
   */
  async createEnhancedSnippet(
    snippetData: any,
    userId: string
  ): Promise<EnhancedCodeSnippet> {
    try {
      // AI analysis and verification
      const aiAnalysis = await this.learningEngine.analyzeCodeQuality(
        snippetData.code,
        snippetData.language
      );

      const trustScore = this.calculateEnhancedTrustScore(aiAnalysis);
      const metadata = await this.generateSnippetMetadata(snippetData);

      // Create snippet with enhanced data
      const snippet = await this.prisma.codeSnippet.create({
        data: {
          ...snippetData,
          authorId: userId,
          trustScore,
          isVerified: trustScore >= 70,
          aiAnalysis: JSON.stringify(aiAnalysis),
          metadata: JSON.stringify(metadata),
          license: {
            create: {
              name: snippetData.license?.name || 'MIT',
              type: snippetData.license?.type || 'MIT',
              description: snippetData.license?.description || 'MIT License',
              terms: snippetData.license?.terms || 'MIT License terms',
              restrictions: snippetData.license?.restrictions || [],
              attribution: snippetData.license?.attribution || true,
              commercial: snippetData.license?.commercial || true,
              modification: snippetData.license?.modification || true,
              distribution: snippetData.license?.distribution || true,
            },
          },
          versions: {
            create: {
              version: '1.0.0',
              changes: ['Initial release'],
              releaseDate: new Date(),
              isLatest: true,
              breakingChanges: false,
            },
          },
          dependencies: {
            create: snippetData.dependencies || [],
          },
          compatibility: {
            create: snippetData.compatibility || {
              nodeVersion: '>=14.0.0',
              npmVersion: '>=6.0.0',
              browsers: ['Chrome', 'Firefox', 'Safari', 'Edge'],
              frameworks: [],
              platforms: ['web'],
              tested: false,
              testResults: [],
            },
          },
          usageExamples: {
            create: snippetData.usageExamples || [],
          },
          documentation: {
            create: snippetData.documentation || {
              overview: snippetData.description,
              installation: 'npm install your-package',
              api: [],
              examples: [],
              troubleshooting: [],
              changelog: [],
            },
          },
          support: {
            create: snippetData.support || {
              email: '',
              documentation: '',
              issues: '',
              responseTime: 24,
              supportLevel: 'basic',
            },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              githubUsername: true,
              reputation: true,
              avatarUrl: true,
            },
          },
          license: true,
          metadata: true,
          versions: true,
          dependencies: true,
          compatibility: true,
          usageExamples: true,
          documentation: true,
          support: true,
        },
      });

      return this.enhanceSnippet(snippet);
    } catch (error) {
      console.error('Enhanced snippet creation error:', error);
      throw new Error('Failed to create enhanced snippet');
    }
  }

  /**
   * Update snippet with new version
   */
  async updateSnippetVersion(
    snippetId: string,
    versionData: any,
    userId: string
  ): Promise<SnippetVersion> {
    try {
      const snippet = await this.prisma.codeSnippet.findUnique({
        where: { id: snippetId },
        include: { author: true },
      });

      if (!snippet || snippet.authorId !== userId) {
        throw new Error('Not authorized to update this snippet');
      }

      // Create new version
      const version = await this.prisma.snippetVersion.create({
        data: {
          snippetId,
          version: versionData.version,
          changes: versionData.changes,
          releaseDate: new Date(),
          isLatest: true,
          breakingChanges: versionData.breakingChanges || false,
        },
      });

      // Update previous version to not be latest
      await this.prisma.snippetVersion.updateMany({
        where: {
          snippetId,
          id: { not: version.id },
        },
        data: { isLatest: false },
      });

      // Update snippet with new code and metadata
      const aiAnalysis = await this.learningEngine.analyzeCodeQuality(
        versionData.code,
        snippet.language
      );

      const trustScore = this.calculateEnhancedTrustScore(aiAnalysis);
      const metadata = await this.generateSnippetMetadata({
        ...snippet,
        code: versionData.code,
      });

      await this.prisma.codeSnippet.update({
        where: { id: snippetId },
        data: {
          code: versionData.code,
          trustScore,
          aiAnalysis: JSON.stringify(aiAnalysis),
          metadata: JSON.stringify(metadata),
          updatedAt: new Date(),
        },
      });

      return version;
    } catch (error) {
      console.error('Version update error:', error);
      throw new Error('Failed to update snippet version');
    }
  }

  /**
   * Get snippet analytics and insights
   */
  async getSnippetAnalytics(snippetId: string): Promise<any> {
    try {
      const [
        snippet,
        purchases,
        reviews,
        downloads,
        revenue,
        userEngagement,
      ] = await Promise.all([
        this.prisma.codeSnippet.findUnique({
          where: { id: snippetId },
          include: {
            purchases: true,
            reviews: true,
            author: true,
          },
        }),
        this.prisma.snippetPurchase.findMany({
          where: { snippetId },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.snippetReview.findMany({
          where: { snippetId },
          include: { reviewer: true },
          orderBy: { createdAt: 'desc' },
        }),
        this.getDownloadHistory(snippetId),
        this.getRevenueHistory(snippetId),
        this.getUserEngagement(snippetId),
      ]);

      if (!snippet) {
        throw new Error('Snippet not found');
      }

      return {
        snippet,
        analytics: {
          totalPurchases: purchases.length,
          totalRevenue: revenue.total,
          averageRating: snippet.averageRating,
          totalReviews: reviews.length,
          totalDownloads: downloads.total,
          monthlyDownloads: downloads.monthly,
          monthlyRevenue: revenue.monthly,
          userEngagement,
          purchaseTrends: this.analyzePurchaseTrends(purchases),
          reviewTrends: this.analyzeReviewTrends(reviews),
          downloadTrends: this.analyzeDownloadTrends(downloads.history),
        },
      };
    } catch (error) {
      console.error('Analytics error:', error);
      throw new Error('Failed to get snippet analytics');
    }
  }

  // Private helper methods

  private buildSearchQuery(query: string, filters: SearchFilters): string {
    let searchQuery = query;

    if (filters.language?.length) {
      searchQuery += ` language:(${filters.language.join(' OR ')})`;
    }

    if (filters.category?.length) {
      searchQuery += ` category:(${filters.category.join(' OR ')})`;
    }

    if (filters.tags?.length) {
      searchQuery += ` tags:(${filters.tags.join(' OR ')})`;
    }

    if (filters.author) {
      searchQuery += ` author:${filters.author}`;
    }

    return searchQuery;
  }

  private getSortOrder(
    sortBy?: string,
    sortOrder?: string
  ): any {
    const order = sortOrder === 'desc' ? 'desc' : 'asc';

    switch (sortBy) {
      case 'price':
        return { price: order };
      case 'rating':
        return { averageRating: order };
      case 'downloads':
        return { downloads: order };
      case 'date':
        return { createdAt: order };
      case 'trust':
        return { trustScore: order };
      default:
        return { trustScore: 'desc' };
    }
  }

  private async getSearchFacets(): Promise<any> {
    const [languages, categories, licenses] = await Promise.all([
      this.prisma.codeSnippet.groupBy({
        by: ['language'],
        where: { isPublic: true, isVerified: true },
        _count: { language: true },
      }),
      this.prisma.codeSnippet.groupBy({
        by: ['category'],
        where: { isPublic: true, isVerified: true },
        _count: { category: true },
      }),
      this.prisma.license.groupBy({
        by: ['type'],
        _count: { type: true },
      }),
    ]);

    return {
      languages: languages.map(l => ({ name: l.language, count: l._count.language })),
      categories: categories.map(c => ({ name: c.category, count: c._count.category })),
      licenses: licenses.map(l => ({ name: l.type, count: l._count.type })),
    };
  }

  private enhanceSnippets(snippets: any[]): EnhancedCodeSnippet[] {
    return snippets.map(snippet => this.enhanceSnippet(snippet));
  }

  private enhanceSnippet(snippet: any): EnhancedCodeSnippet {
    return {
      ...snippet,
      metadata: JSON.parse(snippet.metadata || '{}'),
      aiAnalysis: JSON.parse(snippet.aiAnalysis || '{}'),
      downloads: snippet.downloads || 0,
      purchases: snippet.purchases?.length || 0,
      reviewCount: snippet.reviews?.length || 0,
    };
  }

  private calculateEnhancedTrustScore(aiAnalysis: any): number {
    let score = 50; // Base score

    // Add points for good practices
    if (aiAnalysis.hasComments) score += 10;
    if (aiAnalysis.hasErrorHandling) score += 15;
    if (aiAnalysis.isReadable) score += 10;
    if (aiAnalysis.followsBestPractices) score += 15;
    if (aiAnalysis.hasTests) score += 10;
    if (aiAnalysis.hasDocumentation) score += 10;
    if (aiAnalysis.hasExamples) score += 5;

    // Subtract points for issues
    if (aiAnalysis.hasSecurityIssues) score -= 20;
    if (aiAnalysis.hasPerformanceIssues) score -= 15;
    if (aiAnalysis.hasCodeSmells) score -= 10;
    if (aiAnalysis.hasVulnerabilities) score -= 25;

    return Math.max(0, Math.min(100, score));
  }

  private async generateSnippetMetadata(snippetData: any): Promise<SnippetMetadata> {
    // Analyze code for metadata
    const linesOfCode = snippetData.code.split('\n').length;
    const complexity = this.calculateComplexity(snippetData.code);
    const maintainability = this.calculateMaintainability(snippetData.code);
    const securityScore = this.calculateSecurityScore(snippetData.code);
    const performanceScore = this.calculatePerformanceScore(snippetData.code);

    return {
      linesOfCode,
      complexity,
      maintainability,
      testCoverage: 0, // Would be calculated from actual tests
      securityScore,
      performanceScore,
      lastAudit: new Date(),
      vulnerabilities: [],
      dependencies: this.extractDependencies(snippetData.code),
      frameworks: this.extractFrameworks(snippetData.code),
      platforms: ['web'], // Default
      browsers: ['Chrome', 'Firefox', 'Safari', 'Edge'],
    };
  }

  private calculateComplexity(code: string): number {
    // Implement cyclomatic complexity calculation
    const complexity = code.split('if').length + code.split('for').length + code.split('while').length;
    return Math.min(10, Math.max(1, Math.floor(complexity / 10)));
  }

  private calculateMaintainability(code: string): number {
    // Implement maintainability index calculation
    const lines = code.split('\n').length;
    const functions = code.split('function').length;
    const comments = code.split('//').length + code.split('/*').length;
    
    let score = 100;
    if (lines > 100) score -= 20;
    if (functions > 10) score -= 15;
    if (comments < lines * 0.1) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateSecurityScore(code: string): number {
    // Implement security score calculation
    let score = 100;
    
    const securityIssues = [
      'eval(', 'innerHTML', 'document.write', 'setTimeout(', 'setInterval(',
      'localStorage', 'sessionStorage', 'XMLHttpRequest'
    ];
    
    for (const issue of securityIssues) {
      if (code.includes(issue)) score -= 10;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private calculatePerformanceScore(code: string): number {
    // Implement performance score calculation
    let score = 100;
    
    const performanceIssues = [
      'for (let i = 0; i < array.length; i++)',
      'innerHTML +=',
      'document.getElementById(',
      'querySelector('
    ];
    
    for (const issue of performanceIssues) {
      if (code.includes(issue)) score -= 5;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private extractDependencies(code: string): string[] {
    // Extract dependencies from code
    const dependencies: string[] = [];
    
    // Look for import statements
    const importMatches = code.match(/import.*from ['"]([^'"]+)['"]/g);
    if (importMatches) {
      importMatches.forEach(match => {
        const dep = match.match(/from ['"]([^'"]+)['"]/)?.[1];
        if (dep) dependencies.push(dep);
      });
    }
    
    // Look for require statements
    const requireMatches = code.match(/require\(['"]([^'"]+)['"]\)/g);
    if (requireMatches) {
      requireMatches.forEach(match => {
        const dep = match.match(/require\(['"]([^'"]+)['"]\)/)?.[1];
        if (dep) dependencies.push(dep);
      });
    }
    
    return [...new Set(dependencies)];
  }

  private extractFrameworks(code: string): string[] {
    // Extract framework usage from code
    const frameworks: string[] = [];
    
    const frameworkPatterns = {
      'React': /react|jsx|useState|useEffect/gi,
      'Vue': /vue|v-if|v-for|@click/gi,
      'Angular': /angular|ng-|@Component/gi,
      'Express': /express|app\.get|app\.post/gi,
      'Next.js': /next|getServerSideProps|getStaticProps/gi,
    };
    
    for (const [framework, pattern] of Object.entries(frameworkPatterns)) {
      if (pattern.test(code)) {
        frameworks.push(framework);
      }
    }
    
    return frameworks;
  }

  private async getTopCategories(): Promise<CategoryStats[]> {
    const categories = await this.prisma.codeSnippet.groupBy({
      by: ['category'],
      where: { isPublic: true, isVerified: true },
      _count: { category: true },
      _sum: { downloads: true },
      _avg: { averageRating: true },
    });

    return categories.map(cat => ({
      category: cat.category,
      count: cat._count.category,
      downloads: cat._sum.downloads || 0,
      revenue: 0, // Would calculate from purchases
      averageRating: cat._avg.averageRating || 0,
    }));
  }

  private async getTopLanguages(): Promise<LanguageStats[]> {
    const languages = await this.prisma.codeSnippet.groupBy({
      by: ['language'],
      where: { isPublic: true, isVerified: true },
      _count: { language: true },
      _sum: { downloads: true },
      _avg: { averageRating: true },
    });

    return languages.map(lang => ({
      language: lang.language,
      count: lang._count.language,
      downloads: lang._sum.downloads || 0,
      averageRating: lang._avg.averageRating || 0,
    }));
  }

  private async getRecentActivity(): Promise<ActivityItem[]> {
    const activities = await this.prisma.snippetPurchase.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        snippet: { select: { title: true } },
        user: { select: { name: true } },
      },
    });

    return activities.map(activity => ({
      id: activity.id,
      type: 'purchase',
      snippetId: activity.snippetId,
      snippetTitle: activity.snippet.title,
      userId: activity.userId,
      userName: activity.user.name,
      timestamp: activity.createdAt,
      details: { amount: activity.amount },
    }));
  }

  private async getDownloadHistory(snippetId: string): Promise<any> {
    // This would track actual download history
    // For now, return mock data
    return {
      total: 150,
      monthly: [10, 15, 20, 25, 30, 35, 15],
      history: [
        { date: '2024-01-01', downloads: 10 },
        { date: '2024-01-02', downloads: 15 },
        { date: '2024-01-03', downloads: 20 },
      ],
    };
  }

  private async getRevenueHistory(snippetId: string): Promise<any> {
    const purchases = await this.prisma.snippetPurchase.findMany({
      where: { snippetId, status: 'completed' },
      orderBy: { createdAt: 'asc' },
    });

    const total = purchases.reduce((sum, p) => sum + p.amount, 0);
    const monthly = this.calculateMonthlyRevenue(purchases);

    return { total, monthly };
  }

  private async getUserEngagement(snippetId: string): Promise<any> {
    // Calculate user engagement metrics
    const [purchases, reviews, downloads] = await Promise.all([
      this.prisma.snippetPurchase.count({ where: { snippetId } }),
      this.prisma.snippetReview.count({ where: { snippetId } }),
      this.prisma.codeSnippet.findUnique({
        where: { id: snippetId },
        select: { downloads: true },
      }),
    ]);

    return {
      purchaseRate: downloads?.downloads ? (purchases / downloads.downloads) * 100 : 0,
      reviewRate: purchases ? (reviews / purchases) * 100 : 0,
      averageRating: 4.5, // Would calculate from actual reviews
    };
  }

  private calculateMonthlyRevenue(purchases: any[]): number[] {
    // Calculate monthly revenue for the last 6 months
    const monthly = new Array(6).fill(0);
    const now = new Date();
    
    purchases.forEach(purchase => {
      const purchaseDate = new Date(purchase.createdAt);
      const monthsDiff = (now.getFullYear() - purchaseDate.getFullYear()) * 12 + 
                        (now.getMonth() - purchaseDate.getMonth());
      
      if (monthsDiff < 6) {
        monthly[5 - monthsDiff] += purchase.amount;
      }
    });
    
    return monthly;
  }

  private analyzePurchaseTrends(purchases: any[]): any {
    // Analyze purchase trends over time
    const dailyPurchases = new Map();
    
    purchases.forEach(purchase => {
      const date = purchase.createdAt.toISOString().split('T')[0];
      dailyPurchases.set(date, (dailyPurchases.get(date) || 0) + 1);
    });
    
    return {
      totalPurchases: purchases.length,
      averageDaily: purchases.length / Math.max(1, dailyPurchases.size),
      trend: 'increasing', // Would calculate actual trend
    };
  }

  private analyzeReviewTrends(reviews: any[]): any {
    // Analyze review trends
    const ratings = reviews.map(r => r.rating);
    const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    
    return {
      totalReviews: reviews.length,
      averageRating,
      ratingDistribution: {
        5: ratings.filter(r => r === 5).length,
        4: ratings.filter(r => r === 4).length,
        3: ratings.filter(r => r === 3).length,
        2: ratings.filter(r => r === 2).length,
        1: ratings.filter(r => r === 1).length,
      },
    };
  }

  private analyzeDownloadTrends(downloadHistory: any[]): any {
    // Analyze download trends
    const downloads = downloadHistory.map(d => d.downloads);
    const totalDownloads = downloads.reduce((a, b) => a + b, 0);
    const averageDaily = totalDownloads / downloads.length;
    
    return {
      totalDownloads,
      averageDaily,
      trend: 'stable', // Would calculate actual trend
      peakDay: downloadHistory.reduce((max, d) => 
        d.downloads > max.downloads ? d : max
      ),
    };
  }
}

export default router; 