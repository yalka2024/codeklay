import { NextRequest, NextResponse } from 'next/server'
import { ApiGatewayService } from '../../../backend/api/gateway/api-gateway.service'

const gatewayService = new ApiGatewayService(
  { get: (key: string) => process.env[key] } as any,
  { emit: () => {} } as any
)

export async function GET(request: NextRequest) {
  try {
    const health = await gatewayService.healthCheck()
    
    return NextResponse.json({
      status: health.status,
      timestamp: new Date().toISOString(),
      services: health.services,
      gateway: {
        version: '1.0.0',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
} 