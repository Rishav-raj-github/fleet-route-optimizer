@echo off
REM Fleet Route Optimizer - Quick Start Script for Windows
REM This script helps you get the application running quickly on Windows

echo 🚛 Fleet Route Optimizer - Quick Start
echo ======================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo    Download from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not available. Please install Docker Compose.
    pause
    exit /b 1
)

echo ✅ Docker is available

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ Created .env file. You can customize it if needed.
)

REM Start services
echo 🚀 Starting Fleet Route Optimizer services...
echo    This may take a few minutes on first run...

docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo.
    echo 🎉 Fleet Route Optimizer is now running!
    echo.
    echo 🌐 Access your application:
    echo    Dashboard:       http://localhost:3000
    echo    API:            http://localhost:3001
    echo    API Docs:       http://localhost:3001/docs
    echo    Health Check:   http://localhost:3001/health
    echo.
    echo 📊 Database Information:
    echo    PostgreSQL:     localhost:5432
    echo    Database:       fleet_optimizer
    echo    Username:       postgres
    echo    Password:       fleet123
    echo.
    echo 📋 Useful commands:
    echo    View logs:      docker-compose logs -f
    echo    Stop services:  docker-compose down
    echo    Restart:        docker-compose restart
    echo.
    echo 🤝 Need help? Check the LOCAL-DEVELOPMENT-GUIDE.md
) else (
    echo ❌ Some services failed to start. Check the logs:
    docker-compose logs
)

pause