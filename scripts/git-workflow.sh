#!/bin/bash

# Git Workflow Helper Script
# Giúp thực hiện các thao tác git workflow một cách dễ dàng

set -e

# Màu sắc
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function để hiển thị help
show_help() {
  echo -e "${BLUE}Git Workflow Helper${NC}"
  echo ""
  echo "Usage: $0 [command] [options]"
  echo ""
  echo "Commands:"
  echo "  new-feature <name>     Tạo feature branch mới từ main"
  echo "  new-fix <name>         Tạo fix branch mới từ main"
  echo "  new-hotfix <name>      Tạo hotfix branch mới từ main"
  echo "  merge-staging          Merge current branch vào staging"
  echo "  merge-main             Merge current branch vào main (qua PR)"
  echo "  sync-main              Sync current branch với main"
  echo "  status                 Hiển thị branch status"
  echo "  help                   Hiển thị help này"
  echo ""
  echo "Examples:"
  echo "  $0 new-feature benchmark-report-api"
  echo "  $0 merge-staging"
  echo "  $0 status"
}

# Function để tạo feature branch
new_feature() {
  local feature_name=$1
  
  if [ -z "$feature_name" ]; then
    echo -e "${RED}Error: Feature name is required${NC}"
    echo "Usage: $0 new-feature <name>"
    exit 1
  fi
  
  local branch_name="feature/${feature_name}"
  
  echo -e "${BLUE}Creating feature branch: ${branch_name}${NC}"
  
  # Checkout main và pull latest
  echo -e "${YELLOW}Updating main branch...${NC}"
  git checkout main
  git pull origin main
  
  # Tạo feature branch
  echo -e "${YELLOW}Creating branch: ${branch_name}${NC}"
  git checkout -b "$branch_name"
  
  echo -e "${GREEN}✅ Feature branch created: ${branch_name}${NC}"
  echo -e "${BLUE}Next steps:${NC}"
  echo "  1. Develop your feature"
  echo "  2. Test local: npm run dev && npm run test:api"
  echo "  3. Commit: git add . && git commit -m 'feat: your message'"
  echo "  4. Push: git push origin $branch_name"
  echo "  5. Test on preview URL from Vercel Dashboard"
}

# Function để tạo fix branch
new_fix() {
  local fix_name=$1
  
  if [ -z "$fix_name" ]; then
    echo -e "${RED}Error: Fix name is required${NC}"
    echo "Usage: $0 new-fix <name>"
    exit 1
  fi
  
  local branch_name="fix/${fix_name}"
  
  echo -e "${BLUE}Creating fix branch: ${branch_name}${NC}"
  
  git checkout main
  git pull origin main
  git checkout -b "$branch_name"
  
  echo -e "${GREEN}✅ Fix branch created: ${branch_name}${NC}"
}

# Function để tạo hotfix branch
new_hotfix() {
  local hotfix_name=$1
  
  if [ -z "$hotfix_name" ]; then
    echo -e "${RED}Error: Hotfix name is required${NC}"
    echo "Usage: $0 new-hotfix <name>"
    exit 1
  fi
  
  local branch_name="hotfix/${hotfix_name}"
  
  echo -e "${BLUE}Creating hotfix branch: ${branch_name}${NC}"
  
  git checkout main
  git pull origin main
  git checkout -b "$branch_name"
  
  echo -e "${GREEN}✅ Hotfix branch created: ${branch_name}${NC}"
  echo -e "${YELLOW}⚠️  Remember to merge this back to staging after fixing production!${NC}"
}

# Function để merge vào staging
merge_staging() {
  local current_branch=$(git branch --show-current)
  
  if [ "$current_branch" = "main" ] || [ "$current_branch" = "staging" ]; then
    echo -e "${RED}Error: Cannot merge from $current_branch${NC}"
    exit 1
  fi
  
  echo -e "${BLUE}Merging ${current_branch} into staging${NC}"
  
  # Checkout staging và pull
  git checkout staging
  git pull origin staging
  
  # Merge feature branch
  git merge "$current_branch"
  
  # Push
  git push origin staging
  
  echo -e "${GREEN}✅ Merged ${current_branch} into staging${NC}"
  echo -e "${BLUE}Next steps:${NC}"
  echo "  1. Test on staging environment"
  echo "  2. If OK, create PR: staging → main"
}

# Function để sync với main
sync_main() {
  local current_branch=$(git branch --show-current)
  
  if [ "$current_branch" = "main" ]; then
    echo -e "${YELLOW}Already on main branch${NC}"
    exit 0
  fi
  
  echo -e "${BLUE}Syncing ${current_branch} with main${NC}"
  
  git checkout main
  git pull origin main
  git checkout "$current_branch"
  git merge main
  
  echo -e "${GREEN}✅ Synced ${current_branch} with main${NC}"
}

# Function để hiển thị status
show_status() {
  echo -e "${BLUE}Git Workflow Status${NC}"
  echo ""
  
  local current_branch=$(git branch --show-current)
  echo -e "Current branch: ${GREEN}${current_branch}${NC}"
  echo ""
  
  # Check if there are uncommitted changes
  if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    git status --short
  else
    echo -e "${GREEN}✅ Working directory is clean${NC}"
  fi
  
  echo ""
  
  # Show branch info
  if [ "$current_branch" != "main" ]; then
    local main_commit=$(git rev-parse main)
    local current_commit=$(git rev-parse HEAD)
    local base_commit=$(git merge-base main HEAD)
    
    if [ "$current_commit" = "$base_commit" ]; then
      echo -e "${YELLOW}⚠️  Branch is behind main${NC}"
      echo "Run: $0 sync-main"
    elif [ "$main_commit" = "$base_commit" ]; then
      echo -e "${GREEN}✅ Branch is up to date with main${NC}"
    else
      echo -e "${YELLOW}⚠️  Branch has diverged from main${NC}"
      echo "Run: $0 sync-main"
    fi
  fi
}

# Main command handler
case "$1" in
  new-feature)
    new_feature "$2"
    ;;
  new-fix)
    new_fix "$2"
    ;;
  new-hotfix)
    new_hotfix "$2"
    ;;
  merge-staging)
    merge_staging
    ;;
  sync-main)
    sync_main
    ;;
  status)
    show_status
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    echo -e "${RED}Unknown command: $1${NC}"
    echo ""
    show_help
    exit 1
    ;;
esac

