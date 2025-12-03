# 🚀 Railway Deployment Guide - Chattrix

## 🎯 Overview

This guide will help you deploy Chattrix to Railway in **5-15 minutes**. Railway is the easiest platform for Node.js applications.

## ✨ Why Railway?

- ✅ **Free tier**: $5 credit per month (usually enough for one small project)
- ✅ **Easiest setup**: Just connect GitHub, auto-deploy
- ✅ **No credit card required initially** (for free tier)
- ✅ **PostgreSQL included**: Can add database easily
- ✅ **Custom domains**: Included with paid plans
- ✅ **Auto-scaling**: Handles traffic spikes
- ✅ **Zero downtime deploys**: Automatic

## 📋 Prerequisites

- ✅ GitHub account (free at github.com)
- ✅ Railway account (free at railway.app)
- ✅ This Chattrix project code
- ✅ 5-10 minutes of time

## 🚀 Step-by-Step Deployment

### Phase 1: Prepare Your GitHub Repository (5 minutes)

#### Step 1.1: Add Files to Git
```powershell
cd C:\Users\bmiln\Desktop\Chattrix

# Add all files
git add .

# Commit
git commit -m "Initial Chattrix deployment commit"

# Verify
git log --oneline
```

#### Step 1.2: Create GitHub Repository
1. Go to **https://github.com/new**
2. Fill in:
   - **Repository name**: `chattrix` (or your preferred name)
   - **Description**: `Discord-inspired chat application`
   - **Visibility**: Public (required for free Railway tier)
   - **Initialize**: Leave unchecked (you have local files)
3. Click **Create Repository**

#### Step 1.3: Push Code to GitHub
Copy-paste these commands in PowerShell (replace `YOUR_USERNAME`):

```powershell
cd C:\Users\bmiln\Desktop\Chattrix

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/chattrix.git

# Rename branch
git branch -M main

# Push code
git push -u origin main

# Verify
git remote -v
```

**Expected output**:
```
origin  https://github.com/YOUR_USERNAME/chattrix.git (fetch)
origin  https://github.com/YOUR_USERNAME/chattrix.git (push)
```

### Phase 2: Deploy Backend to Railway (5 minutes)

#### Step 2.1: Sign Up on Railway
1. Go to **https://railway.app**
2. Click **Sign Up**
3. Choose **GitHub** (recommended)
4. Authorize Railway to access your GitHub

#### Step 2.2: Create New Project
1. Click **New Project** (or + button)
2. Click **Deploy from GitHub repo**
3. Select your `chattrix` repository
4. Railway will auto-detect Node.js project

#### Step 2.3: Configure Backend Service
Once deployment starts:

1. **Go to Variables tab** (in Railway dashboard)
2. **Add environment variables**:

```
PORT=3001
NODE_ENV=production
JWT_SECRET=<generate_random_string_below>
DATABASE_URL=postgresql://postgres:password@localhost:5432/chattrix_db
CLIENT_URL=https://chattrix-web.up.railway.app
```

**Generate secure JWT_SECRET**:
```powershell
# In PowerShell, run:
$random = Get-Random -Maximum 999999999999
$secret = -join ((65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
Write-Host $secret
# Copy the output and use it as JWT_SECRET
```

Or use this online: https://randomkeygen.com/ (copy "CodeIgniter Encryption Keys")

#### Step 2.4: Add PostgreSQL Database
1. In Railway dashboard, click **+ Create**
2. Select **PostgreSQL**
3. Railway will auto-set `DATABASE_URL` variable
4. Click deploy

#### Step 2.5: Get Backend URL
1. Go to **Deployments** tab
2. Wait for "Success" status (green checkmark)
3. Click on the domain name to see your backend URL
4. Example: `https://chattrix-api-prod.up.railway.app`

**Save this URL** - you'll need it for frontend configuration!

### Phase 3: Deploy Frontend to Railway (5 minutes)

#### Step 3.1: Create Separate Frontend Project
1. Click **New Project** in Railway
2. **Deploy from GitHub repo** (select same `chattrix` repo)
3. Name it `chattrix-frontend` (or similar)

#### Step 3.2: Configure Frontend Build
1. Go to **Variables** tab
2. Add:
```
VITE_SOCKET_URL=https://chattrix-api-prod.up.railway.app
VITE_API_URL=https://chattrix-api-prod.up.railway.app
NODE_ENV=production
```

3. Go to **Settings** tab
4. Set **Build Command**: `npm run build`
5. Set **Start Command**: `npm start`
6. Set **Root Directory**: `client`

#### Step 3.3: Deploy
Railway will automatically build and deploy. Wait for green checkmark.

#### Step 3.4: Get Frontend URL
Once deployed, Railway gives you a URL like:
`https://chattrix-web-prod.up.railway.app`

### Phase 4: Connect Everything (2 minutes)

#### Step 4.1: Update Environment Variables

**On Backend Service**:
- Update `CLIENT_URL` to your frontend URL

