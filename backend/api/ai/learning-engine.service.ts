import { PrismaClient } from '@prisma/client';
import { LearningEngine } from '@codepal/ai-utils';

const prisma = new PrismaClient();
const aiEngine = new LearningEngine();

export interface SkillAssessment {
  userId: string;
  overallScore: number;
  languageScores: Record<string, number>;
  skillAreas: {
    problemSolving: number;
    codeQuality: number;
    security: number;
    performance: number;
    bestPractices: number;
  };
  recommendations: string[];
  nextAssessmentDate: Date;
}

export interface LearningPathRequest {
  userId: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLanguages: string[];
  learningGoals: string[];
  timeCommitment: number; // hours per week
}

export interface TutorialRequest {
  userId: string;
  topic: string;
  difficulty: number;
  language: string;
  context?: string;
}

export interface ProgressUpdate {
  userId: string;
  moduleId: string;
  completionPercentage: number;
  timeSpent: number; // minutes
  exercisesCompleted: string[];
  assessmentScore?: number;
}

export class AILearningEngineService {
  /**
   * Conduct comprehensive skill assessment for a user
   */
  async assessUserSkills(userId: string, codeSamples?: string[]): Promise<SkillAssessment> {
    try {
      // Get user's recent code history
      const userProfile = await aiEngine.analyzeUserCode(userId);
      const codeHistory = await this.getUserCodeHistory(userId);
      
      // Analyze code samples if provided
      let languageScores: Record<string, number> = {};
      let skillAreas = {
        problemSolving: 50,
        codeQuality: 50,
        security: 50,
        performance: 50,
        bestPractices: 50
      };

      if (codeSamples && codeSamples.length > 0) {
        for (const code of codeSamples) {
          const analysis = await aiEngine.analyzeCodeQuality(code, 'javascript');
          this.updateSkillAreas(skillAreas, analysis);
        }
      }

      // Analyze code history
      for (const entry of codeHistory) {
        if (entry.analysis) {
          this.updateSkillAreas(skillAreas, entry.analysis);
          const language = entry.language.toLowerCase();
          if (!languageScores[language]) {
            languageScores[language] = 0;
          }
          languageScores[language] = Math.max(languageScores[language], entry.analysis.quality.score);
        }
      }

      // Calculate overall score
      const overallScore = Math.round(
        Object.values(skillAreas).reduce((sum, score) => sum + score, 0) / 5
      );

      // Generate recommendations
      const recommendations = await this.generateSkillRecommendations(skillAreas, userProfile);

      // Schedule next assessment
      const nextAssessmentDate = new Date();
      nextAssessmentDate.setDate(nextAssessmentDate.getDate() + 30); // 30 days from now

      const assessment: SkillAssessment = {
        userId,
        overallScore,
        languageScores,
        skillAreas,
        recommendations,
        nextAssessmentDate
      };

      // Save assessment to database
      await this.saveSkillAssessment(assessment);

      return assessment;
    } catch (error) {
      console.error('Skill assessment error:', error);
      throw new Error('Failed to assess user skills');
    }
  }

  /**
   * Create personalized learning path for user
   */
  async createLearningPath(request: LearningPathRequest): Promise<any> {
    try {
      const { userId, skillLevel, preferredLanguages, learningGoals, timeCommitment } = request;

      // Get user's current skills
      const assessment = await this.assessUserSkills(userId);
      
      // Generate learning modules based on goals and skill gaps
      const modules = await this.generateLearningModules(
        learningGoals,
        assessment.skillAreas,
        preferredLanguages,
        skillLevel
      );

      // Calculate estimated duration
      const estimatedDuration = Math.ceil(
        modules.reduce((total, module) => total + module.estimatedTime, 0) / 60
      );

      // Create learning path
      const learningPath = await prisma.learningPath.create({
        data: {
          userId,
          title: `Personalized Learning Path for ${skillLevel}`,
          description: `Custom learning path focusing on ${learningGoals.join(', ')}`,
          difficulty: skillLevel,
          estimatedDuration,
          progress: 0,
          completedModules: [],
          targetCompletionDate: new Date(Date.now() + (estimatedDuration * 7 * 24 * 60 * 60 * 1000)), // weeks to milliseconds
          modules: {
            create: modules.map(module => ({
              title: module.title,
              description: module.description,
              type: module.type,
              difficulty: module.difficulty,
              estimatedTime: module.estimatedTime,
              prerequisites: module.prerequisites,
              content: JSON.stringify(module.content),
              exercises: JSON.stringify(module.exercises),
              assessment: JSON.stringify(module.assessment)
            }))
          }
        },
        include: {
          modules: true
        }
      });

      // Initialize progress tracker
      await this.initializeProgressTracker(userId, learningPath.id);

      return learningPath;
    } catch (error) {
      console.error('Learning path creation error:', error);
      throw new Error('Failed to create learning path');
    }
  }

