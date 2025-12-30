#!/bin/bash
# Script to sync changes between boost2hire and king0fhearts9 repositories

echo "🔄 Syncing repositories..."

# Fetch latest changes from both remotes
echo "📥 Fetching from origin (boost2hire)..."
git fetch origin

echo "📥 Fetching from collaborator (king0fhearts9)..."
git fetch collaborator

# Show current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Merge changes from collaborator
echo "🔀 Merging changes from collaborator..."
git merge collaborator/main --no-edit || git merge collaborator/master --no-edit

# Push to both remotes
echo "📤 Pushing to origin (boost2hire)..."
git push origin $CURRENT_BRANCH

echo "📤 Pushing to collaborator (king0fhearts9)..."
git push collaborator $CURRENT_BRANCH

echo "✅ Sync complete!"

