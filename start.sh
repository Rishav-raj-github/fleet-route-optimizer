#!/bin/bash

# Fleet Route Optimizer - Quick Start Script
# This script helps you get the application running quickly

echo "🚛 Fleet Route Optimizer - Quick Start"
echo "======================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    echo "   Download from: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker is available"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file. You can customize it if needed."
fi

# Start services
echo "🚀 Starting Fleet Route Optimizer services..."
echo "   This may take a few minutes on first run..."

docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "🎉 Fleet Route Optimizer is now running!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Dashboard:       http://localhost:3000"
    echo "   API:            http://localhost:3001"
    echo "   API Docs:       http://localhost:3001/docs"
    echo "   Health Check:   http://localhost:3001/health"
    echo ""
    echo "📊 Database Information:"
    echo "   PostgreSQL:     localhost:5432"
    echo "   Database:       fleet_optimizer"
    echo "   Username:       postgres"
    echo "   Password:       fleet123"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:      docker-compose logs -f"
    echo "   Stop services:  docker-compose down"
    echo "   Restart:        docker-compose restart"
    echo ""
    echo "🤝 Need help? Check the LOCAL-DEVELOPMENT-GUIDE.md"
else
    echo "❌ Some services failed to start. Check the logs:"
    docker-compose logs
fi