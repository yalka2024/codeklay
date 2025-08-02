#!/bin/bash

# CodePal Platform - Production Deployment Script
# Version: 13.0
# Purpose: Automated deployment to production environment

set -e  # Exit on any error

# Configuration
PLATFORM_VERSION="13.0"
DEPLOYMENT_DATE=$(date +"%Y-%m-%d %H:%M:%S")
ENVIRONMENT="production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking deployment prerequisites..."
    
    # Check required tools
    command -v docker >/dev/null 2>&1 || error "Docker is required but not installed"
    command -v kubectl >/dev/null 2>&1 || error "kubectl is required but not installed"
    command -v aws >/dev/null 2>&1 || error "AWS CLI is required but not installed"
    command -v vercel >/dev/null 2>&1 || error "Vercel CLI is required but not installed"
    
    # Check environment variables
    [[ -z "$DATABASE_URL" ]] && error "DATABASE_URL environment variable is required"
    [[ -z "$JWT_SECRET" ]] && error "JWT_SECRET environment variable is required"
    [[ -z "$OPENAI_SECRET_KEY" ]] && error "OPENAI_SECRET_KEY environment variable is required"
    [[ -z "$DEEPSEEK_API_KEY" ]] && error "DEEPSEEK_API_KEY environment variable is required"
    [[ -z "$REDIS_URL" ]] && error "REDIS_URL environment variable is required"
    
    success "Prerequisites check passed"
}

# Run tests
run_tests() {
    log "Running comprehensive test suite..."
    
    # Run unit tests
    log "Running unit tests..."
    npm run test:unit || error "Unit tests failed"
    
    # Run integration tests
    log "Running integration tests..."
    npm run test:integration || error "Integration tests failed"
    
    # Run security tests
    log "Running security tests..."
    npm run test:security || error "Security tests failed"
    
    # Check test coverage
    COVERAGE=$(npm run test:coverage | grep -o '[0-9.]*%' | head -1 | sed 's/%//')
    if (( $(echo "$COVERAGE < 85" | bc -l) )); then
        error "Test coverage is below 85% (current: ${COVERAGE}%)"
    fi
    
    success "All tests passed with ${COVERAGE}% coverage"
}

# Build application
build_application() {
    log "Building application..."
    
    # Clean previous builds
    npm run clean
    
    # Install dependencies
    npm ci --production=false
    
    # Build all packages
    npm run build
    
    # Build Docker images
    docker-compose build --no-cache
    
    success "Application built successfully"
}

# Deploy to Vercel (Frontend)
deploy_frontend() {
    log "Deploying frontend to Vercel..."
    
    # Set environment variables
    vercel env add NEXT_PUBLIC_API_URL production https://api.codepal.ai
    vercel env add NEXT_PUBLIC_WS_URL production wss://api.codepal.ai
    vercel env add NEXT_PUBLIC_ANALYTICS_ID production $ANALYTICS_ID
    
    # Deploy
    vercel --prod --yes
    
    success "Frontend deployed to Vercel"
}

# Deploy to AWS ECS (Backend)
deploy_backend() {
    log "Deploying backend to AWS ECS..."
    
    # Update ECS service
    aws ecs update-service \
        --cluster codepal-api-cluster \
        --service codepal-api-service \
        --force-new-deployment
    
    # Wait for deployment to complete
    aws ecs wait services-stable \
        --cluster codepal-api-cluster \
        --services codepal-api-service
    
    success "Backend deployed to AWS ECS"
}

# Deploy to Cloudflare Workers (AI Worker)
deploy_ai_worker() {
    log "Deploying AI Worker to Cloudflare..."
    
    # Deploy to Cloudflare Workers
    cd apps/ai-worker
    wrangler deploy --env production
    
    success "AI Worker deployed to Cloudflare"
}

# Deploy database migrations
deploy_database() {
    log "Deploying database migrations..."
    
    # Run Prisma migrations
    npx prisma migrate deploy
    
    # Seed production data if needed
    if [[ "$SEED_PRODUCTION_DATA" == "true" ]]; then
        npx prisma db seed
    fi
    
    success "Database migrations deployed"
}

