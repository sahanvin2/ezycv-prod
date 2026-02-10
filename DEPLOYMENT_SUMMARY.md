# EzyCV Deployment Summary

## ✅ GitHub Repository Status
- **Repository**: https://github.com/sahanvin2/ezycv-prod
- **Branch**: main
- **Status**: All code pushed successfully
- **Commits**: 2 commits
  1. Complete platform code (wallpapers, CV builder, mobile optimization)
  2. AWS deployment scripts and guides

---

## 🔑 SSH Connection Issue

The PEM key file (`LightsailDefaultKey-ap-southeast-1.pem`) in your folder does NOT match the AWS Lightsail instance's authorized keys.

### Solution Options:

**Option 1: AWS Lightsail Browser Console (Easiest)**
1. Go to https://lightsail.aws.amazon.com
2. Click on your instance
3. Click "Connect using SSH" button
4. You'll get a browser-based terminal

**Option 2: Download Correct Key**
1. In AWS Lightsail console, go to "Account" → "SSH Keys"
2. Download the correct key for your instance
3. Replace the .pem file in your project folder
4. Try SSH again

---

## 🚀 Manual Deployment Steps

Once you have SSH access, run these commands:

```bash
# 1. Download the deployment script directly from GitHub
wget https://raw.githubusercontent.com/sahanvin2/ezycv-prod/main/deploy.sh

# 2. Make it executable
chmod +x deploy.sh

# 3. Run the deployment
sudo bash deploy.sh
```

**The script will automatically:**
- ✅ Install Node.js, MongoDB, Nginx, PM2
- ✅ Clone your GitHub repository
- ✅ Install all dependencies
- ✅ Build the React frontend
- ✅ Configure Nginx reverse proxy
- ✅ Start backend with PM2 process manager

**Note**: The script creates a `.env` file with PLACEHOLDER values. You'll need to edit it with real credentials:

```bash
# After deploy.sh completes, edit the .env file
nano /home/ubuntu/ezycv-prod/backend/.env

# Update these values:
# - MONGODB_URI (your actual MongoDB Atlas connection string)
# - MAIL_USERNAME (your actual Brevo SMTP username)
# - MAIL_PASSWORD (your actual Brevo SMTP password)

# Then restart the backend
pm2 restart ezycv-backend
```

---

## 📋 Alternative: Copy-Paste Method

If the script download doesn't work, you can copy-paste the deployment commands:

### Step 1: System Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install essential tools
sudo apt install -y nginx git

# Install PM2
sudo npm install -g pm2
```

### Step 2: Clone Repository
```bash
cd /home/ubuntu
git clone https://github.com/sahanvin2/ezycv-prod.git
cd ezycv-prod
```

### Step 3: Setup Backend
```bash
cd backend
npm install

# Create .env file with your actual credentials
nano .env
```

**Copy the values from your local `.env.atlas` file or use the template from `.env.example` in the repository.**

Save with `Ctrl+X`, `Y`, `Enter`

### Step 4: Setup Frontend
```bash
cd ../frontend

# Create build-time .env
echo "REACT_APP_API_URL=http://13.228.29.124:5000" > .env

npm install
npm run build
```

### Step 5: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/ezycv
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name 13.228.29.124;

    location / {
        root /home/ubuntu/ezycv-prod/frontend/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    client_max_body_size 10M;
}
```

Save with `Ctrl+X`, `Y`, `Enter`

```bash
# Enable the site
sudo ln -sf /etc/nginx/sites-available/ezycv /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Start Backend with PM2
```bash
cd /home/ubuntu/ezycv-prod/backend
pm2 start server.js --name ezycv-backend
pm2 save
pm2 startup
```

---

## 🎯 Access Your Site

After deployment completes:
- **Website**: http://13.228.29.124
- **API Health**: http://13.228.29.124/api/health

---

## 🔧 Useful Commands

```bash
# Check backend status
pm2 status
pm2 logs ezycv-backend

# Restart services
pm2 restart ezycv-backend
sudo systemctl restart nginx

# Update code (future updates)
cd /home/ubuntu/ezycv-prod
git pull origin main
cd backend && npm install && pm2 restart ezycv-backend
cd ../frontend && npm install && npm run build
sudo systemctl reload nginx
```

---

## 📚 Full Documentation

See `AWS_DEPLOYMENT_GUIDE.md` in the repository for:
- Detailed architecture diagram
- Complete troubleshooting guide
- Security recommendations
- Monitoring and backup strategies
- SSL certificate setup (HTTPS)

---

## ⚠️ Important Security Notes

1. **Never commit credentials to GitHub** - The .env file is in .gitignore
2. **Setup firewall**: `sudo ufw allow 80 && sudo ufw allow 22 && sudo ufw enable`
3. **Add SSL certificate** when you have a domain name
4. **Keep credentials in secure-setup.sh** file on your local machine only

---

## 📞 Need Help?

If you encounter issues:
1. Check PM2 logs: `pm2 logs ezycv-backend --lines 50`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check MongoDB connection in backend logs
4. Verify .env file has correct credentials

---

**Deployment Date**: February 10, 2026  
**Status**: ✅ Code pushed to GitHub, ready for deployment
