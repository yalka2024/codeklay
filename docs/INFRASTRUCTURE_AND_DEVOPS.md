# Infrastructure & DevOps Documentation

## Overview

This document provides comprehensive guidance for the CodePal infrastructure and DevOps setup, including Kubernetes manifests, CI/CD pipelines, Terraform configurations, monitoring, and production deployment procedures.

## Table of Contents

1. [Kubernetes Infrastructure](#kubernetes-infrastructure)
2. [CI/CD Pipeline](#cicd-pipeline)
3. [Terraform Infrastructure as Code](#terraform-infrastructure-as-code)
4. [Monitoring and Alerting](#monitoring-and-alerting)
5. [SSL/TLS and DNS Configuration](#ssltls-and-dns-configuration)
6. [Production Deployment](#production-deployment)
7. [Security Considerations](#security-considerations)
8. [Disaster Recovery](#disaster-recovery)
9. [Cost Optimization](#cost-optimization)
10. [Troubleshooting](#troubleshooting)

## Kubernetes Infrastructure

### Architecture Overview

The CodePal application is deployed on Kubernetes with the following components:

- **Application Layer**: Next.js frontend and API services
- **Database Layer**: PostgreSQL with Redis caching
- **AI Services**: OpenAI integration and vector search
- **Monitoring**: Prometheus, Grafana, and AlertManager
- **Ingress**: Nginx Ingress Controller with SSL termination
- **Storage**: Persistent volumes for database and file storage

### Key Kubernetes Manifests

#### 1. Application Deployment (`infrastructure/kubernetes/codepal-app.yaml`)

```yaml
# Main application deployment with:
- Horizontal Pod Autoscaler (3-10 replicas)
- Resource limits and requests
- Health checks and readiness probes
- Security context (non-root user)
- ConfigMaps for configuration
- Ingress with SSL/TLS
- Pod Disruption Budget for high availability
```

#### 2. Database Configuration (`infrastructure/kubernetes/database.yaml`)

```yaml
# PostgreSQL StatefulSet with:
- Persistent storage (100GB)
- Optimized configuration
- Automated backups
- Health monitoring
- Security hardening

# Redis Deployment with:
- Persistent storage (10GB)
- Memory optimization
- Connection pooling
- Health checks
```

### Namespace Structure

```
codepal-prod/
├── codepal-app (main application)
├── postgres (database)
├── redis (cache)
├── api-gateway (API proxy)
├── ai-service (AI processing)
├── auth-service (authentication)
└── monitoring (Prometheus, Grafana)
```

### Resource Requirements

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-----------|-------------|-----------|----------------|--------------|
| codepal-app | 250m | 500m | 512Mi | 1Gi |
| postgres | 500m | 1000m | 1Gi | 2Gi |
| redis | 100m | 200m | 256Mi | 512Mi |
| ai-service | 200m | 400m | 512Mi | 1Gi |
| auth-service | 100m | 200m | 256Mi | 512Mi |

## CI/CD Pipeline

### Pipeline Overview

The CI/CD pipeline is implemented using GitHub Actions and includes:

1. **Security Scanning**: Trivy vulnerability scanner, Snyk dependency analysis
2. **Code Quality**: ESLint, Prettier, TypeScript checks
3. **Testing**: Unit tests, integration tests, E2E tests
4. **Building**: Multi-stage Docker builds
5. **Deployment**: Staging and production environments
6. **Monitoring**: Performance testing and compliance checks

### Pipeline Stages

#### 1. Security and Code Quality
```yaml
security-scan:
  - Trivy vulnerability scanner
  - Snyk dependency analysis
  - CodeQL security analysis

lint:
  - ESLint code linting
  - Prettier formatting
  - TypeScript type checking
```

#### 2. Testing
```yaml
test:
  - Unit tests with Jest
  - Integration tests with database
  - Coverage reporting
  - Performance testing

e2e:
  - End-to-end tests with Playwright
  - Cross-browser testing
  - Accessibility testing
```

#### 3. Building and Deployment
```yaml
build:
  - Multi-stage Docker build
  - Image scanning
  - Push to container registry

deploy-staging:
  - Deploy to staging environment
  - Smoke tests
  - Performance validation

deploy-production:
  - Database backup
  - Blue-green deployment
  - Health checks
  - Rollback capability
```

### Environment Configuration

#### Staging Environment
- **Purpose**: Pre-production testing
- **Auto-deploy**: On develop branch
- **Domain**: staging.codepal.com
- **Resources**: 50% of production

#### Production Environment
- **Purpose**: Live application
- **Auto-deploy**: On main branch (after approval)
- **Domain**: app.codepal.com, api.codepal.com
- **Resources**: Full production capacity

## Terraform Infrastructure as Code

### Infrastructure Components

#### 1. VPC and Networking
```hcl
# Multi-AZ VPC with:
- Public and private subnets
- NAT gateways for private subnet internet access
- Security groups and network ACLs
- VPC flow logs for monitoring
```

#### 2. EKS Cluster
```hcl
# Managed Kubernetes cluster with:
- Node groups for different workloads
- Auto-scaling capabilities
- Cluster autoscaler
- Monitoring and logging
```

#### 3. Database and Storage
```hcl
# RDS PostgreSQL with:
- Multi-AZ deployment
- Automated backups
- Encryption at rest
- Performance insights

# ElastiCache Redis with:
- Cluster mode for high availability
- Multi-AZ deployment
- Automated failover
```

#### 4. Load Balancing and CDN
```hcl
# Application Load Balancer with:
- SSL/TLS termination
- Health checks
- Auto-scaling

# CloudFront CDN with:
- Global content delivery
- SSL certificates
- Cache optimization
```

### Terraform Commands

```bash
# Initialize Terraform
terraform init

# Plan deployment
terraform plan -out=tfplan

# Apply changes
terraform apply tfplan

# Destroy infrastructure (use with caution)
terraform destroy
```

### State Management

Terraform state is stored in S3 with DynamoDB locking:

```hcl
terraform {
  backend "s3" {
    bucket = "codepal-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
}
```

## Monitoring and Alerting

### Monitoring Stack

#### 1. Prometheus Configuration
- **Scrape Interval**: 15 seconds
- **Retention**: 30 days
- **Storage**: 100GB persistent volume
- **High Availability**: 3 replicas

#### 2. Key Metrics

**Application Metrics:**
- Request rate and latency
- Error rates and status codes
- User activity and business metrics
- Custom application metrics

**Infrastructure Metrics:**
- CPU, memory, and disk usage
- Network traffic and errors
- Pod and node health
- Kubernetes cluster metrics

**Database Metrics:**
- Connection count and query performance
- Lock wait times and deadlocks
- Replication lag
- Backup status

#### 3. Alerting Rules

**Critical Alerts (Immediate Response):**
- Application down
- Database connectivity issues
- High error rates
- Security incidents

**Warning Alerts (Investigation Required):**
- High resource usage
- Performance degradation
- Backup failures
- Certificate expiration

### Grafana Dashboards

#### 1. Application Dashboard
- Real-time request metrics
- Error rates and response times
- User activity and business KPIs
- Service dependencies

#### 2. Infrastructure Dashboard
- Cluster resource utilization
- Node health and performance
- Network traffic and errors
- Storage usage and performance

#### 3. Database Dashboard
- Query performance and slow queries
- Connection pool status
- Replication health
- Backup and maintenance status

## SSL/TLS and DNS Configuration

### SSL Certificate Management

#### 1. Certificate Types
- **Wildcard Certificate**: *.codepal.com
- **Single Domain**: app.codepal.com, api.codepal.com
- **Auto-renewal**: 30 days before expiration

#### 2. Certificate Providers
- **Let's Encrypt**: Free certificates with automatic renewal
- **AWS Certificate Manager**: Managed certificates for AWS services
- **Custom CA**: For internal certificates

### DNS Configuration

#### 1. Primary DNS Records
```
codepal.com          A     <load-balancer-ip>
app.codepal.com      A     <load-balancer-ip>
api.codepal.com      A     <load-balancer-ip>
www.codepal.com      CNAME codepal.com
```

#### 2. Email Configuration
```
codepal.com          MX    10 mail.codepal.com
codepal.com          TXT   "v=spf1 include:_spf.google.com ~all"
_dmarc.codepal.com   TXT   "v=DMARC1; p=quarantine; rua=mailto:dmarc@codepal.com"
```

#### 3. Security Records
```
codepal.com          TXT   "google-site-verification=<token>"
_acme-challenge.codepal.com TXT "<challenge-token>"
```

### DNS Security

#### 1. DNSSEC Configuration
- **Algorithm**: RSASHA256
- **Key Size**: 2048 bits
- **Key Type**: ZSK (Zone Signing Key)

#### 2. DNS Monitoring
- **Uptime Checks**: Every 60 seconds
- **Response Time Monitoring**: Alert if > 500ms
- **DNSSEC Validation**: Ensure proper signing

## Production Deployment

### Deployment Process

#### 1. Pre-deployment Checklist
- [ ] All tests passing
- [ ] Security scan clean
- [ ] Performance benchmarks met
- [ ] Database backup completed
- [ ] Rollback plan prepared

#### 2. Deployment Steps
```bash
# 1. Run deployment script
./scripts/production-deployment.sh

# 2. Monitor deployment
kubectl get pods -n codepal-prod
kubectl logs -f deployment/codepal-app -n codepal-prod

# 3. Verify health checks
curl -f https://app.codepal.com/api/health
curl -f https://api.codepal.com/api/health

# 4. Run smoke tests
npm run test:smoke
```

#### 3. Post-deployment Verification
- [ ] All services healthy
- [ ] Database connectivity verified
- [ ] SSL certificates valid
- [ ] Monitoring alerts configured
- [ ] Performance metrics normal

### Rollback Procedures

#### 1. Automatic Rollback
```bash
# Kubernetes rollback
kubectl rollout undo deployment/codepal-app -n codepal-prod
kubectl rollout status deployment/codepal-app -n codepal-prod
```

#### 2. Database Rollback
```bash
# Restore from backup
aws s3 cp s3://codepal-backups/production/backup-<timestamp>.sql.gz .
gunzip backup-<timestamp>.sql.gz
psql $DATABASE_URL < backup-<timestamp>.sql
```

#### 3. DNS Rollback
```bash
# Update DNS to previous load balancer
aws route53 change-resource-record-sets \
  --hosted-zone-id $ZONE_ID \
  --change-batch file://dns-rollback.json
```

## Security Considerations

### Network Security

#### 1. VPC Configuration
- **Private Subnets**: Application and database tiers
- **Public Subnets**: Load balancers and bastion hosts
- **Security Groups**: Least privilege access
- **Network ACLs**: Additional layer of protection

#### 2. Kubernetes Security
- **RBAC**: Role-based access control
- **Pod Security Policies**: Container security standards
- **Network Policies**: Pod-to-pod communication rules
- **Secrets Management**: Encrypted secrets storage

### Application Security

#### 1. Container Security
- **Non-root Users**: All containers run as non-root
- **Read-only Filesystems**: Where possible
- **Security Scanning**: Regular vulnerability scans
- **Image Signing**: Verified container images

#### 2. API Security
- **Rate Limiting**: Prevent abuse
- **Authentication**: JWT tokens with short expiry
- **Authorization**: Role-based access control
- **Input Validation**: Sanitize all inputs

### Data Security

#### 1. Encryption
- **At Rest**: Database and storage encryption
- **In Transit**: TLS 1.3 for all communications
- **Secrets**: Encrypted secrets management

#### 2. Access Control
- **Database**: Connection encryption and authentication
- **API**: Token-based authentication
- **Admin Access**: Multi-factor authentication

## Disaster Recovery

### Backup Strategy

#### 1. Database Backups
- **Frequency**: Daily automated backups
- **Retention**: 30 days
- **Storage**: S3 with cross-region replication
- **Testing**: Monthly restore tests

#### 2. Application Backups
- **Configuration**: Version controlled in Git
- **User Data**: Stored in database and S3
- **Code**: Multiple Git repositories

### Recovery Procedures

#### 1. Database Recovery
```bash
# 1. Stop application
kubectl scale deployment/codepal-app --replicas=0 -n codepal-prod

# 2. Restore database
aws s3 cp s3://codepal-backups/production/backup-<timestamp>.sql.gz .
gunzip backup-<timestamp>.sql.gz
psql $DATABASE_URL < backup-<timestamp>.sql

# 3. Restart application
kubectl scale deployment/codepal-app --replicas=3 -n codepal-prod
```

#### 2. Infrastructure Recovery
```bash
# 1. Restore from Terraform state
terraform init
terraform plan
terraform apply

# 2. Redeploy applications
kubectl apply -f infrastructure/kubernetes/
```

### Business Continuity

#### 1. Multi-Region Deployment
- **Primary Region**: us-east-1
- **Secondary Region**: us-west-2
- **Failover**: Automated with Route 53

#### 2. Data Replication
- **Database**: Cross-region replication
- **Storage**: S3 cross-region replication
- **CDN**: Global distribution

## Cost Optimization

### Resource Optimization

#### 1. Auto-scaling
- **Horizontal Pod Autoscaler**: Scale based on CPU/memory
- **Cluster Autoscaler**: Scale nodes based on demand
- **Vertical Pod Autoscaler**: Optimize resource requests

#### 2. Spot Instances
- **Non-critical Workloads**: Use spot instances for cost savings
- **Mixed Instance Types**: Balance availability and cost
- **Spot Fleet**: Automatic spot instance management

### Storage Optimization

#### 1. Data Lifecycle
- **Hot Storage**: Frequently accessed data
- **Warm Storage**: Less frequently accessed data
- **Cold Storage**: Archival data (S3 Glacier)

#### 2. Compression and Deduplication
- **Database**: Enable compression
- **Backups**: Compressed storage
- **Logs**: Compressed and rotated

### Monitoring Costs

#### 1. Cost Tracking
- **AWS Cost Explorer**: Monitor spending
- **Resource Tagging**: Track costs by project/environment
- **Budget Alerts**: Prevent overspending

#### 2. Optimization Recommendations
- **Right-sizing**: Optimize instance types
- **Reserved Instances**: Commit to usage for discounts
- **Savings Plans**: Flexible pricing for compute

## Troubleshooting

### Common Issues

#### 1. Pod Startup Issues
```bash
# Check pod status
kubectl get pods -n codepal-prod

# Check pod logs
kubectl logs <pod-name> -n codepal-prod

# Check pod events
kubectl describe pod <pod-name> -n codepal-prod
```

#### 2. Database Connectivity
```bash
# Test database connection
kubectl exec -it deployment/postgres -n codepal-prod -- psql -U codepal -d codepal

# Check database logs
kubectl logs deployment/postgres -n codepal-prod
```

#### 3. SSL Certificate Issues
```bash
# Check certificate status
kubectl get certificates -n codepal-prod

# Check certificate events
kubectl describe certificate <cert-name> -n codepal-prod

# Test SSL connection
openssl s_client -connect app.codepal.com:443 -servername app.codepal.com
```

### Performance Issues

#### 1. High CPU Usage
```bash
# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods -n codepal-prod

# Check HPA status
kubectl get hpa -n codepal-prod
```

#### 2. Memory Issues
```bash
# Check memory usage
kubectl top pods -n codepal-prod --containers

# Check OOM events
kubectl get events -n codepal-prod | grep OOM
```

#### 3. Network Issues
```bash
# Check network policies
kubectl get networkpolicies -n codepal-prod

# Test connectivity
kubectl exec -it <pod-name> -n codepal-prod -- ping <target>
```

### Monitoring and Debugging

#### 1. Prometheus Queries
```promql
# High error rate
rate(http_requests_total{status=~"5.."}[5m])

# High latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Database connections
pg_stat_database_numbackends
```

#### 2. Log Analysis
```bash
# Search logs
kubectl logs -n codepal-prod -l app=codepal-app --tail=100 | grep ERROR

# Follow logs
kubectl logs -n codepal-prod -l app=codepal-app -f
```

#### 3. Metrics Analysis
```bash
# Check Prometheus targets
curl -s http://prometheus:9090/api/v1/targets | jq

# Check alert status
curl -s http://alertmanager:9093/api/v1/alerts | jq
```

## Maintenance Procedures

### Regular Maintenance

#### 1. Weekly Tasks
- [ ] Review monitoring dashboards
- [ ] Check backup status
- [ ] Review security alerts
- [ ] Update documentation

#### 2. Monthly Tasks
- [ ] Review cost optimization
- [ ] Test disaster recovery procedures
- [ ] Update security patches
- [ ] Performance analysis

#### 3. Quarterly Tasks
- [ ] Infrastructure review
- [ ] Capacity planning
- [ ] Security audit
- [ ] Compliance review

### Update Procedures

#### 1. Kubernetes Updates
```bash
# Check available updates
kubectl get nodes -o wide

# Plan node updates
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# Update node
# (Node update process depends on your infrastructure)

# Uncordon node
kubectl uncordon <node-name>
```

#### 2. Application Updates
```bash
# Deploy new version
kubectl set image deployment/codepal-app codepal-app=new-image:tag -n codepal-prod

# Monitor rollout
kubectl rollout status deployment/codepal-app -n codepal-prod

# Rollback if needed
kubectl rollout undo deployment/codepal-app -n codepal-prod
```

## Conclusion

This infrastructure and DevOps setup provides a robust, scalable, and secure foundation for the CodePal application. The combination of Kubernetes orchestration, automated CI/CD pipelines, comprehensive monitoring, and disaster recovery procedures ensures high availability and maintainability.

For questions or issues, please refer to the troubleshooting section or contact the DevOps team.

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: DevOps Team 