  /**
   * Generate interactive tutorial
   */
  async generateTutorial(request: TutorialRequest): Promise<any> {
    try {
      const { userId, topic, difficulty, language, context } = request;

      // Get user's current skill level for this topic
      const userProfile = await aiEngine.analyzeUserCode(userId);
      
      // Generate tutorial content using AI
      const tutorialContent = await this.generateTutorialContent(topic, difficulty, language, context);
      
      // Create exercises
      const exercises = await this.generateExercises(topic, difficulty, language);
      
      // Create assessment
      const assessment = await this.generateAssessment(topic, difficulty, language);

      const tutorial = {
        id: `tutorial_${Date.now()}`,
        title: `${topic} Tutorial`,
        description: `Learn ${topic} in ${language}`,
        content: tutorialContent,
        exercises,
        assessment,
        difficulty,
        language,
        estimatedTime: this.calculateTutorialTime(difficulty),
        createdAt: new Date()
      };

      return tutorial;
    } catch (error) {
      console.error('Tutorial generation error:', error);
      throw new Error('Failed to generate tutorial');
    }
  }

  /**
   * Update user progress
   */
  async updateProgress(update: ProgressUpdate): Promise<any> {
    try {
      const { userId, moduleId, completionPercentage, timeSpent, exercisesCompleted, assessmentScore } = update;

      // Update module progress
      const module = await prisma.learningModule.findUnique({
        where: { id: moduleId },
        include: { learningPath: true }
      });

      if (!module) {
        throw new Error('Module not found');
      }

      // Update learning path progress
      const path = module.learningPath;
      const allModules = await prisma.learningModule.findMany({
        where: { pathId: path.id }
      });

      const totalModules = allModules.length;
      const completedModules = allModules.filter(m => 
        path.completedModules.includes(m.id)
      ).length;

      let newProgress = Math.round((completedModules / totalModules) * 100);
      
      if (completionPercentage >= 100 && !path.completedModules.includes(moduleId)) {
        // Mark module as completed
        await prisma.learningPath.update({
          where: { id: path.id },
          data: {
            completedModules: [...path.completedModules, moduleId],
            progress: newProgress
          }
        });
      }

      // Update progress tracker
      await this.updateProgressTracker(userId, {
        timeSpent,
        exercisesCompleted,
        assessmentScore
      });

      // Check for achievements
      await this.checkAndAwardAchievements(userId, {
        moduleCompleted: completionPercentage >= 100,
        timeSpent,
        assessmentScore
      });

      return {
        success: true,
        newProgress,
        achievements: await this.getRecentAchievements(userId)
      };
    } catch (error) {
      console.error('Progress update error:', error);
      throw new Error('Failed to update progress');
    }
  }

  /**
   * Get AI feedback on user's code
   */
  async getAIFeedback(userId: string, code: string, language: string, context?: string): Promise<any> {
    try {
      // Analyze code quality
      const analysis = await aiEngine.analyzeCodeQuality(code, language);
      
      // Get personalized suggestions
      const suggestions = await aiEngine.suggestOptimizations(code, language);
      
      // Predict potential issues
      const issues = await aiEngine.predictIssues(code, language);
      
      // Generate learning recommendations
      const userProfile = await aiEngine.analyzeUserCode(userId);
      const recommendations = await aiEngine.generateLearningRecommendations(userProfile);

      // Create personalized feedback
      const feedback = {
        analysis,
        suggestions: suggestions.slice(0, 5), // Top 5 suggestions
        issues,
        recommendations: recommendations.slice(0, 3), // Top 3 recommendations
        overallScore: analysis.quality.score,
        improvementAreas: this.identifyImprovementAreas(analysis),
        nextSteps: this.generateNextSteps(analysis, userProfile)
      };

      // Save feedback to user's history
      await this.saveCodeFeedback(userId, code, language, feedback);

      return feedback;
    } catch (error) {
      console.error('AI feedback error:', error);
      throw new Error('Failed to generate AI feedback');
    }
  }

