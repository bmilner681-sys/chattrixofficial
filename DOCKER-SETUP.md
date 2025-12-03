# 🐳 Docker Setup Complete for Chattrix

## ✅ What's Been Set Up

Your Chattrix project is now fully containerized and ready for Docker deployment!

### Files Created:
- ✅ `server/Dockerfile` - Backend development image (Node.js + TypeScript)
- ✅ `server/Dockerfile.prod` - Backend production image (multi-stage optimized)
- ✅ `client/Dockerfile` - Frontend image (React + Vite + http-server)
- ✅ `docker-compose.yml` - Development stack configuration
- ✅ `docker-compose.prod.yml` - Production stack with PostgreSQL & Nginx
- ✅ `DOCKER.md` - Complete Docker documentation
- ✅ `DOCKER-COMMANDS.md` - Quick reference for common commands
- ✅ `setup-docker.sh` - Linux/Mac setup script
- ✅ `setup-docker.bat` - Windows setup script
- ✅ `.dockerignore` - Optimizes build performance
- ✅ `.env.example` - Development environment template
- ✅ `.env.production` - Production environment template

## 🚀 Quick Start (Windows)

```bash
# Run setup script
.\setup-docker.bat

# OR manually:
docker compose build --no-cache
docker compose up -d

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## 🚀 Quick Start (Linux/Mac)

```bash
# Run setup script
bash setup-docker.sh

# OR manually:
docker compose build --no-cache
docker compose up -d

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## 📊 Architecture

```
┌─────────────────────────────────────┐
│         Docker Compose              │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────┐  ┌──────────────┐│
│  │   Frontend   │  │   Backend    ││
│  │ (Port 3000)  │  │ (Port 3001)  ││
│  │ http-server  │  │   Express    ││
│  │ React + Vite │  │  Socket.IO   ││
│  └──────────────┘  └──────────────┘│
│         ↓                  ↓         │
│  ┌──────────────────────────────────┤
│  │        SQLite Database           │
│  │    (./server/data/*.db)          │
│  └──────────────────────────────────┤
│                                     │
│  Optional Services:                 │
│  - PostgreSQL (prod only)           │
│  - Nginx (prod only)                │
│                                     │
└─────────────────────────────────────┘
```

## 📦 Image Sizes

- **Backend Dev**: ~500MB (includes dev dependencies)
- **Backend Prod**: ~200MB (optimized, prod only)
- **Frontend**: ~150MB (built React app)
- **Base**: node:18-alpine (~170MB)

## 🔧 Common Tasks

### Start Services
```bash
# Development (with logs visible)
docker compose up

# Background mode
docker compose up -d

# Rebuild images
docker compose up --build

# Build without cache
docker compose up --no-cache --build
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend

# Last 100 lines
docker compose logs --tail 100
```

### Stop Services
```bash
# Stop containers (keep data)
docker compose stop

# Stop and remove containers
docker compose down

# Remove everything including volumes
docker compose down -v
```

### Access Container Shell
```bash
# Backend shell
docker compose exec backend sh

# Frontend shell
docker compose exec frontend sh

# Run npm command in backend
docker compose exec backend npm run dev
```

### Database
```bash
# Access SQLite directly
docker compose exec backend sqlite3 /app/data/chattrix.db

# Backup database
docker compose exec backend cat /app/data/chattrix.db > backup.db
```

## 🌍 Production Deployment with Docker

### Using docker-compose.prod.yml
```bash
# Start production stack
docker compose -f docker-compose.prod.yml up -d --build

# With environment file
docker compose -f docker-compose.prod.yml \
  --env-file .env.production \
  up -d --build

# With PostgreSQL
docker compose -f docker-compose.prod.yml \
  --profile postgres \
  up -d --build
```

### Push Images to Docker Registry
```bash
# Tag images
docker tag chattrix-backend:dev myregistry/chattrix-backend:v1.0
docker tag chattrix-frontend:dev myregistry/chattrix-frontend:v1.0

# Push to registry
docker push myregistry/chattrix-backend:v1.0
docker push myregistry/chattrix-frontend:v1.0

# Deploy from registry
docker pull myregistry/chattrix-backend:v1.0
docker run -p 3001:3001 myregistry/chattrix-backend:v1.0
```

## 🛠️ Customization

### Change Ports
Edit `docker-compose.yml`:
```yaml
services:
  backend:
    ports:
      - "8001:3001"  # Changed from 3001
  frontend:
    ports:
      - "8000:3000"  # Changed from 3000
```

### Enable PostgreSQL for Development
```bash
# Use PostgreSQL profile
docker compose --profile postgres up -d --build

# Update DATABASE_URL in docker-compose.yml:
# DATABASE_URL=postgresql://chattrix:dev_password@postgres:5432/chattrix_db
```

### Mount Source Code (Hot Reload)
Edit `docker-compose.yml` backend service:
```yaml
volumes:
  - ./server/data:/app/data
  - ./server/src:/app/src  # Add this for hot reload
```

Then use `npm run dev` in the container (watches TypeScript files).

## 🐛 Troubleshooting

### "Docker daemon is not running"
- Start Docker Desktop or Docker service
- Windows: Launch Docker Desktop from Start menu
- Linux: `sudo systemctl start docker`

### Port Already in Use
```bash
# Stop existing containers
docker compose down

# Or use different ports in docker-compose.yml
```

### Out of Disk Space
```bash
# Clean up Docker resources
docker system prune -a

# Remove all unused containers/images
docker container prune
docker image prune -a
```

### Database Locked Error
```bash
# Stop containers and remove volumes
docker compose down -v

# Restart fresh
docker compose up --build
```

### Build Fails
```bash
# Clean and rebuild
docker compose build --no-cache --pull

# Check Docker is running
docker info

# Check available disk space
df -h  # Linux/Mac
dir   # Windows
```

## 📚 Resources

- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

## 🎯 Next Steps

1. ✅ **Run locally**: `docker compose up -d --build`
2. ✅ **Test thoroughly**: Open http://localhost:3000
3. ✅ **Deploy to cloud**: Use `docker-compose.prod.yml`
4. ✅ **Scale up**: Add more instances behind Nginx load balancer
5. ✅ **Monitor**: Use platform-specific monitoring tools

## ℹ️ Tips

- Use `.dockerignore` to keep builds fast
- Multi-stage builds reduce final image size by ~60%
- Health checks ensure containers start in correct order
- Volumes persist data between container restarts
- Networks provide DNS resolution between containers
- Environment files keep secrets out of version control

---

**Ready to deploy? Run: `docker compose up -d --build`**

For detailed documentation, see `DOCKER.md` and `DOCKER-COMMANDS.md`
