import { performance } from 'perf_hooks';

export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  static measureFunction<T>(fn: () => T, name: string): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.recordMetric(name, duration);
    
    if (typeof window !== 'undefined') {
      navigator.sendBeacon('/api/metrics', JSON.stringify({
        name,
        duration,
        timestamp: Date.now(),
        type: 'function_execution',
      }));
    }
    
    return result;
  }

  static async measureAsyncFunction<T>(fn: () => Promise<T>, name: string): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      
      if (typeof window !== 'undefined') {
        navigator.sendBeacon('/api/metrics', JSON.stringify({
          name,
          duration,
          timestamp: Date.now(),
          type: 'async_function_execution',
          status: 'success',
        }));
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`${name}_error`, duration);
      
      if (typeof window !== 'undefined') {
        navigator.sendBeacon('/api/metrics', JSON.stringify({
          name,
          duration,
          timestamp: Date.now(),
          type: 'async_function_execution',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
      
      throw error;
    }
  }

  static recordCustomMetric(name: string, value: number, tags: Record<string, string> = {}) {
    this.recordMetric(name, value);
    
    if (typeof window !== 'undefined') {
      navigator.sendBeacon('/api/metrics', JSON.stringify({
        name,
        value,
        timestamp: Date.now(),
        type: 'custom_metric',
        tags,
      }));
    }
  }

  static recordPageLoad(pageName: string, loadTime: number) {
    this.recordMetric(`page_load_${pageName}`, loadTime);
    
    if (typeof window !== 'undefined') {
      navigator.sendBeacon('/api/metrics', JSON.stringify({
        name: `page_load_${pageName}`,
        duration: loadTime,
        timestamp: Date.now(),
        type: 'page_load',
        url: window.location.pathname,
      }));
    }
  }

  static getMetrics(): Record<string, { avg: number; count: number; min: number; max: number }> {
    const result: Record<string, { avg: number; count: number; min: number; max: number }> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      const sum = values.reduce((a, b) => a + b, 0);
      result[name] = {
        avg: sum / values.length,
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
      };
    }
    
    return result;
  }

  private static recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    if (values.length > 100) {
      values.shift();
    }
  }
}

export const measurePerformance = (name: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      return PerformanceMonitor.measureFunction(() => originalMethod.apply(this, args), `${target.constructor.name}.${propertyKey}`);
    };
    return descriptor;
  };
};

export const measureAsyncPerformance = (name: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      return PerformanceMonitor.measureAsyncFunction(() => originalMethod.apply(this, args), `${target.constructor.name}.${propertyKey}`);
    };
    return descriptor;
  };
};
