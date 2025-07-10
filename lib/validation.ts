import * as Joi from 'joi'
import { sanitize } from 'sanitize-html'

export const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(12).required(),
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  organizationName: Joi.string().max(100).optional()
})

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  mfaCode: Joi.string().length(6).optional()
})

export const projectCreationSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  type: Joi.string().valid('web', 'mobile', 'api', 'desktop').optional(),
  framework: Joi.string().max(50).optional(),
  template: Joi.string().max(50).optional()
})

export const fileUploadSchema = Joi.object({
  path: Joi.string().min(1).max(500).required(),
  content: Joi.string().max(1000000).required(),
  type: Joi.string().max(50).optional()
})

export function sanitizeInput(input: string): string {
  return sanitize(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard'
  })
}

export function validateFileUpload(file: any): boolean {
  const allowedTypes = ['.js', '.ts', '.jsx', '.tsx', '.py', '.html', '.css', '.json', '.md', '.txt']
  const maxSize = 5 * 1024 * 1024
  
  if (!file || !file.name) return false
  
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!allowedTypes.includes(extension)) return false
  
  if (file.size > maxSize) return false
  
  return true
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
