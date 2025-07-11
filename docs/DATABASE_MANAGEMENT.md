# 🗄️ Database Management Documentation

## Overview

CodePal uses SQLite for development and PostgreSQL for production, with comprehensive database management features including:

- **Automated Migrations** with Prisma
- **Backup & Recovery** strategies
- **Replication** for high availability
- **Monitoring & Health Checks**
- **Performance Optimization**

## Database Schema

### Current Models

```sql
-- Users and Authentication
User (id, name, email, role, hashedPassword, ...)
Account (id, userId, provider, providerAccountId, ...)
Session (id, sessionToken, userId, expires, ...)
APIKey (id, key, userId, createdAt, ...)

-- Projects and Collaboration
Project (id, name, description, ownerId, status, settings, ...)
ProjectMember (id, projectId, userId, role, permissions, ...)
ProjectFile (id, projectId, path, name, content, size, ...)

-- Verification
VerificationToken (identifier, token, expires, ...)
```

### Migration History

1. **20250709035454_init_auth** - Initial authentication tables
2. **20250709040211_add_user_password** - Added password support
3. **20250709202604_add_project_models** - Project management tables

## Migration Management

### Development Workflow

```bash
# Check migration status
npx prisma migrate status

# Create new migration from schema changes
npx prisma migrate dev --name descriptive_name

# Apply migrations to database
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

### Production Deployment

```bash
# Apply pending migrations safely
npx prisma migrate deploy

# Verify migration status
npx prisma migrate status

# Generate production client
npx prisma generate
```

### Migration Best Practices

1. **Always backup before migrations**
2. **Test migrations in staging first**
3. **Use descriptive migration names**
4. **Keep migrations small and focused**
5. **Never modify existing migrations**
6. **Document breaking changes**

## Backup Strategy

### Automated Backups

The system includes a comprehensive backup service with:

- **Scheduled backups** (configurable cron expressions)
- **Compression** to reduce storage size
- **Encryption** for security
- **Multiple storage options** (local, S3, GCS)
- **Retention policies** for automatic cleanup
- **Checksum verification** for integrity

### Configuration

```bash
# Backup Configuration
BACKUP_SCHEDULE=0 2 * * *          # Daily at 2 AM
BACKUP_RETENTION_DAYS=30           # Keep 30 days
BACKUP_COMPRESSION=true            # Enable compression
BACKUP_ENCRYPTION=true             # Enable encryption
BACKUP_ENCRYPTION_KEY=your-key     # Encryption key

# Storage Configuration
BACKUP_LOCAL=true                  # Local storage
BACKUP_S3_BUCKET=your-bucket       # S3 bucket
BACKUP_S3_REGION=us-east-1         # S3 region
BACKUP_S3_ACCESS_KEY=your-key      # S3 access key
BACKUP_S3_SECRET_KEY=your-secret   # S3 secret key

# Google Cloud Storage
BACKUP_GCS_BUCKET=your-bucket      # GCS bucket
BACKUP_GCS_PROJECT_ID=your-project # GCS project
BACKUP_GCS_KEY_FILE=path/to/key    # GCS key file
```

### Manual Backup Operations

```bash
# Create backup via API
curl -X POST /api/database/backup \
  -H "Content-Type: application/json" \
  -d '{"action": "create"}'

# List backups
curl -X GET /api/database/backup?action=list

# Check backup health
curl -X GET /api/database/backup?action=health

# Restore backup
curl -X POST /api/database/backup \
  -H "Content-Type: application/json" \
  -d '{"action": "restore", "backupId": "backup-2024-01-15-123456"}'
```

### Backup File Format

```
backups/
├── backup-2024-01-15T02:00:00.000Z-abc123.sql.gz.enc
├── backup-2024-01-14T02:00:00.000Z-def456.sql.gz.enc
└── backup-2024-01-13T02:00:00.000Z-ghi789.sql.gz.enc
```

### Recovery Procedures

1. **Stop the application**
2. **Create backup of current database**
3. **Restore from backup**
4. **Verify data integrity**
5. **Restart application**

```bash
# Emergency recovery script
#!/bin/bash
echo "Starting emergency recovery..."

