# Quick reference for Docker commands

## Start Services
docker compose up -d --build       # Start all services in background
docker compose up --build          # Start all services and show logs
docker compose up backend frontend # Start only specific services

## Stop Services
docker compose stop                # Stop without removing
docker compose down                # Stop and remove containers
docker compose down -v             # Stop and remove volumes too

## View Logs
docker compose logs -f             # Follow logs from all services
docker compose logs -f backend     # Follow only backend logs
docker compose logs --tail 100     # Show last 100 lines

## Build
docker compose build --no-cache    # Rebuild all images
docker compose build backend       # Rebuild specific service

## Execute Commands
docker compose exec backend npm run dev  # Run npm script in container
docker compose exec backend sh           # Open shell in container

## Database
docker compose exec backend sqlite3 /app/data/chattrix.db  # Access SQLite directly

## Cleanup
docker compose down -v             # Remove everything including volumes
docker system prune -a             # Remove all unused images/containers/networks

## Production
docker compose -f docker-compose.prod.yml up -d --build         # Start production
docker compose -f docker-compose.prod.yml logs -f               # View prod logs
docker compose -f docker-compose.prod.yml --profile postgres up # With PostgreSQL

## Push to Registry
docker tag chattrix-backend:dev your-registry/chattrix-backend:v1.0
docker push your-registry/chattrix-backend:v1.0
