import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]';
import { trackEvent } from '@/lib/analytics';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await prisma.aPIKey.findMany({
      where: { userId: user.id },
      select: { id: true, key: true, createdAt: true },
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate a secure API key
    const apiKey = `cp_${crypto.randomBytes(32).toString('hex')}`;

    const newKey = await prisma.aPIKey.create({
      data: {
        key: apiKey,
        userId: user.id,
      },
      select: { id: true, key: true, createdAt: true },
    });

    // Track API key generation
    trackEvent({
      userId: user.id,
      event: 'api_key_generated',
      category: 'user',
      metadata: {
        keyId: newKey.id,
        keyPrefix: apiKey.substring(0, 8),
      },
    });

    return NextResponse.json({ apiKey: newKey }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'API key ID required' }, { status: 400 });
    }

    // Ensure user owns this API key
    const apiKey = await prisma.aPIKey.findFirst({
      where: { id, userId: user.id },
    });

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    await prisma.aPIKey.delete({ where: { id } });
    
    // Track API key revocation
    trackEvent({
      userId: user.id,
      event: 'api_key_revoked',
      category: 'user',
      metadata: {
        keyId: id,
        keyPrefix: apiKey.key.substring(0, 8),
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 