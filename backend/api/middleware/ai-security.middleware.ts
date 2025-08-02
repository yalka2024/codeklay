import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { sanitizeInput } from '../../../lib/validation'

@Injectable()
export class AiSecurityMiddleware implements NestMiddleware {
  private readonly maxPromptLength = 10000
  private readonly rateLimitWindow = 60 * 1000 // 1 minute
  private readonly maxRequestsPerWindow = 20
  private readonly userRequests = new Map<string, number[]>()

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.includes('/ai') && req.method === 'POST') {
      this.validateAiRequest(req)
    }
    next()
  }

  private validateAiRequest(req: Request): void {
    const userId = req.headers['x-user-id'] as string || 'anonymous'
    
    this.checkRateLimit(userId)
    
    if (req.body.prompt) {
      req.body.prompt = this.sanitizePrompt(req.body.prompt)
      this.validatePromptSafety(req.body.prompt)
    }

    if (req.body.context) {
      req.body.context = this.sanitizePrompt(req.body.context)
    }

    if (req.body.fileContent) {
      this.validateFileContent(req.body.fileContent)
    }
  }

  private checkRateLimit(userId: string): void {
    const now = Date.now()
    const userRequestTimes = this.userRequests.get(userId) || []
    
    const recentRequests = userRequestTimes.filter(time => now - time < this.rateLimitWindow)
    
    if (recentRequests.length >= this.maxRequestsPerWindow) {
      throw new BadRequestException('AI request rate limit exceeded. Please try again later.')
    }
    
    recentRequests.push(now)
    this.userRequests.set(userId, recentRequests)
  }

  private sanitizePrompt(prompt: string): string {
    if (!prompt || typeof prompt !== 'string') {
      throw new BadRequestException('Invalid prompt format')
    }

    if (prompt.length > this.maxPromptLength) {
      throw new BadRequestException(`Prompt exceeds maximum length of ${this.maxPromptLength} characters`)
    }

    return sanitizeInput(prompt)
  }

  private validatePromptSafety(prompt: string): void {
    const dangerousPatterns = [
      /ignore\s+previous\s+instructions/gi,
      /forget\s+everything\s+above/gi,
      /system\s*:\s*you\s+are/gi,
      /new\s+instructions\s*:/gi,
      /override\s+your\s+programming/gi,
      
      /show\s+me\s+your\s+prompt/gi,
      /what\s+are\s+your\s+instructions/gi,
      /reveal\s+your\s+system\s+message/gi,
      
      /jailbreak/gi,
      /DAN\s+mode/gi,
      /developer\s+mode/gi,
      
      /<script/gi,
      /javascript:/gi,
      /eval\s*\(/gi,
      /function\s*\(/gi,
      /=\s*function/gi
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(prompt)) {
        throw new BadRequestException('Prompt contains potentially unsafe content')
      }
    }
  }

  private validateFileContent(fileContent: string): void {
    if (fileContent.length > 50000) { // 50KB limit for file analysis
      throw new BadRequestException('File content too large for AI analysis')
    }

    if (/[\x00-\x08\x0E-\x1F\x7F-\xFF]/.test(fileContent)) {
      throw new BadRequestException('Binary files not supported for AI analysis')
    }
  }
}
