#!/bin/bash
# Script to remove sensitive files from git tracking (keeps them locally)
# Run this script: bash scripts/remove-sensitive-files-from-git.sh

echo "Removing sensitive files from git tracking..."
echo "These files will remain on your local system but won't be tracked by git."

# Remove admin panel files from git tracking
git rm -r --cached app/admin/ 2>/dev/null || echo "app/admin/ not in git or already removed"
git rm -r --cached app/api/admin/ 2>/dev/null || echo "app/api/admin/ not in git or already removed"

# Remove auth file from git tracking
git rm --cached lib/auth.ts 2>/dev/null || echo "lib/auth.ts not in git or already removed"

# Remove environment files
git rm --cached .env .env.local .env.production .env.development 2>/dev/null || echo "Env files not in git or already removed"

echo ""
echo "Done! Files have been removed from git tracking."
echo "Now commit these changes: git commit -m 'Remove sensitive files from git tracking'"
echo ""
echo "Important: Make sure these files are properly excluded in .gitignore before pushing!"

