import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { gatewayMiddleware } from './backend/api/gateway/gateway.middleware';

// --- In-memory rate limiter (fallback) ---
const RATE_LIMIT = 60; // requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const ipRequests = new Map();

function rateLimit(req: any) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const now = Date.now();
  if (!ipRequests.has(ip)) ipRequests.set(ip, []);
  const timestamps = ipRequests.get(ip).filter((ts: number) => now - ts < RATE_LIMIT_WINDOW);
  if (timestamps.length >= RATE_LIMIT) return false;
  timestamps.push(now);
  ipRequests.set(ip, timestamps);
  return true;
}

function setSecurityHeaders(res: any) {
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data:; frame-ancestors 'none';");
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  return res;
}

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'admin';
    const isAuthenticated = !!token;

    // --- Use API Gateway for all /api routes ---
    if (req.nextUrl.pathname.startsWith('/api')) {
      try {
        const gatewayResponse = await gatewayMiddleware(req);
        return setSecurityHeaders(gatewayResponse);
      } catch (error) {
        console.error('Gateway error:', error);
        const res = NextResponse.json({ error: 'Gateway error' }, { status: 500 });
        return setSecurityHeaders(res);
      }
    }

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
      const res = NextResponse.redirect(new URL('/auth/error?error=AccessDenied', req.url));
      return setSecurityHeaders(res);
    }

    // Set security headers for all responses
    const res = NextResponse.next();
    return setSecurityHeaders(res);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/api/plugins/:path*',
    '/api/vector-search/:path*',
    '/api/auth/register',
  ],
};  