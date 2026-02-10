# AWS Lightsail Deployment Guide - EzyCV

## Server Details
- **IP Address**: 13.228.29.124
- **Username**: ubuntu
- **PEM Key**: LightsailDefaultKey-ap-southeast-1.pem

---

## SSH Connection Issue Resolved

The PEM key in the repository does not match the server's authorized keys. To connect:

### Option 1: Use AWS Lightsail Console
1. Go to AWS Lightsail console
2. Click on your instance
3. Click "Connect using SSH" button (browser-based terminal)

### Option 2: Get the Correct PEM Key
1. Download the correct key from AWS Lightsail console
2. Replace the existing PEM key
3. Set correct permissions:
   ```powershell
   icacls "LightsailDefaultKey-ap-southeast-1.pem" /inheritance:r
   icacls "LightsailDefaultKey-ap-southeast-1.pem" /grant:r %USERNAME%:F
   icacls "LightsailDefaultKey-ap-southeast-1.pem" /remove "NT AUTHORITY\Authenticated Users"
   icacls "LightsailDefaultKey-ap-southeast-1.pem" /remove "BUILTIN\Users"
   ```
4. Connect via SSH:
   ```bash
   ssh -i "LightsailDefaultKey-ap-southeast-1.pem" ubuntu@13.228.29.124
   ```

---

## Deployment Steps

### 1. Initial Deployment (First Time)

Connect to your server using one of the methods above, then:

```bash
# Upload the deployment script
# (If using browser SSH, copy-paste the deploy.sh content or use wget/curl)

# Download deployment script from GitHub
wget https://raw.githubusercontent.com/sahanvin2/ezycv-prod/main/deploy.sh

# Make it executable
chmod +x deploy.sh

# Run deployment
sudo bash deploy.sh
```

The script will:
- Install Node.js 20.x
- Install and configure MongoDB
- Install Nginx
- Install PM2 process manager
- Clone the GitHub repository
- Install all dependencies
- Build the frontend
- Configure Nginx as reverse proxy
- Start the backend with PM2

**Deployment time**: ~10-15 minutes

---

### 2. Quick Updates (After Initial Setup)

For future code updates:

```bash
cd /home/ubuntu/ezycv-prod

# Download update script (first time only)
wget https://raw.githubusercontent.com/sahanvin2/ezycv-prod/main/update.sh
chmod +x update.sh

# Run updates
bash update.sh
```

---

## Architecture

```
┌─────────────────────────────────────────────┐
│         AWS Lightsail Ubuntu               │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │         Nginx (Port 80)              │   │
│  │  ┌────────────┬──────────────────┐   │   │
│  │  │  Frontend  │   Proxy /api ->  │   │   │
│  │  │  (Static)  │   Backend:5000   │   │   │
│  │  └────────────┴──────────────────┘   │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │  Backend (PM2 - Port 5000)          │   │
│  │  - Express.js API                    │   │
│  │  - MongoDB queries                   │   │
│  │  - B2 Storage integration            │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
               │
               ↓
       MongoDB Atlas (Cloud)
       Backblaze B2 (Cloud)
```

---

## Access Points

- **Website**: http://13.228.29.124
- **API**: http://13.228.29.124/api
- **Health Check**: http://13.228.29.124/api/health

---

## Useful Commands

### Check Services Status
```bash
# Backend status
pm2 status

# Backend logs
pm2 logs ezycv-backend

# Backend detailed logs
pm2 logs ezycv-backend --lines 100

# Nginx status
sudo systemctl status nginx

# MongoDB status
sudo systemctl status mongod
```

### Restart Services
```bash
# Restart backend
pm2 restart ezycv-backend

# Restart Nginx
sudo systemctl restart nginx

# Restart MongoDB
sudo systemctl restart mongod
```

### View Logs
```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo journalctl -u mongod -f
```

### Update Code
```bash
cd /home/ubuntu/ezycv-prod
git pull origin main
cd backend && npm install && pm2 restart ezycv-backend
cd ../frontend && npm install && npm run build
sudo systemctl reload nginx
```

---

## Environment Variables

Backend `.env` file location: `/home/ubuntu/ezycv-prod/backend/.env`

**Critical**: The .env file contains sensitive credentials (MongoDB URI, SMTP keys). Never commit this file to GitHub.

To edit:
```bash
nano /home/ubuntu/ezycv-prod/backend/.env
# After editing: pm2 restart ezycv-backend
```

---

## Security Recommendations

### 1. Firewall (UFW)
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS (for future SSL)
sudo ufw enable
```

### 2. Setup SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

### 3. MongoDB Security
```bash
# Already configured to use MongoDB Atlas (cloud)
# No local MongoDB exposed to internet
```

---

## Troubleshooting

### Backend not starting
```bash
pm2 logs ezycv-backend --lines 50
# Check for MongoDB connection errors
# Check .env file exists and has correct values
```

### Frontend showing 404
```bash
# Check build exists
ls -la /home/ubuntu/ezycv-prod/frontend/build

# Rebuild if needed
cd /home/ubuntu/ezycv-prod/frontend
npm run build
```

### Nginx errors
```bash
# Test config
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

---

## Backup & Restore

### Backup
```bash
# Backup database (if using local MongoDB)
mongodump --out /home/ubuntu/backups/$(date +%Y%m%d)

# Backup code (already in GitHub)
# Backup .env file
cp /home/ubuntu/ezycv-prod/backend/.env /home/ubuntu/backups/
```

### Restore
```bash
# Restore from GitHub (code)
cd /home/ubuntu/ezycv-prod
git pull origin main

# Restore database
mongorestore /home/ubuntu/backups/20260210/
```

---

## Performance Monitoring

### PM2 Monitoring
```bash
# Real-time dashboard
pm2 monit

# Process info
pm2 info ezycv-backend

# Memory usage
pm2 logs ezycv-backend --format
```

### System Resources
```bash
# CPU & Memory
htop

# Disk usage
df -h

# Network
netstat -tuln | grep :5000
```

---

## Contact & Support

- **GitHub**: https://github.com/sahanvin2/ezycv-prod
- **Issues**: Report issues on GitHub Issues page

---

## Deployment Checklist

- [ ] Connected to server via SSH
- [ ] Ran `deploy.sh` successfully
- [ ] Website accessible at http://13.228.29.124
- [ ] Backend API responding at http://13.228.29.124/api
- [ ] PM2 shows backend running: `pm2 status`
- [ ] Nginx running: `sudo systemctl status nginx`
- [ ] MongoDB connected (check backend logs)
- [ ] Wallpapers loading correctly
- [ ] CV builder working
- [ ] No console errors in browser DevTools

---

**Deployment Date**: February 10, 2026  
**Last Updated**: February 10, 2026