# Stop application
systemctl stop codepal

# Backup current database
cp /var/lib/codepal/dev.db /var/lib/codepal/dev.db.emergency-backup

# Restore from backup
curl -X POST http://localhost:3001/api/database/backup \
  -H "Content-Type: application/json" \
  -d '{"action": "restore", "backupId": "backup-2024-01-15-123456"}'

# Verify restoration
sqlite3 /var/lib/codepal/dev.db "SELECT COUNT(*) FROM User;"

# Restart application
systemctl start codepal

echo "Recovery completed"
```

## Replication Strategy

### Replication Modes

#### Master-Slave Replication
- **Primary node** handles all writes
- **Slave nodes** handle reads and backups
- **Automatic failover** when master fails
- **Configurable sync intervals**

#### Master-Master Replication
- **Multiple master nodes** for high availability
- **Conflict resolution** strategies
- **Bidirectional sync** between nodes
- **Load balancing** across masters

#### Cluster Replication
- **Distributed database** across multiple nodes
- **Automatic sharding** and partitioning
- **Consensus protocols** for consistency
- **Horizontal scaling** capabilities

### Configuration

```bash
# Replication Configuration
REPLICATION_ENABLED=true
REPLICATION_MODE=master-slave
REPLICATION_SYNC_INTERVAL=30000
REPLICATION_CONFLICT_RESOLUTION=last-write-wins

# Node Configuration (JSON)
REPLICATION_NODES='[
  {
    "id": "master-1",
    "host": "db-master-1.example.com",
    "port": 5432,
    "role": "master",
    "priority": 1
  },
  {
    "id": "slave-1",
    "host": "db-slave-1.example.com",
    "port": 5432,
    "role": "slave",
    "priority": 2
  }
]'

# Health Check Configuration
REPLICATION_HEALTH_CHECK=true
REPLICATION_HEALTH_INTERVAL=10000
REPLICATION_HEALTH_TIMEOUT=5000
```

### Replication Management

```bash
# Check replication status
curl -X GET /api/database/replication/status

# Get node health
curl -X GET /api/database/replication/health

# Promote slave to master
curl -X POST /api/database/replication/promote \
  -H "Content-Type: application/json" \
  -d '{"nodeId": "slave-1"}'

# Force sync node
curl -X POST /api/database/replication/sync \
  -H "Content-Type: application/json" \
  -d '{"nodeId": "slave-1"}'
```

## Monitoring & Health Checks

### Database Health Metrics

- **Connection status** - Active connections
- **Query performance** - Response times
- **Storage usage** - Database size and growth
- **Replication lag** - Sync delays
- **Backup status** - Last backup time and success
- **Error rates** - Failed queries and operations

### Health Check Endpoints

```bash
# Database health
GET /api/database/health

# Backup health
GET /api/database/backup?action=health

# Replication health
GET /api/database/replication/health

# Migration status
GET /api/database/migrations/status
```

### Monitoring Alerts

Configure alerts for:
- **Backup failures** - No successful backup in 24 hours
- **Replication lag** - Slave nodes more than 5 minutes behind
- **Database size** - Database growing faster than expected
- **Connection errors** - High rate of connection failures
- **Migration failures** - Failed migration deployments

## Performance Optimization

### Indexing Strategy

```sql
-- User queries
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_user_role ON User(role);

-- Project queries
CREATE INDEX idx_project_owner ON Project(ownerId);
CREATE INDEX idx_project_status ON Project(status);

-- Project member queries
CREATE INDEX idx_project_member_user ON ProjectMember(userId);
CREATE INDEX idx_project_member_project ON ProjectMember(projectId);

-- File queries
CREATE INDEX idx_project_file_project ON ProjectFile(projectId);
CREATE INDEX idx_project_file_path ON ProjectFile(projectId, path);
```

### Query Optimization

1. **Use indexes** for frequently queried columns
2. **Limit result sets** with pagination
3. **Avoid N+1 queries** with proper joins
4. **Use transactions** for multiple operations
5. **Monitor slow queries** and optimize

### Connection Pooling

```typescript
// Prisma connection pool configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pool settings
  __internal: {
    engine: {
      connectionLimit: 10,
      pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
      },
    },
  },
})
```

## Security Considerations

### Data Protection

1. **Encrypt sensitive data** at rest and in transit
2. **Use strong passwords** for database access
3. **Implement row-level security** where appropriate
4. **Regular security audits** of database access
5. **Backup encryption** for all backup files

### Access Control

```sql
-- Create read-only user for analytics
CREATE USER analytics_user WITH PASSWORD 'strong_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_user;

