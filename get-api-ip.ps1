$RESOURCE_GROUP = "WakiFin"
$CONTAINER_NAME = "wakifin-api"

Write-Host "📋 Отримання інформації про контейнер..." -ForegroundColor Cyan
Write-Host ""

# Отримайте всю інформацію
$ContainerInfo = az container show `
  --resource-group $RESOURCE_GROUP `
  --name $CONTAINER_NAME `
  --output json | ConvertFrom-Json

# Витяж IP адреси
$IP = $ContainerInfo.ipAddress.ip
$Port = $ContainerInfo.ipAddress.ports[0].port
$Status = $ContainerInfo.containers[0].instanceView.state
$CPU = $ContainerInfo.containers[0].resources.requests.cpu
$Memory = $ContainerInfo.containers[0].resources.requests.memory

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ КОНТЕЙНЕР ИНФОРМАЦІЯ" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "IP Адреса        : $IP" -ForegroundColor Yellow
Write-Host "Порт             : $Port" -ForegroundColor Yellow
Write-Host "Статус           : $Status" -ForegroundColor Yellow
Write-Host "CPU              : $CPU cores" -ForegroundColor Yellow
Write-Host "Пам'ять          : $Memory GB" -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "🌐 API URL: http://$IP:$Port" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""

# Тест API
Write-Host "🧪 Тестування API..." -ForegroundColor Yellow
$ApiUrl = "http://$IP:$Port/pages"

try {
    $Response = Invoke-WebRequest -Uri $ApiUrl -UseBasicParsing -TimeoutSec 5
    if ($Response.StatusCode -eq 200) {
        Write-Host "✅ API доступна!" -ForegroundColor Green
        Write-Host "Відповідь: $($Response.Content.Length) байт" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  API ще не відповідає (це нормально, контейнер може ще стартувати)" -ForegroundColor Yellow
    Write-Host "Повідомлення: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📝 Для Frontend замініть у docker-compose.azure.yml:" -ForegroundColor Cyan
Write-Host "   VITE_API_BASE: `"http://$IP:$Port`"" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Команди для перевірки логів:" -ForegroundColor Cyan
Write-Host "   az container logs --resource-group $RESOURCE_GROUP --name $CONTAINER_NAME -f" -ForegroundColor Gray
