import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Mock: return 50 credits for free tier
  return NextResponse.json({ credits: 50 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { code } = await req.json();
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }
  // Mock: accept any code and add 10 credits
  return NextResponse.json({ success: true, creditsAdded: 10 });
} 