import express from 'express';
import { PrismaClient } from '@prisma/client';
import { LearningEngine } from '@codepal/ai-utils';

const router = express.Router();
const prisma = new PrismaClient();
const learningEngine = new LearningEngine();

// Authentication middleware (reuse from main app)
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Get all code snippets with filtering
router.get('/snippets', async (req, res) => {
  try {
    const { 
      language, 
      category, 
      minTrustScore, 
      maxPrice, 
      search,
      page = 1,
      limit = 20
    } = req.query;

    const where: any = {
      isPublic: true,
      isVerified: true
    };

    if (language) where.language = language;
    if (category) where.category = category;
    if (minTrustScore) where.trustScore = { gte: parseInt(minTrustScore as string) };
    if (maxPrice) where.price = { lte: parseFloat(maxPrice as string) };
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { tags: { hasSome: [search as string] } }
      ];
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
          }
        },
        purchases: {
          select: { userId: true }
        }
      },
      orderBy: [
        { trustScore: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string)
    });

    const total = await prisma.codeSnippet.count({ where });

    res.json({
      snippets,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching snippets:', error);
    res.status(500).json({ error: 'Failed to fetch snippets' });
  }
});

// Get snippet by ID
router.get('/snippets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const snippet = await prisma.codeSnippet.findUnique({
      where: { id },
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
          orderBy: { createdAt: 'desc' }
        },
        purchases: {
          select: { userId: true }
        }
      }
    });

    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    res.json(snippet);
  } catch (error) {
    console.error('Error fetching snippet:', error);
    res.status(500).json({ error: 'Failed to fetch snippet' });
  }
});

// Create new snippet
router.post('/snippets', authenticateToken, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      code, 
      language, 
      category, 
      tags, 
      price = 0,
      isPublic = true 
    } = req.body;

    // Validate required fields
    if (!title || !code || !language) {
      return res.status(400).json({ error: 'Title, code, and language are required' });
    }

    // AI verification and trust score calculation
    const aiAnalysis = await learningEngine.analyzeCodeQuality(code, language);
    const trustScore = calculateTrustScore(aiAnalysis);

    // Create snippet
    const snippet = await prisma.codeSnippet.create({
      data: {
        title,
        description,
        code,
        language,
        category,
        tags: tags || [],
        price: parseFloat(price),
        isPublic,
        isVerified: trustScore >= 70, // Auto-verify if high trust score
        trustScore,
        authorId: req.user.id,
        aiAnalysis: JSON.stringify(aiAnalysis)
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            githubUsername: true
          }
        }
      }
    });

    res.status(201).json(snippet);
  } catch (error) {
    console.error('Error creating snippet:', error);
    res.status(500).json({ error: 'Failed to create snippet' });
  }
});

// Update snippet
router.put('/snippets/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check ownership
    const snippet = await prisma.codeSnippet.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    if (snippet.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this snippet' });
    }

    // Re-analyze if code changed
    if (updateData.code) {
      const aiAnalysis = await learningEngine.analyzeCodeQuality(updateData.code, updateData.language || 'javascript');
      const trustScore = calculateTrustScore(aiAnalysis);
      updateData.trustScore = trustScore;
      updateData.isVerified = trustScore >= 70;
      updateData.aiAnalysis = JSON.stringify(aiAnalysis);
    }

    const updatedSnippet = await prisma.codeSnippet.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            githubUsername: true
          }
        }
      }
    });

    res.json(updatedSnippet);
  } catch (error) {
    console.error('Error updating snippet:', error);
    res.status(500).json({ error: 'Failed to update snippet' });
  }
});

// Delete snippet
router.delete('/snippets/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const snippet = await prisma.codeSnippet.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    if (snippet.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this snippet' });
    }

    await prisma.codeSnippet.delete({ where: { id } });

    res.json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    console.error('Error deleting snippet:', error);
    res.status(500).json({ error: 'Failed to delete snippet' });
  }
});

