// Security utilities for CodePal platform
import { hash, compare } from 'bcryptjs';

// --- Brute Force Protection ---
const LOGIN_ATTEMPTS = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const RESET_WINDOW = 60 * 60 * 1000; // 1 hour

export function checkBruteForce(identifier: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now();
  const attempts = LOGIN_ATTEMPTS.get(identifier);
  
  if (!attempts) return { allowed: true };
  
  // Check if still blocked
  if (attempts.blockedUntil && now < attempts.blockedUntil) {
    return { 
      allowed: false, 
      remainingTime: Math.ceil((attempts.blockedUntil - now) / 1000) 
    };
  }
  
  // Reset if window has passed
  if (now - attempts.lastAttempt > RESET_WINDOW) {
    LOGIN_ATTEMPTS.delete(identifier);
    return { allowed: true };
  }
  
  return { allowed: attempts.count < MAX_LOGIN_ATTEMPTS };
}

export function recordLoginAttempt(identifier: string, success: boolean): void {
  const now = Date.now();
  const attempts = LOGIN_ATTEMPTS.get(identifier) || { count: 0, lastAttempt: 0 };
  
  if (success) {
    LOGIN_ATTEMPTS.delete(identifier);
    return;
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  
  // Block if max attempts reached
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.blockedUntil = now + BLOCK_DURATION;
  }
  
  LOGIN_ATTEMPTS.set(identifier, attempts);
}

// --- Password Policy ---
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { valid: errors.length === 0, errors };
}

// --- Audit Logging ---
export interface AuditLogEntry {
  timestamp: Date;
  userId?: string;
  action: string;
  resource?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
  success: boolean;
}

const AUDIT_LOGS: AuditLogEntry[] = [];

export function logAuditEvent(entry: Omit<AuditLogEntry, 'timestamp'>): void {
  const logEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date(),
  };
  
  AUDIT_LOGS.push(logEntry);
  
  // Keep only last 1000 entries in memory (for MVP)
  if (AUDIT_LOGS.length > 1000) {
    AUDIT_LOGS.splice(0, AUDIT_LOGS.length - 1000);
  }
  
  // In production, this would write to a database or external logging service
  console.log(`[AUDIT] ${logEntry.timestamp.toISOString()} - ${logEntry.action} - ${logEntry.success ? 'SUCCESS' : 'FAILED'}`);
}

export function getAuditLogs(filters?: {
  userId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): AuditLogEntry[] {
  let logs = [...AUDIT_LOGS];
  
  if (filters?.userId) {
    logs = logs.filter(log => log.userId === filters.userId);
  }
  
  if (filters?.action) {
    logs = logs.filter(log => log.action === filters.action);
  }
  
  if (filters?.startDate) {
    logs = logs.filter(log => log.timestamp >= filters.startDate!);
  }
  
  if (filters?.endDate) {
    logs = logs.filter(log => log.timestamp <= filters.endDate!);
  }
  
  if (filters?.limit) {
    logs = logs.slice(-filters.limit);
  }
  
  return logs;
}

// --- Session Management ---
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function validateSessionExpiry(createdAt: Date, maxAge: number = 24 * 60 * 60 * 1000): boolean {
  return Date.now() - createdAt.getTime() < maxAge;
}

// --- CSRF Protection ---
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}

// --- Input Sanitization ---
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// --- Security Headers Helper ---
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src * data:; connect-src *; font-src 'self' data:; frame-ancestors 'self';",
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
} 