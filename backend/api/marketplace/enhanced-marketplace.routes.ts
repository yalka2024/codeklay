import express from 'express';
import { PrismaClient } from '@prisma/client';
import EnhancedMarketplaceService, {
  SnippetCreateRequest,
  SnippetSearchRequest,
  PaymentRequest,
  ReviewRequest
} from './enhanced-marketplace.service';

const router = express.Router();
const prisma = new PrismaClient();
const marketplaceService = new EnhancedMarketplaceService();

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
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

// Validation middleware
const validateSnippetCreate = (req: any, res: any, next: any) => {
  const { title, description, code, language, category, tags, price, isPublic, license } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Valid title required' });
  }
  
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Valid description required' });
  }
  
  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({ error: 'Valid code required' });
  }
  
  if (!language || typeof language !== 'string') {
    return res.status(400).json({ error: 'Valid language required' });
  }
  
  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Valid category required' });
  }
  
  if (!tags || !Array.isArray(tags)) {
    return res.status(400).json({ error: 'Tags must be an array' });
  }
  
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Valid price required' });
  }
  
  if (typeof isPublic !== 'boolean') {
    return res.status(400).json({ error: 'Valid isPublic flag required' });
  }
  
  if (!license || typeof license !== 'string') {
    return res.status(400).json({ error: 'Valid license required' });
  }
  
  next();
};

const validatePaymentRequest = (req: any, res: any, next: any) => {
  const { snippetId, amount, currency } = req.body;
  
  if (!snippetId || typeof snippetId !== 'string') {
    return res.status(400).json({ error: 'Valid snippet ID required' });
  }
  
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount required' });
  }
  
  if (currency && typeof currency !== 'string') {
    return res.status(400).json({ error: 'Valid currency required' });
  }
  
  next();
};

const validateReviewRequest = (req: any, res: any, next: any) => {
  const { snippetId, rating, comment, pros, cons } = req.body;
  
  if (!snippetId || typeof snippetId !== 'string') {
    return res.status(400).json({ error: 'Valid snippet ID required' });
  }
  
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  if (comment && typeof comment !== 'string') {
    return res.status(400).json({ error: 'Valid comment required' });
  }
  
  if (pros && !Array.isArray(pros)) {
    return res.status(400).json({ error: 'Pros must be an array' });
  }
  
  if (cons && !Array.isArray(cons)) {
    return res.status(400).json({ error: 'Cons must be an array' });
  }
  
  next();
};

// Snippet Management Routes
router.post('/snippets', authenticateToken, validateSnippetCreate, async (req, res) => {
  try {
    const request: SnippetCreateRequest = {
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      language: req.body.language,
      category: req.body.category,
      tags: req.body.tags,
      price: req.body.price,
      isPublic: req.body.isPublic,
      license: req.body.license,
      dependencies: req.body.dependencies,
      usageExamples: req.body.usageExamples,
      documentation: req.body.documentation,
      supportInfo: req.body.supportInfo
    };

    const snippet = await marketplaceService.createSnippet(request, req.user.id);

    res.status(201).json({
      success: true,
      snippet,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Snippet creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create snippet',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/snippets', async (req, res) => {
  try {
    const request: SnippetSearchRequest = {
      query: req.query.query as string,
      language: req.query.language as string,
      category: req.query.category as string,
      minTrustScore: req.query.minTrustScore ? parseInt(req.query.minTrustScore as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      authorId: req.query.authorId as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await marketplaceService.searchSnippets(request);

    res.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Snippet search error:', error);
    res.status(500).json({ 
      error: 'Failed to search snippets',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/snippets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Optional, for checking purchase status

    const snippet = await marketplaceService.getSnippetById(id, userId);

    res.json({
      success: true,
      snippet,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get snippet error:', error);
    res.status(500).json({ 
      error: 'Failed to get snippet',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.put('/snippets/:id', authenticateToken, validateSnippetCreate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check ownership
    const snippet = await prisma.codeSnippet.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    if (snippet.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this snippet' });
    }

    // Update snippet
    const updatedSnippet = await prisma.codeSnippet.update({
      where: { id },
      data: {
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        language: req.body.language,
        category: req.body.category,
        tags: req.body.tags,
        price: req.body.price,
        isPublic: req.body.isPublic,
        license: req.body.license,
        dependencies: req.body.dependencies,
        usageExamples: req.body.usageExamples,
        documentation: req.body.documentation,
        supportInfo: req.body.supportInfo
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

    res.json({
      success: true,
      snippet: updatedSnippet,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Snippet update error:', error);
    res.status(500).json({ 
      error: 'Failed to update snippet',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.delete('/snippets/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check ownership
    const snippet = await prisma.codeSnippet.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    if (snippet.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this snippet' });
    }

    // Delete snippet
    await prisma.codeSnippet.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Snippet deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Snippet deletion error:', error);
    res.status(500).json({ 
      error: 'Failed to delete snippet',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Payment Routes
router.post('/payment-intent', authenticateToken, validatePaymentRequest, async (req, res) => {
  try {
    const request: PaymentRequest = {
      snippetId: req.body.snippetId,
      userId: req.user.id,
      amount: req.body.amount,
      currency: req.body.currency
    };

    const paymentIntent = await marketplaceService.createPaymentIntent(request);

    res.json({
      success: true,
      paymentIntent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/payment-success', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      return res.status(400).json({ error: 'Valid payment intent ID required' });
    }

    const purchase = await marketplaceService.processPaymentSuccess(paymentIntentId);

    res.json({
      success: true,
      purchase,
      message: 'Payment processed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Payment success processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process payment success',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Review Routes
router.post('/reviews', authenticateToken, validateReviewRequest, async (req, res) => {
  try {
    const request: ReviewRequest = {
      snippetId: req.body.snippetId,
      userId: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
      pros: req.body.pros,
      cons: req.body.cons
    };

    const review = await marketplaceService.createReview(request);

    res.status(201).json({
      success: true,
      review,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create review',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/reviews/:snippetId', async (req, res) => {
  try {
    const { snippetId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await prisma.snippetReview.findMany({
      where: { snippetId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            githubUsername: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string)
    });

    const total = await prisma.snippetReview.count({
      where: { snippetId }
    });

    res.json({
      success: true,
      reviews,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      error: 'Failed to get reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Marketplace Statistics Routes
router.get('/stats', async (req, res) => {
  try {
    const stats = await marketplaceService.getMarketplaceStats();

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get marketplace stats error:', error);
    res.status(500).json({ 
      error: 'Failed to get marketplace statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// User Marketplace Activity Routes
router.get('/user/activity', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const activity = await marketplaceService.getUserMarketplaceActivity(userId);

    res.json({
      success: true,
      activity,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ 
      error: 'Failed to get user marketplace activity',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Categories and Tags Routes
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.codeSnippet.groupBy({
      by: ['category'],
      where: { isPublic: true },
      _count: { category: true }
    });

    res.json({
      success: true,
      categories: categories.map(c => ({
        name: c.category,
        count: c._count.category
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      error: 'Failed to get categories',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/languages', async (req, res) => {
  try {
    const languages = await prisma.codeSnippet.groupBy({
      by: ['language'],
      where: { isPublic: true },
      _count: { language: true }
    });

    res.json({
      success: true,
      languages: languages.map(l => ({
        name: l.language,
        count: l._count.language
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ 
      error: 'Failed to get languages',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'enhanced-marketplace',
    timestamp: new Date().toISOString()
  });
});

export default router; 