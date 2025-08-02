import { PrismaClient } from '@prisma/client';
import { LearningEngine } from '@codepal/ai-utils';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const aiEngine = new LearningEngine();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export interface SnippetCreateRequest {
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  price: number;
  isPublic: boolean;
  license: string;
  dependencies?: string[];
  usageExamples?: string[];
  documentation?: string;
  supportInfo?: string;
}

export interface SnippetSearchRequest {
  query?: string;
  language?: string;
  category?: string;
  minTrustScore?: number;
  maxPrice?: number;
  authorId?: string;
  tags?: string[];
  sortBy?: 'relevance' | 'price' | 'trustScore' | 'rating' | 'downloads' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaymentRequest {
  snippetId: string;
  userId: string;
  amount: number;
  currency?: string;
}

export interface ReviewRequest {
  snippetId: string;
  userId: string;
  rating: number;
  comment?: string;
  pros?: string[];
  cons?: string[];
}

export class EnhancedMarketplaceService {
  /**
   * Create a new code snippet with AI verification
   */
  async createSnippet(request: SnippetCreateRequest, authorId: string): Promise<any> {
    try {
      // AI verification and analysis
      const aiAnalysis = await aiEngine.analyzeCodeQuality(request.code, request.language);
      const trustScore = this.calculateTrustScore(aiAnalysis);
      
      // Security scan
      const securityScan = await this.performSecurityScan(request.code, request.language);
      
      // Performance analysis
      const performanceAnalysis = await this.analyzePerformance(request.code, request.language);
      
      // Create snippet
      const snippet = await prisma.codeSnippet.create({
        data: {
          title: request.title,
          description: request.description,
          code: request.code,
          language: request.language,
          category: request.category,
          tags: request.tags,
          price: request.price,
          isPublic: request.isPublic,
          isVerified: trustScore >= 70,
          trustScore,
          authorId,
          license: request.license,
          dependencies: request.dependencies || [],
          usageExamples: request.usageExamples || [],
          documentation: request.documentation || '',
          supportInfo: request.supportInfo || '',
          aiAnalysis: JSON.stringify(aiAnalysis),
          securityScan: JSON.stringify(securityScan),
          performanceAnalysis: JSON.stringify(performanceAnalysis),
          downloadCount: 0,
          averageRating: 0,
          reviewCount: 0
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              githubUsername: true,
              reputation: true
            }
          }
        }
      });

      // Update marketplace stats
      await this.updateMarketplaceStats();

