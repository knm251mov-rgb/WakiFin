# Налаштування
$RESOURCE_GROUP = "WakiFin"
$CONTAINER_NAME = "wakifin-api"
$IMAGE = "knm251mov/wakifin-api:latest"
$LOCATION = "italynorth"
$DOCKER_USERNAME = "knm251mov"
$DOCKER_PASSWORD = "Sasha2436"
$MONGO_URL = "mongodb+srv://knm211_mov:adminadmin@cluster0.xyz4bnp.mongodb.net/wakifin?retryWrites=true&w=majority"

Write-Host "🚀 Розгортання API контейнера..." -ForegroundColor Green

az container create `
  --resource-group $RESOURCE_GROUP `
  --name $CONTAINER_NAME `
  --image $IMAGE `
  --ports 3001 `
  --os-type Linux `
  --cpu 1 `
  --memory 1 `
  --environment-variables `
    PORT=3001 `
    HOST=0.0.0.0 `
    MONGO_URL=$MONGO_URL `
    NODE_ENV=production `
  --location $LOCATION `
  --registry-login-server index.docker.io `
  --registry-username $DOCKER_USERNAME `
  --registry-password $DOCKER_PASSWORD

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Контейнер успішно розгорнутий!" -ForegroundColor Green
  Write-Host ""
  Write-Host "⏳ Чекаємо на присвоєння IP адреси..." -ForegroundColor Yellow
  Start-Sleep -Seconds 30
  
  $IP = az container show `
    --resource-group $RESOURCE_GROUP `
    --name $CONTAINER_NAME `
    --query ipAddress.ip `
    --output tsv
  
  Write-Host "✅ API доступна за адресою:" -ForegroundColor Green
  Write-Host "🌐 http://$IP`:3001" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "Тест API:" -ForegroundColor Yellow
  Write-Host "curl http://$IP`:3001/pages"
} else {
  Write-Host "❌ Помилка при розгортанні!" -ForegroundColor Red
  exit 1
}
