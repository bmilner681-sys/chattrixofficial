# Docker Setup Guide for Chattrix

## Quick Start

### Prerequisites
- Docker installed ([Get Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose installed (included with Docker Desktop)
- Git

### Development Setup (Recommended for Testing)

1. **Clone and Navigate**
```bash
cd Chattrix
```

2. **Build and Start Services**
```bash
# Build images and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

3. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Live database at: `./server/data/chattrix.db`

4. **View Logs**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

5. **Stop Services**
```bash
# Stop and remove containers
docker-compose down

# Stop without removing (keeps data)
docker-compose stop
```

## Production Setup

1. **Using Production Compose File**
```bash
# Build with production settings
docker-compose -f docker-compose.prod.yml up -d --build

# With environment file
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

2. **PostgreSQL Integration** (for production)
```bash
# With postgres profile enabled
docker-compose -f docker-compose.prod.yml --profile postgres up -d --build

# Configure DATABASE_URL in .env.production
DATABASE_URL=postgresql://chattrix:password@postgres:5432/chattrix_db
```

## Individual Docker Commands

### Building Images

```bash
# Backend development image
docker build -t chattrix-backend:dev ./server -f ./server/Dockerfile

# Backend production image (optimized)
docker build -t chattrix-backend:prod ./server -f ./server/Dockerfile.prod

# Frontend image
docker build -t chattrix-frontend:latest ./client -f ./client/Dockerfile
```

### Running Individual Containers

```bash
# Backend
docker run -p 3001:3001 \
  -e NODE_ENV=development \
  -e JWT_SECRET=dev_secret \
  -e DATABASE_URL=sqlite:./data/chattrix.db \
  -v $(pwd)/server/data:/app/data \
  chattrix-backend:dev

# Frontend
docker run -p 3000:3000 \
  -e VITE_SOCKET_URL=http://localhost:3001 \
  chattrix-frontend:latest
```

## File Structure

```
server/
├── Dockerfile          # Development image
├── Dockerfile.prod     # Production optimized image
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts       # Main server entry
│   ├── handlers/      # Socket.IO handlers
│   ├── routes/        # Express routes
│   ├── database/      # Database initialization
│   └── types/         # TypeScript types
└── data/              # SQLite database (created at runtime)

client/
├── Dockerfile         # Multi-stage build
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── App.tsx        # Main React component
    ├── components/    # React components
    ├── api/           # API functions
    └── socket.ts      # Socket.IO client setup
```

## Docker Images Details

### Backend Image Size
- **Development**: ~500MB (includes TypeScript compiler)
- **Production**: ~200MB (optimized, minified only)

### Frontend Image Size
- **Production**: ~150MB (built React app + http-server)

### Base Image
- Both use `node:18-alpine` (~170MB base) for small footprint

## Common Issues

### Port Already in Use
```bash
# Check what's using port 3000 or 3001
lsof -i :3000
lsof -i :3001

# Kill process (or change docker port mapping)
docker-compose down
```

### Database Permissions
```bash
# Ensure data directory has write permissions
chmod 755 ./server/data

# Or let Docker create it automatically
rm -rf ./server/data
docker-compose up --build
```

### Container Exits Immediately
```bash
# Check logs for errors
docker-compose logs backend
docker-compose logs frontend

# Rebuild without cache
docker-compose build --no-cache
docker-compose up
```

### Slow Build Times
```bash
# Use .dockerignore to skip unnecessary files
echo "node_modules" > .dockerignore
echo ".git" >> .dockerignore

# Then rebuild
docker-compose build --no-cache
```

## Environment Variables

### Development (.env)
```
PORT=3001
NODE_ENV=development
JWT_SECRET=dev_secret_key_change_in_production
DATABASE_URL=sqlite:./data/chattrix.db
CLIENT_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3001
VITE_API_URL=http://localhost:3001
```

### Production (.env.production)
```
PORT=3001
NODE_ENV=production
JWT_SECRET=<generate-secure-random-string>
DATABASE_URL=postgresql://user:pass@host:5432/db
CLIENT_URL=https://yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
VITE_API_URL=https://api.yourdomain.com
```

## Advanced Usage

### Docker Network
```bash
# View network
docker network ls
docker network inspect chattrix_chattrix-network

# Containers can communicate by service name:
# backend can reach frontend at http://frontend:3000
```

### Volume Management
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect chattrix_postgres_data

# Backup data
docker run --rm -v chattrix_postgres_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup.tar.gz /data
```

### Multi-Stage Build Benefits
1. **Smaller final images** - dev dependencies stripped
2. **Faster runtime** - no compilation during container startup
3. **Security** - less attack surface area
4. **Cleaner deploys** - only production code included

## Next Steps

1. **Local Testing**: Use `docker-compose up` for full stack testing
2. **Production Deploy**: Use `docker-compose.prod.yml` with PostgreSQL
3. **Push to Registry**: 
   ```bash
   docker tag chattrix-backend:prod username/chattrix-backend:v1.0
   docker push username/chattrix-backend:v1.0
   ```
4. **Container Orchestration**: Deploy to Kubernetes, Docker Swarm, or cloud platforms

## Useful Commands

```bash
# Clean up everything
docker-compose down --volumes
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Run specific service
docker-compose up backend

# Execute command in container
docker-compose exec backend npm run dev

# View resource usage
docker stats

# Save image as file
docker save chattrix-backend:prod | gzip > backend.tar.gz

# Load image from file
docker load < backend.tar.gz
```
