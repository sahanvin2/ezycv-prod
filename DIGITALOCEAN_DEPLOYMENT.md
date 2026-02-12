# 🚀 Complete DigitalOcean Droplet Deployment Guide - Ezy CV

This is a **complete step-by-step guide** to deploy your Ezy CV MERN stack website on a DigitalOcean droplet, including GitHub setup, server configuration, and VS Code remote development.

---

## 📋 What You're Deploying

**Ezy CV** is a MERN stack website featuring:
- ✅ **CV Builder** - Professional resume creator with multiple templates
- ✅ **Wallpapers Gallery** - HD wallpaper collection with categories
- ✅ **Stock Photos** - Free stock photo downloads
- ✅ **User Authentication** - Firebase + JWT authentication
- ✅ **Email Service** - Brevo SMTP for welcome emails and contact forms
- ✅ **Newsletter** - Email subscription system

**Tech Stack:**
- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB
- **Storage**: Backblaze B2
- **Email**: Brevo (Sendinblue) SMTP

---

## 🎯 Deployment Overview

1. Push code to GitHub
2. Create DigitalOcean Droplet
3. Setup MongoDB Atlas
4. Install Node.js & dependencies
5. Clone repository & configure
6. Setup PM2 process manager
7. Configure Nginx reverse proxy
8. Setup SSL certificate
9. Configure domain
10. Connect VS Code for remote development

---

## Part 1: Push to GitHub

### Step 1.1: Initialize Git (if not already initialized)

Open PowerShell in your project root:

```powershell
cd D:\MERN\CV

# Initialize git if not already done
git init

# Create .gitignore file
```

### Step 1.2: Create .gitignore

Create a `.gitignore` file in the root:

```
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.production
backend/.env
frontend/.env

# Build files
frontend/build/
dist/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Firebase
firebase-adminsdk.json

# Uploads
backend/uploads/*
!backend/uploads/.gitkeep

# Testing
coverage/
.nyc_output/

# Misc
*.pem
*.key
```

### Step 1.3: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New Repository"**
3. Repository name: `ezycv-website` (or your choice)
4. Description: "Professional CV Builder with Wallpapers & Stock Photos"
5. Keep it **Private** (or Public if you want)
6. **DON'T** initialize with README (we already have one)
7. Click **"Create repository"**

### Step 1.4: Push Code to GitHub

```powershell
# Add all files
git add .

# Commit
git commit -m "Initial commit - Ezy CV MERN stack website"

# Add remote (replace with YOUR GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ezycv-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Part 2: DigitalOcean Droplet Setup

### Step 2.1: Create Droplet

1. **Login to DigitalOcean**: [cloud.digitalocean.com](https://cloud.digitalocean.com)

2. **Create Droplet**:
   - Click **"Create" → "Droplets"**

3. **Choose Image**:
   - Distribution: **Ubuntu 22.04 LTS** (recommended)

4. **Choose Plan**:
   - **Basic Plan**: $6/month (1GB RAM, 1 vCPU, 25GB SSD) - Minimum recommended
   - **Better**: $12/month (2GB RAM, 1 vCPU, 50GB SSD) - Recommended for production

5. **Choose Datacenter**:
   - Select nearest to Sri Lanka: **Singapore (sgp1)** or **Bangalore (blr1)**

6. **Authentication**:
   - **Option A (Easier)**: Password - Create a strong password
   - **Option B (More Secure)**: SSH Key - Upload your SSH public key

7. **Hostname**: `ezycv-production`

8. **Click "Create Droplet"**

9. **Wait 1-2 minutes** for droplet to be created

10. **Copy the IP Address** (e.g., `164.90.xxx.xxx`)

### Step 2.2: Connect to Droplet

```powershell
# Connect via SSH (replace with your IP)
ssh root@164.90.xxx.xxx

# Enter password when prompted
```

You're now in your server! 🎉

---

## Part 3: Server Initial Setup

### Step 3.1: Update System

```bash
# Update package list
apt update

# Upgrade packages
apt upgrade -y
```

### Step 3.2: Create Non-Root User (Security Best Practice)

```bash
# Create user
adduser ezycv

# Add to sudo group
usermod -aG sudo ezycv

# Switch to new user
su - ezycv
```

### Step 3.3: Install Node.js 20

```bash
# Install curl if not installed
sudo apt install curl -y

