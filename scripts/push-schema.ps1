# PowerShell script to push Prisma schema with .env.local variables
# Run with: .\scripts\push-schema.ps1

Write-Host "Loading environment variables from .env.local..." -ForegroundColor Cyan

# Load .env.local
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^=:#]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove quotes if present
            if ($value.StartsWith('"') -and $value.EndsWith('"')) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            if ($value.StartsWith("'") -and $value.EndsWith("'")) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "  Loaded $key" -ForegroundColor Green
        }
    }
} else {
    Write-Host ".env.local file not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Environment Variables:" -ForegroundColor Cyan
$hasPrisma = [bool]$env:POSTGRES_PRISMA_URL
$hasNonPooling = [bool]$env:POSTGRES_URL_NON_POOLING
Write-Host "  POSTGRES_PRISMA_URL: $hasPrisma" -ForegroundColor $(if ($hasPrisma) { "Green" } else { "Red" })
Write-Host "  POSTGRES_URL_NON_POOLING: $hasNonPooling" -ForegroundColor $(if ($hasNonPooling) { "Green" } else { "Red" })

if (-not $env:POSTGRES_PRISMA_URL -and -not $env:POSTGRES_URL_NON_POOLING) {
    Write-Host ""
    Write-Host "No database connection strings found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Pushing Prisma schema to database..." -ForegroundColor Cyan
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Schema pushed successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Schema push failed!" -ForegroundColor Red
    exit 1
}

