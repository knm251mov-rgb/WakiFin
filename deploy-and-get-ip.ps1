param(
    [string]$ResourceGroup = "WakiFin",
    [string]$ContainerName = "wakifin-api",
    [string]$Image = "knm251mov/wakifin-api:latest",
    [string]$Location = "italynorth",
    [string]$DockerUsername = "knm251mov",
    [string]$DockerPassword = "Sasha2436",
    [string]$MongoUrl = "mongodb+srv://knm211_mov:adminadmin@cluster0.xyz4bnp.mongodb.net/wakifin?retryWrites=true&w=majority"
)

Write-Host "🗑️  Видалення старого контейнера..." -ForegroundColor Yellow
az container delete --resource-group $ResourceGroup --name $ContainerName --yes 2>$null
Write-Host "✅ Старий контейнер видалений" -ForegroundColor Green

Write-Host ""
Write-Host "⏳ Чекаємо 10 секунд..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "🚀 Створення нового контейнера..." -ForegroundColor Green

az container create `
  --resource-group $ResourceGroup `
  --name $ContainerName `
  --image $Image `
  --ports 3001 `
  --os-type Linux `
  --cpu 1 `
  --memory 1.5 `
  --environment-variables `
    PORT=3001 `
    HOST=0.0.0.0 `
    "MONGO_URL=$MongoUrl" `
    NODE_ENV=production `
  --location $Location `
  --registry-login-server index.docker.io `
  --registry-username $DockerUsername `
  --registry-password $DockerPassword

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Контейнер успішно створений!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⏳ Чекаємо 30 секунд на присвоєння IP адреси..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    $ContainerInfo = az container show `
      --resource-group $ResourceGroup `
      --name $ContainerName `
      --output json | ConvertFrom-Json
    
    if ($ContainerInfo.ipAddress.ip) {
        $IP = $ContainerInfo.ipAddress.ip
        Write-Host ""
        Write-Host "✅ IP адреса отримана успішно!" -ForegroundColor Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host "API адреса: http://$IP:3001" -ForegroundColor Cyan
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Тест API:" -ForegroundColor Yellow
        Write-Host "curl http://$IP:3001/pages"
        Write-Host ""
        Write-Host "Статус контейнера:" -ForegroundColor Yellow
        Write-Host "Status: $($ContainerInfo.containers[0].instanceView.state)"
        Write-Host "CPU: $($ContainerInfo.containers[0].resources.requests.cpu)"
        Write-Host "Memory: $($ContainerInfo.containers[0].resources.requests.memory) GB"
    } else {
        Write-Host "⚠️  IP адреса ще не присвоєна. Статус:" -ForegroundColor Yellow
        Write-Host "Status: $($ContainerInfo.containers[0].instanceView.state)"
        Write-Host ""
        Write-Host "Попробуйте ще раз через 1 хвилину:"
        Write-Host ".\deploy-and-get-ip.ps1"
    }
} else {
    Write-Host "❌ Помилка при створенні контейнера!" -ForegroundColor Red
    exit 1
}
