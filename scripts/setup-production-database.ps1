# 🗄️ Production Database Setup Script for CodePal Platform (PowerShell)
# This script helps set up a production PostgreSQL database

param(
    [string]$Command = "setup"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor $Blue
}

# Check if required tools are installed
function Test-Dependencies {
    Write-Info "Checking dependencies..."
    
    if (!(Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Error "Node.js is not installed. Please install Node.js first."
        exit 1
    }
    
    if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Error "npm is not installed. Please install npm first."
        exit 1
    }
    
    Write-Status "Dependencies check passed"
}

# Install Prisma CLI if not installed
function Install-Prisma {
    Write-Info "Installing Prisma CLI..."
    npm install -g prisma
    Write-Status "Prisma CLI installed"
}

# Create production environment file
function New-ProductionEnv {
    Write-Info "Creating production environment file..."
    
    $envContent = @"
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
"@

    $envContent | Out-File -FilePath ".env.production" -Encoding UTF8
    Write-Status "Production environment file created (.env.production)"
    Write-Warning "Please update the DATABASE_URL with your actual PostgreSQL connection string"
}

# Generate Prisma client
function Invoke-PrismaGenerate {
    Write-Info "Generating Prisma client..."
    npx prisma generate
    Write-Status "Prisma client generated"
}

# Test database connection
function Test-DatabaseConnection {
    Write-Info "Testing database connection..."
    
    if ([string]::IsNullOrEmpty($env:DATABASE_URL)) {
        Write-Warning "DATABASE_URL not set. Please set it in your environment or .env.production file"
        return $false
    }
    
    # Test connection using Prisma
    try {
        npx prisma db pull --schema=prisma/schema.prisma 2>$null
        Write-Status "Database connection successful"
        return $true
    }
    catch {
        Write-Error "Database connection failed. Please check your DATABASE_URL"
        return $false
    }
}

# Run database migrations
function Invoke-DatabaseMigration {
    Write-Info "Running database migrations..."
    
    try {
        npx prisma migrate deploy
        Write-Status "Database migrations completed successfully"
        return $true
    }
    catch {
        Write-Error "Database migrations failed"
        return $false
    }
}

# Create database backup script
function New-BackupScript {
    Write-Info "Creating database backup script..."
    
    $backupScript = @"
# Database Backup Script for CodePal Platform
# Run this script to create a backup of your production database

param(
    [string]`$BackupDir = "./backups"
)

# Create backup directory if it doesn't exist
if (!(Test-Path `$BackupDir)) {
    New-Item -ItemType Directory -Path `$BackupDir
}

`$Date = Get-Date -Format "yyyyMMdd_HHmmss"
`$BackupFile = "`$BackupDir/backup_`$Date.sql"

Write-Host "🗄️ Creating database backup..."

# Create backup using Prisma
npx prisma db pull --schema=prisma/schema.prisma > `$BackupFile

Write-Host "✅ Backup created: `$BackupFile"

# Keep only last 7 days of backups
Get-ChildItem -Path `$BackupDir -Filter "backup_*.sql" | Where-Object { `$_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item

Write-Host "🧹 Cleaned up backups older than 7 days"
"@

    $backupScript | Out-File -FilePath "scripts/backup-database.ps1" -Encoding UTF8
    Write-Status "Backup script created (scripts/backup-database.ps1)"
}

# Create database monitoring script
function New-MonitoringScript {
    Write-Info "Creating database monitoring script..."
    
    $monitoringScript = @"
# Database Monitoring Script for CodePal Platform
# Run this script to check database health and performance

Write-Host "📊 Database Health Check"
Write-Host "======================="

# Check if DATABASE_URL is set
if ([string]::IsNullOrEmpty(`$env:DATABASE_URL)) {
    Write-Host "❌ DATABASE_URL not set" -ForegroundColor Red
    exit 1
}

# Test connection
Write-Host "🔍 Testing database connection..."
try {
    npx prisma db pull --schema=prisma/schema.prisma 2>`$null
    Write-Host "✅ Database connection: OK" -ForegroundColor Green
}
catch {
    Write-Host "❌ Database connection: FAILED" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Database health check completed" -ForegroundColor Green
"@

    $monitoringScript | Out-File -FilePath "scripts/monitor-database.ps1" -Encoding UTF8
    Write-Status "Monitoring script created (scripts/monitor-database.ps1)"
}

# Main setup function
function Start-Setup {
    Write-Host "🚀 Starting CodePal Production Database Setup..."
    Write-Host ""
    
    Test-Dependencies
    Install-Prisma
    New-ProductionEnv
    Invoke-PrismaGenerate
    
    Write-Host ""
    Write-Info "Next steps:"
    Write-Host "1. Update .env.production with your actual DATABASE_URL"
    Write-Host "2. Run: .\scripts\setup-production-database.ps1 test"
    Write-Host "3. Run: .\scripts\setup-production-database.ps1 migrate"
    Write-Host ""
    
    New-BackupScript
    New-MonitoringScript
    
    Write-Host ""
    Write-Status "Setup completed! Please configure your database connection string."
}

# Test database connection
function Test-Connection {
    Write-Host "🔍 Testing database connection..."
    Test-DatabaseConnection
}

# Run migrations
function Start-Migration {
    Write-Host "🔄 Running database migrations..."
    Invoke-DatabaseMigration
}

# Show help
function Show-Help {
    Write-Host "Usage: .\setup-production-database.ps1 [command]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  setup    - Complete database setup (default)"
    Write-Host "  test     - Test database connection"
    Write-Host "  migrate  - Run database migrations"
    Write-Host "  help     - Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\setup-production-database.ps1 setup"
    Write-Host "  .\setup-production-database.ps1 test"
    Write-Host "  .\setup-production-database.ps1 migrate"
}

# Parse command line arguments
switch ($Command) {
    "setup" {
        Start-Setup
    }
    "test" {
        Test-Connection
    }
    "migrate" {
        Start-Migration
    }
    { $_ -in @("help", "-h", "--help") } {
        Show-Help
    }
    default {
        Write-Host "Unknown command: $Command"
        Show-Help
        exit 1
    }
} 