import Redis from 'ioredis';
import { createHash } from 'crypto';

// Circuit Template Interface
export interface CircuitTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  language: 'qiskit' | 'cirq' | 'qsharp';
  qubits: number;
  depth: number;
  gates: number;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  averageExecutionTime?: number;
  successRate?: number;
}

// Optimized Circuit Interface
export interface OptimizedCircuit {
  originalCircuit: CircuitTemplate;
  optimizedCode: string;
  optimizationType: 'depth' | 'gates' | 'cost' | 'accuracy';
  improvements: {
    depthReduction: number;
    gateReduction: number;
    costReduction: number;
    accuracyImprovement: number;
  };
  optimizationParams: Record<string, any>;
  createdAt: Date;
}

// Cache Configuration
export interface QuantumCacheConfig {
  redisUrl: string;
  ttl: number; // Time to live in seconds
  maxSize: number; // Maximum number of cached items
  enableCompression: boolean;
  enableMetrics: boolean;
}

// Cache Metrics
export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
  averageResponseTime: number;
  cacheSize: number;
  evictions: number;
}

// Quantum Cache Service
export class QuantumCache {
  private redis: Redis;
  private config: QuantumCacheConfig;
  private metrics: {
    hits: number;
    misses: number;
    totalRequests: number;
    responseTimes: number[];
    evictions: number;
  };

  constructor(config: QuantumCacheConfig) {
    this.config = config;
    this.redis = new Redis(config.redisUrl);
    this.metrics = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      responseTimes: [],
      evictions: 0
    };

    this.initializeCache();
  }

  /**
   * Initialize cache with default settings
   */
  private async initializeCache(): Promise<void> {
    try {
      // Set cache configuration
      await this.redis.config('SET', 'maxmemory-policy', 'allkeys-lru');
      await this.redis.config('SET', 'maxmemory', `${this.config.maxSize * 1024 * 1024}`); // MB
      
      console.log('Quantum cache initialized successfully');
    } catch (error) {
      console.error('Failed to initialize quantum cache:', error);
      throw error;
    }
  }

  /**
   * Cache circuit template
   */
  async cacheCircuitTemplate(template: CircuitTemplate): Promise<void> {
    const startTime = Date.now();
    
    try {
      const key = this.generateCacheKey('template', template.id);
      const value = this.config.enableCompression ? 
        this.compressData(template) : 
        JSON.stringify(template);

      await this.redis.setex(key, this.config.ttl, value);
      
      // Update metrics
      this.recordResponseTime(Date.now() - startTime);
      
      console.log(`Cached circuit template: ${template.name}`);
    } catch (error) {
      console.error('Failed to cache circuit template:', error);
      throw error;
    }
  }

  /**
   * Get cached circuit template
   */
  async getCircuitTemplate(templateId: string): Promise<CircuitTemplate | null> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    try {
      const key = this.generateCacheKey('template', templateId);
      const value = await this.redis.get(key);

      if (value) {
        this.metrics.hits++;
        const template = this.config.enableCompression ? 
          this.decompressData(value) : 
          JSON.parse(value);
        
        this.recordResponseTime(Date.now() - startTime);
        return template;
      } else {
        this.metrics.misses++;
        this.recordResponseTime(Date.now() - startTime);
        return null;
      }
    } catch (error) {
      console.error('Failed to get cached circuit template:', error);
      this.metrics.misses++;
      return null;
    }
  }

  /**
   * Get optimized circuit from cache
   */
  async getOptimizedCircuit(circuit: CircuitTemplate): Promise<OptimizedCircuit | null> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    try {
      const circuitHash = this.generateCircuitHash(circuit);
      const key = this.generateCacheKey('optimized', circuitHash);
      const value = await this.redis.get(key);

      if (value) {
        this.metrics.hits++;
        const optimizedCircuit = this.config.enableCompression ? 
          this.decompressData(value) : 
          JSON.parse(value);
        
        this.recordResponseTime(Date.now() - startTime);
        return optimizedCircuit;
      } else {
        this.metrics.misses++;
        this.recordResponseTime(Date.now() - startTime);
        return null;
      }
    } catch (error) {
      console.error('Failed to get optimized circuit:', error);
      this.metrics.misses++;
      return null;
    }
  }

  /**
   * Cache optimized circuit
   */
  async cacheOptimizedCircuit(optimizedCircuit: OptimizedCircuit): Promise<void> {
    const startTime = Date.now();
    
    try {
      const circuitHash = this.generateCircuitHash(optimizedCircuit.originalCircuit);
      const key = this.generateCacheKey('optimized', circuitHash);
      const value = this.config.enableCompression ? 
        this.compressData(optimizedCircuit) : 
        JSON.stringify(optimizedCircuit);

      await this.redis.setex(key, this.config.ttl, value);
      
      this.recordResponseTime(Date.now() - startTime);
      console.log(`Cached optimized circuit: ${optimizedCircuit.originalCircuit.name}`);
    } catch (error) {
      console.error('Failed to cache optimized circuit:', error);
      throw error;
    }
  }

  /**
   * Search cached templates by tags
   */
  async searchTemplatesByTags(tags: string[]): Promise<CircuitTemplate[]> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    try {
      const pattern = this.generateCacheKey('template', '*');
      const keys = await this.redis.keys(pattern);
      const templates: CircuitTemplate[] = [];

      for (const key of keys) {
        const value = await this.redis.get(key);
        if (value) {
          const template = this.config.enableCompression ? 
            this.decompressData(value) : 
            JSON.parse(value);
          
          // Check if template has any of the requested tags
          const hasMatchingTag = tags.some(tag => template.tags.includes(tag));
          if (hasMatchingTag) {
            templates.push(template);
          }
        }
      }

      this.metrics.hits++;
      this.recordResponseTime(Date.now() - startTime);
      return templates;
    } catch (error) {
      console.error('Failed to search templates by tags:', error);
      this.metrics.misses++;
      return [];
    }
  }

  /**
   * Get popular templates (most used)
   */
  async getPopularTemplates(limit: number = 10): Promise<CircuitTemplate[]> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    try {
      const pattern = this.generateCacheKey('template', '*');
      const keys = await this.redis.keys(pattern);
      const templates: CircuitTemplate[] = [];

      for (const key of keys) {
        const value = await this.redis.get(key);
        if (value) {
          const template = this.config.enableCompression ? 
            this.decompressData(value) : 
            JSON.parse(value);
          templates.push(template);
        }
      }

      // Sort by usage count and return top templates
      const popularTemplates = templates
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, limit);

      this.metrics.hits++;
      this.recordResponseTime(Date.now() - startTime);
      return popularTemplates;
    } catch (error) {
      console.error('Failed to get popular templates:', error);
      this.metrics.misses++;
      return [];
    }
  }

  /**
   * Update template usage statistics
   */
  async updateTemplateUsage(templateId: string, executionTime: number, success: boolean): Promise<void> {
    try {
      const template = await this.getCircuitTemplate(templateId);
      if (template) {
        template.usageCount++;
        template.averageExecutionTime = this.calculateAverageExecutionTime(
          template.averageExecutionTime || 0,
          executionTime,
          template.usageCount
        );
        
        if (template.successRate !== undefined) {
          template.successRate = this.calculateSuccessRate(
            template.successRate,
            success,
            template.usageCount
          );
        } else {
          template.successRate = success ? 1.0 : 0.0;
        }

        template.updatedAt = new Date();
        await this.cacheCircuitTemplate(template);
      }
    } catch (error) {
      console.error('Failed to update template usage:', error);
    }
  }

  /**
   * Invalidate cache entry
   */
  async invalidateCache(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      console.log(`Invalidated cache key: ${key}`);
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
      throw error;
    }
  }

  /**
   * Clear entire cache
   */
  async clearCache(): Promise<void> {
    try {
      await this.redis.flushall();
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }

  /**
   * Get cache metrics
   */
  getCacheMetrics(): CacheMetrics {
    const hitRate = this.metrics.totalRequests > 0 ? 
      this.metrics.hits / this.metrics.totalRequests : 0;
    
    const averageResponseTime = this.metrics.responseTimes.length > 0 ? 
      this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length : 0;

    return {
      hits: this.metrics.hits,
      misses: this.metrics.misses,
      hitRate,
      totalRequests: this.metrics.totalRequests,
      averageResponseTime,
      cacheSize: this.metrics.responseTimes.length,
      evictions: this.metrics.evictions
    };
  }

  /**
   * Export cache metrics to file
   */
  exportMetrics(filename: string): void {
    const metrics = this.getCacheMetrics();
    const fs = require('fs');
    fs.writeFileSync(filename, JSON.stringify(metrics, null, 2));
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(type: string, id: string): string {
    return `quantum:${type}:${id}`;
  }

  /**
   * Generate circuit hash for optimization caching
   */
  private generateCircuitHash(circuit: CircuitTemplate): string {
    const circuitData = {
      code: circuit.code,
      qubits: circuit.qubits,
      depth: circuit.depth,
      gates: circuit.gates
    };
    
    return createHash('sha256')
      .update(JSON.stringify(circuitData))
      .digest('hex');
  }

  /**
   * Compress data for storage
   */
  private compressData(data: any): string {
    // Simple compression using JSON stringification
    // In production, you might want to use a proper compression library
    return JSON.stringify(data);
  }

  /**
   * Decompress data from storage
   */
  private decompressData(data: string): any {
    // Simple decompression
    // In production, you might want to use a proper compression library
    return JSON.parse(data);
  }

  /**
   * Record response time for metrics
   */
  private recordResponseTime(responseTime: number): void {
    this.metrics.responseTimes.push(responseTime);
    
    // Keep only last 1000 response times for memory efficiency
    if (this.metrics.responseTimes.length > 1000) {
      this.metrics.responseTimes = this.metrics.responseTimes.slice(-1000);
    }
  }

  /**
   * Calculate average execution time
   */
  private calculateAverageExecutionTime(currentAvg: number, newTime: number, count: number): number {
    return (currentAvg * (count - 1) + newTime) / count;
  }

  /**
   * Calculate success rate
   */
  private calculateSuccessRate(currentRate: number, success: boolean, count: number): number {
    const currentSuccesses = currentRate * (count - 1);
    const newSuccesses = currentSuccesses + (success ? 1 : 0);
    return newSuccesses / count;
  }

  /**
   * Close Redis connection
   */
  async close(): Promise<void> {
    try {
      await this.redis.quit();
      console.log('Redis connection closed');
    } catch (error) {
      console.error('Failed to close Redis connection:', error);
    }
  }
}

// Cache Manager for multiple cache instances
export class QuantumCacheManager {
  private caches: Map<string, QuantumCache> = new Map();

  /**
   * Create or get cache instance
   */
  getCache(name: string, config: QuantumCacheConfig): QuantumCache {
    if (!this.caches.has(name)) {
      const cache = new QuantumCache(config);
      this.caches.set(name, cache);
    }
    return this.caches.get(name)!;
  }

  /**
   * Close all cache connections
   */
  async closeAll(): Promise<void> {
    const closePromises = Array.from(this.caches.values()).map(cache => cache.close());
    await Promise.all(closePromises);
    this.caches.clear();
  }

  /**
   * Get all cache metrics
   */
  getAllMetrics(): Record<string, CacheMetrics> {
    const metrics: Record<string, CacheMetrics> = {};
    for (const [name, cache] of this.caches.entries()) {
      metrics[name] = cache.getCacheMetrics();
    }
    return metrics;
  }
}

// Predefined circuit templates for caching
export const PREDEFINED_TEMPLATES: CircuitTemplate[] = [
  {
    id: 'bell-state-2q',
    name: 'Bell State (2 Qubits)',
    description: 'Creates a Bell state between two qubits',
    code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure_all()`,
    language: 'qiskit',
    qubits: 2,
    depth: 3,
    gates: 3,
    tags: ['bell-state', 'entanglement', 'basic'],
    metadata: {
      category: 'basic',
      difficulty: 'beginner'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    usageCount: 0
  },
  {
    id: 'grover-3q',
    name: 'Grover Algorithm (3 Qubits)',
    description: 'Grover search algorithm for 3 qubits',
    code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(3, 3)
qc.h([0, 1, 2])
qc.x([0, 1, 2])
qc.h(2)
qc.ccx(0, 1, 2)
qc.h(2)
qc.x([0, 1, 2])
qc.h([0, 1, 2])
qc.measure_all()`,
    language: 'qiskit',
    qubits: 3,
    depth: 8,
    gates: 12,
    tags: ['grover', 'search', 'algorithm'],
    metadata: {
      category: 'algorithm',
      difficulty: 'intermediate'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    usageCount: 0
  },
  {
    id: 'quantum-teleportation',
    name: 'Quantum Teleportation',
    description: 'Quantum teleportation protocol',
    code: `from qiskit import QuantumCircuit
qc = QuantumCircuit(3, 3)
qc.h(1)
qc.cx(1, 2)
qc.cx(0, 1)
qc.h(0)
qc.measure([0, 1], [0, 1])
qc.cx(1, 2)
qc.cz(0, 2)
qc.measure(2, 2)`,
    language: 'qiskit',
    qubits: 3,
    depth: 7,
    gates: 8,
    tags: ['teleportation', 'protocol', 'advanced'],
    metadata: {
      category: 'protocol',
      difficulty: 'advanced'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    usageCount: 0
  }
]; 