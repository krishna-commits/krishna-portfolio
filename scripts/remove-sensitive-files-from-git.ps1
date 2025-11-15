# PowerShell script to remove sensitive files from git tracking (keeps them locally)
# Run this script: .\scripts\remove-sensitive-files-from-git.ps1

Write-Host "Removing sensitive files from git tracking..." -ForegroundColor Yellow
Write-Host "These files will remain on your local system but won't be tracked by git." -ForegroundColor Yellow
Write-Host ""

# Remove admin panel files from git tracking
if (Test-Path "app\admin") {
    git rm -r --cached app/admin/ 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Removed app/admin/ from git tracking" -ForegroundColor Green
    } else {
        Write-Host "app/admin/ not in git or already removed" -ForegroundColor Gray
    }
}

if (Test-Path "app\api\admin") {
    git rm -r --cached app/api/admin/ 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Removed app/api/admin/ from git tracking" -ForegroundColor Green
    } else {
        Write-Host "app/api/admin/ not in git or already removed" -ForegroundColor Gray
    }
}

# Remove auth file from git tracking
if (Test-Path "lib\auth.ts") {
    git rm --cached lib/auth.ts 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Removed lib/auth.ts from git tracking" -ForegroundColor Green
    } else {
        Write-Host "lib/auth.ts not in git or already removed" -ForegroundColor Gray
    }
}

# Remove environment files
$envFiles = @(".env", ".env.local", ".env.production", ".env.development")
foreach ($envFile in $envFiles) {
    if (Test-Path $envFile) {
        git rm --cached $envFile 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Removed $envFile from git tracking" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Done! Files have been removed from git tracking." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Commit these changes: git commit -m 'Remove sensitive files from git tracking'" -ForegroundColor Cyan
Write-Host "2. Make sure .gitignore is properly configured before pushing!" -ForegroundColor Cyan
Write-Host "3. Push to GitHub: git push origin main" -ForegroundColor Cyan
Write-Host ""

