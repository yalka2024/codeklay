# CodePal Branch Merge Script (PowerShell)
# This script merges all 4 branches into one called "codepal"

Write-Host "🚀 Starting CodePal Branch Merge Process..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Step 1: Check current status
Write-Host "📋 Step 1: Checking current repository status..." -ForegroundColor Yellow
git status

# Step 2: Fetch all remote branches
Write-Host "📥 Step 2: Fetching all remote branches..." -ForegroundColor Yellow
git fetch origin

# Step 3: List all available branches
Write-Host "🌿 Step 3: Available branches:" -ForegroundColor Yellow
git branch -a

# Step 4: Create backup branch
Write-Host "💾 Step 4: Creating backup branch..." -ForegroundColor Yellow
$backupName = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git checkout -b $backupName
Write-Host "✅ Backup branch created: $backupName" -ForegroundColor Green

# Step 5: Create new codepal branch from fix/critical-security-issues
Write-Host "🆕 Step 5: Creating new 'codepal' branch..." -ForegroundColor Yellow
git checkout fix/critical-security-issues
git checkout -b codepal
Write-Host "✅ New 'codepal' branch created" -ForegroundColor Green

# Step 6: Merge branches sequentially
Write-Host "🔀 Step 6: Merging branches..." -ForegroundColor Yellow

# Merge devin/1752214014-collaborative-enterprise-features
Write-Host "Merging devin/1752214014-collaborative-enterprise-features..." -ForegroundColor Cyan
git merge origin/devin/1752214014-collaborative-enterprise-features --no-edit
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully merged devin/1752214014-collaborative-enterprise-features" -ForegroundColor Green
} else {
    Write-Host "⚠️  Conflicts detected in devin/1752214014-collaborative-enterprise-features merge" -ForegroundColor Yellow
    Write-Host "Please resolve conflicts manually and then continue" -ForegroundColor Red
    exit 1
}

# Merge robust-platform-v1
Write-Host "Merging robust-platform-v1..." -ForegroundColor Cyan
git merge origin/robust-platform-v1 --no-edit
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully merged robust-platform-v1" -ForegroundColor Green
} else {
    Write-Host "⚠️  Conflicts detected in robust-platform-v1 merge" -ForegroundColor Yellow
    Write-Host "Please resolve conflicts manually and then continue" -ForegroundColor Red
    exit 1
}

# Step 7: Check final status
Write-Host "📊 Step 7: Checking final merge status..." -ForegroundColor Yellow
git status

# Step 8: Install dependencies and test
Write-Host "🧪 Step 8: Installing dependencies and testing..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 9: Build project
Write-Host "🔨 Step 9: Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Project built successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Step 10: Push new branch
Write-Host "📤 Step 10: Pushing new 'codepal' branch..." -ForegroundColor Yellow
git push origin codepal
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed 'codepal' branch to remote" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push branch" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 MERGE COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ All branches merged into 'codepal'" -ForegroundColor Green
Write-Host "✅ Backup created: $backupName" -ForegroundColor Green
Write-Host "✅ Project builds successfully" -ForegroundColor Green
Write-Host "✅ New branch pushed to remote" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Set 'codepal' as default branch in GitHub settings" -ForegroundColor White
Write-Host "2. Update branch protection rules" -ForegroundColor White
Write-Host "3. Clean up old branches (optional)" -ForegroundColor White
Write-Host "4. Update documentation" -ForegroundColor White 