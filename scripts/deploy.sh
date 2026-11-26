#!/usr/bin/env bash
# Publishes the website to https://ireneyuyuu.github.io/
#
#   npm run deploy                         (uses the message "Update portfolio")
#   npm run deploy -- "Add library project"
#
# It checks that the site builds, saves your changes with Git, and uploads
# them to GitHub. GitHub then rebuilds and publishes the site by itself
# (.github/workflows/deploy.yml), usually within 1–2 minutes.
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/bin:$PATH"

msg="${1:-Update portfolio}"

echo "1/4  Checking that the site builds…"
npm run build --silent

echo "2/4  Saving your changes…"
git add -A
if git diff --cached --quiet; then
  echo "     (no new changes)"
else
  git commit -q -m "$msg"
fi

echo "3/4  Fetching anything changed on GitHub since last time…"
git pull --rebase -q

if [ -z "$(git log --oneline '@{u}..HEAD')" ]; then
  echo ""
  echo "✓ Nothing new to publish: the website is already up to date."
  echo "  Website:  https://ireneyuyuu.github.io/"
  exit 0
fi

echo "4/4  Uploading to GitHub…"
git push -q

echo ""
echo "✓ Uploaded. GitHub is publishing it now (about 1–2 minutes)."
echo "  Progress: https://github.com/ireneyuyuu/ireneyuyuu.github.io/actions"
echo "  Website:  https://ireneyuyuu.github.io/"
