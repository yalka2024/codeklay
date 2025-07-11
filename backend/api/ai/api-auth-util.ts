const VALID_API_KEYS = [process.env.VECTOR_API_KEY || 'dev-key'];
const rateLimitStore: Record<string, { count: number; reset: number }> = {};

export function checkApiKey(req: Request): boolean {
  const apiKey = req.headers.get('x-api-key');
  return !!apiKey && VALID_API_KEYS.includes(apiKey);
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (!rateLimitStore[key] || rateLimitStore[key].reset < now) {
    rateLimitStore[key] = { count: 1, reset: now + windowMs };
    return true;
  }
  if (rateLimitStore[key].count < limit) {
    rateLimitStore[key].count++;
    return true;
  }
  return false;
} 