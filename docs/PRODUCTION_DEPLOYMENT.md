# 🚀 CodePal Production Deployment Runbook

## Overview
This runbook provides step-by-step procedures for deploying the CodePal platform to production environments, including pre-deployment checks, deployment procedures, and post-deployment validation.

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Deployment Procedures](#deployment-procedures)
4. [Post-Deployment Validation](#post-deployment-validation)
5. [Rollback Procedures](#rollback-procedures)
6. [Monitoring & Alerting](#monitoring--alerting)
7. [Troubleshooting](#troubleshooting)
8. [Emergency Procedures](#emergency-procedures)

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code review completed and approved
- [ ] Security scan passed (Snyk, npm audit)
- [ ] Performance benchmarks met
- [ ] Accessibility audit completed
- [ ] Documentation updated

### Infrastructure
- [ ] Kubernetes cluster ready
- [ ] Database migrations tested
- [ ] SSL certificates valid
- [ ] Load balancer configured
- [ ] Monitoring stack deployed
- [ ] Backup systems verified

### Security
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Authentication systems tested
- [ ] API keys rotated
- [ ] Secrets management configured
- [ ] Audit logging enabled

### Compliance
- [ ] GDPR compliance verified
- [ ] Data retention policies applied
- [ ] Privacy policy updated
- [ ] Terms of service current
- [ ] Legal review completed

---

## 🏗️ Environment Setup

### Production Environment Variables
```bash
# Application
NODE_ENV=production
NEXTAUTH_URL=https://codepal.com
NEXTAUTH_SECRET=<strong-secret-key>

# Database
DATABASE_URL=postgresql://user:pass@host:5432/codepal_prod

# AI Services
OPENAI_SECRET_KEY=<openai-api-key>

# Monitoring
SENTRY_DSN=<sentry-dsn>
PROMETHEUS_ENDPOINT=http://prometheus:9090

# Security
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60000
SESSION_MAX_AGE=86400

# WebSocket
WS_PORT=3002
WS_MAX_CONNECTIONS=1000
```

### Kubernetes Namespace Setup
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: codepal-prod
  labels:
    environment: production
    app: codepal
```

### Resource Requirements
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

---

## 🚀 Deployment Procedures

### Method 1: Kubernetes Deployment
```bash
# 1. Build and push Docker image
docker build -t codepal:latest .
docker tag codepal:latest registry.codepal.com/codepal:latest
docker push registry.codepal.com/codepal:latest

# 2. Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# 3. Verify deployment
kubectl get pods -n codepal-prod
kubectl get services -n codepal-prod
kubectl get ingress -n codepal-prod
```

### Method 2: Helm Deployment
```bash
# 1. Update Helm values
helm upgrade --install codepal-prod ./helm-chart \
  --namespace codepal-prod \
  --values values-production.yaml \
  --set image.tag=latest

# 2. Verify deployment
helm status codepal-prod -n codepal-prod
```

### Method 3: Docker Compose (Development/Staging)
```bash
# 1. Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# 2. Verify services
docker-compose -f docker-compose.prod.yml ps
```

---

## 🔍 Post-Deployment Validation

### Health Checks
```bash
# Application health
curl -f https://codepal.com/api/health

# WebSocket health
curl -f https://codepal.com:3002/health

# Database connectivity
kubectl exec -n codepal-prod deployment/codepal-app -- npm run db:check

# SSL certificate validation
openssl s_client -connect codepal.com:443 -servername codepal.com
```

### Functional Tests
```bash
# Run smoke tests
npm run test:smoke -- --base-url=https://codepal.com

# Run performance tests
npm run test:performance -- --base-url=https://codepal.com

# Run security tests
npm run test:security -- --base-url=https://codepal.com
```

### Monitoring Verification
- [ ] Prometheus metrics collection
- [ ] Grafana dashboards populated
- [ ] AlertManager notifications working
- [ ] Log aggregation functional
- [ ] APM traces visible

### User Acceptance Testing
- [ ] Authentication flow works
- [ ] Collaborative features functional
- [ ] AI features responding
- [ ] File upload/download works
- [ ] Real-time features operational

---

## 🔄 Rollback Procedures

### Quick Rollback (Kubernetes)
```bash
# Rollback to previous deployment
kubectl rollout undo deployment/codepal-app -n codepal-prod

# Verify rollback
kubectl rollout status deployment/codepal-app -n codepal-prod

# Check application health
curl -f https://codepal.com/api/health
```

### Database Rollback
```bash
# Revert database migrations
npm run db:migrate:down

# Restore from backup (if needed)
pg_restore -d codepal_prod backup_$(date -d '1 day ago' +%Y%m%d).sql
```

### Configuration Rollback
```bash
# Revert configuration changes
kubectl apply -f k8s/configmap-previous.yaml

# Restart pods to pick up changes
kubectl rollout restart deployment/codepal-app -n codepal-prod
```

---

## 📊 Monitoring & Alerting

### Key Metrics to Monitor
- **Application Metrics**
  - Response time (p95 < 2s)
  - Error rate (< 1%)
  - Request rate
  - Active users

- **Infrastructure Metrics**
  - CPU usage (< 80%)
  - Memory usage (< 85%)
  - Disk usage (< 85%)
  - Network I/O

- **Business Metrics**
  - User registrations
  - Feature usage
  - Revenue metrics
  - Customer satisfaction

### Alert Thresholds
```yaml
alerts:
  critical:
    - response_time > 5s
    - error_rate > 5%
    - cpu_usage > 90%
    - memory_usage > 95%
  
  warning:
    - response_time > 2s
    - error_rate > 1%
    - cpu_usage > 80%
    - memory_usage > 85%
```

### Notification Channels
- **Critical**: Phone, SMS, Slack, Email
- **Warning**: Slack, Email
- **Info**: Slack, Dashboard

---

## 🔧 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
kubectl logs -n codepal-prod deployment/codepal-app

# Check resource usage
kubectl top pods -n codepal-prod

# Check configuration
kubectl describe configmap -n codepal-prod
```

#### Database Connection Issues
```bash
# Test database connectivity
kubectl exec -n codepal-prod deployment/codepal-app -- npm run db:test

# Check database status
kubectl exec -n codepal-prod deployment/codepal-db -- pg_isready

# Verify connection pool
kubectl exec -n codepal-prod deployment/codepal-app -- npm run db:pool:status
```

#### WebSocket Connection Issues
```bash
# Check WebSocket server
curl -f https://codepal.com:3002/health

# Test WebSocket connection
wscat -c wss://codepal.com:3002

# Check firewall rules
kubectl exec -n codepal-prod deployment/codepal-app -- netstat -tlnp
```

#### Performance Issues
```bash
# Check resource usage
kubectl top pods -n codepal-prod

# Analyze slow queries
kubectl exec -n codepal-prod deployment/codepal-db -- psql -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# Check application metrics
curl https://codepal.com/api/metrics
```

### Debug Commands
```bash
# Get pod details
kubectl describe pod <pod-name> -n codepal-prod

# Execute commands in pod
kubectl exec -it <pod-name> -n codepal-prod -- /bin/bash

# Port forward for debugging
kubectl port-forward <pod-name> 3001:3001 -n codepal-prod

# Check events
kubectl get events -n codepal-prod --sort-by='.lastTimestamp'
```

---

## 🚨 Emergency Procedures

### Service Outage
1. **Immediate Actions**
   - Check monitoring dashboards
   - Verify infrastructure status
   - Notify stakeholders
   - Initiate incident response

2. **Investigation**
   - Review recent changes
   - Check system logs
   - Analyze metrics
   - Identify root cause

3. **Resolution**
   - Apply hotfix if needed
   - Rollback if necessary
   - Restart services
   - Verify recovery

### Data Breach
1. **Immediate Response**
   - Isolate affected systems
   - Preserve evidence
   - Notify security team
   - Contact legal team

2. **Investigation**
   - Analyze audit logs
   - Identify affected data
   - Determine breach scope
   - Document timeline

3. **Recovery**
   - Patch vulnerabilities
   - Reset compromised credentials
   - Restore from backup if needed
   - Implement additional security

### Performance Crisis
1. **Immediate Actions**
   - Scale up resources
   - Enable rate limiting
   - Disable non-critical features
   - Notify users

2. **Optimization**
   - Analyze bottlenecks
   - Optimize database queries
   - Add caching layers
   - Implement CDN

3. **Long-term Fixes**
   - Architectural improvements
   - Performance monitoring
   - Capacity planning
   - Load testing

---

## 📞 Emergency Contacts

### Technical Team
- **DevOps Lead**: +1-XXX-XXX-XXXX
- **Backend Lead**: +1-XXX-XXX-XXXX
- **Frontend Lead**: +1-XXX-XXX-XXXX
- **Database Admin**: +1-XXX-XXX-XXXX

### Management
- **CTO**: +1-XXX-XXX-XXXX
- **VP Engineering**: +1-XXX-XXX-XXXX
- **Product Manager**: +1-XXX-XXX-XXXX

### External Services
- **Cloud Provider**: AWS Support
- **SSL Certificate**: Let's Encrypt
- **CDN**: Cloudflare
- **Monitoring**: DataDog

---

## 📚 Additional Resources

### Documentation
- [Architecture Overview](../docs/ARCHITECTURE.md)
- [Security Guidelines](../docs/COMPLIANCE.md)
- [API Documentation](../docs/API.md)
- [User Guide](../docs/USER_GUIDE.md)

### Tools
- **Monitoring**: Grafana, Prometheus, AlertManager
- **Logging**: ELK Stack, Fluentd
- **APM**: New Relic, DataDog
- **Security**: Snyk, OWASP ZAP

### Runbooks
- [Database Maintenance](../docs/DATABASE_MAINTENANCE.md)
- [Security Incident Response](../docs/SECURITY_INCIDENT.md)
- [Performance Tuning](../docs/PERFORMANCE_TUNING.md)

---

*This runbook is maintained by the DevOps team and updated with each deployment. Last updated: January 2024* 