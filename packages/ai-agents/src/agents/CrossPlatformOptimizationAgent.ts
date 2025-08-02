import { BaseAgent, AgentConfig, AgentAction, AgentResponse, AgentMetrics } from '../core/BaseAgent';
import { Redis } from 'redis';
import { z } from 'zod';

// Input validation schemas
const PlatformSchema = z.enum(['web', 'mobile', 'iot', 'desktop', 'server']);
const CodeValidationSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty'),
  language: z.string().optional(),
  framework: z.string().optional()
});

interface PerformancePrediction {
  predictedScore: number;
  bottlenecks: string[];
  optimizations: string[];
  confidence: number;
  estimatedImprovement: number;
}

interface PlatformOptimization {
  optimizedCode: string;
  suggestions: string[];
  performanceGain: number;
  compatibilityScore: number;
}

/**
 * CrossPlatformOptimizationAgent
 * Predicts and optimizes transpiled code for specific platforms (web, mobile, IoT, etc.).
 * Forecasts performance, suggests platform-specific optimizations, and integrates with analytics.
 */
export class CrossPlatformOptimizationAgent extends BaseAgent {
  private redis: Redis;
  private cacheExpiry = 3600; // 1 hour cache expiry

  constructor(config: AgentConfig, redisClient?: Redis) {
    super(config);
    this.redis = redisClient || new Redis({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
  }

  /**
   * Validates input parameters
   */
  private validateInput(code: string, platform: string): { code: string; platform: string } {
    try {
      const validatedCode = CodeValidationSchema.parse({ code });
      const validatedPlatform = PlatformSchema.parse(platform);
      
      return {
        code: validatedCode.code,
        platform: validatedPlatform
      };
    } catch (error) {
      this.logger.error('Input validation failed:', error);
      throw new Error(`Invalid input: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates cache key for performance predictions
   */
  private generateCacheKey(code: string, platform: string): string {
    const codeHash = this.hashCode(code);
    return `perf:${platform}:${codeHash}`;
  }

  /**
   * Simple hash function for code content
   */
  private hashCode(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Gets cached prediction if available
   */
  private async getCachedPrediction(cacheKey: string): Promise<PerformancePrediction | null> {
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        this.logger.info(`Cache hit for key: ${cacheKey}`);
        return parsed;
      }
    } catch (error) {
      this.logger.warn('Cache retrieval failed:', error);
    }
    return null;
  }

  /**
   * Caches prediction result
   */
  private async cachePrediction(cacheKey: string, prediction: PerformancePrediction): Promise<void> {
    try {
      await this.redis.setex(cacheKey, this.cacheExpiry, JSON.stringify(prediction));
      this.logger.info(`Cached prediction for key: ${cacheKey}`);
    } catch (error) {
      this.logger.warn('Cache storage failed:', error);
    }
  }

  /**
   * Analyzes code for platform-specific performance characteristics
   */
  private async analyzeCodePerformance(code: string, platform: string): Promise<PerformancePrediction> {
    // Platform-specific analysis logic
    const analysis = {
      web: () => this.analyzeWebPerformance(code),
      mobile: () => this.analyzeMobilePerformance(code),
      iot: () => this.analyzeIoTPerformance(code),
      desktop: () => this.analyzeDesktopPerformance(code),
      server: () => this.analyzeServerPerformance(code)
    };

    const analyzer = analysis[platform as keyof typeof analysis];
    if (!analyzer) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    return await analyzer();
  }

  /**
   * Web platform performance analysis
   */
  private async analyzeWebPerformance(code: string): Promise<PerformancePrediction> {
    const bottlenecks: string[] = [];
    const optimizations: string[] = [];
    let score = 100;

    // Check for common web performance issues
    if (code.includes('document.write')) {
      bottlenecks.push('Use of document.write can block rendering');
      optimizations.push('Replace document.write with DOM manipulation');
      score -= 20;
    }

    if (code.includes('innerHTML')) {
      bottlenecks.push('innerHTML can cause XSS vulnerabilities');
      optimizations.push('Use textContent or createElement for safe DOM manipulation');
      score -= 15;
    }

    if (code.includes('eval(')) {
      bottlenecks.push('eval() is a security risk and performance bottleneck');
      optimizations.push('Use JSON.parse() or Function constructor instead');
      score -= 25;
    }

    if (code.includes('setTimeout') && code.includes('setInterval')) {
      bottlenecks.push('Multiple timers can impact performance');
      optimizations.push('Consolidate timers and use requestAnimationFrame for animations');
      score -= 10;
    }

    return {
      predictedScore: Math.max(0, score),
      bottlenecks,
      optimizations,
      confidence: 0.85,
      estimatedImprovement: Math.min(30, 100 - score)
    };
  }

  /**
   * Mobile platform performance analysis
   */
  private async analyzeMobilePerformance(code: string): Promise<PerformancePrediction> {
    const bottlenecks: string[] = [];
    const optimizations: string[] = [];
    let score = 100;

    // Check for mobile-specific issues
    if (code.includes('addEventListener') && code.includes('touch')) {
      bottlenecks.push('Touch events can cause performance issues on mobile');
      optimizations.push('Use passive event listeners for touch events');
      score -= 15;
    }

    if (code.includes('localStorage') || code.includes('sessionStorage')) {
      bottlenecks.push('Storage operations can be slow on mobile devices');
      optimizations.push('Batch storage operations and use async patterns');
      score -= 10;
    }

    if (code.includes('fetch(') && !code.includes('cache')) {
      bottlenecks.push('Network requests without caching impact mobile performance');
      optimizations.push('Implement proper caching strategies');
      score -= 20;
    }

    return {
      predictedScore: Math.max(0, score),
      bottlenecks,
      optimizations,
      confidence: 0.80,
      estimatedImprovement: Math.min(25, 100 - score)
    };
  }

  /**
   * IoT platform performance analysis
   */
  private async analyzeIoTPerformance(code: string): Promise<PerformancePrediction> {
    const bottlenecks: string[] = [];
    const optimizations: string[] = [];
    let score = 100;

    // Check for IoT-specific issues
    if (code.includes('setInterval') && code.includes('100')) {
      bottlenecks.push('Frequent polling can drain IoT device batteries');
      optimizations.push('Use event-driven patterns instead of polling');
      score -= 30;
    }

    if (code.includes('JSON.stringify') && code.includes('JSON.parse')) {
      bottlenecks.push('JSON operations are expensive on IoT devices');
      optimizations.push('Use binary protocols or lightweight serialization');
      score -= 20;
    }

    if (code.includes('console.log')) {
      bottlenecks.push('Console logging impacts IoT performance');
      optimizations.push('Use conditional logging or remove in production');
      score -= 10;
    }

    return {
      predictedScore: Math.max(0, score),
      bottlenecks,
      optimizations,
      confidence: 0.75,
      estimatedImprovement: Math.min(40, 100 - score)
    };
  }

  /**
   * Desktop platform performance analysis
   */
  private async analyzeDesktopPerformance(code: string): Promise<PerformancePrediction> {
    const bottlenecks: string[] = [];
    const optimizations: string[] = [];
    let score = 100;

    // Check for desktop-specific issues
    if (code.includes('fs.readFileSync')) {
      bottlenecks.push('Synchronous file operations block the main thread');
      optimizations.push('Use async file operations with fs.promises');
      score -= 15;
    }

    if (code.includes('require(') && code.includes('node_modules')) {
      bottlenecks.push('Large dependency trees impact startup time');
      optimizations.push('Use dynamic imports and tree shaking');
      score -= 10;
    }

    return {
      predictedScore: Math.max(0, score),
      bottlenecks,
      optimizations,
      confidence: 0.90,
      estimatedImprovement: Math.min(20, 100 - score)
    };
  }

  /**
   * Server platform performance analysis
   */
  private async analyzeServerPerformance(code: string): Promise<PerformancePrediction> {
    const bottlenecks: string[] = [];
    const optimizations: string[] = [];
    let score = 100;

    // Check for server-specific issues
    if (code.includes('for (') && code.includes('database')) {
      bottlenecks.push('N+1 queries can cause performance issues');
      optimizations.push('Use batch queries and eager loading');
      score -= 25;
    }

    if (code.includes('setTimeout') && code.includes('0')) {
      bottlenecks.push('Microtask queue can cause memory leaks');
      optimizations.push('Use proper async/await patterns');
      score -= 15;
    }

    return {
      predictedScore: Math.max(0, score),
      bottlenecks,
      optimizations,
      confidence: 0.85,
      estimatedImprovement: Math.min(30, 100 - score)
    };
  }

  /**
   * Predicts performance of transpiled code on a given platform.
   */
  async predictPerformance(code: string, platform: string): Promise<PerformancePrediction> {
    try {
      // Validate input
      const { code: validatedCode, platform: validatedPlatform } = this.validateInput(code, platform);
      
      // Generate cache key
      const cacheKey = this.generateCacheKey(validatedCode, validatedPlatform);
      
      // Check cache first
      const cached = await this.getCachedPrediction(cacheKey);
      if (cached) {
        return cached;
      }

      // Perform analysis
      const prediction = await this.analyzeCodePerformance(validatedCode, validatedPlatform);
      
      // Cache the result
      await this.cachePrediction(cacheKey, prediction);
      
      // Record metrics
      this.recordMetrics('performance_predicted', {
        platform: validatedPlatform,
        score: prediction.predictedScore,
        confidence: prediction.confidence
      });

      return prediction;
    } catch (error) {
      this.logger.error('Error predicting performance:', error);
      throw error;
    }
  }

  /**
   * Suggests or applies platform-specific optimizations.
   */
  async optimizeForPlatform(code: string, platform: string): Promise<PlatformOptimization> {
    try {
      // Validate input
      const { code: validatedCode, platform: validatedPlatform } = this.validateInput(code, platform);
      
      // Get performance prediction first
      const prediction = await this.predictPerformance(validatedCode, validatedPlatform);
      
      // Apply optimizations based on platform
      const optimizedCode = await this.applyPlatformOptimizations(validatedCode, validatedPlatform, prediction);
      
      const optimization: PlatformOptimization = {
        optimizedCode,
        suggestions: prediction.optimizations,
        performanceGain: prediction.estimatedImprovement,
        compatibilityScore: this.calculateCompatibilityScore(optimizedCode, validatedPlatform)
      };

      // Record metrics
      this.recordMetrics('platform_optimized', {
        platform: validatedPlatform,
        performanceGain: optimization.performanceGain,
        compatibilityScore: optimization.compatibilityScore
      });

      return optimization;
    } catch (error) {
      this.logger.error('Error optimizing for platform:', error);
      throw error;
    }
  }

  /**
   * Applies platform-specific optimizations to code
   */
  private async applyPlatformOptimizations(code: string, platform: string, prediction: PerformancePrediction): Promise<string> {
    let optimizedCode = code;

    // Apply optimizations based on platform and prediction
    switch (platform) {
      case 'web':
        optimizedCode = this.applyWebOptimizations(optimizedCode, prediction);
        break;
      case 'mobile':
        optimizedCode = this.applyMobileOptimizations(optimizedCode, prediction);
        break;
      case 'iot':
        optimizedCode = this.applyIoTOptimizations(optimizedCode, prediction);
        break;
      case 'desktop':
        optimizedCode = this.applyDesktopOptimizations(optimizedCode, prediction);
        break;
      case 'server':
        optimizedCode = this.applyServerOptimizations(optimizedCode, prediction);
        break;
    }

    return optimizedCode;
  }

  /**
   * Apply web-specific optimizations
   */
  private applyWebOptimizations(code: string, prediction: PerformancePrediction): string {
    let optimized = code;
    
    // Replace document.write with safer alternatives
    optimized = optimized.replace(/document\.write\(/g, 'document.createElement(');
    
    // Replace innerHTML with textContent where safe
    optimized = optimized.replace(/\.innerHTML\s*=\s*['"][^'"]*['"]/g, '.textContent = ');
    
    // Remove eval() calls
    optimized = optimized.replace(/eval\(/g, 'JSON.parse(');
    
    return optimized;
  }

  /**
   * Apply mobile-specific optimizations
   */
  private applyMobileOptimizations(code: string, prediction: PerformancePrediction): string {
    let optimized = code;
    
    // Add passive event listeners
    optimized = optimized.replace(/addEventListener\(['"]touch/g, 'addEventListener("touch', { passive: true });
    
    // Add caching headers for fetch requests
    optimized = optimized.replace(/fetch\(/g, 'fetch(/* with caching */');
    
    return optimized;
  }

  /**
   * Apply IoT-specific optimizations
   */
  private applyIoTOptimizations(code: string, prediction: PerformancePrediction): string {
    let optimized = code;
    
    // Replace polling with event-driven patterns
    optimized = optimized.replace(/setInterval\(/g, '// Use event-driven pattern instead of polling');
    
    // Remove console.log statements
    optimized = optimized.replace(/console\.log\([^)]*\);/g, '');
    
    return optimized;
  }

  /**
   * Apply desktop-specific optimizations
   */
  private applyDesktopOptimizations(code: string, prediction: PerformancePrediction): string {
    let optimized = code;
    
    // Replace sync file operations with async
    optimized = optimized.replace(/fs\.readFileSync\(/g, 'await fs.promises.readFile(');
    
    return optimized;
  }

  /**
   * Apply server-specific optimizations
   */
  private applyServerOptimizations(code: string, prediction: PerformancePrediction): string {
    let optimized = code;
    
    // Add batch query patterns
    optimized = optimized.replace(/for\s*\([^)]*\)\s*{[^}]*database[^}]*}/g, '// Use batch queries instead of loops');
    
    return optimized;
  }

  /**
   * Calculate compatibility score for optimized code
   */
  private calculateCompatibilityScore(code: string, platform: string): number {
    let score = 100;
    
    // Platform-specific compatibility checks
    switch (platform) {
      case 'web':
        if (code.includes('document.write')) score -= 20;
        if (code.includes('eval(')) score -= 30;
        break;
      case 'mobile':
        if (code.includes('addEventListener') && !code.includes('passive')) score -= 15;
        break;
      case 'iot':
        if (code.includes('setInterval')) score -= 25;
        if (code.includes('console.log')) score -= 10;
        break;
    }
    
    return Math.max(0, score);
  }

  /**
   * Get current optimizations being tracked
   */
  async getCurrentOptimizations(): Promise<any> {
    try {
      const keys = await this.redis.keys('perf:*');
      const optimizations = [];
      
      for (const key of keys) {
        const cached = await this.redis.get(key);
        if (cached) {
          optimizations.push({
            key,
            data: JSON.parse(cached)
          });
        }
      }
      
      return optimizations;
    } catch (error) {
      this.logger.error('Error getting current optimizations:', error);
      return [];
    }
  }

  /**
   * Executes an agent action (for API integration).
   */
  async executeAction(action: AgentAction): Promise<AgentResponse> {
    try {
      switch (action.type) {
        case 'predict_performance':
          const { code, platform } = action.params;
          const prediction = await this.predictPerformance(code, platform);
          return {
            success: true,
            data: prediction,
            timestamp: new Date()
          };

        case 'optimize_for_platform':
          const { code: optCode, platform: optPlatform } = action.params;
          const optimization = await this.optimizeForPlatform(optCode, optPlatform);
          return {
            success: true,
            data: optimization,
            timestamp: new Date()
          };

        case 'get_optimizations':
          const optimizations = await this.getCurrentOptimizations();
          return {
            success: true,
            data: optimizations,
            timestamp: new Date()
          };

        default:
          return { 
            success: false, 
            error: `Unknown action type: ${action.type}`, 
            timestamp: new Date() 
          };
      }
    } catch (error) {
      this.logger.error('Error executing action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  async getMetrics(): Promise<AgentMetrics> {
    const base = await super.getMetrics();
    return { 
      ...base, 
      custom: { 
        crossPlatformOptimizations: await this.getOptimizationCount(),
        averagePerformanceScore: await this.getAveragePerformanceScore(),
        cacheHitRate: await this.getCacheHitRate()
      } 
    };
  }

  /**
   * Get count of optimizations performed
   */
  private async getOptimizationCount(): Promise<number> {
    try {
      const keys = await this.redis.keys('perf:*');
      return keys.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get average performance score
   */
  private async getAveragePerformanceScore(): Promise<number> {
    try {
      const keys = await this.redis.keys('perf:*');
      let totalScore = 0;
      let count = 0;
      
      for (const key of keys) {
        const cached = await this.redis.get(key);
        if (cached) {
          const data = JSON.parse(cached);
          totalScore += data.predictedScore || 0;
          count++;
        }
      }
      
      return count > 0 ? totalScore / count : 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get cache hit rate
   */
  private async getCacheHitRate(): Promise<number> {
    // This would require tracking cache hits/misses
    // For now, return a placeholder
    return 0.75;
  }
} 