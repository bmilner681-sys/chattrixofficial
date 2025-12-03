# Quick Start: Run Chattrix with Docker

## Windows

### Option 1: Automatic Setup (Recommended)
```cmd
setup-docker.bat
```
This script will:
- ✓ Check if Docker is installed
- ✓ Verify Docker is running
- ✓ Build Docker images
- ✓ Show you what to do next

### Option 2: Manual Commands
```cmd
REM Build images
docker compose build --no-cache

REM Start all services in background
docker compose up -d

REM Access the application
REM Frontend: http://localhost:3000
REM Backend: http://localhost:3001

REM View logs (to check for errors)
docker compose logs -f

REM Stop services when done
docker compose down
```

---

## Linux / Mac

### Option 1: Automatic Setup (Recommended)
```bash
bash setup-docker.sh
```
This script will:
- ✓ Check if Docker is installed
- ✓ Verify Docker is running  
- ✓ Build Docker images
- ✓ Show you what to do next

### Option 2: Manual Commands
```bash
# Build images
docker compose build --no-cache

# Start all services in background
docker compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001

# View logs (to check for errors)
docker compose logs -f

# Stop services when done
docker compose down
```

---

## Visual Guide

```
1. Open Terminal/Command Prompt
       ↓
2. Navigate to project: cd Chattrix
       ↓
3. Run setup script OR docker compose up -d --build
       ↓
4. Wait 2-3 minutes for build
       ↓
5. Open browser: http://localhost:3000
       ↓
✓ Chattrix is running!
```

---

## Verify It's Working

### Check Services
```bash
# List running containers
docker compose ps

# Should show:
# SERVICE    STATUS       PORTS
# backend    Up           0.0.0.0:3001->3001/tcp
# frontend   Up           0.0.0.0:3000->3000/tcp
```

### Test Frontend
```bash
# Open in browser
http://localhost:3000

# Should see login page
```

### Test Backend
```bash
# Windows
curl http://localhost:3001

# Linux/Mac
curl http://localhost:3001

# Should return a response
```

### View Live Logs
```bash
# See everything happening in real-time
docker compose logs -f

# Or just backend
docker compose logs -f backend

# Or just frontend  
docker compose logs -f frontend
```

---

## Common Issues & Fixes

### Docker Not Installed
**Error**: `'docker' is not recognized`
**Fix**: Install Docker Desktop from https://www.docker.com/

### Docker Not Running
**Error**: `Cannot connect to Docker daemon`
**Fix**: Start Docker Desktop application

### Port 3000 or 3001 Already in Use
**Error**: `Address already in use`
**Fix**: 
```bash
# Stop existing container
docker compose down

# Or use different ports in docker-compose.yml
```

### Out of Disk Space
**Error**: `No space left on device`
**Fix**:
```bash
# Clean up Docker
docker system prune -a

# This removes unused images/containers
```

---

## What Each Command Does

| Command | Purpose |
|---------|---------|
| `docker compose build` | Create images from Dockerfiles |
| `docker compose up -d` | Start all services in background |
| `docker compose up` | Start services and show logs |
| `docker compose down` | Stop and remove all containers |
| `docker compose logs -f` | Show live logs from all services |
| `docker compose exec backend sh` | Open shell in backend container |
| `docker compose restart backend` | Restart backend service |
| `docker compose ps` | Show running containers |

---

## Performance Notes

⏱️ **First Run**: 3-5 minutes (building images)
⏱️ **Subsequent Runs**: 10-20 seconds (already built)
🖥️ **Memory Used**: ~500MB
💾 **Disk Used**: ~1GB total
🔌 **Bandwidth**: ~300MB download

---

## Data & Database

- **Location**: `./server/data/chattrix.db`
- **Persistence**: Data survives container restarts
- **Backup**: Copy `server/data/` folder
- **Reset**: Delete `server/data/` folder and restart

```bash
# Backup
cp -r server/data server/data.backup

# Reset (delete all data)
rm -rf server/data
docker compose down
docker compose up -d
```

---

## Stop & Cleanup

```bash
# Stop containers (keep data)
docker compose stop

# Remove containers (keep data)
docker compose down

# Remove everything including data
docker compose down -v

# Remove all unused Docker resources
docker system prune -a
```

---

## Production Deployment

To deploy to the cloud:

1. **Choose platform**: Railway, Render, Heroku, AWS, etc.
   - See `DEPLOYMENT.md` for comparison

2. **For Railway (Easiest)**:
   ```
   - Push code to GitHub
   - Connect GitHub to Railway
   - Railway auto-deploys
   - Visit https://your-app.railway.app
   ```

3. **For Docker Registry**:
   ```bash
   docker tag chattrix-backend:dev myregistry/chattrix-backend:v1.0
   docker push myregistry/chattrix-backend:v1.0
   ```

See `DEPLOYMENT.md` for complete guide for each platform.

---

## Files Created

✓ Dockerfiles (server & client)
✓ docker-compose.yml (local dev)
✓ docker-compose.prod.yml (production)
✓ .dockerignore (build optimization)
✓ .env templates
✓ Setup scripts
✓ Documentation

All ready to use!

---

## Support

- **Docker Issues**: See `DOCKER.md`
- **Commands Reference**: See `DOCKER-COMMANDS.md`  
- **Deployment**: See `DEPLOYMENT.md`
- **Setup Issues**: See `DOCKER-CHECKLIST.md`

---

## TL;DR - Just Run This

**Windows**:
```cmd
setup-docker.bat
```

**Linux/Mac**:
```bash
bash setup-docker.sh
```

**Or All Platforms**:
```bash
docker compose up -d --build
```

Then open: **http://localhost:3000**

---

✨ **Your Chattrix app is now running in Docker!** ✨
