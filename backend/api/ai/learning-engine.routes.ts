import express from 'express';
import { PrismaClient } from '@prisma/client';
import AILearningEngineService, { 
  SkillAssessment, 
  LearningPathRequest, 
  TutorialRequest, 
  ProgressUpdate 
} from './learning-engine.service';

const router = express.Router();
const prisma = new PrismaClient();
const learningService = new AILearningEngineService();

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
const validateSkillAssessment = (req: any, res: any, next: any) => {
  const { codeSamples } = req.body;
  
  if (codeSamples && !Array.isArray(codeSamples)) {
    return res.status(400).json({ error: 'Code samples must be an array' });
  }
  
  next();
};

const validateLearningPathRequest = (req: any, res: any, next: any) => {
  const { skillLevel, preferredLanguages, learningGoals, timeCommitment } = req.body;
  
  if (!skillLevel || !['beginner', 'intermediate', 'advanced'].includes(skillLevel)) {
    return res.status(400).json({ error: 'Valid skill level required' });
  }
  
  if (!preferredLanguages || !Array.isArray(preferredLanguages) || preferredLanguages.length === 0) {
    return res.status(400).json({ error: 'At least one preferred language required' });
  }
  
  if (!learningGoals || !Array.isArray(learningGoals) || learningGoals.length === 0) {
    return res.status(400).json({ error: 'At least one learning goal required' });
  }
  
  if (!timeCommitment || typeof timeCommitment !== 'number' || timeCommitment < 1) {
    return res.status(400).json({ error: 'Valid time commitment required (hours per week)' });
  }
  
  next();
};

const validateTutorialRequest = (req: any, res: any, next: any) => {
  const { topic, difficulty, language } = req.body;
  
  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Valid topic required' });
  }
  
  if (!difficulty || typeof difficulty !== 'number' || difficulty < 1 || difficulty > 5) {
    return res.status(400).json({ error: 'Difficulty must be between 1 and 5' });
  }
  
  if (!language || typeof language !== 'string') {
    return res.status(400).json({ error: 'Valid language required' });
  }
  
  next();
};

const validateProgressUpdate = (req: any, res: any, next: any) => {
  const { moduleId, completionPercentage, timeSpent, exercisesCompleted } = req.body;
  
  if (!moduleId || typeof moduleId !== 'string') {
    return res.status(400).json({ error: 'Valid module ID required' });
  }
  
  if (typeof completionPercentage !== 'number' || completionPercentage < 0 || completionPercentage > 100) {
    return res.status(400).json({ error: 'Completion percentage must be between 0 and 100' });
  }
  
  if (typeof timeSpent !== 'number' || timeSpent < 0) {
    return res.status(400).json({ error: 'Valid time spent required' });
  }
  
  if (!exercisesCompleted || !Array.isArray(exercisesCompleted)) {
    return res.status(400).json({ error: 'Exercises completed must be an array' });
  }
  
  next();
};

