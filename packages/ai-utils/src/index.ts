// packages/ai-utils/src/index.ts
// AI utilities for CodePal platform

export interface UserProfile {
  id: string;
  codingPatterns: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLanguages: string[];
  strengths: string[];
  weaknesses: string[];
  learningGoals: string[];
  completedTutorials: string[];
  codeHistory: CodeHistoryEntry[];
}

export interface CodeHistoryEntry {
  id: string;
  code: string;
  language: string;
  timestamp: Date;
  projectId?: string;
  analysis?: CodeAnalysis;
}

export interface CodeAnalysis {
  quality: {
    score: number;
    issues: string[];
    strengths: string[];
    recommendations: string[];
  };
  security: {
    vulnerabilities: string[];
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
  };
  performance: {
    bottlenecks: string[];
    optimizations: string[];
    score: number;
  };
  bestPractices: {
    practices: string[];
    violations: string[];
    score: number;
  };
}

export interface Tutorial {
  id: string;
  title: string;
  content: string;
  difficulty: number;
  language: string;
  estimatedTime: number;
  prerequisites: string[];
  exercises: Exercise[];
  tags: string[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  hints: string[];
  difficulty: number;
}

export interface CodeSuggestion {
  type: 'readability' | 'performance' | 'security' | 'best_practice';
  description: string;
  code: string;
  priority: 'high' | 'medium' | 'low';
  explanation: string;
}

export interface LearningRecommendation {
  type: 'tutorial' | 'practice' | 'challenge' | 'review';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  reason: string;
  priority: number;
}

export class LearningEngine {
  private apiEndpoint: string;
  private userProfiles: Map<string, UserProfile> = new Map();

  constructor(apiEndpoint: string = 'https://api.codepal.ai') {
    this.apiEndpoint = apiEndpoint;
  }

  /**
   * Analyze user's code and update their profile
   */
  async analyzeUserCode(userId: string, code?: string, language?: string): Promise<UserProfile> {
    let profile = this.userProfiles.get(userId);
    
    if (!profile) {
      profile = {
        id: userId,
        codingPatterns: [],
        skillLevel: 'beginner',
        preferredLanguages: ['javascript', 'typescript'],
        strengths: [],
        weaknesses: [],
        learningGoals: [],
        completedTutorials: [],
        codeHistory: []
      };
      this.userProfiles.set(userId, profile);
    }

    if (code && language) {
      const analysis = await this.analyzeCodeQuality(code, language);
      const historyEntry: CodeHistoryEntry = {
        id: `code_${Date.now()}`,
        code,
        language,
        timestamp: new Date(),
        analysis
      };
      
      profile.codeHistory.push(historyEntry);
      this.updateProfileFromAnalysis(profile, analysis);
    }

    return profile;
  }

  /**
   * Analyze code quality using AI
   */
  async analyzeCodeQuality(code: string, language: string): Promise<CodeAnalysis> {
    try {
      const response = await fetch(`${this.apiEndpoint}/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          analysisType: 'quality'
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const result = await response.json();
      return this.parseAnalysisResult(result.analysis);
    } catch (error) {
      console.error('Code analysis error:', error);
      return this.getDefaultAnalysis();
    }
  }

  /**
   * Generate personalized tutorials based on user profile
   */
  async generateTutorials(profile: UserProfile): Promise<Tutorial[]> {
    const tutorials: Tutorial[] = [];
    
    // Generate tutorials based on weaknesses
    for (const weakness of profile.weaknesses) {
      const tutorial = await this.createTutorialForWeakness(weakness, profile.skillLevel);
      if (tutorial) {
        tutorials.push(tutorial);
      }
    }

    // Generate tutorials for learning goals
    for (const goal of profile.learningGoals) {
      const tutorial = await this.createTutorialForGoal(goal, profile.skillLevel);
      if (tutorial) {
        tutorials.push(tutorial);
      }
    }

    // Add language-specific tutorials
    for (const language of profile.preferredLanguages) {
      const tutorial = await this.createLanguageTutorial(language, profile.skillLevel);
      if (tutorial) {
        tutorials.push(tutorial);
      }
    }

    return tutorials.slice(0, 5); // Return top 5 tutorials
  }

  /**
   * Suggest code optimizations
   */
  async suggestOptimizations(code: string, language: string): Promise<CodeSuggestion[]> {
    try {
      const response = await fetch(`${this.apiEndpoint}/ai/suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          context: 'optimization suggestions'
        })
      });

      if (!response.ok) {
        throw new Error(`Suggestion failed: ${response.status}`);
      }

