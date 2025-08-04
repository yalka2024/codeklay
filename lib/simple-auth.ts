import { prisma } from "@/lib/prisma";

export interface User {
  id: string;
  email: string;
  name?: string;
  password: string;
}

export interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  expires: string;
}

// Simple in-memory session store (for development)
const sessions = new Map<string, Session>();

export class SimpleAuth {
  static async createUser(email: string, password: string, name?: string): Promise<User | null> {
    try {
      // Simple password hashing (in production, use bcrypt)
      const hashedPassword = btoa(password); // Base64 encoding for demo
      
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || email.split('@')[0],
        },
      });
      
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  static async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return null;
      }

      // Simple password verification (in production, use bcrypt)
      const hashedPassword = btoa(password);
      if (user.password !== hashedPassword) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  }

  static createSession(user: User): string {
    const sessionId = Math.random().toString(36).substring(2);
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
} 