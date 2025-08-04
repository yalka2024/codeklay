# 🗄️ **PRODUCTION DATABASE SETUP - CodePal Platform**

## ✅ **OVERVIEW**

Your platform is currently using SQLite for development, but for production you need PostgreSQL. Here's how to set up a production-ready PostgreSQL database with proper backup strategies and connection pooling.

---

## 🎯 **DATABASE HOSTING OPTIONS**

### **✅ Option 1: Vercel Postgres (Recommended for Vercel Deployment)**
- **Cost**: $20/month for 1GB storage
- **Features**: Automatic backups, connection pooling, SSL
- **Setup**: Integrated with Vercel dashboard
- **Best for**: Quick deployment with Vercel

### **✅ Option 2: DigitalOcean Managed Database**
- **Cost**: $15/month for 1GB storage
- **Features**: Automated backups, monitoring, SSL
- **Setup**: Through DigitalOcean dashboard
- **Best for**: Cost-effective production database

### **✅ Option 3: AWS RDS**
- **Cost**: ~$25/month for db.t3.micro
- **Features**: High availability, automated backups, scaling
- **Setup**: Through AWS console
- **Best for**: Enterprise-grade applications

### **✅ Option 4: Supabase (Free Tier Available)**
- **Cost**: Free tier available, $25/month for Pro
- **Features**: Real-time subscriptions, auth, backups
- **Setup**: Through Supabase dashboard
- **Best for**: Modern applications with real-time features

---

## 🚀 **QUICK SETUP GUIDE**

### **✅ Step 1: Choose Your Database Provider**

#### **Option A: Vercel Postgres (Easiest)**
```bash
# 1. Go to Vercel Dashboard
# 2. Create new project or select existing
# 3. Go to Storage tab
# 4. Create Postgres database
# 5. Copy connection string
```

#### **Option B: DigitalOcean Managed Database**
```bash
# 1. Go to DigitalOcean Dashboard
# 2. Create Database Cluster
# 3. Choose PostgreSQL 15
# 4. Select region close to your users
# 5. Copy connection string
```

#### **Option C: Supabase (Free)**
```bash
# 1. Go to supabase.com
# 2. Create new project
# 3. Go to Settings > Database
# 4. Copy connection string
```

### **✅ Step 2: Update Environment Variables**

Create `.env.production` file:
```bash
# Production Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public"

# Example for Vercel Postgres:
# DATABASE_URL="postgresql://default:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Example for DigitalOcean:
# DATABASE_URL="postgresql://doadmin:password@host:25060/defaultdb?sslmode=require"

# Example for Supabase:
# DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
```

### **✅ Step 3: Run Database Migrations**

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Run migrations to production database
npx prisma migrate deploy

# 3. Verify database connection
npx prisma db pull

# 4. Seed initial data (optional)
npx prisma db seed
```

---

## 🔧 **DETAILED SETUP INSTRUCTIONS**

### **✅ Vercel Postgres Setup**

1. **Create Vercel Project**:
   - Go to [vercel.com](https://vercel.com)
   - Create new project or select existing
   - Go to Storage tab

2. **Create Postgres Database**:
   - Click "Create Database"
   - Choose "Postgres"
   - Select region
   - Click "Create"

3. **Get Connection String**:
   - Go to Database settings
   - Copy the connection string
   - Format: `postgresql://username:password@host:port/database`

4. **Set Environment Variables**:
   ```bash
   # In Vercel dashboard > Settings > Environment Variables
   DATABASE_URL=your_connection_string
   ```

### **✅ DigitalOcean Managed Database**

1. **Create Database Cluster**:
   - Go to [DigitalOcean](https://digitalocean.com)
   - Create Database Cluster
   - Choose PostgreSQL 15
   - Select region

2. **Configure Database**:
   - Set database name
   - Create admin user
   - Enable SSL (recommended)

3. **Get Connection String**:
   - Go to Database settings
   - Copy connection string
   - Note: Uses port 25060 for SSL

4. **Set Environment Variables**:
   ```bash
   DATABASE_URL=postgresql://doadmin:password@host:25060/database?sslmode=require
   ```

### **✅ Supabase Setup**

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for setup to complete

2. **Get Connection String**:
   - Go to Settings > Database
   - Copy connection string
   - Format: `postgresql://postgres:password@db.supabase.co:5432/postgres`

3. **Set Environment Variables**:
   ```bash
   DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
   ```

---

## 🛡️ **BACKUP STRATEGY**

### **✅ Automated Backups**

#### **Vercel Postgres**:
- Automatic daily backups
- 7-day retention
- Point-in-time recovery

#### **DigitalOcean**:
- Daily automated backups
- 7-day retention
- Manual backup option

#### **Supabase**:
- Automatic backups
- 7-day retention
- Point-in-time recovery

### **✅ Manual Backup Commands**

```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql $DATABASE_URL < backup_file.sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "$BACKUP_DIR/backup_$DATE.sql"
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

---

## 🔄 **CONNECTION POOLING**

### **✅ Why Connection Pooling?**

- **Performance**: Reuse database connections
- **Scalability**: Handle high traffic efficiently
- **Reliability**: Prevent connection exhaustion

### **✅ Implementation Options**

#### **Option 1: Prisma Connection Pooling**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pooling configuration
  log: ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

#### **Option 2: PgBouncer (Advanced)**
```bash
# Install PgBouncer
sudo apt-get install pgbouncer

# Configure PgBouncer
# /etc/pgbouncer/pgbouncer.ini
[databases]
* = host=your_db_host port=5432

[pgbouncer]
listen_port = 6432
listen_addr = 127.0.0.1
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
```

---

## 📊 **MONITORING & MAINTENANCE**

### **✅ Database Monitoring**

#### **Vercel Postgres**:
- Built-in monitoring dashboard
- Query performance insights
- Connection metrics

#### **DigitalOcean**:
- Database metrics in dashboard
- Query performance monitoring
- Alert notifications

#### **Supabase**:
- Real-time database monitoring
- Query performance insights
- Connection pooling metrics

### **✅ Maintenance Tasks**

```bash
# Check database size
SELECT pg_size_pretty(pg_database_size(current_database()));

# Check active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

# Vacuum database (cleanup)
VACUUM ANALYZE;

# Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

---

## 🚨 **SECURITY CONSIDERATIONS**

### **✅ SSL Configuration**
```bash
# Force SSL connections
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Verify SSL connection
psql $DATABASE_URL -c "SHOW ssl;"
```

### **✅ Network Security**
- **Vercel**: Automatic SSL, private networking
- **DigitalOcean**: VPC, firewall rules
- **Supabase**: Automatic SSL, IP restrictions

### **✅ Access Control**
```sql
-- Create read-only user
CREATE USER readonly WITH PASSWORD 'password';
GRANT CONNECT ON DATABASE codepal TO readonly;
GRANT USAGE ON SCHEMA public TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
```

---

## 🎯 **NEXT STEPS**

### **✅ After Database Setup:**

1. **Test Connection**:
   ```bash
   npx prisma db pull
   npx prisma studio
   ```

2. **Run Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Verify Data**:
   ```bash
   npx prisma db seed
   ```

4. **Update Application**:
   - Set `DATABASE_URL` in production environment
   - Test all database operations
   - Monitor performance

### **✅ Recommended Timeline**:
- **Database Setup**: 1-2 hours
- **Migration**: 30 minutes
- **Testing**: 1-2 hours
- **Total**: 3-5 hours

**Your database will be production-ready with proper backup strategies and connection pooling!** 🚀 