# Configure monitoring
setup_monitoring() {
    log "Setting up monitoring and alerting..."
    
    # Deploy Prometheus
    kubectl apply -f monitoring/prometheus/
    
    # Deploy Grafana
    kubectl apply -f monitoring/grafana/
    
    # Deploy AlertManager
    kubectl apply -f monitoring/alertmanager/
    
    # Configure dashboards
    kubectl apply -f monitoring/dashboards/
    
    success "Monitoring setup completed"
}

# Run load tests
run_load_tests() {
    log "Running load tests..."
    
    # Install Artillery if not present
    npm install -g artillery
    
    # Run load tests
    artillery run scripts/load-testing/artillery-config.yml \
        --environment production \
        --output load-test-results.json
    
    # Check results
    if [[ -f "load-test-results.json" ]]; then
        ERROR_RATE=$(jq -r '.aggregate.errors.rate' load-test-results.json)
        if (( $(echo "$ERROR_RATE > 0.01" | bc -l) )); then
            error "Load test error rate is too high: ${ERROR_RATE}%"
        fi
    fi
    
    success "Load tests passed"
}

# Health checks
run_health_checks() {
    log "Running health checks..."
    
    # Check frontend
    FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://codepal.ai)
    if [[ "$FRONTEND_STATUS" != "200" ]]; then
        error "Frontend health check failed: HTTP $FRONTEND_STATUS"
    fi
    
    # Check backend API
    API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.codepal.ai/health)
    if [[ "$API_STATUS" != "200" ]]; then
        error "Backend API health check failed: HTTP $API_STATUS"
    fi
    
    # Check AI Worker
    AI_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://ai.codepal.ai/health)
    if [[ "$AI_STATUS" != "200" ]]; then
        error "AI Worker health check failed: HTTP $AI_STATUS"
    fi
    
    # Check database
    DB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.codepal.ai/health/db)
    if [[ "$DB_STATUS" != "200" ]]; then
        error "Database health check failed: HTTP $DB_STATUS"
    fi
    
    success "All health checks passed"
}

# Update DNS and SSL
setup_dns_ssl() {
    log "Setting up DNS and SSL certificates..."
    
    # Update DNS records
    aws route53 change-resource-record-sets \
        --hosted-zone-id $HOSTED_ZONE_ID \
        --change-batch file://scripts/deploy/dns-changes.json
    
    # Request SSL certificates
    aws acm request-certificate \
        --domain-names "codepal.ai" "*.codepal.ai" \
        --validation-method DNS
    
    success "DNS and SSL setup completed"
}

# Send notifications
send_notifications() {
    log "Sending deployment notifications..."
    
    # Send Slack notification
    if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{
                'text': '🚀 CodePal Platform v${PLATFORM_VERSION} deployed successfully to production!',
                'attachments': [{
                    'fields': [
                        {'title': 'Version', 'value': '${PLATFORM_VERSION}', 'short': true},
                        {'title': 'Environment', 'value': '${ENVIRONMENT}', 'short': true},
                        {'title': 'Deployment Date', 'value': '${DEPLOYMENT_DATE}', 'short': true}
                    ]
                }]
            }" \
            $SLACK_WEBHOOK_URL
    fi
    
    # Send email notification
    if [[ -n "$EMAIL_RECIPIENTS" ]]; then
        echo "CodePal Platform v${PLATFORM_VERSION} deployed successfully" | \
        mail -s "Deployment Success - CodePal Platform" $EMAIL_RECIPIENTS
    fi
    
    success "Notifications sent"
}

# Main deployment function
main() {
    log "Starting CodePal Platform production deployment..."
    log "Version: ${PLATFORM_VERSION}"
    log "Environment: ${ENVIRONMENT}"
    log "Deployment Date: ${DEPLOYMENT_DATE}"
    
    # Pre-deployment checks
    check_prerequisites
    run_tests
    build_application
    
    # Deploy infrastructure
    deploy_database
    deploy_backend
    deploy_ai_worker
    deploy_frontend
    
    # Post-deployment setup
    setup_dns_ssl
    setup_monitoring
    run_load_tests
    run_health_checks
    
    # Notifications
    send_notifications
    
    success "🎉 CodePal Platform v${PLATFORM_VERSION} deployed successfully to production!"
    log "Deployment completed at: $(date)"
}

# Run main function
main "$@" 