import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { validateFileUpload } from '../../../lib/validation'
import * as crypto from 'crypto'

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  private readonly maxFileSize = 5 * 1024 * 1024 // 5MB
  private readonly allowedMimeTypes = [
    'text/plain',
    'text/javascript',
    'text/typescript',
    'application/json',
    'text/html',
    'text/css',
    'text/markdown',
    'application/javascript',
    'application/typescript'
  ]

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.includes('/files') && (req.method === 'POST' || req.method === 'PUT')) {
      this.validateFileUpload(req)
    }
    next()
  }

  private validateFileUpload(req: Request): void {
    const file = req.body.file || (req as any).file

    if (!file) {
      throw new BadRequestException('No file provided')
    }

    if (file.size && file.size > this.maxFileSize) {
      throw new BadRequestException(`File size exceeds maximum allowed size of ${this.maxFileSize / (1024 * 1024)}MB`)
    }

    if (!validateFileUpload(file)) {
      throw new BadRequestException('Invalid file type or size')
    }

    if (file.mimetype && !this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed')
    }

    if (file.content || file.buffer) {
      const content = file.content || file.buffer.toString()
      this.scanForMaliciousContent(content)
    }

    if (file.originalname) {
      const extension = file.originalname.substring(file.originalname.lastIndexOf('.'))
      const secureFilename = crypto.randomBytes(16).toString('hex') + extension
      file.secureFilename = secureFilename
    }
  }

  private scanForMaliciousContent(content: string): void {
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi,
      /onclick\s*=/gi,
      /eval\s*\(/gi,
      /document\.cookie/gi,
      /window\.location/gi,
      /\.innerHTML/gi
    ]

    for (const pattern of maliciousPatterns) {
      if (pattern.test(content)) {
        throw new BadRequestException('File contains potentially malicious content')
      }
    }
  }
}
