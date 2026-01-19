param(
    [string]$ApiIP = "1.2.3.4",  # ⚠️ Замініть на реальну IP
    [string]$ResourceGroup = "WakiFin",
    [string]$PlanName = "WakiFin-plan",
    [string]$WebAppName = "wakifin-frontend",
    [string]$Image = "knm251mov/wakifin-frontend:latest",
    [string]$DockerUsername = "knm251mov",
    [string]$DockerPassword = "Sasha2436"
)

Write-Host "🏗️  Фаза 1: Збірка Docker образу..." -ForegroundColor Cyan
Set-Location frontend
docker build -f Dockerfile.prod -t $Image .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Помилка при збірці образу!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📤 Фаза 2: Залиття образу на Docker Hub..." -ForegroundColor Cyan
docker push $Image
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Помилка при залитті образу!" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "☁️  Фаза 3: Створення Web App на Azure..." -ForegroundColor Cyan
az webapp create `
  --resource-group $ResourceGroup `
  --plan $PlanName `
  --name $WebAppName `
  --deployment-container-image-name $Image

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Web App вже існує, оновлюємо конфігурацію..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Фаза 4: Налаштування Docker реєстру..." -ForegroundColor Cyan
az webapp config container set `
  --name $WebAppName `
  --resource-group $ResourceGroup `
  --docker-custom-image-name $Image `
  --docker-registry-server-url https://index.docker.io/v1/ `
  --docker-registry-server-user $DockerUsername `
  --docker-registry-server-password $DockerPassword

Write-Host ""
Write-Host "⚙️  Фаза 5: Налаштування App Settings..." -ForegroundColor Cyan
az webapp config appsettings set `
  --resource-group $ResourceGroup `
  --name $WebAppName `
  --settings `
    "VITE_API_BASE=http://$ApiIP:3001" `
    WEBSITES_PORT=3000 `
    NODE_ENV=production

Write-Host ""
Write-Host "📋 Фаза 6: Отримання інформації..." -ForegroundColor Cyan
$WebAppInfo = az webapp show `
  --resource-group $ResourceGroup `
  --name $WebAppName `
  --output json | ConvertFrom-Json

$WebAppUrl = $WebAppInfo.defaultHostName

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ FRONTEND УСПІШНО РОЗГОРНУТИЙ!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend URL: https://$WebAppUrl" -ForegroundColor Cyan
Write-Host "🌐 Frontend URL: http://$WebAppUrl" -ForegroundColor Cyan
Write-Host "⚙️  API Base: http://$ApiIP:3001" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 Логи контейнера:" -ForegroundColor Yellow
Write-Host "az webapp log tail --name $WebAppName --resource-group $ResourceGroup"
Write-Host ""
