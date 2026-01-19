#!/bin/bash

set -e

DOCKER_USERNAME="knm251mov"
DOCKER_PASSWORD="Sasha2436"

echo "🔐 Вход в Docker Hub..."
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

echo ""
echo "🏗️  Збірка API образу..."
cd api
docker build -t $DOCKER_USERNAME/wakifin-api:latest .
cd ..

echo "📤 Залиття API образу на Docker Hub..."
docker push $DOCKER_USERNAME/wakifin-api:latest

echo ""
echo "🏗️  Збірка Frontend образу..."
cd frontend
docker build -f Dockerfile.prod -t $DOCKER_USERNAME/wakifin-frontend:latest .
cd ..

echo "📤 Залиття Frontend образу на Docker Hub..."
docker push $DOCKER_USERNAME/wakifin-frontend:latest

echo ""
echo "✅ Всі образи успішно залиті на Docker Hub!"
echo ""
echo "📋 Доступні образи:"
docker image ls | grep "$DOCKER_USERNAME"
