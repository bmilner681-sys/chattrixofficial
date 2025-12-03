@echo off
REM Chattrix Deployment Script for Windows

echo.
echo 🚀 Chattrix Deployment Helper
echo ==============================
echo.
echo Select deployment platform:
echo 1) Railway (Recommended - Easiest)
echo 2) Render
echo 3) Heroku
echo 4) DigitalOcean
echo 5) Fly.io
echo 6) Docker (Local or Self-hosted)
echo 7) AWS
echo.

set /p choice="Enter choice [1-7]: "

if "%choice%"=="1" (
    echo 🚀 Railway Deployment
    echo 1. Create GitHub repository and push code
    echo 2. Go to railway.app and sign in
    echo 3. Click 'New Project' ^> 'Deploy from GitHub'
    echo 4. Select your repository
    echo 5. Set environment variables in Railway dashboard
    echo 6. Deploy!
    echo.
    echo Environment variables to set:
    echo   PORT=3001
    echo   NODE_ENV=production
    echo   JWT_SECRET=^<generate-random-string^>
    echo   DATABASE_URL=^<railway-postgres-url^>
    echo   CLIENT_URL=^<frontend-url^>
)

if "%choice%"=="2" (
    echo 🚀 Render Deployment
    echo 1. Go to render.com and sign in with GitHub
    echo 2. Click 'New +' ^> 'Web Service'
    echo 3. Select your repository
    echo 4. Configure:
    echo    Build Command: npm install
    echo    Start Command: npm run build ^&^& npm start
    echo 5. Add environment variables
    echo 6. Create service and deploy
)

if "%choice%"=="3" (
    echo 🚀 Heroku Deployment
    echo 1. Install Heroku CLI
    echo 2. Login: heroku login
    echo 3. Create app: heroku create chattrix-app
    echo 4. Set variables: heroku config:set KEY=value
    echo 5. Deploy: git push heroku main
)

if "%choice%"=="4" (
    echo 🚀 DigitalOcean Deployment
    echo 1. Create Ubuntu 22.04 droplet
    echo 2. SSH into server
    echo 3. Install Node.js, npm, Git, PM2, Nginx
    echo 4. Clone repository
    echo 5. Build and start with PM2
    echo 6. Configure Nginx reverse proxy
    echo 7. Setup SSL with Certbot
)

if "%choice%"=="5" (
    echo 🚀 Fly.io Deployment
    echo 1. Install Fly CLI
    echo 2. Login: fly auth login
    echo 3. Launch: fly launch
    echo 4. Deploy: fly deploy
)

if "%choice%"=="6" (
    echo 🚀 Docker Deployment
    echo Building Docker images...
    docker-compose -f docker-compose.yml build
    echo.
    echo To start: docker-compose up
    echo To stop: docker-compose down
)

if "%choice%"=="7" (
    echo 🚀 AWS Deployment
    echo Option A: Elastic Beanstalk
    echo   1. Install EB CLI
    echo   2. eb init
    echo   3. eb create
    echo   4. eb deploy
    echo.
    echo Option B: EC2 ^+ RDS
    echo   1. Launch EC2 instance
    echo   2. Configure security groups
    echo   3. Install Node.js, npm, Git
    echo   4. Follow DigitalOcean setup steps
)

pause
