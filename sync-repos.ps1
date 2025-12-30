# PowerShell script to sync changes between boost2hire and king0fhearts9 repositories

Write-Host "🔄 Syncing repositories..." -ForegroundColor Cyan

# Fetch latest changes from both remotes
Write-Host "📥 Fetching from origin (boost2hire)..." -ForegroundColor Yellow
git fetch origin

Write-Host "📥 Fetching from collaborator (king0fhearts9)..." -ForegroundColor Yellow
git fetch collaborator

# Show current branch
$currentBranch = git branch --show-current
Write-Host "📍 Current branch: $currentBranch" -ForegroundColor Green

# Merge changes from collaborator
Write-Host "🔀 Merging changes from collaborator..." -ForegroundColor Yellow
git merge collaborator/main --no-edit
if ($LASTEXITCODE -ne 0) {
    git merge collaborator/master --no-edit
}

# Push to both remotes
Write-Host "📤 Pushing to origin (boost2hire)..." -ForegroundColor Yellow
git push origin $currentBranch

Write-Host "📤 Pushing to collaborator (king0fhearts9)..." -ForegroundColor Yellow
git push collaborator $currentBranch

Write-Host "✅ Sync complete!" -ForegroundColor Green

