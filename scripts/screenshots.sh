#!/usr/bin/env bash
# Capture screenshots of the live tools into public/projects/ (used on project cards and pages).
# Usage: npm run screenshots
set -euo pipefail

mkdir -p public/projects
shoot() {
  npx --yes playwright@1 screenshot --viewport-size=1440,900 --wait-for-timeout=2500 "$2" "public/projects/$1.png"
  echo "✓ $1"
}

npx --yes playwright@1 install chromium >/dev/null
shoot devops-world https://devops.krishnaneupane.com
shoot domain-search https://domain-search.krishnaneupane.com
shoot tech-cheatsheet https://cheatsheet.krishnaneupane.com
shoot cron-job-generator https://cron-generator.krishnaneupane.com
