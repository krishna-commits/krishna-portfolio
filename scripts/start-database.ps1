# PowerShell script to start PostgreSQL database with Docker

Write-Host "Starting PostgreSQL database..." -ForegroundColor Cyan

# Check if Docker is running
$dockerRunning = $true
try {
    docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        $dockerRunning = $false
    }
} catch {
    $dockerRunning = $false
}

if (-not $dockerRunning) {
    Write-Host "✗ Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✓ Docker is running" -ForegroundColor Green
}

# Check if container already exists
$existingContainer = docker ps -a --filter "name=portfolio-postgres" --format "{{.Names}}"

if ($existingContainer -match "portfolio-postgres") {
    Write-Host "Found existing container: portfolio-postgres" -ForegroundColor Yellow
    Write-Host "Starting container..." -ForegroundColor Cyan
    docker start portfolio-postgres
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Container started successfully!" -ForegroundColor Green
        Start-Sleep -Seconds 3
        Write-Host ""
        Write-Host "You can now run: npx prisma db push" -ForegroundColor Cyan
        exit 0
    } else {
        Write-Host "✗ Failed to start container" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Creating new PostgreSQL container..." -ForegroundColor Cyan
    
    # Generate a random password
    $password = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 16 | ForEach-Object {[char]$_})
    
    Write-Host "Generated password: $password" -ForegroundColor Yellow
    Write-Host "Save this password for your .env file!" -ForegroundColor Yellow
    
    docker run --name portfolio-postgres `
        -e POSTGRES_PASSWORD=$password `
        -e POSTGRES_USER=portfolio_user `
        -e POSTGRES_DB=portfolio `
        -p 5432:5432 `
        -d postgres:16-alpine
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Container created and started successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Add these to your .env file:" -ForegroundColor Cyan
        
        # Build URLs using proper string concatenation to avoid ampersand issues
        $baseUrl = "postgresql://portfolio_user:$password@localhost:5432/portfolio"
        $prismaUrl = "$baseUrl" + "?pgbouncer=true" + "&connect_timeout=15"
        $nonPoolingUrl = "$baseUrl"
        
        Write-Host "POSTGRES_PRISMA_URL=`"$prismaUrl`"" -ForegroundColor White
        Write-Host "POSTGRES_URL_NON_POOLING=`"$nonPoolingUrl`"" -ForegroundColor White
        Write-Host ""
        
        # Wait for database to be ready
        Write-Host "Waiting for database to be ready..." -ForegroundColor Cyan
        Start-Sleep -Seconds 5
        
        # Verify connection
        $maxAttempts = 10
        $attempt = 0
        $ready = $false
        
        while ($attempt -lt $maxAttempts -and -not $ready) {
            $attempt++
            docker exec portfolio-postgres pg_isready -U portfolio_user 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                $ready = $true
                Write-Host "✓ Database is ready!" -ForegroundColor Green
                Write-Host ""
                Write-Host "You can now run: npx prisma db push" -ForegroundColor Cyan
                exit 0
            }
            Start-Sleep -Seconds 2
        }
        
        if (-not $ready) {
            Write-Host "⚠ Database might still be starting. Try running 'npx prisma db push' in a moment." -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ Failed to create container" -ForegroundColor Red
        exit 1
    }
}
