# 🎯 START HERE - Docker Setup for Chattrix

## ⚡ Get Running in 5 Minutes

### Step 1: Choose Your Platform

#### Windows
```cmd
setup-docker.bat
```

#### Linux / Mac
```bash
bash setup-docker.sh
```

#### Or All Platforms
```bash
docker compose up -d --build
```

### Step 2: Wait for Build (2-3 minutes)
The script will:
- ✅ Check if Docker is installed
- ✅ Verify Docker is running
- ✅ Build Docker images
- ✅ Start all services

### Step 3: Open in Browser
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### Step 4: Test It Works
1. Register a new account
2. Log in
3. Send a message
4. Add reaction
5. ✅ Done!

---

## 🆘 If Something Goes Wrong

### Docker Not Installed?
Download from: https://www.docker.com/products/docker-desktop

### Docker Not Running?
- Windows/Mac: Launch Docker Desktop app
- Linux: Run `sudo systemctl start docker`

### Port Already in Use?
```bash
docker compose down
# Wait a few seconds, then try again
docker compose up -d --build
```

### Need More Help?
Read: [DOCKER-SETUP.md](DOCKER-SETUP.md)

---

## 📚 Documentation Files

Read these in order:

1. **[QUICK-START-DOCKER.md](QUICK-START-DOCKER.md)** - Quick reference (3 min)
2. **[DOCKER-COMMANDS.md](DOCKER-COMMANDS.md)** - Common commands (5 min)
3. **[DOCKER-SETUP.md](DOCKER-SETUP.md)** - Full setup guide (10 min)
4. **[DOCKER.md](DOCKER.md)** - Complete reference (20 min)
5. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to cloud (15 min)

Or jump to: [DOCKER-INDEX.md](DOCKER-INDEX.md) for navigation help

---

## ✨ What's Included

- ✅ Development environment (with SQLite)
- ✅ Production environment (with PostgreSQL)
- ✅ Automatic setup scripts
- ✅ Comprehensive documentation
- ✅ All Docker configurations
- ✅ Environment templates
- ✅ Deployment guides

---

## 🚀 Common Commands

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Shell access
docker compose exec backend sh

# Full reference
# See DOCKER-COMMANDS.md
```

---

## 🌍 Ready to Deploy?

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Railway (easiest)
- Render
- Fly.io
- Heroku
- DigitalOcean
- AWS
- And more...

---

## ✅ Verification

After starting, verify:
- [ ] Frontend loads at http://localhost:3000
- [ ] Can register account
- [ ] Can log in
- [ ] Can send messages
- [ ] Real-time updates work

For more checks, see: [DOCKER-CHECKLIST.md](DOCKER-CHECKLIST.md)

---

**Ready? Run:**

### Windows
```cmd
setup-docker.bat
```

### Linux/Mac
```bash
bash setup-docker.sh
```

**Then open**: http://localhost:3000

---

✨ **Welcome to Chattrix Docker! Enjoy!** ✨