# Install Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Step 3.4: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 3.5: Install Nginx (Web Server)

```bash
# Install Nginx
sudo apt install nginx -y

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx

# Allow Nginx through firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Step 3.6: Install Git

```bash
sudo apt install git -y
git --version
```

---

## Part 4: MongoDB Setup (MongoDB Atlas)

Since DigitalOcean charges for MongoDB, we'll use **MongoDB Atlas** (free tier available).

### Step 4.1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create new project: "EzyCV Production"

### Step 4.2: Create Cluster

1. Click **"Build a Database"**
2. Choose **"M0 Free"** tier
3. Provider: **AWS**
4. Region: **Singapore** (ap-southeast-1) - nearest to Sri Lanka
5. Cluster name: `ezycv-cluster`
6. Click **"Create"**

### Step 4.3: Create Database User

1. **Security → Database Access**
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `ezycv_admin`
5. Password: **Auto-generate** (save this!)
6. Built-in Role: **Read and write to any database**
7. Click **"Add User"**

### Step 4.4: Whitelist IP Address

1. **Security → Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - *Note: In production, use your droplet's specific IP*
4. Click **"Confirm"**

### Step 4.5: Get Connection String

1. Go to **Database → Connect**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy connection string - looks like:
   ```
   mongodb+srv://ezycv_admin:<password>@ezycv-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. **Save this connection string!**

---

## Part 5: Clone and Configure Project

### Step 5.1: Generate GitHub Personal Access Token

