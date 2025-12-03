@echo off
REM Chattrix Docker Setup Verification Script for Windows

echo.
echo 🐳 Chattrix Docker Setup
echo =======================
echo.

REM Check Docker installation
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed
    echo    Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
echo ✅ Docker is installed: %DOCKER_VERSION%

REM Check Docker daemon
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker daemon is not running
    echo    Please start Docker Desktop
    pause
    exit /b 1
)

echo ✅ Docker daemon is running
echo.

REM Create data directory
echo 📁 Setting up directories...
if not exist "server\data" mkdir "server\data"
echo ✅ Directories ready
echo.

REM Build images
echo 🔨 Building Docker images...
echo    This may take a few minutes on first run...
echo.

docker compose build --no-cache

if %errorlevel% neq 0 (
    echo.
    echo ❌ Build failed. Check Docker Desktop is running and disk space is available.
    pause
    exit /b 1
)

echo.
echo ✅ Docker images built successfully!
echo.
echo 🚀 Ready to start!
echo.
echo Run: docker compose up -d
echo Access:
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:3001
echo.
echo View logs: docker compose logs -f
echo Stop: docker compose down
echo.
pause
