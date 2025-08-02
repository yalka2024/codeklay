# CodePal Branch Merge Script (PowerShell)
# Merges 4 branches (fix/critical-security-issues, devin/1752214014-collaborative-enterprise-features, robust-platform-v1, codepal) into a new local 'codepal' branch.
# Run in the repo root after setup (git init, remote add, fetch, checkout fix/critical-security-issues).

Write-Host "🚀 Starting CodePal Branch Merge Process..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Check if it's a Git repo
Write-Host "🔍 Checking if this is a Git repository..." -ForegroundColor Yellow
git rev-parse --is-inside-work-tree > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: This is not a Git repository. Ensure repo is initialized." -ForegroundColor Red
    exit 1
}

# Step 1: Check current status
Write-Host "📋 Step 1: Checking current repository status..." -ForegroundColor Yellow
git status
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to check status. Ensure Git is working." -ForegroundColor Red
    exit 1
}

# Step 2: Fetch all remote branches
Write-Host "📥 Step 2: Fetching all remote branches..." -ForegroundColor Yellow
git fetch origin
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to fetch remote branches. Check your remote URL or network." -ForegroundColor Red
    exit 1
}

# Step 3: List all available branches
Write-Host "🌿 Step 3: Available branches:" -ForegroundColor Yellow
git branch -a

# Step 4: Create backup branch
Write-Host "💾 Step 4: Creating backup branch..." -ForegroundColor Yellow
$backupName = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git checkout -b $backupName
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create backup branch." -ForegroundColor Red
    exit 1
}
# Optional: Push backup to remote
# git push origin $backupName
Write-Host "✅ Backup branch created: $backupName" -ForegroundColor Green

# Step 5: Create new codepal branch from fix/critical-security-issues
Write-Host "🆕 Step 5: Creating new 'codepal' branch from fix/critical-security-issues..." -ForegroundColor Yellow
git checkout fix/critical-security-issues
git checkout -b codepal
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create 'codepal' branch. Ensure 'fix/critical-security-issues' is checked out." -ForegroundColor Red
    exit 1
}
Write-Host "✅ New 'codepal' branch created" -ForegroundColor Green

# Step 6: Merge branches sequentially
Write-Host "🔀 Step 6: Merging branches..." -ForegroundColor Yellow

$branchesToMerge = @(
    "origin/devin/1752214014-collaborative-enterprise-features",
    "origin/robust-platform-v1",
    "origin/codepal"
)

foreach ($branch in $branchesToMerge) {
    Write-Host "Merging $branch..." -ForegroundColor Cyan
    git merge $branch --no-edit
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully merged $branch" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Conflicts detected in $branch merge" -ForegroundColor Yellow
        Write-Host "Please resolve conflicts manually:" -ForegroundColor Red
        Write-Host "1. Open conflicting files in an editor (e.g., code . for VS Code)." -ForegroundColor Red
        Write-Host "2. Resolve conflicts (look for <<<<<<< markers), then run:" -ForegroundColor Red
        Write-Host "   git add <file>" -ForegroundColor Red
        Write-Host "   git commit" -ForegroundColor Red
        Write-Host "3. Re-run the script or continue manually: git merge <next-branch> --no-edit" -ForegroundColor Red
        git status
        exit 1
    }
}

# Step 7: Push the merged branch
Write-Host "📤 Step 7: Pushing merged 'codepal' branch to remote..." -ForegroundColor Yellow
git push origin codepal --force
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Merge complete! 'codepal' branch is now updated on remote." -ForegroundColor Green
} else {
    Write-Host "❌ Push failed. Check your remote setup, permissions, or if 'codepal' already exists." -ForegroundColor Red
    exit 1
}