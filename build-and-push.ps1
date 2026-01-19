$DOCKER_USERNAME = "knm251mov"
$DOCKER_PASSWORD = "Sasha2436"

Write-Host "🔐 Вход в Docker Hub..." -ForegroundColor Green
$DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin

Write-Host ""
Write-Host "🏗️  Збірка API образу..." -ForegroundColor Cyan
Set-Location api
docker build -t "$DOCKER_USERNAME/wakifin-api:latest" .
Set-Location ..

Write-Host ""
Write-Host "📤 Залиття API образу на Docker Hub..." -ForegroundColor Yellow
docker push "$DOCKER_USERNAME/wakifin-api:latest"

Write-Host ""
Write-Host "🏗️  Збірка Frontend образу..." -ForegroundColor Cyan
Set-Location frontend
docker build -f Dockerfile.prod -t "$DOCKER_USERNAME/wakifin-frontend:latest" .
Set-Location ..

Write-Host ""
Write-Host "📤 Залиття Frontend образу на Docker Hub..." -ForegroundColor Yellow
docker push "$DOCKER_USERNAME/wakifin-frontend:latest"

Write-Host ""
Write-Host "✅ Всі образи успішно залиті на Docker Hub!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Доступні образи:" -ForegroundColor Cyan
docker image ls | Select-String $DOCKER_USERNAME
