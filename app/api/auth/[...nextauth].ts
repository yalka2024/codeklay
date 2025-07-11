import NextAuth, { NextAuthOptions, Session, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { compare } from 'bcryptjs';
import { checkBruteForce, recordLoginAttempt, logAuditEvent, sanitizeEmail } from '@/lib/security';

const prisma = new PrismaClient();

type UserWithPassword = PrismaUser & { hashedPassword: string };

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
  subscription_tier?: string;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          logAuditEvent({
            action: 'LOGIN_ATTEMPT',
            resource: 'auth',
            ip: req.headers?.['x-forwarded-for'] as string || req.headers?.['x-real-ip'] as string,
            userAgent: req.headers?.['user-agent'] as string,
            details: { email: credentials?.email, reason: 'Missing credentials' },
            success: false,
          });
          return null;
        }

        const sanitizedEmail = sanitizeEmail(credentials.email);
        
        // Check brute force protection
        const bruteForceCheck = checkBruteForce(sanitizedEmail);
        if (!bruteForceCheck.allowed) {
          logAuditEvent({
            action: 'LOGIN_BLOCKED',
            resource: 'auth',
            ip: req.headers?.['x-forwarded-for'] as string || req.headers?.['x-real-ip'] as string,
            userAgent: req.headers?.['user-agent'] as string,
            details: { 
              email: sanitizedEmail, 
              reason: 'Brute force protection',
              remainingTime: bruteForceCheck.remainingTime 
            },
            success: false,
          });
          throw new Error(`Too many login attempts. Please try again in ${bruteForceCheck.remainingTime} seconds.`);
        }

        try {
          const user = await prisma.user.findUnique({ 
            where: { email: sanitizedEmail } 
          }) as UserWithPassword | null;
          
          if (!user || !user.hashedPassword) {
            recordLoginAttempt(sanitizedEmail, false);
            logAuditEvent({
              action: 'LOGIN_ATTEMPT',
              resource: 'auth',
              ip: req.headers?.['x-forwarded-for'] as string || req.headers?.['x-real-ip'] as string,
              userAgent: req.headers?.['user-agent'] as string,
              details: { email: sanitizedEmail, reason: 'User not found or no password' },
              success: false,
            });
            return null;
          }

          const valid = await compare(credentials.password, user.hashedPassword);
          
          if (!valid) {
            recordLoginAttempt(sanitizedEmail, false);
            logAuditEvent({
              action: 'LOGIN_ATTEMPT',
              resource: 'auth',
              ip: req.headers?.['x-forwarded-for'] as string || req.headers?.['x-real-ip'] as string,
              userAgent: req.headers?.['user-agent'] as string,
              details: { email: sanitizedEmail, reason: 'Invalid password' },
              success: false,
            });
            return null;
          }

          // Successful login
          recordLoginAttempt(sanitizedEmail, true);
          logAuditEvent({
            userId: user.id,
            action: 'LOGIN_SUCCESS',
            resource: 'auth',
            ip: req.headers?.['x-forwarded-for'] as string || req.headers?.['x-real-ip'] as string,
            userAgent: req.headers?.['user-agent'] as string,
            details: { email: sanitizedEmail, userId: user.id },
            success: true,
          });

          return user;
        } catch (error) {
          recordLoginAttempt(sanitizedEmail, false);
          logAuditEvent({
            action: 'LOGIN_ERROR',
            resource: 'auth',
            ip: req.headers?.['x-forwarded-for'] as string || req.headers?.['x-real-ip'] as string,
            userAgent: req.headers?.['user-agent'] as string,
            details: { email: sanitizedEmail, error: error instanceof Error ? error.message : 'Unknown error' },
            success: false,
          });
          throw error;
        }
      },
    }),
    // Uncomment to enable GitHub OAuth
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async session({ session, token, user }: { session: Session; token: any; user?: NextAuthUser }) {
      if (session.user) {
        (session.user as SessionUser).id = token.sub;
        (session.user as SessionUser).role = token.role;
        (session.user as SessionUser).subscription_tier = token.subscription_tier;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user?: NextAuthUser }) {
      if (user) {
        token.role = (user as any).role;
        token.subscription_tier = (user as any).subscriptionTier;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };    