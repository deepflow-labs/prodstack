#!/bin/bash

# GitHub Repository Setup Script
# Applies settings from .github/repository-settings.json to the current repository

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 GitHub Repository Setup${NC}"
echo ""

# Check if we're in a git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo -e "${RED}❌ Error: Not in a git repository${NC}"
  exit 1
fi

# Check if gh is installed
if ! command -v gh &> /dev/null; then
  echo -e "${RED}❌ Error: GitHub CLI (gh) is not installed${NC}"
  echo "Install it from: https://cli.github.com/"
  exit 1
fi

# Check if gh is authenticated
if ! gh auth status > /dev/null 2>&1; then
  echo -e "${RED}❌ Error: GitHub CLI not authenticated${NC}"
  echo "Run: ${YELLOW}gh auth login${NC}"
  exit 1
fi

# Check if settings file exists
SETTINGS_FILE=".github/repository-settings.json"
if [ ! -f "$SETTINGS_FILE" ]; then
  echo -e "${RED}❌ Error: Settings file not found: $SETTINGS_FILE${NC}"
  exit 1
fi

echo -e "${GREEN}✓${NC} Prerequisites checked"
echo ""

# Get repository info
REPO_INFO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo -e "Repository: ${BLUE}$REPO_INFO${NC}"
echo ""

# Confirm before proceeding
read -p "Apply GitHub settings to this repository? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

echo ""

# Step 1: Apply repository settings
echo -e "${BLUE}📋 Step 1/2: Applying repository settings...${NC}"

# Auto-delete branches after merge
echo -ne "  → Auto-delete branches after merge... "
gh api repos/:owner/:repo -X PATCH --field delete_branch_on_merge=true > /dev/null
echo -e "${GREEN}✓${NC}"

# Squash merge settings
echo -ne "  → Configuring merge options... "
gh api repos/:owner/:repo -X PATCH \
  --field allow_squash_merge=true \
  --field allow_merge_commit=true \
  --field allow_rebase_merge=true \
  --field allow_auto_merge=false \
  --field use_squash_pr_title_as_default=false \
  --field squash_merge_commit_message=COMMIT_MESSAGES \
  --field squash_merge_commit_title=COMMIT_OR_PR_TITLE > /dev/null
echo -e "${GREEN}✓${NC}"

echo ""

# Step 2: Apply branch protection
echo -e "${BLUE}📋 Step 2/2: Applying branch protection rules...${NC}"

# Get default branch
DEFAULT_BRANCH=$(gh api repos/:owner/:repo | jq -r '.default_branch')
echo -e "  → Protecting branch: ${YELLOW}$DEFAULT_BRANCH${NC}"

# Check if branch naming workflow exists
if [ ! -f ".github/workflows/branch-naming.yml" ]; then
  echo -e "  ${YELLOW}⚠️  Warning: Branch naming workflow not found${NC}"
  echo -e "     Applying protection without status checks..."
  echo -e "     Add 'check-branch-name' to required checks after first workflow run."

  # Apply protection without status checks
  gh api "repos/:owner/:repo/branches/$DEFAULT_BRANCH/protection" -X PUT --input - <<'EOF'
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
else
  # Apply protection with status checks
  gh api "repos/:owner/:repo/branches/$DEFAULT_BRANCH/protection" -X PUT --input - <<'EOF'
{
  "required_status_checks": {
    "strict": false,
    "contexts": ["check-branch-name"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
fi

echo -ne "  → Branch protection configured... "
echo -e "${GREEN}✓${NC}"

echo ""
echo -e "${GREEN}🎉 GitHub repository setup complete!${NC}"
echo ""
echo -e "${BLUE}Settings applied:${NC}"
echo -e "  ${GREEN}✓${NC} Require 1 approval before merge"
echo -e "  ${GREEN}✓${NC} Dismiss stale reviews on new commits"
echo -e "  ${GREEN}✓${NC} Auto-delete branches after merge"
echo -e "  ${GREEN}✓${NC} Prevent force pushes to $DEFAULT_BRANCH"
echo -e "  ${GREEN}✓${NC} Prevent deletion of $DEFAULT_BRANCH branch"

if [ -f ".github/workflows/branch-naming.yml" ]; then
  echo -e "  ${GREEN}✓${NC} Require branch naming convention (feat/, fix/, etc.)"
fi

echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Create a new branch: ${YELLOW}git checkout -b feat/your-feature${NC}"
echo -e "  2. Make changes and push"
echo -e "  3. Create a PR and verify checks run"
echo ""
echo -e "For more details, see: ${YELLOW}docs/github-setup.md${NC}"
