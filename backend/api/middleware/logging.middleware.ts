import { NextRequest, NextResponse } from 'next/server';
import { captureException, captureMessage } from '@/lib/sentry';

export async function loggingMiddleware(request: NextRequest, next: (req: NextRequest) => Promise<Response>) {
  const start = Date.now();
  let response: Response;
  try {
    response = await next(request);
  } catch (error) {
    // Log error to console and Sentry
    console.error('API Error:', error);
    captureException(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  const duration = Date.now() - start;
  // Log request/response details
  const logDetails = {
    method: request.method,
    url: request.url,
    status: response.status,
    duration,
    ip: request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
  };
  console.log('[API]', JSON.stringify(logDetails));
  captureMessage(`[API] ${request.method} ${request.url} ${response.status} (${duration}ms)`, 'info');
  return response;
} 