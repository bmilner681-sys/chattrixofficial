# Deployment Guide - Chattrix

Chattrix can be deployed on multiple platforms. This guide covers the best options for keeping it running 24/7.

## Quick Deployment Options

### 🌟 Best Options (Recommended)
1. **Railway** - Easiest, free tier, excellent for Node.js
2. **Render** - Simple deployment, good free tier
3. **Heroku** - Paid but reliable (no free tier anymore)
4. **Vercel** (Frontend only) + Railway (Backend)

### ⚡ Other Options
- AWS (EC2, Lambda)
- DigitalOcean
- Fly.io
- PythonAnywhere (if backend refactored)
- Google Cloud Run
- Azure App Service

---

## 1. Railway Deployment (EASIEST) ⭐

Railway is perfect for beginners and offers a free tier to start.

### Prerequisites
- GitHub account (to connect repository)
- Railway account (free signup at railway.app)

### Steps

#### Step 1: Prepare Repository
```powershell
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"
```

#### Step 2: Create GitHub Repository
1. Go to github.com and create a new repository
2. Push your code:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/chattrix.git
git branch -M main
git push -u origin main
```

#### Step 3: Deploy on Railway
1. Go to railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `chattrix` repository
5. Railway auto-detects Node.js project

#### Step 4: Configure Environment Variables
In Railway dashboard, go to Variables tab:
```
PORT=3001
NODE_ENV=production
JWT_SECRET=your_secure_random_string_here
DATABASE_URL=sqlite:./data/chattrix.db
CLIENT_URL=https://your-client-domain.railway.app
```

#### Step 5: Deploy Frontend
1. Create another Railway project for frontend
2. Configure build command: `npm run build`
3. Configure start command: `npm run preview`
4. Set environment variables for backend URL

**Cost**: Free tier includes 5GB disk, then $5/month

---

## 2. Render Deployment ⭐⭐

Render offers easy deployment with free tier.

### Step 1: Connect Repository
1. Go to render.com
2. Sign in with GitHub
3. Click "New +"

### Step 2: Deploy Backend
1. Select "Web Service"
2. Connect your GitHub repository
3. Set configuration:
   - **Name**: chattrix-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run build && node dist/index.js`

### Step 3: Add Environment Variables
```
PORT=3001
NODE_ENV=production
JWT_SECRET=generate_secure_random_key
DATABASE_URL=postgresql://user:password@host/dbname
CLIENT_URL=https://chattrix-frontend.render.com
```

### Step 4: Deploy Frontend
1. Select "Static Site"
2. Connect repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`

**Cost**: Free tier included, paid plans $7+/month

---

## 3. Heroku Deployment (Paid)

Heroku no longer has free tier but is still popular.

### Step 1: Install Heroku CLI
```powershell
# Using chocolatey
choco install heroku-cli

# Or download from heroku.com/downloads
```

### Step 2: Create Procfile
Create `server/Procfile`:
```
web: npm run build && node dist/index.js
```

### Step 3: Deploy
```powershell
heroku login
heroku create chattrix-backend
heroku buildpacks:add --index 1 heroku/nodejs

# Set environment variables
heroku config:set PORT=3001
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key

