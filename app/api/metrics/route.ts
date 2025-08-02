import { NextRequest, NextResponse } from 'next/server';
import { PerformanceMonitor } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const metrics = await request.json();
    
    console.log('Performance metrics received:', metrics);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing metrics:', error);
    return NextResponse.json({ error: 'Failed to process metrics' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const metrics = PerformanceMonitor.getMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error retrieving metrics:', error);
    return NextResponse.json({ error: 'Failed to retrieve metrics' }, { status: 500 });
  }
}
