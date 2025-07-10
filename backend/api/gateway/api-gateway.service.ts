import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import type { Request, Response } from 'express'
import * as crypto from 'crypto'

export interface GatewayRequest {
  method: string
  path: string
  headers: Record<string, string>
  body?: any
  query?: Record<string, string>
  userId?: string
  apiKey?: string
  ip: string
  userAgent: string
}

export interface GatewayResponse {
  status: number
  headers: Record<string, string>
  body: any
  executionTime: number
}

export interface RouteConfig {
  path: string
  method: string
  service: string
  auth: boolean
  rateLimit: {
    requests: number
    window: number
  }
  timeout: number
  cache?: {
    ttl: number
    key?: string
  }
}

@Injectable()
export class ApiGatewayService {
  private readonly logger = new Logger(ApiGatewayService.name)
  private readonly rateLimitStore = new Map<string, { count: number; resetTime: number }>()
  private readonly cache = new Map<string, { data: any; expires: number }>()

  // Route configuration
  private readonly routes: RouteConfig[] = [
    // Auth routes
    {
      path: '/api/auth/register',
      method: 'POST',
      service: 'auth',
      auth: false,
      rateLimit: { requests: 5, window: 300000 }, // 5 requests per 5 minutes
      timeout: 10000,
    },
    {
      path: '/api/auth/login',
      method: 'POST',
      service: 'auth',
      auth: false,
      rateLimit: { requests: 10, window: 300000 }, // 10 requests per 5 minutes
      timeout: 10000,
    },
    {
      path: '/api/auth/sso',
      method: 'POST',
      service: 'auth',
      auth: false,
      rateLimit: { requests: 20, window: 300000 },
      timeout: 15000,
    },

    // Project routes
    {
      path: '/api/projects',
      method: 'GET',
      service: 'projects',
      auth: true,
      rateLimit: { requests: 100, window: 60000 }, // 100 requests per minute
      timeout: 5000,
      cache: { ttl: 30000 }, // 30 seconds cache
    },
    {
      path: '/api/projects',
      method: 'POST',
      service: 'projects',
      auth: true,
      rateLimit: { requests: 20, window: 60000 },
      timeout: 10000,
    },
    {
      path: '/api/projects/:id',
      method: 'GET',
      service: 'projects',
      auth: true,
      rateLimit: { requests: 200, window: 60000 },
      timeout: 5000,
      cache: { ttl: 60000 }, // 1 minute cache
    },
    {
      path: '/api/projects/:id',
      method: 'PUT',
      service: 'projects',
      auth: true,
      rateLimit: { requests: 30, window: 60000 },
      timeout: 10000,
    },
    {
      path: '/api/projects/:id',
      method: 'DELETE',
      service: 'projects',
      auth: true,
      rateLimit: { requests: 10, window: 60000 },
      timeout: 5000,
    },

    // File routes
    {
      path: '/api/projects/:projectId/files',
      method: 'GET',
      service: 'files',
      auth: true,
      rateLimit: { requests: 200, window: 60000 },
      timeout: 5000,
      cache: { ttl: 30000 },
    },
    {
      path: '/api/projects/:projectId/files',
      method: 'POST',
      service: 'files',
      auth: true,
      rateLimit: { requests: 50, window: 60000 },
      timeout: 10000,
    },
    {
      path: '/api/projects/:projectId/files/:filePath',
      method: 'GET',
      service: 'files',
      auth: true,
      rateLimit: { requests: 300, window: 60000 },
      timeout: 5000,
      cache: { ttl: 60000 },
    },
    {
      path: '/api/projects/:projectId/files/:filePath',
      method: 'PUT',
      service: 'files',
      auth: true,
      rateLimit: { requests: 100, window: 60000 },
      timeout: 10000,
    },
    {
      path: '/api/projects/:projectId/files/:filePath',
      method: 'DELETE',
      service: 'files',
      auth: true,
      rateLimit: { requests: 30, window: 60000 },
      timeout: 5000,
    },

    // AI routes
    {
      path: '/api/ai-chat',
      method: 'POST',
      service: 'ai',
      auth: true,
      rateLimit: { requests: 50, window: 60000 }, // 50 requests per minute
      timeout: 30000, // 30 seconds for AI processing
    },
    {
      path: '/api/vector-search',
      method: 'POST',
      service: 'ai',
      auth: true,
      rateLimit: { requests: 100, window: 60000 },
      timeout: 15000,
    },

    // User routes
    {
      path: '/api/user/profile',
      method: 'GET',
      service: 'users',
      auth: true,
      rateLimit: { requests: 100, window: 60000 },
      timeout: 5000,
      cache: { ttl: 300000 }, // 5 minutes cache
    },
    {
      path: '/api/user/profile',
      method: 'PUT',
      service: 'users',
      auth: true,
      rateLimit: { requests: 20, window: 60000 },
      timeout: 10000,
    },
    {
      path: '/api/user/api-keys',
      method: 'GET',
      service: 'users',
      auth: true,
      rateLimit: { requests: 50, window: 60000 },
      timeout: 5000,
    },
  ]

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async processRequest(req: Request, res: Response): Promise<GatewayResponse> {
    const startTime = Date.now()
    const gatewayRequest = this.buildGatewayRequest(req)

    try {
      // 1. Route matching
      const route = this.matchRoute(gatewayRequest.path, gatewayRequest.method)
      if (!route) {
        return this.createErrorResponse(404, 'Route not found')
      }

      // 2. Rate limiting
      const rateLimitResult = this.checkRateLimit(gatewayRequest, route)
      if (!rateLimitResult.allowed) {
        return this.createErrorResponse(429, 'Rate limit exceeded', {
          retryAfter: rateLimitResult.retryAfter,
        })
      }

      // 3. Authentication
      if (route.auth) {
        const authResult = await this.authenticateRequest(gatewayRequest)
        if (!authResult.authenticated) {
          return this.createErrorResponse(401, 'Authentication required')
        }
        gatewayRequest.userId = authResult.userId
      }

      // 4. Cache check
      const cacheKey = this.buildCacheKey(gatewayRequest, route)
      if (route.cache && gatewayRequest.method === 'GET') {
        const cachedResponse = this.getCachedResponse(cacheKey)
        if (cachedResponse) {
          return {
            status: 200,
            headers: { 'X-Cache': 'HIT', 'Content-Type': 'application/json' },
            body: cachedResponse,
            executionTime: Date.now() - startTime,
          }
        }
      }

      // 5. Route to service
      const serviceResponse = await this.routeToService(gatewayRequest, route)

      // 6. Cache response
      if (route.cache && gatewayRequest.method === 'GET' && serviceResponse.status === 200) {
        this.cacheResponse(cacheKey, serviceResponse.body, route.cache.ttl)
      }

      // 7. Log and emit events
      this.logRequest(gatewayRequest, serviceResponse, Date.now() - startTime)
      this.emitAnalytics(gatewayRequest, serviceResponse, Date.now() - startTime)

      return {
        status: serviceResponse.status,
        headers: { 'X-Cache': 'MISS', 'Content-Type': 'application/json' },
        body: serviceResponse.body,
        executionTime: Date.now() - startTime,
      }
    } catch (error) {
      this.logger.error('Gateway error:', error)
      return this.createErrorResponse(500, 'Internal server error')
    }
  }

