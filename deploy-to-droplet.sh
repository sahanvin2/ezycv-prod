#!/bin/bash
# Ezy CV - Automated DigitalOcean Droplet Deployment Script
# This script installs all dependencies and deploys the application

set -e  # Exit on any error

echo "🚀 Starting Ezy CV Deployment on DigitalOcean"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
GITHUB_REPO="https://github.com/sahanvin2/ezycv-prod.git"
APP_DIR="/var/www/ezycv"
DOMAIN_OR_IP="138.197.40.119"

# Step 1: Update system
echo -e "${BLUE}📦 Step 1: Updating system packages...${NC}"
apt update
apt upgrade -y
echo -e "${GREEN}✅ System updated${NC}\n"

# Step 2: Install Node.js 20
echo -e "${BLUE}📦 Step 2: Installing Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
echo -e "${GREEN}✅ Node.js $(node --version) installed${NC}"
echo -e "${GREEN}✅ npm $(npm --version) installed${NC}\n"

# Step 3: Install PM2
echo -e "${BLUE}📦 Step 3: Installing PM2 process manager...${NC}"
npm install -g pm2
echo -e "${GREEN}✅ PM2 installed${NC}\n"

# Step 4: Install Nginx
echo -e "${BLUE}📦 Step 4: Installing Nginx web server...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx
echo -e "${GREEN}✅ Nginx installed and started${NC}\n"

# Step 5: Install Git (if not already installed)
echo -e "${BLUE}📦 Step 5: Ensuring Git is installed...${NC}"
apt install -y git
echo -e "${GREEN}✅ Git installed${NC}\n"

# Step 6: Clone repository
echo -e "${BLUE}📦 Step 6: Cloning repository...${NC}"
if [ -d "$APP_DIR" ]; then
    echo "Directory exists, pulling latest changes..."
    cd $APP_DIR
    git pull origin main
else
    mkdir -p $APP_DIR
    git clone $GITHUB_REPO $APP_DIR
    cd $APP_DIR
fi
echo -e "${GREEN}✅ Repository cloned/updated${NC}\n"

# Step 7: Create backend .env file
echo -e "${BLUE}📦 Step 7: Creating backend environment file...${NC}"
cat > $APP_DIR/backend/.env << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=production
BASE_URL=http://138.197.40.119

# MongoDB Atlas - Production
MONGODB_URI=mongodb+srv://ezycv22_db_user:z6sxbfaIYt8CLhxj@ezycv.gmcrohr.mongodb.net/ezycv-prod?retryWrites=true&w=majority&appName=ezycv

# JWT Secret
JWT_SECRET=movia-super-secure-jwt-secret-key-2024

# Firebase Admin SDK
FIREBASE_PROJECT_ID=ezycv-84859

# Backblaze B2 Storage
B2_ENDPOINT=https://s3.us-east-005.backblazeb2.com
B2_ACCESS_KEY_ID=0053aaa597862ee0000000001
B2_SECRET_ACCESS_KEY=K005kVHvMmLD696fVPINAqzU2wW+HGs
B2_BUCKET=movia-prod
B2_PUBLIC_BASE=https://f005.backblazeb2.com/file/movia-prod

# Email SMTP (Brevo)
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=YOUR_BREVO_SMTP_USERNAME
MAIL_PASSWORD=YOUR_BREVO_SMTP_PASSWORD
MAIL_FROM_NAME=EzyCV
MAIL_FROM_ADDRESS=noreply@ezycv.org

# Frontend URL
FRONTEND_URL=http://138.197.40.119
EOF
echo -e "${GREEN}✅ Backend .env created${NC}\n"

# Step 8: Install backend dependencies
echo -e "${BLUE}📦 Step 8: Installing backend dependencies...${NC}"
cd $APP_DIR/backend
npm install --production
echo -e "${GREEN}✅ Backend dependencies installed${NC}\n"

# Step 9: Install frontend dependencies
echo -e "${BLUE}📦 Step 9: Installing frontend dependencies...${NC}"
cd $APP_DIR/frontend
npm install
echo -e "${GREEN}✅ Frontend dependencies installed${NC}\n"

# Step 10: Build frontend
echo -e "${BLUE}📦 Step 10: Building frontend...${NC}"
REACT_APP_API_URL=http://138.197.40.119/api npm run build
echo -e "${GREEN}✅ Frontend built successfully${NC}\n"

# Step 11: Start backend with PM2
echo -e "${BLUE}📦 Step 11: Starting backend with PM2...${NC}"
cd $APP_DIR/backend
pm2 delete ezycv-backend 2>/dev/null || true
pm2 start server.js --name ezycv-backend
pm2 save
pm2 startup | tail -n 1 | bash
echo -e "${GREEN}✅ Backend started with PM2${NC}\n"

# Step 12: Configure Nginx
echo -e "${BLUE}📦 Step 12: Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/ezycv << 'EOF'
server {
    listen 80;
    server_name 138.197.40.119;

    # Frontend (React build)
    root /var/www/ezycv/frontend/build;
    index index.html;

    # Client max body size
    client_max_body_size 10M;

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
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -sf /etc/nginx/sites-available/ezycv /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
echo -e "${GREEN}✅ Nginx configured and reloaded${NC}\n"

# Step 13: Configure firewall
echo -e "${BLUE}📦 Step 13: Configuring firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable
echo -e "${GREEN}✅ Firewall configured${NC}\n"

# Step 14: Display status
echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=============================================="
echo ""
echo "📊 Status Check:"
echo "----------------------------------------"
echo -e "Backend Status:  $(pm2 list | grep ezycv-backend > /dev/null && echo '✅ Running' || echo '❌ Not Running')"
echo -e "Nginx Status:    $(systemctl is-active nginx)"
echo -e "Node Version:    $(node --version)"
echo -e "PM2 Version:     $(pm2 --version)"
echo ""
echo "🌐 Access your website:"
echo "   http://138.197.40.119"
echo ""
echo "📝 Useful Commands:"
echo "   pm2 logs ezycv-backend    - View backend logs"
echo "   pm2 restart ezycv-backend - Restart backend"
echo "   pm2 monit                 - Monitor processes"
echo "   systemctl status nginx    - Check Nginx status"
echo ""
echo "=============================================="
echo "🎊 Your Ezy CV website is now LIVE!"
echo "=============================================="
