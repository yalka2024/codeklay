# Production Database Setup for CodePal Platform
param([string]$Action = "setup")

Write-Host "🗄️ CodePal Production Database Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check dependencies
Write-Host "✅ Checking dependencies..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies check passed" -ForegroundColor Green

# Install Prisma
Write-Host "✅ Installing Prisma..." -ForegroundColor Yellow
npm install -g prisma

# Create production environment file
Write-Host "✅ Creating production environment file..." -ForegroundColor Yellow

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
Write-Host "✅ Production environment file created (.env.production)" -ForegroundColor Green
Write-Host "⚠️  Please update the DATABASE_URL with your actual PostgreSQL connection string" -ForegroundColor Yellow

# Generate Prisma client
Write-Host "✅ Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Create backup script
Write-Host "✅ Creating backup script..." -ForegroundColor Yellow

$backupScript = @"
# Database Backup Script
param([string]`$BackupDir = "./backups")

if (!(Test-Path `$BackupDir)) {
    New-Item -ItemType Directory -Path `$BackupDir
}

`$Date = Get-Date -Format "yyyyMMdd_HHmmss"
`$BackupFile = "`$BackupDir/backup_`$Date.sql"

Write-Host "🗄️ Creating database backup..."
npx prisma db pull --schema=prisma/schema.prisma > `$BackupFile
Write-Host "✅ Backup created: `$BackupFile"

# Clean old backups
Get-ChildItem -Path `$BackupDir -Filter "backup_*.sql" | Where-Object { `$_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item
Write-Host "🧹 Cleaned up backups older than 7 days"
"@

$backupScript | Out-File -FilePath "backup-database.ps1" -Encoding UTF8

Write-Host ""
Write-Host "🎉 Setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update .env.production with your actual DATABASE_URL" -ForegroundColor White
Write-Host "2. Choose a database provider:" -ForegroundColor White
Write-Host "   - Vercel Postgres: https://vercel.com" -ForegroundColor White
Write-Host "   - Supabase: https://supabase.com" -ForegroundColor White
Write-Host "   - DigitalOcean: https://digitalocean.com" -ForegroundColor White
Write-Host "3. Run: npx prisma migrate deploy" -ForegroundColor White
Write-Host "4. Test: npx prisma db pull" -ForegroundColor White
Write-Host "" 