#!/usr/bin/env bash
# One-time: enable free GitHub Pages from the gh-pages branch (requires admin token or gh auth).
# GITHUB_TOKEN in Actions cannot do this the first time — GitHub requires repo admin.
set -euo pipefail

OWNER="${OWNER:-sbkoth}"
REPO="${REPO:-sbkoth-intro-page}"
BRANCH="${BRANCH:-gh-pages}"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI required. Install: https://cli.github.com/" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Authenticate once: gh auth login -h github.com -p ssh -s repo" >&2
  exit 1
fi

echo "Enabling GitHub Pages for ${OWNER}/${REPO} from branch ${BRANCH}..."
# Prefer branch source (works with peaceiris deploy)
if gh api -X POST "repos/${OWNER}/${REPO}/pages" \
  -f "source[branch]=${BRANCH}" \
  -f "source[path]=/" 2>/dev/null; then
  echo "Pages site created."
else
  echo "Create failed (may already exist); updating source..."
  gh api -X PUT "repos/${OWNER}/${REPO}/pages" \
    -f "source[branch]=${BRANCH}" \
    -f "source[path]=/" || true
fi

echo "Pages status:"
gh api "repos/${OWNER}/${REPO}/pages"
echo
echo "Site URL: https://${OWNER}.github.io/${REPO}/"
