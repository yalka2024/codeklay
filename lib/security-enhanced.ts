import { getSecurityHeaders } from './security';
import crypto from 'crypto';

export interface SecurityConfig {
  enableCSRF: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  rateLimitWindow: number;
  rateLimitMax: number;
}

export class SecurityManager {
  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  ];

  private static readonly SQL_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(;|\||&|\$|\*|'|"|`)/g,
    /(\b(OR|AND)\b.*=)/gi,
  ];

  static validateInput(input: string, type: 'email' | 'password' | 'text' | 'sql' = 'text'): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!input || typeof input !== 'string') {
      errors.push('Input is required and must be a string');
      return { isValid: false, errors };
    }

    if (input.length > 10000) {
      errors.push('Input exceeds maximum length');
    }

    if (this.XSS_PATTERNS.some(pattern => pattern.test(input))) {
      errors.push('Potential XSS attack detected');
    }

    if (type === 'sql' && this.SQL_PATTERNS.some(pattern => pattern.test(input))) {
      errors.push('Potential SQL injection detected');
    }

    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        errors.push('Invalid email format');
      }
    }

    if (type === 'password') {
      if (input.length < 8) {
        errors.push('Password must be at least 8 characters');
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(input)) {
        errors.push('Password must contain uppercase, lowercase, and number');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static validateCSRFToken(token: string, sessionToken: string): boolean {
    if (!token || !sessionToken) return false;
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken));
  }

  static getEnhancedSecurityHeaders(): Record<string, string> {
    return {
      ...getSecurityHeaders(),
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'X-DNS-Prefetch-Control': 'off',
      'Expect-CT': 'max-age=86400, enforce',
    };
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  static logSecurityEvent(event: string, details: any, request?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      ip: request?.ip || 'unknown',
      userAgent: request?.headers?.['user-agent'] || 'unknown',
      url: request?.url || 'unknown',
    };
    
    console.warn('SECURITY EVENT:', JSON.stringify(logEntry));
    
    if (typeof window === 'undefined') {
      try {
        const { captureMessage, setContext } = require('./sentry');
        setContext('securityEvent', logEntry);
        captureMessage(`Security Event: ${event}`, 'warning');
      } catch (sentryError) {
        console.warn('Failed to send security event to Sentry:', sentryError);
      }
    }
  }

  static generateSecureHeaders(): Record<string, string> {
    return this.getEnhancedSecurityHeaders();
  }
}

export const validateInput = SecurityManager.validateInput;
export const sanitizeInput = SecurityManager.sanitizeInput;
export const generateCSRFToken = SecurityManager.generateCSRFToken;
export const validateCSRFToken = SecurityManager.validateCSRFToken;
export const logSecurityEvent = SecurityManager.logSecurityEvent;
