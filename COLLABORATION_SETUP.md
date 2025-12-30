# Collaboration Setup Guide

## Current Setup

- **Origin (Your repo)**: `https://github.com/boost2hire/Deimos-Smart-mirror.git`
- **Collaborator**: `king0fhearts9`

## Setup Steps

### 1. Add Collaborator Remote

First, you need to know the exact repository URL of king0fhearts9. Then run:

```bash
git remote add collaborator https://github.com/king0fhearts9/REPOSITORY_NAME.git
```

### 2. Verify Remotes

```bash
git remote -v
```

You should see:
- `origin` → boost2hire repository
- `collaborator` → king0fhearts9 repository

## Syncing Changes

### Manual Sync

#### To pull changes from collaborator:
```bash
git fetch collaborator
git merge collaborator/main
# or
git merge collaborator/master
```

#### To push your changes to both repositories:
```bash
git push origin <branch-name>
git push collaborator <branch-name>
```

### Using Sync Script (Windows PowerShell)

```powershell
.\sync-repos.ps1
```

### Using Sync Script (Linux/Mac)

```bash
chmod +x sync-repos.sh
./sync-repos.sh
```

## Workflow Recommendations

1. **Before starting work**: Always fetch latest changes
   ```bash
   git fetch origin
   git fetch collaborator
   ```

2. **After making changes**: Push to both remotes
   ```bash
   git push origin <branch-name>
   git push collaborator <branch-name>
   ```

3. **To sync collaborator's changes**: Merge their branch
   ```bash
   git fetch collaborator
   git merge collaborator/main
   ```

## Important Notes

- Make sure both repositories have the same branch names (main/master)
- Always communicate with your collaborator before merging changes
- Consider using pull requests for code review before merging