// Purchase snippet
router.post('/snippets/:id/purchase', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const snippet = await prisma.codeSnippet.findUnique({
      where: { id },
      select: { 
        id: true, 
        price: true, 
        authorId: true,
        isPublic: true 
      }
    });

    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    if (!snippet.isPublic) {
      return res.status(403).json({ error: 'Snippet is not available for purchase' });
    }

    if (snippet.authorId === req.user.id) {
      return res.status(400).json({ error: 'Cannot purchase your own snippet' });
    }

    // Check if already purchased
    const existingPurchase = await prisma.snippetPurchase.findUnique({
      where: {
        userId_snippetId: {
          userId: req.user.id,
          snippetId: id
        }
      }
    });

    if (existingPurchase) {
      return res.status(400).json({ error: 'Already purchased this snippet' });
    }

    // TODO: Integrate with payment processor (Stripe, etc.)
    // For now, just create the purchase record
    const purchase = await prisma.snippetPurchase.create({
      data: {
        userId: req.user.id,
        snippetId: id,
        amount: snippet.price,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });

    // Update author's earnings
    if (snippet.price > 0) {
      await prisma.user.update({
        where: { id: snippet.authorId },
        data: {
          earnings: {
            increment: snippet.price * 0.8 // 80% to author, 20% platform fee
          }
        }
      });
    }

    res.json({ 
      message: 'Purchase successful',
      purchase 
    });
  } catch (error) {
    console.error('Error purchasing snippet:', error);
    res.status(500).json({ error: 'Failed to purchase snippet' });
  }
});

// Review snippet
router.post('/snippets/:id/review', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user has purchased the snippet
    const purchase = await prisma.snippetPurchase.findUnique({
      where: {
        userId_snippetId: {
          userId: req.user.id,
          snippetId: id
        }
      }
    });

    if (!purchase) {
      return res.status(403).json({ error: 'Must purchase snippet before reviewing' });
    }

    // Create or update review
    const review = await prisma.snippetReview.upsert({
      where: {
        userId_snippetId: {
          userId: req.user.id,
          snippetId: id
        }
      },
      update: {
        rating,
        comment,
        updatedAt: new Date()
      },
      create: {
        userId: req.user.id,
        snippetId: id,
        rating,
        comment
      }
    });

    // Update snippet's average rating
    const reviews = await prisma.snippetReview.findMany({
      where: { snippetId: id },
      select: { rating: true }
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.codeSnippet.update({
      where: { id },
      data: { averageRating: avgRating }
    });

    res.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Get user's snippets
router.get('/user/snippets', authenticateToken, async (req, res) => {
  try {
    const snippets = await prisma.codeSnippet.findMany({
      where: { authorId: req.user.id },
      include: {
        purchases: {
          select: { userId: true }
        },
        reviews: {
          select: { rating: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(snippets);
  } catch (error) {
    console.error('Error fetching user snippets:', error);
    res.status(500).json({ error: 'Failed to fetch user snippets' });
  }
});

// Get user's purchases
router.get('/user/purchases', authenticateToken, async (req, res) => {
  try {
    const purchases = await prisma.snippetPurchase.findMany({
      where: { userId: req.user.id },
      include: {
        snippet: {
          include: {
            author: {
              select: { id: true, name: true, githubUsername: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(purchases);
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    res.status(500).json({ error: 'Failed to fetch user purchases' });
  }
});

// Helper function to calculate trust score
function calculateTrustScore(aiAnalysis: any): number {
  let score = 50; // Base score

  // Add points for good practices
  if (aiAnalysis.hasComments) score += 10;
  if (aiAnalysis.hasErrorHandling) score += 15;
  if (aiAnalysis.isReadable) score += 10;
  if (aiAnalysis.followsBestPractices) score += 15;
  if (aiAnalysis.hasTests) score += 10;

  // Subtract points for issues
  if (aiAnalysis.hasSecurityIssues) score -= 20;
  if (aiAnalysis.hasPerformanceIssues) score -= 15;
  if (aiAnalysis.hasCodeSmells) score -= 10;

  return Math.max(0, Math.min(100, score));
}

export default router; 