      return snippet;
    } catch (error) {
      console.error('Snippet creation error:', error);
      throw new Error('Failed to create snippet');
    }
  }

  /**
   * Advanced search with filtering and pagination
   */
  async searchSnippets(request: SnippetSearchRequest): Promise<any> {
    try {
      const {
        query,
        language,
        category,
        minTrustScore,
        maxPrice,
        authorId,
        tags,
        sortBy = 'relevance',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = request;

      const where: any = {
        isPublic: true,
        isVerified: true
      };

      // Text search
      if (query) {
        where.OR = [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } }
        ];
      }

      // Filters
      if (language) where.language = language;
      if (category) where.category = category;
      if (minTrustScore) where.trustScore = { gte: minTrustScore };
      if (maxPrice) where.price = { lte: maxPrice };
      if (authorId) where.authorId = authorId;
      if (tags && tags.length > 0) {
        where.tags = { hasSome: tags };
      }

      // Sorting
      const orderBy: any = {};
      switch (sortBy) {
        case 'price':
          orderBy.price = sortOrder;
          break;
        case 'trustScore':
          orderBy.trustScore = sortOrder;
          break;
        case 'rating':
          orderBy.averageRating = sortOrder;
          break;
        case 'downloads':
          orderBy.downloadCount = sortOrder;
          break;
        case 'createdAt':
          orderBy.createdAt = sortOrder;
          break;
        default:
          // Relevance sorting (combination of trust score and rating)
          orderBy.trustScore = 'desc';
          orderBy.averageRating = 'desc';
      }

      const snippets = await prisma.codeSnippet.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              githubUsername: true,
              reputation: true
            }
          },
          reviews: {
            include: {
              reviewer: {
                select: { id: true, name: true }
              }
            },
            take: 3,
            orderBy: { createdAt: 'desc' }
          },
          purchases: {
            select: { userId: true }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      });

      const total = await prisma.codeSnippet.count({ where });

      return {
        snippets,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Snippet search error:', error);
      throw new Error('Failed to search snippets');
    }
  }

  /**
   * Get snippet by ID with full details
   */
  async getSnippetById(snippetId: string, userId?: string): Promise<any> {
    try {
      const snippet = await prisma.codeSnippet.findUnique({
        where: { id: snippetId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              githubUsername: true,
              reputation: true,
              earnings: true
            }
          },
          reviews: {
            include: {
              reviewer: {
                select: { id: true, name: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          purchases: {
            select: { userId: true }
          }
        }
      });

      if (!snippet) {
        throw new Error('Snippet not found');
      }

      // Check if user has purchased this snippet
      const hasPurchased = userId ? 
        snippet.purchases.some(p => p.userId === userId) : false;

      // Increment view count
      await prisma.codeSnippet.update({
        where: { id: snippetId },
        data: { viewCount: { increment: 1 } }
      });

      return {
        ...snippet,
        hasPurchased,
        canDownload: snippet.isPublic || hasPurchased
      };
    } catch (error) {
      console.error('Get snippet error:', error);
      throw new Error('Failed to get snippet');
    }
  }

  /**
   * Create payment intent for snippet purchase
   */
  async createPaymentIntent(request: PaymentRequest): Promise<any> {
    try {
      const { snippetId, userId, amount, currency = 'usd' } = request;

      // Verify snippet exists and is available
      const snippet = await prisma.codeSnippet.findUnique({
        where: { id: snippetId },
        select: { 
          id: true, 
          price: true, 
          authorId: true,
          isPublic: true 
        }
      });

      if (!snippet) {
        throw new Error('Snippet not found');
      }

      if (!snippet.isPublic) {
        throw new Error('Snippet is not available for purchase');
      }

      if (snippet.authorId === userId) {
        throw new Error('Cannot purchase your own snippet');
      }

      // Check if already purchased
      const existingPurchase = await prisma.snippetPurchase.findUnique({
        where: {
          userId_snippetId: {
            userId,
            snippetId
          }
        }
      });

      if (existingPurchase) {
        throw new Error('Already purchased this snippet');
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          snippetId,
          userId,
          type: 'snippet_purchase'
        }
      });

      // Save payment intent to database
      await prisma.paymentIntent.create({
        data: {
          userId,
          snippetId,
          amount,
          currency,
          status: 'pending',
          clientSecret: paymentIntent.client_secret || ''
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        amount,
        currency,
        snippetId
      };
    } catch (error) {
      console.error('Payment intent creation error:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Process successful payment and grant access
   */
  async processPaymentSuccess(paymentIntentId: string): Promise<any> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not successful');
      }

      const { snippetId, userId } = paymentIntent.metadata;

      // Create purchase record
      const purchase = await prisma.snippetPurchase.create({
        data: {
          userId,
          snippetId,
          amount: paymentIntent.amount / 100, // Convert from cents
          transactionId: paymentIntentId,
          purchaseDate: new Date()
        }
      });

      // Update snippet download count
      await prisma.codeSnippet.update({
        where: { id: snippetId },
        data: { downloadCount: { increment: 1 } }
      });

      // Update author earnings
      const snippet = await prisma.codeSnippet.findUnique({
        where: { id: snippetId },
        select: { authorId: true, price: true }
      });

      if (snippet) {
        const authorEarnings = snippet.price * 0.8; // 80% to author, 20% platform fee
        await prisma.user.update({
          where: { id: snippet.authorId },
          data: { earnings: { increment: authorEarnings } }
        });
      }

      // Update payment intent status
      await prisma.paymentIntent.update({
        where: { id: paymentIntentId },
        data: { status: 'completed' }
      });

      return purchase;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw new Error('Failed to process payment');
    }
  }

  /**
   * Create review for snippet
   */
  async createReview(request: ReviewRequest): Promise<any> {
    try {
      const { snippetId, userId, rating, comment, pros, cons } = request;

      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Check if user has purchased the snippet
      const purchase = await prisma.snippetPurchase.findUnique({
        where: {
          userId_snippetId: {
            userId,
            snippetId
          }
        }
      });

      if (!purchase) {
        throw new Error('Must purchase snippet before reviewing');
      }

      // Create or update review
      const review = await prisma.snippetReview.upsert({
        where: {
          userId_snippetId: {
            userId,
            snippetId
          }
        },
        update: {
          rating,
          comment,
          pros: pros || [],
          cons: cons || [],
          updatedAt: new Date()
        },
        create: {
          userId,
          snippetId,
          rating,
          comment,
          pros: pros || [],
          cons: cons || []
        }
      });

      // Update snippet's average rating
      await this.updateSnippetRating(snippetId);

      return review;
    } catch (error) {
      console.error('Review creation error:', error);
      throw new Error('Failed to create review');
    }
  }

  /**
   * Get marketplace statistics
   */
  async getMarketplaceStats(): Promise<any> {
    try {
      const stats = await prisma.marketplaceStats.findFirst({
        orderBy: { createdAt: 'desc' }
      });

      if (!stats) {
        // Generate initial stats
        return await this.generateMarketplaceStats();
      }

      return stats;
    } catch (error) {
      console.error('Get marketplace stats error:', error);
      throw new Error('Failed to get marketplace statistics');
    }
  }

  /**
   * Get user's marketplace activity
   */
  async getUserMarketplaceActivity(userId: string): Promise<any> {
    try {
      const [snippets, purchases, reviews] = await Promise.all([
        prisma.codeSnippet.findMany({
          where: { authorId: userId },
          include: {
            purchases: { select: { userId: true } },
            reviews: { select: { rating: true } }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.snippetPurchase.findMany({
          where: { userId },
          include: {
            snippet: {
              include: {
                author: { select: { id: true, name: true, githubUsername: true } }
              }
            }
          },
          orderBy: { purchaseDate: 'desc' }
        }),
        prisma.snippetReview.findMany({
          where: { userId },
          include: {
            snippet: { select: { title: true, author: { select: { name: true } } } }
          },
          orderBy: { createdAt: 'desc' }
        })
      ]);

      return {
        snippets,
        purchases,
        reviews,
        analytics: {
          totalSnippets: snippets.length,
          totalPurchases: purchases.length,
          totalReviews: reviews.length,
          totalEarnings: snippets.reduce((sum, s) => sum + (s.earnings || 0), 0),
          averageRating: snippets.length > 0 ? 
            snippets.reduce((sum, s) => sum + (s.averageRating || 0), 0) / snippets.length : 0
        }
      };
    } catch (error) {
      console.error('Get user marketplace activity error:', error);
      throw new Error('Failed to get user marketplace activity');
    }
  }

  // Private helper methods
  private calculateTrustScore(aiAnalysis: any): number {
    let score = 50; // Base score

    // Add points for good practices
    if (aiAnalysis.quality?.score) score += aiAnalysis.quality.score * 0.3;
    if (aiAnalysis.security?.vulnerabilities?.length === 0) score += 20;
    if (aiAnalysis.performance?.score) score += aiAnalysis.performance.score * 0.2;
    if (aiAnalysis.bestPractices?.score) score += aiAnalysis.bestPractices.score * 0.3;

    // Subtract points for issues
    if (aiAnalysis.security?.vulnerabilities?.length > 0) {
      score -= aiAnalysis.security.vulnerabilities.length * 10;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private async performSecurityScan(code: string, language: string): Promise<any> {
    try {
      const analysis = await aiEngine.analyzeCodeQuality(code, language);
      return {
        vulnerabilities: analysis.security?.vulnerabilities || [],
        riskLevel: analysis.security?.riskLevel || 'low',
        recommendations: analysis.security?.recommendations || []
      };
    } catch (error) {
      console.error('Security scan error:', error);
      return { vulnerabilities: [], riskLevel: 'unknown', recommendations: [] };
    }
  }

  private async analyzePerformance(code: string, language: string): Promise<any> {
    try {
      const analysis = await aiEngine.analyzeCodeQuality(code, language);
      return {
        bottlenecks: analysis.performance?.bottlenecks || [],
        optimizations: analysis.performance?.optimizations || [],
        score: analysis.performance?.score || 50
      };
    } catch (error) {
      console.error('Performance analysis error:', error);
      return { bottlenecks: [], optimizations: [], score: 50 };
    }
  }

  private async updateSnippetRating(snippetId: string): Promise<void> {
    const reviews = await prisma.snippetReview.findMany({
      where: { snippetId },
      select: { rating: true }
    });

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      
      await prisma.codeSnippet.update({
        where: { id: snippetId },
        data: { 
          averageRating: avgRating,
          reviewCount: reviews.length
        }
      });
    }
  }

  private async updateMarketplaceStats(): Promise<void> {
    const [totalSnippets, totalDownloads, totalRevenue, activeAuthors] = await Promise.all([
      prisma.codeSnippet.count({ where: { isPublic: true } }),
      prisma.codeSnippet.aggregate({
        where: { isPublic: true },
        _sum: { downloadCount: true }
      }),
      prisma.snippetPurchase.aggregate({
        _sum: { amount: true }
      }),
      prisma.user.count({
        where: {
          codeSnippets: { some: { isPublic: true } }
        }
      })
    ]);

    await prisma.marketplaceStats.create({
      data: {
        totalSnippets,
        totalDownloads: totalDownloads._sum.downloadCount || 0,
        totalRevenue: totalRevenue._sum.amount || 0,
        activeAuthors,
        averageRating: 0, // Would need to calculate from all snippets
        topCategories: '[]', // Would need to aggregate
        topLanguages: '[]', // Would need to aggregate
        recentActivity: '[]' // Would need to track recent activity
      }
    });
  }

  private async generateMarketplaceStats(): Promise<any> {
    await this.updateMarketplaceStats();
    return await prisma.marketplaceStats.findFirst({
      orderBy: { createdAt: 'desc' }
    });
  }
}

export default EnhancedMarketplaceService; 