  /**
   * Get user's learning analytics
   */
  async getLearningAnalytics(userId: string): Promise<any> {
    try {
      const progressTracker = await prisma.progressTracker.findUnique({
        where: { userId }
      });

      const achievements = await prisma.achievement.findMany({
        where: { userId },
        orderBy: { earnedDate: 'desc' },
        take: 10
      });

      const learningPaths = await prisma.learningPath.findMany({
        where: { userId },
        include: { modules: true }
      });

      const recentActivity = await this.getRecentLearningActivity(userId);

      return {
        progressTracker,
        achievements,
        learningPaths,
        recentActivity,
        analytics: {
          totalTimeSpent: progressTracker?.totalTimeSpent || 0,
          currentStreak: progressTracker?.streak || 0,
          completedModules: learningPaths.reduce((total, path) => 
            total + path.completedModules.length, 0
          ),
          averageProgress: learningPaths.length > 0 ? 
            learningPaths.reduce((sum, path) => sum + path.progress, 0) / learningPaths.length : 0
        }
      };
    } catch (error) {
      console.error('Learning analytics error:', error);
      throw new Error('Failed to get learning analytics');
    }
  }

  // Private helper methods
  private async getUserCodeHistory(userId: string): Promise<any[]> {
    // This would fetch from the user's code history
    // For now, return empty array
    return [];
  }

  private updateSkillAreas(skillAreas: any, analysis: any): void {
    if (analysis.quality) {
      skillAreas.codeQuality = Math.max(skillAreas.codeQuality, analysis.quality.score);
    }
    if (analysis.security) {
      skillAreas.security = Math.max(skillAreas.security, 
        100 - (analysis.security.vulnerabilities.length * 10)
      );
    }
    if (analysis.performance) {
      skillAreas.performance = Math.max(skillAreas.performance, analysis.performance.score);
    }
    if (analysis.bestPractices) {
      skillAreas.bestPractices = Math.max(skillAreas.bestPractices, analysis.bestPractices.score);
    }
  }

  private async generateSkillRecommendations(skillAreas: any, userProfile: any): Promise<string[]> {
    const recommendations: string[] = [];
    
    if (skillAreas.codeQuality < 70) {
      recommendations.push('Focus on code quality and readability');
    }
    if (skillAreas.security < 70) {
      recommendations.push('Improve security awareness and best practices');
    }
    if (skillAreas.performance < 70) {
      recommendations.push('Learn performance optimization techniques');
    }
    if (skillAreas.bestPractices < 70) {
      recommendations.push('Study design patterns and SOLID principles');
    }

    return recommendations.slice(0, 5);
  }

  private async saveSkillAssessment(assessment: SkillAssessment): Promise<void> {
    // Save assessment to database
    // This would be implemented based on your schema
  }

  private async generateLearningModules(
    goals: string[],
    skillAreas: any,
    languages: string[],
    skillLevel: string
  ): Promise<any[]> {
    const modules: any[] = [];
    
    // Generate modules based on learning goals
    for (const goal of goals) {
      modules.push({
        title: `Learn ${goal}`,
        description: `Comprehensive tutorial on ${goal}`,
        type: 'tutorial',
        difficulty: this.getDifficultyForSkillLevel(skillLevel),
        estimatedTime: 120, // 2 hours
        prerequisites: [],
        content: { sections: [] },
        exercises: { problems: [] },
        assessment: { questions: [] }
      });
    }

    // Generate modules for skill gaps
    if (skillAreas.codeQuality < 70) {
      modules.push({
        title: 'Code Quality Fundamentals',
        description: 'Learn to write clean, maintainable code',
        type: 'tutorial',
        difficulty: 2,
        estimatedTime: 90,
        prerequisites: [],
        content: { sections: [] },
        exercises: { problems: [] },
        assessment: { questions: [] }
      });
    }

    return modules;
  }

