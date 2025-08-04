import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'CodeKlay',
    version: '1.0.0',
    features: {
      server: 'running',
      database: 'configured',
      authentication: 'ready',
      api: 'operational'
    }
  });
}
