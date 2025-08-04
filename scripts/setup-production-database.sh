#!/bin/bash

# 🗄️ Production Database Setup Script for CodePal Platform
# This script helps set up a production PostgreSQL database

set -e

echo "🚀 CodePal Production Database Setup"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    print_info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_status "Dependencies check passed"
}

# Install Prisma CLI if not installed
install_prisma() {
    print_info "Installing Prisma CLI..."
    npm install -g prisma
    print_status "Prisma CLI installed"
}

# Create production environment file
create_production_env() {
    print_info "Creating production environment file..."
    
    cat > .env.production << EOF
# Production Environment Variables
NODE_ENV=production

# Database Configuration
# Replace with your actual PostgreSQL connection string
DATABASE_URL="postgresql://username:password@host:5432/codepal_prod?schema=public"

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret-key

# Stripe Configuration (Update with live keys)
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_key

# Platform Configuration
PLATFORM_NAME=codepal

# Security
SESSION_MAX_AGE=86400
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60000

# Monitoring (Optional)
SENTRY_DSN=your_sentry_dsn
EOF

    print_status "Production environment file created (.env.production)"
    print_warning "Please update the DATABASE_URL with your actual PostgreSQL connection string"
}

# Generate Prisma client
generate_prisma_client() {
    print_info "Generating Prisma client..."
    npx prisma generate
    print_status "Prisma client generated"
}

# Test database connection
test_database_connection() {
    print_info "Testing database connection..."
    
    if [ -z "$DATABASE_URL" ]; then
        print_warning "DATABASE_URL not set. Please set it in your environment or .env.production file"
        return 1
    fi
    
    # Test connection using Prisma
    if npx prisma db pull --schema=prisma/schema.prisma > /dev/null 2>&1; then
        print_status "Database connection successful"
        return 0
    else
        print_error "Database connection failed. Please check your DATABASE_URL"
        return 1
    fi
}

# Run database migrations
run_migrations() {
    print_info "Running database migrations..."
    
    if npx prisma migrate deploy; then
        print_status "Database migrations completed successfully"
    else
        print_error "Database migrations failed"
        exit 1
    fi
}

# Create database backup script
create_backup_script() {
    print_info "Creating database backup script..."
    
    cat > scripts/backup-database.sh << 'EOF'
#!/bin/bash

# Database Backup Script for CodePal Platform
# Run this script to create a backup of your production database

set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🗄️ Creating database backup..."

# Create backup using Prisma
npx prisma db pull --schema=prisma/schema.prisma > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"

echo "✅ Backup created: $BACKUP_FILE.gz"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +7 -delete

echo "🧹 Cleaned up backups older than 7 days"
EOF

    chmod +x scripts/backup-database.sh
    print_status "Backup script created (scripts/backup-database.sh)"
}

# Create database monitoring script
create_monitoring_script() {
    print_info "Creating database monitoring script..."
    
    cat > scripts/monitor-database.sh << 'EOF'
#!/bin/bash

# Database Monitoring Script for CodePal Platform
# Run this script to check database health and performance

set -e

echo "📊 Database Health Check"
echo "======================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set"
    exit 1
fi

# Test connection
echo "🔍 Testing database connection..."
if npx prisma db pull --schema=prisma/schema.prisma > /dev/null 2>&1; then
    echo "✅ Database connection: OK"
else
    echo "❌ Database connection: FAILED"
    exit 1
fi

# Check database size (if using PostgreSQL)
if [[ "$DATABASE_URL" == *"postgresql"* ]]; then
    echo "📏 Checking database size..."
    npx prisma db execute --stdin <<< "SELECT pg_size_pretty(pg_database_size(current_database()));"
fi

# Check active connections (if using PostgreSQL)
if [[ "$DATABASE_URL" == *"postgresql"* ]]; then
    echo "🔗 Checking active connections..."
    npx prisma db execute --stdin <<< "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';"
fi

echo "✅ Database health check completed"
EOF

    chmod +x scripts/monitor-database.sh
    print_status "Monitoring script created (scripts/monitor-database.sh)"
}

# Main setup function
main() {
    echo "🚀 Starting CodePal Production Database Setup..."
    echo ""
    
    check_dependencies
    install_prisma
    create_production_env
    generate_prisma_client
    
    echo ""
    print_info "Next steps:"
    echo "1. Update .env.production with your actual DATABASE_URL"
    echo "2. Run: source .env.production && ./scripts/setup-production-database.sh test"
    echo "3. Run: ./scripts/setup-production-database.sh migrate"
    echo ""
    
    create_backup_script
    create_monitoring_script
    
    echo ""
    print_status "Setup completed! Please configure your database connection string."
}

# Test database connection
test_connection() {
    echo "🔍 Testing database connection..."
    test_database_connection
}

# Run migrations
migrate() {
    echo "🔄 Running database migrations..."
    run_migrations
}

# Show help
show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup    - Complete database setup (default)"
    echo "  test     - Test database connection"
    echo "  migrate  - Run database migrations"
    echo "  help     - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup"
    echo "  $0 test"
    echo "  $0 migrate"
}

# Parse command line arguments
case "${1:-setup}" in
    "setup")
        main
        ;;
    "test")
        test_connection
        ;;
    "migrate")
        migrate
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac 