import { NextRequest, NextResponse } from 'next/server';
import { VectorSearchService } from '../../../backend/api/ai/vector-search.service';
import { getEmbedding } from '../../../backend/api/ai/embedding-util';
import { checkApiKey, rateLimit } from '../../../backend/api/ai/api-auth-util';

const vectorService = new VectorSearchService(); // In production, use DI

export async function POST(req: NextRequest) {
  if (!checkApiKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const apiKey = req.headers.get('x-api-key') as string;
  if (!rateLimit(apiKey, 100, 60 * 1000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  try {
    const { content, embedding, metadata } = await req.json();
    if (!content && !embedding) {
      return NextResponse.json({ error: 'Missing content or embedding' }, { status: 400 });
    }
    let finalEmbedding = embedding;
    if (!finalEmbedding && content) {
      finalEmbedding = await getEmbedding(content);
    }
    if (!finalEmbedding) {
      return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 500 });
    }
    const id = vectorService.upsert({ content, embedding: finalEmbedding, metadata });
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 