#!/bin/bash

# CodePal Production Deployment Script
# This script handles the complete production deployment process

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENVIRONMENT="production"
NAMESPACE="codepal-prod"
REGISTRY="ghcr.io"
IMAGE_NAME="codepal/app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check required tools
    local tools=("kubectl" "docker" "terraform" "helm" "jq" "curl")
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "$tool is required but not installed"
            exit 1
        fi
    done
    
    # Check kubectl context
    if ! kubectl config current-context &> /dev/null; then
        log_error "No kubectl context found"
        exit 1
    fi
    
    # Check if we're connected to the right cluster
    local current_context=$(kubectl config current-context)
    if [[ ! "$current_context" =~ "production" ]]; then
        log_warning "Current kubectl context ($current_context) doesn't appear to be production"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    log_success "Prerequisites check passed"
}

# Validate environment variables
validate_env_vars() {
    log_info "Validating environment variables..."
    
    local required_vars=(
        "DATABASE_URL"
        "NEXTAUTH_SECRET"
        "OPENAI_SECRET_KEY"
        "REDIS_URL"
        "AWS_ACCESS_KEY_ID"
        "AWS_SECRET_ACCESS_KEY"
        "AWS_REGION"
    )
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            log_error "Required environment variable $var is not set"
            exit 1
        fi
    done
    
    log_success "Environment variables validation passed"
}

# Create backup before deployment
create_backup() {
    log_info "Creating database backup before deployment..."
    
    local backup_name="pre-deployment-$(date +%Y%m%d-%H%M%S)"
    
    # Create database backup
    kubectl exec -n "$NAMESPACE" deployment/postgres -- pg_dump -U codepal codepal > "backup-$backup_name.sql"
    
    # Compress backup
    gzip "backup-$backup_name.sql"
    
    # Upload to S3
    aws s3 cp "backup-$backup_name.sql.gz" "s3://codepal-backups/production/"
    
    log_success "Backup created: backup-$backup_name.sql.gz"
}

# Run pre-deployment tests
run_pre_deployment_tests() {
    log_info "Running pre-deployment tests..."
    
    # Run unit tests
    cd "$PROJECT_ROOT"
    npm run test:unit
    
    # Run integration tests
    npm run test:integration
    
    # Run security scan
    npm run security:scan
    
    # Run performance tests
    npm run test:performance
    
    log_success "Pre-deployment tests passed"
}

# Build and push Docker image
build_and_push_image() {
    log_info "Building and pushing Docker image..."
    
    local image_tag="${REGISTRY}/${IMAGE_NAME}:${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"
    local latest_tag="${REGISTRY}/${IMAGE_NAME}:${ENVIRONMENT}-latest"
    
    # Build image
    docker build -t "$image_tag" -t "$latest_tag" .
    
    # Push images
    docker push "$image_tag"
    docker push "$latest_tag"
    
    # Store image tag for deployment
    echo "$image_tag" > .deployment-image-tag
    
    log_success "Docker image built and pushed: $image_tag"
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    log_info "Deploying infrastructure with Terraform..."
    
    cd "$PROJECT_ROOT/infrastructure/terraform"
    
    # Initialize Terraform
    terraform init
    
    # Plan deployment
    terraform plan -out=tfplan
    
    # Show plan
    terraform show tfplan
    
    # Confirm deployment
    read -p "Apply Terraform plan? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        terraform apply tfplan
    else
        log_warning "Terraform deployment cancelled"
        return 1
    fi
    
    log_success "Infrastructure deployment completed"
}

# Deploy Kubernetes resources
deploy_kubernetes() {
    log_info "Deploying Kubernetes resources..."
    
    local image_tag=$(cat "$PROJECT_ROOT/.deployment-image-tag")
    
    # Create namespace if it doesn't exist
    kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply secrets
    kubectl apply -f "$PROJECT_ROOT/infrastructure/kubernetes/secrets.yaml" -n "$NAMESPACE"
    
    # Apply database
    kubectl apply -f "$PROJECT_ROOT/infrastructure/kubernetes/database.yaml" -n "$NAMESPACE"
    
    # Wait for database to be ready
    kubectl wait --for=condition=ready pod -l app=postgres -n "$NAMESPACE" --timeout=300s
    kubectl wait --for=condition=ready pod -l app=redis -n "$NAMESPACE" --timeout=300s
    
    # Apply application
    kubectl apply -f "$PROJECT_ROOT/infrastructure/kubernetes/codepal-app.yaml" -n "$NAMESPACE"
    
    # Update image
    kubectl set image deployment/codepal-app codepal-app="$image_tag" -n "$NAMESPACE"
    
    # Wait for deployment to be ready
    kubectl rollout status deployment/codepal-app -n "$NAMESPACE" --timeout=600s
    
    log_success "Kubernetes deployment completed"
}

# Deploy monitoring stack
deploy_monitoring() {
    log_info "Deploying monitoring stack..."
    
    # Add Prometheus Helm repository
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    
    # Deploy Prometheus
    helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --create-namespace \
        --values "$PROJECT_ROOT/infrastructure/monitoring/prometheus-values.yaml"
    
    # Deploy Grafana dashboards
    kubectl apply -f "$PROJECT_ROOT/infrastructure/monitoring/grafana-dashboards.yaml" -n monitoring
    
    log_success "Monitoring stack deployed"
}