Since the repo might be private, create a token:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (full control)
4. Copy token (you won't see it again!)

### Step 5.2: Clone Repository

```bash
cd /home/ezycv

# Clone repository (replace with your details)
git clone https://github.com/YOUR_USERNAME/ezycv-website.git

cd ezycv-website
```

### Step 5.3: Create Backend .env

```bash
cd backend

# Create .env file
nano .env
```

Paste this content (update with YOUR values):

```env
# Server Configuration
PORT=5000
NODE_ENV=production
BASE_URL=http://your-ip-address:5000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://ezycv_admin:YOUR_PASSWORD@ezycv-cluster.xxxxx.mongodb.net/ezycv?retryWrites=true&w=majority

# JWT Secret (generate new one!)
JWT_SECRET=YOUR_SUPER_SECURE_JWT_SECRET_MINIMUM_32_CHARACTERS

# Firebase Admin SDK
FIREBASE_PROJECT_ID=ezycv-84859

# Backblaze B2 Storage
B2_ENDPOINT=https://s3.us-east-005.backblazeb2.com
B2_ACCESS_KEY_ID=YOUR_B2_ACCESS_KEY_ID
B2_SECRET_ACCESS_KEY=YOUR_B2_SECRET_ACCESS_KEY
B2_BUCKET=your-bucket-name
B2_PUBLIC_BASE=https://your-b2-public-url

# Email SMTP (Brevo)
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your-brevo-smtp-username
MAIL_PASSWORD=your-brevo-smtp-password
MAIL_FROM_NAME=EzyCV
MAIL_FROM_ADDRESS=no-reply@ezycv.com

# Frontend URL
FRONTEND_URL=http://your-ip-address
```

**Save**: `Ctrl+X` → `Y` → `Enter`

### Step 5.4: Generate JWT Secret

```bash
# Generate secure random key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy output and update JWT_SECRET in .env
nano .env
```

### Step 5.5: Install Backend Dependencies

```bash
# Still in /home/ezycv/ezycv-website/backend
npm install

# This might take 2-5 minutes
```

### Step 5.6: Test Backend

```bash
node server.js

# You should see:
# ✅ MongoDB Connected
# ✅ Email Service Connected
# 🚀 Server running on port 5000
```

**Press Ctrl+C to stop**

### Step 5.7: Setup Frontend

```bash
cd ../frontend

# Create .env file
nano .env
```

Paste this content:

```env
# Backend API URL
REACT_APP_API_URL=http://your-ip-address:5000/api

# Firebase Configuration (your existing values)
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=ezycv-84859.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=ezycv-84859
REACT_APP_FIREBASE_STORAGE_BUCKET=ezycv-84859.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

**Save**: `Ctrl+X` → `Y` → `Enter`

### Step 5.8: Install Frontend Dependencies & Build

```bash
# Install dependencies (takes 3-5 minutes)
npm install

# Build production version (takes 2-4 minutes)
npm run build

# Build folder created at /home/ezycv/ezycv-website/frontend/build
```

---

## Part 6: PM2 Process Management

### Step 6.1: Start Backend with PM2

```bash
cd /home/ezycv/ezycv-website/backend

# Start with PM2
pm2 start server.js --name ezycv-backend

# Check status
pm2 status

# View logs
pm2 logs ezycv-backend

# Stop logs: Ctrl+C
```

### Step 6.2: Save PM2 Configuration

```bash
# Save current PM2 processes
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Copy and run the command it outputs (starts with sudo)
```

### Step 6.3: PM2 Useful Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs ezycv-backend

# Restart
pm2 restart ezycv-backend

# Stop
pm2 stop ezycv-backend

# Delete
pm2 delete ezycv-backend

# Monitor
pm2 monit
```

---

## Part 7: Nginx Configuration

### Step 7.1: Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/ezycv
```

Paste this configuration (replace IP with yours):

```nginx
server {
    listen 80;
    server_name your-ip-address;  # Change this to your domain later

    # Frontend (React build)
    root /home/ezycv/ezycv-website/frontend/build;
    index index.html;

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Save**: `Ctrl+X` → `Y` → `Enter`

### Step 7.2: Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/ezycv /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Should show: "syntax is ok" and "test is successful"

# Restart Nginx
sudo systemctl restart nginx
```

### Step 7.3: Test Your Website

Open browser and visit: `http://your-ip-address`

You should see your Ezy CV website! 🎉

---

## Part 8: Domain Configuration (Optional but Recommended)

### Step 8.1: Get a Domain

Buy a domain from:
- [Namecheap](https://namecheap.com) - $8-12/year
- [GoDaddy](https://godaddy.com)
- [Google Domains](https://domains.google)

Example: `ezycv.com`

### Step 8.2: Configure DNS

In your domain registrar's DNS settings:

1. **A Record**:
   - Host: `@`
   - Value: `your-droplet-ip`
   - TTL: `3600`

2. **A Record (www subdomain)**:
   - Host: `www`
   - Value: `your-droplet-ip`
   - TTL: `3600`

Wait 5-30 minutes for DNS propagation.

### Step 8.3: Update Nginx Config

```bash
sudo nano /etc/nginx/sites-available/ezycv
```

Change `server_name`:

```nginx
server_name ezycv.com www.ezycv.com;  # Your actual domain
```

**Save and restart**:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## Part 9: SSL Certificate (HTTPS)

### Step 9.1: Install Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y
```

### Step 9.2: Get SSL Certificate

```bash
# Get certificate (replace with your domain)
sudo certbot --nginx -d ezycv.com -d www.ezycv.com

# Follow prompts:
# - Enter email: ezycv22@gmail.com
# - Agree to terms: Y
# - Share email: N (optional)
# - Redirect HTTP to HTTPS: 2 (Yes, recommended)
```

### Step 9.3: Test Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Should show: "Congratulations, all simulated renewals succeeded"
```

### Step 9.4: Update Environment Variables

```bash
# Update backend .env
cd /home/ezycv/ezycv-website/backend
nano .env
```

Change URLs to HTTPS:

```env
BASE_URL=https://ezycv.com
FRONTEND_URL=https://ezycv.com
```

```bash
# Update frontend .env
cd ../frontend
nano .env
```

```env
REACT_APP_API_URL=https://ezycv.com/api
```

### Step 9.5: Rebuild Frontend

```bash
# Still in frontend folder
npm run build

# Restart backend
pm2 restart ezycv-backend
```

**Visit**: `https://ezycv.com` - You now have HTTPS! 🔒

---

## Part 10: VS Code Remote Development (Edit from Windows)

### Step 10.1: Install VS Code Extension

1. Open VS Code on your Windows machine
2. Install extension: **"Remote - SSH"** by Microsoft
3. Restart VS Code

### Step 10.2: Configure SSH in VS Code

1. **Press** `F1` or `Ctrl+Shift+P`
2. Type: **"Remote-SSH: Connect to Host"**
3. Select **"Configure SSH Hosts"**
4. Choose: `C:\Users\YourName\.ssh\config`

If file doesn't exist, create it:

```
Host ezycv-droplet
    HostName your-droplet-ip
    User ezycv
    Port 22
```

**Save the file**

### Step 10.3: Connect to Droplet

1. **Press** `F1` or `Ctrl+Shift+P`
2. Type: **"Remote-SSH: Connect to Host"**
3. Select **"ezycv-droplet"**
4. Enter password when prompted
5. Wait for VS Code to install VS Code Server on droplet (first time only)

### Step 10.4: Open Project Folder

1. Once connected, click **"Open Folder"**
2. Navigate to: `/home/ezycv/ezycv-website`
3. Click OK

You can now edit files directly on the server! 🚀

### Step 10.5: Make Changes & Deploy

When you make changes:

**Frontend changes**:
```bash
cd frontend
npm run build
# Nginx automatically serves new build
```

**Backend changes**:
```bash
pm2 restart ezycv-backend
```

### Step 10.6: Pull Latest from GitHub

```bash
cd /home/ezycv/ezycv-website

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
cd backend && npm install
cd ../frontend && npm install

# Rebuild frontend
cd frontend && npm run build

# Restart backend
pm2 restart ezycv-backend
```

---

## Part 11: Maintenance & Monitoring

### Useful Commands

```bash
# Check backend logs
pm2 logs ezycv-backend

# Monitor processes
pm2 monit

# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
top
```

### Update Your Code

```bash
# SSH into droplet
ssh ezycv@your-droplet-ip

cd /home/ezycv/ezycv-website

# Pull latest code
git pull origin main

# Update backend
cd backend
npm install
pm2 restart ezycv-backend

# Update frontend
cd ../frontend
npm install
npm run build
```

---

## 🎉 Deployment Complete Checklist

- ✅ Code pushed to GitHub
- ✅ DigitalOcean droplet created
- ✅ MongoDB Atlas configured
- ✅ Node.js & dependencies installed
- ✅ Backend running with PM2
- ✅ Frontend built and served by Nginx
- ✅ Website accessible via IP/domain
- ✅ SSL certificate installed (HTTPS)
- ✅ VS Code remote SSH configured
- ✅ Firewall configured
- ✅ PM2 auto-start on boot

---

## 🔥 Quick Reference

### Your URLs
- **Website**: `https://ezycv.com` (or your domain)
- **API**: `https://ezycv.com/api`

### Important Files
- Backend env: `/home/ezycv/ezycv-website/backend/.env`
- Frontend env: `/home/ezycv/ezycv-website/frontend/.env`
- Nginx config: `/etc/nginx/sites-available/ezycv`
- PM2 logs: `pm2 logs ezycv-backend`

### Quick Deploy Commands
```bash
# Connect
ssh ezycv@your-droplet-ip

# Pull latest
cd /home/ezycv/ezycv-website && git pull

# Update backend
cd backend && npm install && pm2 restart ezycv-backend

# Update frontend
cd ../frontend && npm install && npm run build
```

---

## 🆘 Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs ezycv-backend

# Check if port 5000 is in use
sudo lsof -i :5000

# Restart
pm2 restart ezycv-backend
```

### Frontend not loading
```bash
# Check Nginx
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Rebuild frontend
cd /home/ezycv/ezycv-website/frontend
npm run build
sudo systemctl restart nginx
```

### MongoDB connection issues
- Check connection string in `.env`
- Verify MongoDB Atlas IP whitelist
- Check username/password

### SSL certificate issues
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

---

## 🚀 Next Steps

1. **Custom Domain**: Get `ezycv.lk` for Sri Lankan domain
2. **Email Domain**: Setup email forwarding (contact@ezycv.com)
3. **Backups**: Setup automated database backups
4. **Monitoring**: Add [UptimeRobot](https://uptimerobot.com) for uptime monitoring
5. **Analytics**: Verify Google Analytics is working
6. **CDN**: Add Cloudflare for better performance
7. **Improve Security**: 
   - Change SSH port from 22
   - Setup fail2ban
   - Regular security updates

---

## 📞 Support

If you encounter issues:
1. Check logs: `pm2 logs ezycv-backend`
2. Check Nginx: `sudo nginx -t`
3. Check MongoDB connection
4. Verify all environment variables
5. Check firewall rules: `sudo ufw status`

**Your website is now LIVE on DigitalOcean!** 🎊

---

**Made with ❤️ in Sri Lanka**
**Rambukkana, Sri Lanka**
**ezycv22@gmail.com**
