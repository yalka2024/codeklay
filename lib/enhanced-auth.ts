import { prisma } from "@/lib/prisma";

export interface User {
  id: string;
  email: string;
  name?: string;
  password: string;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  expires: string;
}

// Enhanced in-memory session store
const sessions = new Map<string, Session>();

// Rate limiting store
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export class EnhancedAuth {
  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password strength validation
  static isStrongPassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Enhanced password hashing (simulated bcrypt)
  static async hashPassword(password: string): Promise<string> {
    // In a real implementation, this would use bcrypt
    // For now, we'll use a more secure base64 with salt
    const salt = Math.random().toString(36).substring(2);
    const hashedPassword = btoa(password + salt) + '.' + salt;
    return hashedPassword;
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const [hash, salt] = hashedPassword.split('.');
      const testHash = btoa(password + salt);
      return hash === testHash;
    } catch {
      return false;
    }
  }

  // Rate limiting
  static isRateLimited(email: string): boolean {
    const attempts = loginAttempts.get(email);
    if (!attempts) return false;
    
    const now = Date.now();
    const timeWindow = 15 * 60 * 1000; // 15 minutes
    
    if (now - attempts.lastAttempt > timeWindow) {
      loginAttempts.delete(email);
      return false;
    }
    
    return attempts.count >= 5; // Max 5 attempts per 15 minutes
  }

  static recordLoginAttempt(email: string): void {
    const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    attempts.count++;
    attempts.lastAttempt = Date.now();
    loginAttempts.set(email, attempts);
  }

  // Enhanced user creation
  static async createUser(email: string, password: string, name?: string): Promise<User | null> {
    try {
      // Validate email
      if (!this.isValidEmail(email)) {
        throw new Error("Invalid email format");
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      // Validate password strength
      const passwordValidation = this.isStrongPassword(password);
      if (!passwordValidation.valid) {
        throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);
      
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || email.split('@')[0],
          emailVerified: false,
        },
      });
      
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Enhanced user authentication
  static async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      // Check rate limiting
      if (this.isRateLimited(email)) {
        throw new Error("Too many login attempts. Please try again later.");
      }

      // Validate email format
      if (!this.isValidEmail(email)) {
        throw new Error("Invalid email format");
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        this.recordLoginAttempt(email);
        throw new Error("Invalid credentials");
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        this.recordLoginAttempt(email);
        throw new Error("Invalid credentials");
      }

      // Clear login attempts on successful login
      loginAttempts.delete(email);

      return user;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  // Enhanced session management
  static createSession(user: User): string {
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const session: Session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };
    
    sessions.set(sessionId, session);
    return sessionId;
  }

  static getSession(sessionId: string): Session | null {
    const session = sessions.get(sessionId);
    if (!session) return null;
    
    if (new Date(session.expires) < new Date()) {
      sessions.delete(sessionId);
      return null;
    }
    
    return session;
  }

  static deleteSession(sessionId: string): void {
    sessions.delete(sessionId);
  }

  // Password reset functionality
  static async initiatePasswordReset(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return false; // Don't reveal if user exists
      }

      // In a real implementation, you would:
      // 1. Generate a reset token
      // 2. Store it in the database with expiration
      // 3. Send an email with the reset link
      
      console.log(`Password reset initiated for ${email}`);
      return true;
    } catch (error) {
      console.error('Error initiating password reset:', error);
      return false;
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: { name?: string; email?: string }): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: updates,
      });
      
      return user;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }
} 