# Run post-deployment tests
run_post_deployment_tests() {
    log_info "Running post-deployment tests..."
    
    # Wait for application to be ready
    sleep 30
    
    # Health checks
    local endpoints=(
        "https://app.codepal.com/api/health"
        "https://api.codepal.com/api/health"
        "https://app.codepal.com/api/health/detailed"
    )
    
    for endpoint in "${endpoints[@]}"; do
        log_info "Checking health endpoint: $endpoint"
        if ! curl -f -s "$endpoint" > /dev/null; then
            log_error "Health check failed for $endpoint"
            return 1
        fi
    done
    
    # Run smoke tests
    cd "$PROJECT_ROOT"
    npm run test:smoke
    
    # Run performance tests
    npm run test:performance:production
    
    log_success "Post-deployment tests passed"
}

# Update DNS records
update_dns() {
    log_info "Updating DNS records..."
    
    # Get load balancer IP
    local lb_ip=$(kubectl get service -n "$NAMESPACE" codepal-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    
    if [[ -z "$lb_ip" ]]; then
        log_error "Could not get load balancer IP"
        return 1
    fi
    
    # Update DNS records (example with AWS Route 53)
    aws route53 change-resource-record-sets \
        --hosted-zone-id "$ROUTE53_HOSTED_ZONE_ID" \
        --change-batch file://"$PROJECT_ROOT/infrastructure/ssl/dns-update.json"
    
    log_success "DNS records updated"
}

# Configure SSL certificates
configure_ssl() {
    log_info "Configuring SSL certificates..."
    
    # Deploy cert-manager
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml
    
    # Wait for cert-manager to be ready
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=300s
    
    # Apply certificate issuers
    kubectl apply -f "$PROJECT_ROOT/infrastructure/ssl/cert-issuers.yaml"
    
    # Apply certificates
    kubectl apply -f "$PROJECT_ROOT/infrastructure/ssl/certificates.yaml"
    
    log_success "SSL certificates configured"
}

# Send deployment notifications
send_notifications() {
    log_info "Sending deployment notifications..."
    
    local deployment_time=$(date)
    local image_tag=$(cat "$PROJECT_ROOT/.deployment-image-tag")
    
    # Slack notification
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{
                'text': '🚀 CodePal Production Deployment Successful!\n
                • Time: $deployment_time\n
                • Image: $image_tag\n
                • Environment: $ENVIRONMENT\n
                • Status: All systems operational'
            }" \
            "$SLACK_WEBHOOK_URL"
    fi
    
    # Email notification
    if [[ -n "${EMAIL_RECIPIENTS:-}" ]]; then
        echo "CodePal Production Deployment Completed Successfully" | \
        mail -s "CodePal Production Deployment - $deployment_time" \
             -r "deployments@codepal.com" \
             "$EMAIL_RECIPIENTS"
    fi
    
    log_success "Deployment notifications sent"
}

# Rollback function
rollback() {
    log_error "Deployment failed, initiating rollback..."
    
    # Rollback Kubernetes deployment
    kubectl rollout undo deployment/codepal-app -n "$NAMESPACE"
    kubectl rollout status deployment/codepal-app -n "$NAMESPACE"
    
    # Send rollback notification
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{
                'text': '⚠️ CodePal Production Deployment Failed - Rollback Initiated\n
                • Time: $(date)\n
                • Environment: $ENVIRONMENT\n
                • Status: Rolled back to previous version'
            }" \
            "$SLACK_WEBHOOK_URL"
    fi
    
    log_success "Rollback completed"
}

# Main deployment function
main() {
    log_info "Starting CodePal production deployment..."
    
    # Set up error handling
    trap 'rollback' ERR
    
    # Run deployment steps
    check_root
    check_prerequisites
    validate_env_vars
    create_backup
    run_pre_deployment_tests
    build_and_push_image
    deploy_infrastructure
    deploy_kubernetes
    deploy_monitoring
    run_post_deployment_tests
    update_dns
    configure_ssl
    send_notifications
    
    log_success "Production deployment completed successfully!"
    
    # Clean up
    rm -f "$PROJECT_ROOT/.deployment-image-tag"
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --dry-run      Show what would be deployed without actually deploying"
        echo "  --skip-tests   Skip running tests"
        echo "  --skip-backup  Skip creating backup"
        exit 0
        ;;
    --dry-run)
        log_info "Dry run mode - showing deployment plan"
        # Add dry run logic here
        exit 0
        ;;
    --skip-tests)
        log_warning "Skipping tests"
        SKIP_TESTS=true
        ;;
    --skip-backup)
        log_warning "Skipping backup"
        SKIP_BACKUP=true
        ;;
    "")
        # No arguments, run full deployment
        ;;
    *)
        log_error "Unknown option: $1"
        exit 1
        ;;
esac

# Run main function
main "$@"