**On Frontend Service**:
- Update `VITE_SOCKET_URL` to your backend URL
- Update `VITE_API_URL` to your backend URL

#### Step 4.2: Trigger Redeploy
1. On each service, click **Deployments**
2. Click **Redeploy** on latest deployment
3. Wait for green checkmark

### Phase 5: Test Production (2 minutes)

#### Step 5.1: Access Your App
1. Go to your frontend URL
2. Try to **register** a new account
3. Try to **log in**
4. Try to **send a message**
5. Try to **add a reaction**

#### Step 5.2: Check Logs
If something doesn't work:
1. Go to **Logs** tab in Railway
2. Look for error messages
3. Check both backend and frontend logs

---

## 🔗 Environment Variables Explained

| Variable | Value | Purpose |
|----------|-------|---------|
| `PORT` | `3001` | Backend server port |
| `NODE_ENV` | `production` | Production mode (optimized) |
| `JWT_SECRET` | Random string | Secure token generation |
| `DATABASE_URL` | PostgreSQL URL | Database connection |
| `CLIENT_URL` | Frontend URL | Allow frontend to connect |
| `VITE_SOCKET_URL` | Backend URL | Frontend connects to backend |
| `VITE_API_URL` | Backend URL | Frontend API calls |

---

## 💾 Production Database

### Using SQLite (Quick, but not recommended for production)
Already configured. Database stored as file.

**Pros**: No setup, file-based
**Cons**: Not scalable, loses data if container restarts

### Using PostgreSQL (Recommended)
1. In Railway, click **+ Create**
2. Select **PostgreSQL**
3. Railway auto-creates and connects
4. Your database is now persistent and scalable

---

## 📊 Your Application URLs

After deployment:

```
Frontend:  https://chattrix-web-prod.up.railway.app
Backend:   https://chattrix-api-prod.up.railway.app
WebSocket: wss://chattrix-api-prod.up.railway.app
```

---

## 🆘 Troubleshooting

### "Connection refused" error
**Problem**: Frontend can't reach backend
**Solution**:
1. Check backend URL in frontend environment variables
2. Make sure backend is deployed and running (green checkmark)
3. Redeploy frontend

### "Cannot POST /auth/login"
**Problem**: Backend not deployed correctly
**Solution**:
1. Check backend logs in Railway
2. Look for TypeScript compilation errors
3. Make sure all dependencies are installed

### "Database connection failed"
**Problem**: PostgreSQL not connected
**Solution**:
1. Check `DATABASE_URL` is set correctly
2. PostgreSQL service must be created
3. Redeploy backend

### Blank page in browser
**Problem**: Frontend build failed
**Solution**:
1. Check frontend logs
2. Make sure `Root Directory` is set to `client`
3. Make sure build command is correct

---

## 📈 Pricing & Scaling

### Free Tier
- **Includes**: $5 credit/month
- **Enough for**: Small development project
- **Services**: 1 backend + 1 frontend + 1 database

### Pro Tier ($5+/month)
- **Cost**: $5-50+ per month depending on usage
- **Includes**: More resources, custom domains, SSL

---

## 🔐 Security Checklist

- [ ] `JWT_SECRET` is strong and random (32+ characters)
- [ ] `DATABASE_URL` contains secure password
- [ ] Production mode enabled (`NODE_ENV=production`)
- [ ] HTTPS enabled (automatic with Railway)
- [ ] CORS configured for your domain
- [ ] `.env` files NOT committed to Git (check `.gitignore`)

---

## 🚀 Next Steps

After deployment works:

1. **Add Custom Domain** (optional)
   - Go to Settings → Domain
   - Add your own domain name
   - Requires paid Railway plan

2. **Monitor Application**
   - Railway dashboard shows CPU, memory, requests
   - Check logs regularly for errors

3. **Enable Backups**
   - Set up PostgreSQL backups
   - For SQLite, export database regularly

4. **Scale Application**
   - If needed, Railway auto-scales
   - Upgrade to Pro plan for reserved resources

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Your App Backend URL**: Check Railway dashboard
- **Your App Frontend URL**: Check Railway dashboard

---

## ✅ Quick Checklist

- [ ] GitHub account created
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Backend deployed (green checkmark)
- [ ] PostgreSQL database created
- [ ] Frontend deployed (green checkmark)
- [ ] Environment variables configured
- [ ] Both services redeployed
- [ ] Frontend loads in browser
- [ ] Can register and log in
- [ ] Real-time messaging works

---

## 🎉 Congratulations!

Your Chattrix application is now **live on the internet**! 

Share the URL with friends and start chatting! 🚀

---

**Need Help?**
- Check Railway dashboard logs
- Review environment variables
- Verify GitHub repository connected
- Make sure all services show green checkmark

**Troubleshooting Guide**: See above for common issues

**Getting your app official URL ready?** The URL will be assigned by Railway automatically when you deploy. Save it somewhere safe!
