import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { VectorSearchService } from '../../../backend/api/ai/vector-search.service';
import { authOptions } from '../auth/[...nextauth]';
import { trackEvent } from '@/lib/analytics';

const prisma = new PrismaClient();
const vectorService = new VectorSearchService(); // In production, use DI

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
};

async function authenticateRequest(req: NextRequest) {
  // Check for API key in headers
  const apiKey = req.headers.get('x-api-key');
  if (apiKey) {
    const keyRecord = await prisma.aPIKey.findUnique({
      where: { key: apiKey },
      include: { user: true },
    });
    if (keyRecord) {
      return { user: keyRecord.user, method: 'api-key' };
    }
  }

  // Check for session authentication
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const user = session.user as SessionUser;
    if (user.id) {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (dbUser) {
        return { user: dbUser, method: 'session' };
      }
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { embedding, k } = await req.json();
    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json({ error: 'Missing embedding' }, { status: 400 });
    }

    // Log the search for analytics (if using API key)
    if (auth.method === 'api-key') {
      console.log(`API search by user ${auth.user.id}: ${embedding.length} dimensions`);
    }

    // Track vector search for analytics
    trackEvent({
      userId: auth.user.id,
      event: 'vector_search',
      category: 'api',
      metadata: {
        embeddingDimensions: embedding.length,
        resultsCount: k || 5,
        method: auth.method,
      },
    });

    const results = vectorService.query(embedding, k || 5);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Vector search error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 