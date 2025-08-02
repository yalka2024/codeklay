import { NextRequest, NextResponse } from 'next/server'
import { ApiGatewayService } from './api-gateway.service'
import { loggingMiddleware } from '../middleware/logging.middleware';

// Initialize the gateway service
const gatewayService = new ApiGatewayService(
  { get: (key: string) => process.env[key] } as any,
  { emit: () => {} } as any
)

export async function gatewayMiddleware(request: NextRequest) {
  // Only process API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Wrap the gateway logic with logging middleware
  return loggingMiddleware(request, async (req) => {
    try {
      // Convert NextRequest to Express-like request for gateway
      const expressReq = {
        method: req.method,
        path: req.nextUrl.pathname,
        headers: Object.fromEntries(req.headers.entries()),
        body: req.method !== 'GET' ? await req.json().catch(() => undefined) : undefined,
        query: Object.fromEntries(req.nextUrl.searchParams.entries()),
        ip: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown',
        connection: { remoteAddress: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown' },
        get: (name: string) => req.headers.get(name),
      } as any;

      // Process request through gateway
      const gatewayResponse = await gatewayService.processRequest(expressReq, {} as any);

      // Convert gateway response to NextResponse
      const response = NextResponse.json(gatewayResponse.body, {
        status: gatewayResponse.status,
        headers: gatewayResponse.headers,
      });

      // Add gateway headers
      response.headers.set('X-Gateway-Execution-Time', gatewayResponse.executionTime.toString());
      response.headers.set('X-Gateway-Cache', gatewayResponse.headers['X-Cache'] || 'MISS');

      return response;
    } catch (error) {
      console.error('Gateway middleware error:', error);
      return NextResponse.json(
        { error: 'Gateway error', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  });
}

// Export for use in middleware.ts
export { gatewayMiddleware as default } 