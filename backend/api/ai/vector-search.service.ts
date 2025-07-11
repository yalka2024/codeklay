import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

@Injectable()
export class VectorSearchService {
  private documents: VectorDocument[] = [];

  // Simple cosine similarity
  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
    const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
    return dot / (normA * normB);
  }

  // Add or update a document
  upsert(doc: Omit<VectorDocument, 'id'> & { id?: string }): string {
    const id = doc.id || crypto.randomUUID();
    const existing = this.documents.find(d => d.id === id);
    if (existing) {
      existing.content = doc.content;
      existing.embedding = doc.embedding;
      existing.metadata = doc.metadata;
    } else {
      this.documents.push({ ...doc, id });
    }
    return id;
  }

  // Remove a document
  remove(id: string) {
    this.documents = this.documents.filter(d => d.id !== id);
  }

  // Query top-k most similar documents
  query(embedding: number[], k: number = 5): VectorDocument[] {
    return this.documents
      .map(doc => ({ ...doc, score: this.cosineSimilarity(doc.embedding, embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }

  // List all documents (for debugging)
  list(): VectorDocument[] {
    return this.documents;
  }
} 