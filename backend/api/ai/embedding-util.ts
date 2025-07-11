import fetch from 'node-fetch';

const OPENAI_API_KEY = process.env.OPENAI_SECRET_KEY;
const EMBEDDING_MODEL = 'text-embedding-3-small';

export async function getEmbedding(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) throw new Error('Missing OpenAI API key');
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });
  if (!response.ok) {
    throw new Error(`OpenAI Embedding API error: ${await response.text()}`);
  }
  const data = await response.json();
  return data.data[0].embedding;
} 