-- Create backup user with limited permissions
CREATE USER backup_user WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE codepal TO backup_user;
```

### Audit Logging

```sql
-- Enable audit logging
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  action VARCHAR(50),
  table_name VARCHAR(50),
  record_id VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Disaster Recovery

### Recovery Time Objectives (RTO)

- **Critical systems**: 15 minutes
- **Important systems**: 1 hour
- **Non-critical systems**: 4 hours

### Recovery Point Objectives (RPO)

- **User data**: 5 minutes
- **Project data**: 15 minutes
- **Analytics data**: 1 hour

### Recovery Procedures

1. **Database corruption**
   - Restore from latest backup
   - Replay transaction logs if available
   - Verify data integrity

2. **Hardware failure**
   - Failover to replica node
   - Restore from backup if needed
   - Rebuild failed node

3. **Data center outage**
   - Activate disaster recovery site
   - Restore from off-site backup
   - Update DNS and routing

4. **Ransomware attack**
   - Isolate affected systems
   - Restore from clean backup
   - Investigate attack vector

## Maintenance Procedures

### Regular Maintenance

#### Daily
- Monitor backup success
- Check replication status
- Review error logs
- Monitor performance metrics

#### Weekly
- Analyze slow queries
- Update database statistics
- Review security logs
- Test backup restoration

#### Monthly
- Review and update indexes
- Clean up old data
- Update database software
- Review capacity planning

#### Quarterly
- Full security audit
- Performance optimization
- Disaster recovery testing
- Documentation updates

### Maintenance Scripts

```bash
#!/bin/bash
# Daily maintenance script

echo "Starting daily database maintenance..."

# Check backup status
curl -s http://localhost:3001/api/database/backup?action=health

# Check replication status
curl -s http://localhost:3001/api/database/replication/health

# Analyze database performance
sqlite3 /var/lib/codepal/dev.db "ANALYZE;"

# Clean up old sessions
sqlite3 /var/lib/codepal/dev.db "DELETE FROM Session WHERE expires < datetime('now');"

echo "Daily maintenance completed"
```

## Troubleshooting

### Common Issues

1. **Migration failures**
   - Check database connectivity
   - Verify migration files
   - Review error logs
   - Rollback if necessary

2. **Backup failures**
   - Check disk space
   - Verify permissions
   - Test storage connectivity
   - Review backup logs

3. **Replication issues**
   - Check network connectivity
   - Verify node configuration
   - Review sync logs
   - Test node health

4. **Performance problems**
   - Analyze slow queries
   - Check index usage
   - Monitor resource usage
   - Optimize queries

### Debug Commands

```bash
# Check database size
ls -lh /var/lib/codepal/dev.db

# Check active connections
sqlite3 /var/lib/codepal/dev.db "PRAGMA database_list;"

# Check table sizes
sqlite3 /var/lib/codepal/dev.db "SELECT name, sql FROM sqlite_master WHERE type='table';"

# Check index usage
sqlite3 /var/lib/codepal/dev.db "PRAGMA index_list(User);"

# Check database integrity
sqlite3 /var/lib/codepal/dev.db "PRAGMA integrity_check;"
```

## Future Enhancements

### Planned Features

1. **Automated scaling** - Dynamic resource allocation
2. **Advanced analytics** - Query performance insights
3. **Machine learning** - Predictive maintenance
4. **Multi-region support** - Global data distribution
5. **Real-time monitoring** - Live performance dashboards

### Technology Roadmap

- **PostgreSQL migration** for production
- **Redis integration** for caching
- **Elasticsearch** for search functionality
- **Time-series databases** for metrics
- **Graph databases** for relationship analysis 