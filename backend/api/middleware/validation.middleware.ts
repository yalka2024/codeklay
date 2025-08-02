import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { 
  userRegistrationSchema, 
  userLoginSchema, 
  projectCreationSchema, 
  fileUploadSchema,
  sanitizeInput 
} from '../../../lib/validation'

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const path = req.path
    const method = req.method
    
    if (method === 'POST' || method === 'PUT') {
      this.sanitizeRequestBody(req)
      this.validateRequest(req, path)
    }
    
    next()
  }
  
  private sanitizeRequestBody(req: Request): void {
    if (req.body && typeof req.body === 'object') {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeInput(req.body[key])
        }
      }
    }
  }
  
  private validateRequest(req: Request, path: string): void {
    let schema
    
    if (path.includes('/auth/register')) {
      schema = userRegistrationSchema
    } else if (path.includes('/auth/login')) {
      schema = userLoginSchema
    } else if (path.includes('/projects') && req.method === 'POST') {
      schema = projectCreationSchema
    } else if (path.includes('/files')) {
      schema = fileUploadSchema
    }
    
    if (schema) {
      const { error } = schema.validate(req.body)
      if (error) {
        throw new BadRequestException(error.details[0].message)
      }
    }
  }
}