// Skill Assessment Routes
router.post('/assess-skills', authenticateToken, validateSkillAssessment, async (req, res) => {
  try {
    const { codeSamples } = req.body;
    const userId = req.user.id;

    const assessment = await learningService.assessUserSkills(userId, codeSamples);

    res.json({
      success: true,
      assessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Skill assessment error:', error);
    res.status(500).json({ 
      error: 'Failed to assess skills',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/assessment/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is requesting their own assessment or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this assessment' });
    }

    const assessment = await learningService.assessUserSkills(userId);

    res.json({
      success: true,
      assessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ 
      error: 'Failed to get assessment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Learning Path Routes
router.post('/learning-paths', authenticateToken, validateLearningPathRequest, async (req, res) => {
  try {
    const request: LearningPathRequest = {
      userId: req.user.id,
      skillLevel: req.body.skillLevel,
      preferredLanguages: req.body.preferredLanguages,
      learningGoals: req.body.learningGoals,
      timeCommitment: req.body.timeCommitment
    };

    const learningPath = await learningService.createLearningPath(request);

    res.status(201).json({
      success: true,
      learningPath,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Learning path creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create learning path',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/learning-paths', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, difficulty } = req.query;

    const where: any = { userId };
    
    if (status) {
      where.progress = status === 'completed' ? 100 : { lt: 100 };
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }

    const learningPaths = await prisma.learningPath.findMany({
      where,
      include: {
        modules: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      learningPaths,
      count: learningPaths.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get learning paths error:', error);
    res.status(500).json({ 
      error: 'Failed to get learning paths',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/learning-paths/:pathId', authenticateToken, async (req, res) => {
  try {
    const { pathId } = req.params;
    const userId = req.user.id;

    const learningPath = await prisma.learningPath.findFirst({
      where: {
        id: pathId,
        userId
      },
      include: {
        modules: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!learningPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    res.json({
      success: true,
      learningPath,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get learning path error:', error);
    res.status(500).json({ 
      error: 'Failed to get learning path',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Tutorial Routes
router.post('/tutorials', authenticateToken, validateTutorialRequest, async (req, res) => {
  try {
    const request: TutorialRequest = {
      userId: req.user.id,
      topic: req.body.topic,
      difficulty: req.body.difficulty,
      language: req.body.language,
      context: req.body.context
    };

    const tutorial = await learningService.generateTutorial(request);

    res.status(201).json({
      success: true,
      tutorial,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Tutorial generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate tutorial',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/tutorials', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic, difficulty, language } = req.query;

    // Get user's learning paths and extract tutorials
    const learningPaths = await prisma.learningPath.findMany({
      where: { userId },
      include: {
        modules: {
          where: {
            type: 'tutorial',
            ...(topic && { title: { contains: topic as string, mode: 'insensitive' } }),
            ...(difficulty && { difficulty: parseInt(difficulty as string) }),
          }
        }
      }
    });

    const tutorials = learningPaths.flatMap(path => 
      path.modules.map(module => ({
        ...module,
        pathTitle: path.title,
        pathId: path.id
      }))
    );

    res.json({
      success: true,
      tutorials,
      count: tutorials.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get tutorials error:', error);
    res.status(500).json({ 
      error: 'Failed to get tutorials',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Progress Tracking Routes
router.post('/progress', authenticateToken, validateProgressUpdate, async (req, res) => {
  try {
    const update: ProgressUpdate = {
      userId: req.user.id,
      moduleId: req.body.moduleId,
      completionPercentage: req.body.completionPercentage,
      timeSpent: req.body.timeSpent,
      exercisesCompleted: req.body.exercisesCompleted,
      assessmentScore: req.body.assessmentScore
    };

    const result = await learningService.updateProgress(update);

    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ 
      error: 'Failed to update progress',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/progress/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is requesting their own progress or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this progress' });
    }

    const analytics = await learningService.getLearningAnalytics(userId);

    res.json({
      success: true,
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ 
      error: 'Failed to get progress',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// AI Feedback Routes
router.post('/feedback', authenticateToken, async (req, res) => {
  try {
    const { code, language, context } = req.body;
    const userId = req.user.id;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const feedback = await learningService.getAIFeedback(userId, code, language, context);

    res.json({
      success: true,
      feedback,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI feedback error:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI feedback',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Achievement Routes
router.get('/achievements', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, type } = req.query;

    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    const achievements = await prisma.achievement.findMany({
      where,
      orderBy: { earnedDate: 'desc' },
      take: parseInt(limit as string)
    });

    res.json({
      success: true,
      achievements,
      count: achievements.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ 
      error: 'Failed to get achievements',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Analytics Routes
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const analytics = await learningService.getLearningAnalytics(userId);

    res.json({
      success: true,
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to get analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ai-learning-engine',
    timestamp: new Date().toISOString()
  });
});

export default router; 