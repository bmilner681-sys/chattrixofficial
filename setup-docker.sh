#!/bin/bash

# Chattrix Docker Setup Verification Script
# This script checks prerequisites and builds Docker images

set -e

echo "🐳 Chattrix Docker Setup"
echo "======================="
echo ""

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    echo "   Please install Docker from https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker is installed: $(docker --version)"

# Check Docker Compose
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi

echo "✅ Docker Compose is installed: $(docker compose version)"

# Check Docker daemon
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running"
    echo "   Please start Docker Desktop"
    exit 1
fi

echo "✅ Docker daemon is running"
echo ""

# Create data directory for SQLite
echo "📁 Setting up directories..."
mkdir -p ./server/data
chmod 755 ./server/data

echo "✅ Directories ready"
echo ""

# Build images
echo "🔨 Building Docker images..."
echo "   This may take a few minutes on first run..."
echo ""

docker compose build --no-cache

echo ""
echo "✅ Docker images built successfully!"
echo ""
echo "🚀 Ready to start!"
echo ""
echo "Run: docker compose up -d"
echo "Access:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend:  http://localhost:3001"
echo ""
echo "View logs: docker compose logs -f"
echo "Stop: docker compose down"
echo ""
