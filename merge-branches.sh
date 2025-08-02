#!/bin/bash

# CodePal Branch Merge Script
# This script merges all 4 branches into one called "codepal"

echo "🚀 Starting CodePal Branch Merge Process..."
echo "=========================================="

# Step 1: Check current status
echo "📋 Step 1: Checking current repository status..."
git status

# Step 2: Fetch all remote branches
echo "📥 Step 2: Fetching all remote branches..."
git fetch origin

# Step 3: List all available branches
echo "🌿 Step 3: Available branches:"
git branch -a

# Step 4: Create new codepal branch from current branch
echo "🆕 Step 4: Creating new 'codepal' branch..."
git checkout -b codepal

# Step 5: Merge each branch one by one
echo "🔀 Step 5: Merging branches..."

# Merge devin/1752214014-collaborative-enterprise-features
echo "Merging devin/1752214014-collaborative-enterprise-features..."
git merge origin/devin/1752214014-collaborative-enterprise-features --no-edit

# Merge fix/critical-security-issues
echo "Merging fix/critical-security-issues..."
git merge origin/fix/critical-security-issues --no-edit

# Merge robust-platform-v1
echo "Merging robust-platform-v1..."
git merge origin/robust-platform-v1 --no-edit

# Step 6: Check for conflicts and resolve them
echo "🔍 Step 6: Checking for merge conflicts..."
if git status --porcelain | grep -q "^UU"; then
    echo "⚠️  Merge conflicts detected. Please resolve them manually:"
    git status
    echo "After resolving conflicts, run:"
    echo "  git add ."
    echo "  git commit -m 'Resolve merge conflicts'"
else
    echo "✅ No merge conflicts detected!"
fi

# Step 7: Push the new merged branch
echo "📤 Step 7: Pushing new 'codepal' branch to remote..."
git push origin codepal

# Step 8: Set codepal as the default branch (optional)
echo "🎯 Step 8: Setting 'codepal' as default branch..."
echo "Note: You may need to set this manually in GitHub settings"

# Step 9: Clean up old branches (optional)
echo "🧹 Step 9: Clean up old branches (optional)..."
echo "To delete old branches after confirming merge is successful:"
echo "  git push origin --delete devin/1752214014-collaborative-enterprise-features"
echo "  git push origin --delete fix/critical-security-issues"
echo "  git push origin --delete robust-platform-v1"

echo "✅ Merge process completed!"
echo "=========================================="
echo "New merged branch: codepal"
echo "Check the repository to ensure everything merged correctly." 