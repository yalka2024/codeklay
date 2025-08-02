import * as crypto from 'crypto'

const csrfTokens = new Map<string, { token: string; expires: number }>()

export function generateCSRFToken(sessionId: string): string {
  const token = crypto.randomBytes(32).toString('hex')
  const expires = Date.now() + 3600000
  
  csrfTokens.set(sessionId, { token, expires })
  
  return token
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId)
  
  if (!stored) return false
  
  if (Date.now() > stored.expires) {
    csrfTokens.delete(sessionId)
    return false
  }
  
  return stored.token === token
}

export function cleanupExpiredTokens(): void {
  const now = Date.now()
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now > data.expires) {
      csrfTokens.delete(sessionId)
    }
  }
}

setInterval(cleanupExpiredTokens, 300000)