# Push code
git push heroku main
```

**Cost**: Paid, starts at $7/month

---

## 4. DigitalOcean Deployment

DigitalOcean provides affordable VPS hosting.

### Step 1: Create Droplet
1. Go to digitalocean.com
2. Create new Droplet
3. Select Ubuntu 22.04
4. Choose Basic plan ($5-6/month)
5. Select SSH key or password

### Step 2: Connect & Setup
```bash
# SSH into server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install Git
apt install -y git

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx
```

### Step 3: Clone Repository
```bash
cd /home
git clone https://github.com/your-username/chattrix.git
cd chattrix/server
npm install
npm run build
```

### Step 4: Configure PM2
```bash
pm2 start dist/index.js --name chattrix-backend
pm2 startup
pm2 save
```

### Step 5: Setup Nginx Reverse Proxy
Create `/etc/nginx/sites-available/chattrix`:
```nginx
upstream chattrix {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://chattrix;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/chattrix /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 6: Install SSL (Free)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

**Cost**: $5-6/month for basic droplet

---

## 5. AWS Deployment

### Using EC2 (Similar to DigitalOcean)
1. Launch EC2 instance (Ubuntu 22.04)
2. Configure security groups
3. Follow DigitalOcean steps above

### Using Elastic Beanstalk (Easier)
```powershell
# Install EB CLI
pip install awsebcli

# Create EB app
eb init -p "Node.js 18" chattrix
eb create chattrix-env

# Deploy
eb deploy
```

### Using Lambda (Serverless)
- More complex
- Good for pay-as-you-go
- Need to refactor for serverless

**Cost**: Highly variable, starts free tier

---

## 6. Fly.io Deployment

Fly.io is great for global deployment.

### Step 1: Install Fly CLI
```powershell
# Windows
choco install flyctl

# Or download from fly.io
```

### Step 2: Create Dockerfile
Create `server/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

### Step 3: Deploy
```bash
fly auth login
fly launch
fly deploy
```

**Cost**: Free tier + pay as you go ($0.02-0.10/month typically)

---

## Database Deployment

### Migrate from SQLite to PostgreSQL

#### Option 1: Railway PostgreSQL (Free)
1. In Railway, add Postgres plugin
2. Get connection string
3. Update `DATABASE_URL` variable

#### Option 2: Render PostgreSQL (Free)
1. Create PostgreSQL instance on Render
2. Get connection string
3. Update environment variable

#### Option 3: Heroku Postgres
```powershell
heroku addons:create heroku-postgresql:hobby-dev
heroku config:get DATABASE_URL
```

#### Option 4: Managed Services
- AWS RDS (starts ~$11/month)
- DigitalOcean Managed DB ($15/month)
- Supabase (PostgreSQL + REST API, free tier)

---

## Production Database Setup

### Update Backend for PostgreSQL

Install package:
```powershell
npm install pg
```

Create `server/src/database/postgres.ts`:
```typescript
import pg from 'pg';
import { Pool } from 'pg';

let pool: Pool;

export function getDatabase(): Pool {
  return pool;
}

export async function initializeDatabase(): Promise<void> {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Run migrations here...
  console.log('📦 PostgreSQL connected');
}
```

---

## Frontend Deployment

### Vercel (Easiest for React)
```powershell
npm install -g vercel
cd client
vercel
```

Then connect your backend API URL in environment variables.

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Your Own Server
```bash
npm run build
# Serve dist folder with Nginx or Apache
```

---

## Recommended Deployment Stack

### For Beginners:
```
Frontend: Vercel (React app)
Backend: Railway (Node.js + Database)
Database: Railway PostgreSQL
Cost: ~$10-15/month
```

### For Production:
```
Frontend: Vercel or Netlify
Backend: DigitalOcean Droplet
Database: DigitalOcean Managed DB
Domain: Namecheap or GoDaddy (~$12/year)
Total Cost: ~$30-40/month
```

### For Enterprise:
```
Frontend: Vercel
Backend: AWS EC2 + ELB
Database: AWS RDS
CDN: CloudFront
Monitoring: DataDog
Cost: $100-500+/month
```

---

## Step-by-Step: Deploy to Railway (RECOMMENDED)

### Most Straightforward Path:

1. **Create GitHub Repo**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on github.com and push
   ```

2. **Sign up at railway.app**
   - Use GitHub login (easiest)

3. **Connect Repository**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize and select `chattrix`

4. **Configure Backend**
   - Railway auto-detects `package.json`
   - Set build command: `npm run build` (if needed)
   - Set start command: `npm start`
   - Add environment variables (see above)

5. **Configure Frontend**
   - Create another Railway project
   - Select `client` folder
   - Set build: `npm run build`
   - Set start: `npm run preview`
   - Set backend URL as environment variable

6. **Get URLs**
   - Backend: `https://chattrix-backend-production.up.railway.app`
   - Frontend: `https://chattrix-frontend-production.up.railway.app`

7. **Update CORS**
   Update `server/src/index.ts`:
   ```typescript
   const io = new SocketIOServer(httpServer, {
     cors: {
       origin: process.env.CLIENT_URL || 'http://localhost:3000',
       credentials: true,
     },
   });
   ```

---

## Monitoring & Logging

### Railway
- Built-in logs viewer
- Monitor performance in dashboard

### Render
- Built-in monitoring
- Email alerts

### Self-Hosted (DigitalOcean)
```bash
# Install PM2 monitoring
pm2 install pm2-logrotate
pm2 install pm2-auto-pull

# View logs
pm2 logs chattrix-backend
```

---

## Domain Setup

1. Buy domain from:
   - Namecheap ($8.88/year)
   - GoDaddy ($10+/year)
   - Vercel Domains

2. Point DNS to:
   - **Railway**: Add custom domain in project
   - **Render**: Add custom domain
   - **DigitalOcean**: Update nameservers

3. Get SSL certificate (free):
   - Railway: Automatic
   - Render: Automatic
   - DigitalOcean: Use Certbot

---

## Cost Comparison

| Platform | Backend | Frontend | Database | Total/Month |
|----------|---------|----------|----------|------------|
| Railway | Free* | Free* | Free* | $0-10 |
| Render | Free* | Free* | Free* | $0-10 |
| Vercel + Railway | - | Free | Free* | $0-10 |
| DigitalOcean | $5 | $5 | $15 | $25 |
| Heroku | $7 | $7 | $9 | $23 |
| AWS | Variable | - | Variable | $20-100 |

*Free tier has limitations; production typically costs $5-15/month

---

## Next Steps

1. **Choose Platform** (Railway recommended for easiest setup)
2. **Create GitHub Repository** (if not already done)
3. **Sign up to Platform**
4. **Connect Repository and Deploy**
5. **Configure Environment Variables**
6. **Test Application**
7. **Add Custom Domain** (optional)
8. **Monitor Logs**

---

## Troubleshooting

### Build Fails
- Check logs in platform dashboard
- Ensure all dependencies installed locally first
- Verify Node version compatibility

### Connection Issues
- Verify CORS settings
- Check environment variables set correctly
- Ensure frontend has correct backend URL

### Database Connection Fails
- Test connection string locally
- Verify user permissions
- Check IP whitelist if applicable

### SSL Certificate Issues
- Let platform handle automatically
- For self-hosted, use Certbot
- Wait 24-48 hours for DNS propagation

---

## Quick Command Reference

```bash
# Railway
railway up

# Render
# Use web dashboard

# Heroku
heroku deploy
git push heroku main

# DigitalOcean
pm2 start dist/index.js

# Fly.io
fly deploy
```

For detailed guides on each platform, see corresponding sections above.
