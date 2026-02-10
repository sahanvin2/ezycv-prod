#!/bin/bash
# EzyCV Production Deployment Script for AWS Lightsail
# Run this as: sudo bash deploy.sh

set -e

echo "=========================================="
echo "EzyCV Production Deployment"
echo "=========================================="

# Update system
echo "1. Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Node.js 20.x
echo "2. Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (Community Edition)
echo "3. Installing MongoDB..."
sudo apt-get install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
echo "4. Installing Nginx..."
sudo apt install -y nginx

# Install PM2 globally
echo "5. Installing PM2..."
sudo npm install -g pm2

# Install Git
echo "6. Installing Git..."
sudo apt install -y git

# Clone repository
echo "7. Cloning repository..."
cd /home/ubuntu
if [ -d "ezycv-prod" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd ezycv-prod
    git pull origin main
else
    git clone https://github.com/sahanvin2/ezycv-prod.git
    cd ezycv-prod
fi

# Setup backend
echo "8. Setting up backend..."
cd /home/ubuntu/ezycv-prod/backend

# Create .env file
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cat > .env << 'EOF'
# MongoDB Atlas - REPLACE WITH YOUR CREDENTIALS
MONGODB_URI=your_mongodb_connection_string_here

# Email SMTP (Brevo) - REPLACE WITH YOUR CREDENTIALS
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your_smtp_username
MAIL_PASSWORD=your_smtp_password
MAIL_FROM_NAME=EzyCV
MAIL_FROM_ADDRESS=no-reply@ezycv.com

# JWT Secret - GENERATE A SECURE RANDOM STRING
JWT_SECRET=ezycv_super_secret_key_2026_production_secure_min_32_chars

# Node Environment
NODE_ENV=production
PORT=5000
EOF
    echo ""
    echo "⚠️  IMPORTANT: Edit /home/ubuntu/ezycv-prod/backend/.env with your actual credentials!"
    echo "    Use: nano /home/ubuntu/ezycv-prod/backend/.env"
    echo ""
fi

npm install
sudo npm install -g nodemon

# Setup frontend
echo "9. Setting up frontend..."
cd /home/ubuntu/ezycv-prod/frontend

# Create .env for build
cat > .env << 'EOF'
REACT_APP_API_URL=http://13.228.29.124:5000
EOF

npm install
npm run build

# Configure Nginx
echo "10. Configuring Nginx..."
sudo tee /etc/nginx/sites-available/ezycv << 'EOF'
server {
    listen 80;
    server_name 13.228.29.124;

    # Frontend
    location / {
        root /home/ubuntu/ezycv-prod/frontend/build;
        try_files $uri /index.html;
        add_header Cache-Control "no-cache";
    }

    # Backend API
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

    # Increase upload size for CV files
    client_max_body_size 10M;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/ezycv /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Start backend with PM2
echo "11. Starting backend with PM2..."
cd /home/ubuntu/ezycv-prod/backend
pm2 delete ezycv-backend 2>/dev/null || true
pm2 start server.js --name ezycv-backend
pm2 save
pm2 startup

echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Access your site at: http://13.228.29.124"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check backend status"
echo "  pm2 logs ezycv-backend  - View backend logs"
echo "  pm2 restart ezycv-backend - Restart backend"
echo "  sudo systemctl status nginx - Check Nginx status"
echo "  sudo systemctl status mongod - Check MongoDB status"
echo ""
