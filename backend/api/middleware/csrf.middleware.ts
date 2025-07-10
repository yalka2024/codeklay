import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { generateCSRFToken, validateCSRFToken } from '../../../lib/csrf'

@Injectable()
export class CSRFMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method
    const sessionId = req.session?.id || req.headers['x-session-id'] as string
    
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      if (sessionId) {
        const token = generateCSRFToken(sessionId)
        res.setHeader('X-CSRF-Token', token)
      }
      return next()
    }
    
    if (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH') {
      const token = req.headers['x-csrf-token'] as string
      
      if (!sessionId || !token) {
        throw new ForbiddenException('CSRF token required')
      }
      
      if (!validateCSRFToken(sessionId, token)) {
        throw new ForbiddenException('Invalid CSRF token')
      }
    }
    
    next()
  }
}
