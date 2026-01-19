#!/bin/bash

# Налаштування
RESOURCE_GROUP="WakiFin"
CONTAINER_NAME="wakifin-api"
IMAGE="knm251mov/wakifin-api:latest"
LOCATION="italynorth"
DOCKER_USERNAME="knm251mov"
DOCKER_PASSWORD="Sasha2436"

echo "🚀 Розгортання API контейнера..."

az container create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$CONTAINER_NAME" \
  --image "$IMAGE" \
  --ports 3001 \
  --os-type Linux \
  --cpu 1 \
  --memory 1 \
  --environment-variables \
    PORT=3001 \
    HOST=0.0.0.0 \
    "MONGO_URL=mongodb+srv://knm211_mov:adminadmin@cluster0.xyz4bnp.mongodb.net/wakifin?retryWrites=true&w=majority" \
    NODE_ENV=production \
  --location "$LOCATION" \
  --registry-login-server index.docker.io \
  --registry-username "$DOCKER_USERNAME" \
  --registry-password "$DOCKER_PASSWORD"

if [ $? -eq 0 ]; then
  echo "✅ Контейнер успішно розгорнутий!"
  echo ""
  echo "⏳ Чекаємо на присвоєння IP адреси (це може зайняти 30 секунд)..."
  sleep 30
  
  IP=$(az container show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$CONTAINER_NAME" \
    --query ipAddress.ip \
    --output tsv)
  
  echo "✅ API доступна за адресою:"
  echo "🌐 http://$IP:3001"
  echo ""
  echo "Тест API:"
  echo "curl http://$IP:3001/pages"
else
  echo "❌ Помилка при розгортанні!"
  exit 1
fi