      const result = await response.json();
      return result.suggestions || [];
    } catch (error) {
      console.error('Optimization suggestion error:', error);
      return this.getDefaultSuggestions();
    }
  }

  /**
   * Predict potential bugs and tech debt
   */
  async predictIssues(code: string, language: string): Promise<{
    bugs: string[];
    techDebt: string[];
    riskScore: number;
    recommendations: string[];
  }> {
    try {
      const analysis = await this.analyzeCodeQuality(code, language);
      
      const bugs: string[] = [];
      const techDebt: string[] = [];
      let riskScore = 0;

      // Analyze for bugs
      if (analysis.security.vulnerabilities.length > 0) {
        bugs.push(...analysis.security.vulnerabilities);
        riskScore += 30;
      }

      if (analysis.performance.bottlenecks.length > 0) {
        bugs.push(...analysis.performance.bottlenecks);
        riskScore += 20;
      }

      // Analyze for tech debt
      if (analysis.bestPractices.violations.length > 0) {
        techDebt.push(...analysis.bestPractices.violations);
        riskScore += 15;
      }

      if (analysis.quality.score < 70) {
        techDebt.push('Low code quality indicates technical debt');
        riskScore += 25;
      }

      const recommendations = [
        ...analysis.quality.recommendations,
        ...analysis.security.recommendations,
        ...analysis.performance.optimizations
      ];

      return {
        bugs,
        techDebt,
        riskScore: Math.min(100, riskScore),
        recommendations: recommendations.slice(0, 5)
      };
    } catch (error) {
      console.error('Issue prediction error:', error);
      return {
        bugs: [],
        techDebt: [],
        riskScore: 0,
        recommendations: ['Unable to analyze code at this time']
      };
    }
  }

  /**
   * Generate learning recommendations
   */
  async generateLearningRecommendations(profile: UserProfile): Promise<LearningRecommendation[]> {
    const recommendations: LearningRecommendation[] = [];

    // Recommendations based on weaknesses
    for (const weakness of profile.weaknesses) {
      recommendations.push({
        type: 'tutorial',
        title: `Improve ${weakness}`,
        description: `Focus on improving your ${weakness} skills`,
        difficulty: profile.skillLevel,
        estimatedTime: 2,
        reason: `Based on your coding patterns, you could benefit from improving ${weakness}`,
        priority: 8
      });
    }

    // Recommendations based on skill level progression
    if (profile.skillLevel === 'beginner') {
      recommendations.push({
        type: 'practice',
        title: 'Code Review Practice',
        description: 'Practice reviewing code to improve your understanding',
        difficulty: 'beginner',
        estimatedTime: 1,
        reason: 'Code review helps beginners understand best practices',
        priority: 7
      });
    } else if (profile.skillLevel === 'intermediate') {
      recommendations.push({
        type: 'challenge',
        title: 'Advanced Algorithm Challenge',
        description: 'Tackle complex algorithmic problems',
        difficulty: 'intermediate',
        estimatedTime: 3,
        reason: 'Intermediate developers benefit from algorithmic thinking',
        priority: 6
      });
    } else {
      recommendations.push({
        type: 'review',
        title: 'Architecture Review',
        description: 'Review and improve system architecture',
        difficulty: 'advanced',
        estimatedTime: 4,
        reason: 'Advanced developers should focus on system design',
        priority: 9
      });
    }

    // Language-specific recommendations
    for (const language of profile.preferredLanguages) {
      recommendations.push({
        type: 'tutorial',
        title: `Advanced ${language} Patterns`,
        description: `Learn advanced patterns and techniques in ${language}`,
        difficulty: profile.skillLevel,
        estimatedTime: 2,
        reason: `Deepen your knowledge of ${language}`,
        priority: 5
      });
    }

    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);
  }

  /**
   * Create personalized exercises
   */
  async createPersonalizedExercises(profile: UserProfile, topic: string): Promise<Exercise[]> {
    const exercises: Exercise[] = [];

    // Create exercises based on user's skill level and weaknesses
    const difficulty = this.getExerciseDifficulty(profile.skillLevel);
    
    for (let i = 0; i < 3; i++) {
      exercises.push({
        id: `exercise_${topic}_${i}`,
        title: `${topic} Exercise ${i + 1}`,
        description: `Practice ${topic} with a focus on your skill level`,
        starterCode: this.generateStarterCode(topic, profile.preferredLanguages[0]),
        solution: `// Solution will be provided after completion`,
        hints: [
          `Think about the ${topic} concepts you've learned`,
          `Consider edge cases and error handling`,
          `Focus on clean, readable code`
        ],
        difficulty: difficulty + i
      });
    }

    return exercises;
  }

  // Private helper methods
  private updateProfileFromAnalysis(profile: UserProfile, analysis: CodeAnalysis): void {
    // Update strengths and weaknesses based on analysis
    if (analysis.quality.score > 80) {
      profile.strengths.push('Code quality');
    } else {
      profile.weaknesses.push('Code quality needs improvement');
    }

    if (analysis.security.vulnerabilities.length === 0) {
      profile.strengths.push('Security awareness');
    } else {
      profile.weaknesses.push('Security vulnerabilities');
    }

    if (analysis.performance.score > 75) {
      profile.strengths.push('Performance optimization');
    } else {
      profile.weaknesses.push('Performance optimization');
    }

    // Update skill level based on overall performance
    const overallScore = (
      analysis.quality.score +
      (100 - analysis.security.vulnerabilities.length * 10) +
      analysis.performance.score +
      analysis.bestPractices.score
    ) / 4;

    if (overallScore > 85) {
      profile.skillLevel = 'advanced';
    } else if (overallScore > 65) {
      profile.skillLevel = 'intermediate';
    } else {
      profile.skillLevel = 'beginner';
    }
  }

  private parseAnalysisResult(analysis: any): CodeAnalysis {
    return {
      quality: {
        score: analysis.score || 70,
        issues: analysis.issues || [],
        strengths: analysis.strengths || [],
        recommendations: analysis.recommendations || []
      },
      security: {
        vulnerabilities: analysis.vulnerabilities || [],
        riskLevel: analysis.riskLevel || 'low',
        recommendations: analysis.recommendations || []
      },
      performance: {
        bottlenecks: analysis.bottlenecks || [],
        optimizations: analysis.optimizations || [],
        score: analysis.performanceScore || 75
      },
      bestPractices: {
        practices: analysis.practices || [],
        violations: analysis.violations || [],
        score: analysis.score || 80
      }
    };
  }

  private getDefaultAnalysis(): CodeAnalysis {
    return {
      quality: {
        score: 70,
        issues: ['Unable to analyze code'],
        strengths: [],
        recommendations: ['Try again later']
      },
      security: {
        vulnerabilities: [],
        riskLevel: 'low',
        recommendations: []
      },
      performance: {
        bottlenecks: [],
        optimizations: [],
        score: 75
      },
      bestPractices: {
        practices: [],
        violations: [],
        score: 80
      }
    };
  }

  private getDefaultSuggestions(): CodeSuggestion[] {
    return [
      {
        type: 'readability',
        description: 'Consider adding comments to explain complex logic',
        code: '// TODO: Add comments here',
        priority: 'medium',
        explanation: 'Comments help other developers understand your code'
      }
    ];
  }

  private async createTutorialForWeakness(weakness: string, skillLevel: string): Promise<Tutorial | null> {
    // This would typically call an AI service to generate content
    return {
      id: `tutorial_${weakness.replace(/\s+/g, '_')}`,
      title: `Improving ${weakness}`,
      content: `This tutorial will help you improve your ${weakness} skills...`,
      difficulty: this.getDifficultyForSkillLevel(skillLevel),
      language: 'javascript',
      estimatedTime: 2,
      prerequisites: [],
      exercises: [],
      tags: [weakness, skillLevel]
    };
  }

  private async createTutorialForGoal(goal: string, skillLevel: string): Promise<Tutorial | null> {
    return {
      id: `tutorial_${goal.replace(/\s+/g, '_')}`,
      title: `Achieving: ${goal}`,
      content: `This tutorial will help you achieve your goal of ${goal}...`,
      difficulty: this.getDifficultyForSkillLevel(skillLevel),
      language: 'javascript',
      estimatedTime: 3,
      prerequisites: [],
      exercises: [],
      tags: [goal, skillLevel]
    };
  }

  private async createLanguageTutorial(language: string, skillLevel: string): Promise<Tutorial | null> {
    return {
      id: `tutorial_${language}_${skillLevel}`,
      title: `Advanced ${language} for ${skillLevel} developers`,
      content: `Learn advanced ${language} concepts suitable for ${skillLevel} developers...`,
      difficulty: this.getDifficultyForSkillLevel(skillLevel),
      language,
      estimatedTime: 2,
      prerequisites: [`Basic ${language} knowledge`],
      exercises: [],
      tags: [language, skillLevel, 'advanced']
    };
  }

  private getDifficultyForSkillLevel(skillLevel: string): number {
    switch (skillLevel) {
      case 'beginner': return 1;
      case 'intermediate': return 2;
      case 'advanced': return 3;
      default: return 2;
    }
  }

  private getExerciseDifficulty(skillLevel: string): number {
    switch (skillLevel) {
      case 'beginner': return 1;
      case 'intermediate': return 3;
      case 'advanced': return 5;
      default: return 3;
    }
  }

  private generateStarterCode(topic: string, language: string): string {
    const templates = {
      javascript: `// ${topic} exercise
function ${topic.toLowerCase()}() {
  // TODO: Implement your solution here
  
}

// Test your implementation
console.log(${topic.toLowerCase()}());`,
      python: `# ${topic} exercise
def ${topic.lower()}():
    # TODO: Implement your solution here
    pass

# Test your implementation
print(${topic.lower()}())`,
      typescript: `// ${topic} exercise
function ${topic.toLowerCase()}(): any {
  // TODO: Implement your solution here
  
}

// Test your implementation
console.log(${topic.toLowerCase()}());`
    };

    return templates[language as keyof typeof templates] || templates.javascript;
  }
}

// Export the main class and interfaces
export { LearningEngine };
export default LearningEngine; 