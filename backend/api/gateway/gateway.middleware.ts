import { NextRequest, NextResponse } from 'next/server'
import { ApiGatewayService } from './api-gateway.service'

// Initialize the gateway service
const gatewayService = new ApiGatewayService(
  { get: (key: string) => process.env[key] } as any,
  { emit: () => {} } as any
)

export async function gatewayMiddleware(request: NextRequest) {
  // Only process API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  try {
    // Convert NextRequest to Express-like request for gateway
    const expressReq = {
      method: request.method,
      path: request.nextUrl.pathname,
      headers: Object.fromEntries(request.headers.entries()),
      body: request.method !== 'GET' ? await request.json().catch(() => undefined) : undefined,
      query: Object.fromEntries(request.nextUrl.searchParams.entries()),
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      connection: { remoteAddress: request.ip || 'unknown' },
      get: (name: string) => request.headers.get(name),
    } as any

    // Process request through gateway
    const gatewayResponse = await gatewayService.processRequest(expressReq, {} as any)

    // Convert gateway response to NextResponse
    const response = NextResponse.json(gatewayResponse.body, {
      status: gatewayResponse.status,
      headers: gatewayResponse.headers,
    })

    // Add gateway headers
    response.headers.set('X-Gateway-Execution-Time', gatewayResponse.executionTime.toString())
    response.headers.set('X-Gateway-Cache', gatewayResponse.headers['X-Cache'] || 'MISS')

    return response
  } catch (error) {
    console.error('Gateway middleware error:', error)
    return NextResponse.json(
      { error: 'Gateway error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Export for use in middleware.ts
export { gatewayMiddleware as default } 