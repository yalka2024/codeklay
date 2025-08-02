# 🚀 API Gateway Documentation

## Overview

The CodePal API Gateway provides a centralized layer for handling all API requests with advanced features including:

- **Request Routing & Load Balancing**
- **Authentication & Authorization**
- **Rate Limiting & Security**
- **Caching & Performance**
- **Request/Response Transformation**
- **Error Handling & Logging**
- **Service Health Monitoring**

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │───▶│  API Gateway    │───▶│  Microservices  │
│                 │    │                 │    │                 │
│ - Web App       │    │ - Rate Limiting │    │ - Auth Service  │
│ - Mobile App    │    │ - Authentication│    │ - Project Svc   │
│ - API Clients   │    │ - Caching       │    │ - File Service  │
│                 │    │ - Routing       │    │ - AI Service    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Features

### 🔐 Authentication & Authorization
- **JWT Token Validation**: Validates Bearer tokens for authenticated routes
- **API Key Support**: Supports API key authentication for external integrations
- **Role-Based Access**: Enforces role-based permissions for different endpoints
- **Session Management**: Handles user sessions and authentication state

### 🛡️ Security & Rate Limiting
- **Rate Limiting**: Configurable rate limits per endpoint and user/IP
- **Request Validation**: Validates request format and content
- **Security Headers**: Adds security headers to all responses
- **IP Filtering**: Supports IP whitelisting/blacklisting
- **CORS Handling**: Manages cross-origin requests

### ⚡ Performance & Caching
- **Response Caching**: Intelligent caching for GET requests
- **Cache Invalidation**: Automatic cache invalidation on updates
- **Request Deduplication**: Prevents duplicate requests
- **Connection Pooling**: Optimizes database connections

### 📊 Monitoring & Analytics
- **Request Logging**: Comprehensive request/response logging
- **Performance Metrics**: Tracks response times and throughput
- **Error Tracking**: Monitors and reports errors
- **Health Checks**: Service health monitoring
- **Analytics Events**: Emits events for analytics processing

## Configuration

### Environment Variables

```bash
# Service URLs
AUTH_SERVICE_URL=http://localhost:3001/api/auth
PROJECTS_SERVICE_URL=http://localhost:3001/api/projects
FILES_SERVICE_URL=http://localhost:3001/api/projects
AI_SERVICE_URL=http://localhost:3001/api
USERS_SERVICE_URL=http://localhost:3001/api/user

# Gateway Configuration
GATEWAY_PORT=3000
GATEWAY_ENV=production
GATEWAY_LOG_LEVEL=info

# Security
JWT_SECRET=your-jwt-secret
API_KEY_SALT=your-api-key-salt

# Rate Limiting
DEFAULT_RATE_LIMIT=100
DEFAULT_RATE_WINDOW=60000

# Caching
CACHE_TTL=300000
REDIS_URL=redis://localhost:6379
```

### Route Configuration

Routes are configured in the `ApiGatewayService` with the following options:

```typescript
interface RouteConfig {
  path: string           // API path pattern
  method: string         // HTTP method
  service: string        // Target service name
  auth: boolean          // Requires authentication
  rateLimit: {
    requests: number     // Max requests per window
    window: number       // Time window in milliseconds
  }
  timeout: number        // Request timeout
  cache?: {
    ttl: number         // Cache TTL in milliseconds
    key?: string        // Custom cache key
  }
}
```

## API Endpoints

### Health Check
```http
GET /api/gateway/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "auth": "healthy",
    "projects": "healthy",
    "files": "healthy",
    "ai": "healthy",
    "users": "healthy"
  },
  "gateway": {
    "version": "1.0.0",
    "uptime": 3600,
    "memory": {
      "rss": 123456789,
      "heapTotal": 987654321,
      "heapUsed": 123456789
    }
  }
}
```

### Rate Limit Information
```http
GET /api/gateway/rate-limits
```

**Response:**
```json
{
  "limits": {
    "/api/auth/register": {
      "requests": 5,
      "window": 300000,
      "description": "5 requests per 5 minutes"
    },
    "/api/projects": {
      "requests": 100,
      "window": 60000,
      "description": "100 requests per minute"
    }
  }
}
```

## Request Flow

1. **Request Reception**: Gateway receives HTTP request
2. **Route Matching**: Matches request to configured route
3. **Rate Limiting**: Checks rate limits for the route
4. **Authentication**: Validates authentication if required
5. **Cache Check**: Checks cache for GET requests
6. **Service Routing**: Routes request to appropriate service
7. **Response Processing**: Processes and transforms response
8. **Caching**: Caches response if applicable
9. **Logging**: Logs request and response details
10. **Response**: Returns response to client

## Error Handling

### Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

### Common Error Codes
- `401` - Authentication required
- `403` - Access denied
- `404` - Route not found
- `429` - Rate limit exceeded
- `500` - Internal server error
- `503` - Service unavailable

## Monitoring & Metrics

### Key Metrics
- **Request Rate**: Requests per second
- **Response Time**: Average response time
- **Error Rate**: Percentage of failed requests
- **Cache Hit Rate**: Percentage of cached responses
- **Service Health**: Health status of all services

### Logging
The gateway logs the following information:
- Request method and path
- Response status and execution time
- Client IP and user agent
- Authentication status
- Cache hit/miss status
- Error details

## Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: codepal/api-gateway:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## Security Considerations

### Best Practices
1. **Use HTTPS**: Always use HTTPS in production
2. **Validate Input**: Validate all input data
3. **Rate Limiting**: Implement appropriate rate limits
4. **Authentication**: Require authentication for sensitive endpoints
5. **Logging**: Log security-relevant events
6. **Monitoring**: Monitor for suspicious activity
7. **Updates**: Keep dependencies updated

### Security Headers
The gateway automatically adds security headers:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: default-src 'self'`
- `Strict-Transport-Security: max-age=63072000`

## Troubleshooting

### Common Issues

1. **Rate Limit Exceeded**
   - Check current usage: `GET /api/gateway/rate-limits`
   - Adjust limits if needed
   - Implement client-side retry logic

2. **Service Unavailable**
   - Check service health: `GET /api/gateway/health`
   - Verify service URLs in configuration
   - Check network connectivity

3. **Authentication Errors**
   - Verify JWT token format
   - Check token expiration
   - Validate API key format

4. **Cache Issues**
   - Clear cache if needed
   - Check cache configuration
   - Verify cache key generation

### Debug Mode
Enable debug logging by setting:
```bash
GATEWAY_LOG_LEVEL=debug
```

## Future Enhancements

### Planned Features
- **GraphQL Support**: Add GraphQL endpoint support
- **WebSocket Gateway**: Handle WebSocket connections
- **API Versioning**: Support multiple API versions
- **Advanced Caching**: Redis-based distributed caching
- **Load Balancing**: Intelligent load balancing
- **Circuit Breaker**: Implement circuit breaker pattern
- **API Documentation**: Auto-generated API docs
- **Developer Portal**: Self-service API management

### Performance Optimizations
- **Connection Pooling**: Optimize database connections
- **Request Batching**: Batch multiple requests
- **Response Compression**: Compress responses
- **Edge Caching**: CDN integration
- **Streaming**: Support streaming responses 