  private getDifficultyForSkillLevel(skillLevel: string): number {
    switch (skillLevel) {
      case 'beginner': return 1;
      case 'intermediate': return 2;
      case 'advanced': return 3;
      default: return 2;
    }
  }

  private async initializeProgressTracker(userId: string, pathId: string): Promise<void> {
    await prisma.progressTracker.upsert({
      where: { userId },
      update: {
        learningPaths: { push: pathId }
      },
      create: {
        userId,
        learningPaths: [pathId],
        skillImprovements: '[]',
        achievements: '[]',
        streak: 0,
        totalTimeSpent: 0
      }
    });
  }

  private async generateTutorialContent(
    topic: string,
    difficulty: number,
    language: string,
    context?: string
  ): Promise<any> {
    // This would use AI to generate tutorial content
    return {
      sections: [
        {
          title: `Introduction to ${topic}`,
          content: `Learn the fundamentals of ${topic} in ${language}`,
          examples: []
        }
      ]
    };
  }

  private async generateExercises(topic: string, difficulty: number, language: string): Promise<any> {
    // This would use AI to generate exercises
    return {
      problems: [
        {
          title: `Practice ${topic}`,
          description: `Complete this exercise to practice ${topic}`,
          starterCode: '',
          solution: '',
          hints: []
        }
      ]
    };
  }

  private async generateAssessment(topic: string, difficulty: number, language: string): Promise<any> {
    // This would use AI to generate assessment questions
    return {
      questions: [
        {
          question: `What is ${topic}?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0
        }
      ]
    };
  }

  private calculateTutorialTime(difficulty: number): number {
    return difficulty * 30; // 30 minutes per difficulty level
  }

  private async updateProgressTracker(userId: string, update: any): Promise<void> {
    await prisma.progressTracker.update({
      where: { userId },
      data: {
        totalTimeSpent: { increment: update.timeSpent },
        lastActivity: new Date()
      }
    });
  }

  private async checkAndAwardAchievements(userId: string, criteria: any): Promise<void> {
    const achievements = await prisma.achievement.findMany({
      where: { userId }
    });

    // Check for new achievements based on criteria
    if (criteria.moduleCompleted && !achievements.find(a => a.title.includes('Module Completion'))) {
      await prisma.achievement.create({
        data: {
          userId,
          title: 'Module Master',
          description: 'Completed your first learning module',
          type: 'completion',
          icon: '🎯',
          points: 100
        }
      });
    }
  }

  private async getRecentAchievements(userId: string): Promise<any[]> {
    return await prisma.achievement.findMany({
      where: { userId },
      orderBy: { earnedDate: 'desc' },
      take: 5
    });
  }

  private identifyImprovementAreas(analysis: any): string[] {
    const areas: string[] = [];
    
    if (analysis.quality.score < 70) areas.push('Code Quality');
    if (analysis.security.vulnerabilities.length > 0) areas.push('Security');
    if (analysis.performance.score < 70) areas.push('Performance');
    if (analysis.bestPractices.score < 70) areas.push('Best Practices');
    
    return areas;
  }

  private generateNextSteps(analysis: any, userProfile: any): string[] {
    const steps: string[] = [];
    
    if (analysis.quality.score < 70) {
      steps.push('Review code quality best practices');
    }
    if (analysis.security.vulnerabilities.length > 0) {
      steps.push('Address security vulnerabilities');
    }
    
    return steps;
  }

  private async saveCodeFeedback(userId: string, code: string, language: string, feedback: any): Promise<void> {
    // Save feedback to user's history
    // This would be implemented based on your schema
  }

  private async getRecentLearningActivity(userId: string): Promise<any[]> {
    // Get recent learning activity
    // This would be implemented based on your schema
    return [];
  }
}

export default AILearningEngineService; 