  private buildGatewayRequest(req: Request): GatewayRequest {
    return {
      method: req.method,
      path: req.path,
      headers: req.headers as Record<string, string>,
      body: req.body,
      query: req.query as Record<string, string>,
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      apiKey: req.get('X-API-Key') || undefined,
    }
  }

  private matchRoute(path: string, method: string): RouteConfig | null {
    return this.routes.find(route => {
      const pathMatch = this.matchPath(route.path, path)
      return pathMatch && route.method === method
    }) || null
  }

  private matchPath(routePath: string, requestPath: string): boolean {
    // Simple path matching with parameters
    const routeParts = routePath.split('/')
    const requestParts = requestPath.split('/')

    if (routeParts.length !== requestParts.length) {
      return false
    }

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        continue // Parameter match
      }
      if (routeParts[i] !== requestParts[i]) {
        return false
      }
    }

    return true
  }

  private checkRateLimit(request: GatewayRequest, route: RouteConfig): { allowed: boolean; retryAfter?: number } {
    const key = `${request.ip}:${route.path}:${request.method}`
    const now = Date.now()
    const limit = route.rateLimit

    const current = this.rateLimitStore.get(key)
    if (!current || now > current.resetTime) {
      this.rateLimitStore.set(key, { count: 1, resetTime: now + limit.window })
      return { allowed: true }
    }

    if (current.count >= limit.requests) {
      return { allowed: false, retryAfter: Math.ceil((current.resetTime - now) / 1000) }
    }

    current.count++
    return { allowed: true }
  }

  private async authenticateRequest(request: GatewayRequest): Promise<{ authenticated: boolean; userId?: string }> {
    // Check API key first
    if (request.apiKey) {
      // TODO: Validate API key against database
      return { authenticated: true, userId: 'api-user' }
    }

    // Check session token
    const authHeader = request.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        // TODO: Validate JWT token
        const userId = this.validateJWT(token)
        return { authenticated: true, userId }
      } catch (error) {
        return { authenticated: false }
      }
    }

    return { authenticated: false }
  }

  private validateJWT(token: string): string {
    // TODO: Implement JWT validation
    // This is a placeholder - in production, use a proper JWT library
    const jwt = require('jsonwebtoken')
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
      return decoded.sub || decoded.userId
    } catch (error) {
      throw new Error('Invalid JWT token')
    }
  }

  private buildCacheKey(request: GatewayRequest, route: RouteConfig): string {
    const key = `${route.service}:${request.method}:${request.path}:${request.userId || 'anonymous'}`
    return crypto.createHash('md5').update(key).digest('hex')
  }

  private getCachedResponse(key: string): any | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() < cached.expires) {
      return cached.data
    }
    if (cached) {
      this.cache.delete(key)
    }
    return null
  }

  private cacheResponse(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    })
  }

  private async routeToService(request: GatewayRequest, route: RouteConfig): Promise<{ status: number; body: any }> {
    // In production, this would route to actual microservices
    // For now, we'll simulate the routing
    
    const serviceUrl = this.getServiceUrl(route.service)
    const targetUrl = `${serviceUrl}${request.path}`

    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': request.headers.authorization || '',
          'X-API-Key': request.apiKey || '',
          'X-User-ID': request.userId || '',
        },
        body: request.method !== 'GET' ? JSON.stringify(request.body) : undefined,
      })

      const body = await response.json()
      return { status: response.status, body }
    } catch (error) {
      this.logger.error(`Service routing error to ${route.service}:`, error)
      return { status: 503, body: { error: 'Service unavailable' } }
    }
  }

  private getServiceUrl(service: string): string {
    const serviceUrls: Record<string, string> = {
      auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/api/auth',
      projects: process.env.PROJECTS_SERVICE_URL || 'http://localhost:3001/api/projects',
      files: process.env.FILES_SERVICE_URL || 'http://localhost:3001/api/projects',
      ai: process.env.AI_SERVICE_URL || 'http://localhost:3001/api',
      users: process.env.USERS_SERVICE_URL || 'http://localhost:3001/api/user',
    }
    return serviceUrls[service] || 'http://localhost:3001/api'
  }

  private createErrorResponse(status: number, message: string, extras?: any): GatewayResponse {
    return {
      status,
      headers: { 'Content-Type': 'application/json' },
      body: { error: message, ...extras },
      executionTime: 0,
    }
  }

  private logRequest(request: GatewayRequest, response: any, executionTime: number): void {
    this.logger.log(
      `${request.method} ${request.path} - ${response.status} - ${executionTime}ms - ${request.ip}`
    )
  }

  private emitAnalytics(request: GatewayRequest, response: any, executionTime: number): void {
    this.eventEmitter.emit('gateway.request', {
      method: request.method,
      path: request.path,
      status: response.status,
      executionTime,
      userId: request.userId,
      ip: request.ip,
      userAgent: request.userAgent,
      timestamp: new Date(),
    })
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; services: Record<string, string> }> {
    const services = await this.checkServiceHealth()
    const status = Object.values(services).every(s => s === 'healthy') ? 'healthy' : 'degraded'
    
    return { status, services }
  }

  private async checkServiceHealth(): Promise<Record<string, string>> {
    const services = ['auth', 'projects', 'files', 'ai', 'users']
    const health: Record<string, string> = {}

    for (const service of services) {
      try {
        const url = this.getServiceUrl(service)
        const response = await fetch(`${url}/health`)
        health[service] = response.ok ? 'healthy' : 'unhealthy'
      } catch (error) {
        health[service] = 'unhealthy'
      }
    }

    return health
  }
}    