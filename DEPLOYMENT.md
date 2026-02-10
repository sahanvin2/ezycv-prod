# 🚀 Deployment Guide - CV Maker Pro

This guide provides step-by-step instructions for deploying CV Maker Pro to various hosting platforms.

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration

**Frontend (.env)**
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_GA_ID=G-XXXXXXXXXX
REACT_APP_SITE_URL=https://your-domain.com
```

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cvmaker
JWT_SECRET=your_secure_random_jwt_secret_key_minimum_32_characters
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
```

### 2. Code Preparation

- [ ] Update package.json with correct name, version, and repository
- [ ] Test build locally: `npm run build`
- [ ] Remove console.logs from production code
- [ ] Update API URLs to production endpoints
- [ ] Verify all environment variables are set
- [ ] Test all features in production mode

### 3. Database Setup

**MongoDB Atlas (Recommended)**
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create new cluster (Free tier available)
3. Create database user with password
4. Whitelist IP addresses (0.0.0.0/0 for all IPs or specific ones)
5. Get connection string
6. Update MONGODB_URI in backend .env

### 4. Security

- [ ] Generate strong JWT secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Enable CORS with specific origins only
- [ ] Add rate limiting to API endpoints
- [ ] Set secure cookie flags
- [ ] Add helmet.js for security headers
- [ ] Implement input validation and sanitization

---

## 🌐 Deployment Options

## Option 1: Netlify (Frontend) + Heroku (Backend)

### Frontend on Netlify

**Method A: GitHub Integration (Recommended)**

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/cv-maker-pro.git
git push -u origin main
```

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub and select repository
   - Build settings:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/build`
   - Environment variables:
     - `REACT_APP_API_URL`: Your Heroku backend URL
     - `REACT_APP_GA_ID`: Your Google Analytics ID
   - Click "Deploy site"

**Method B: Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build frontend
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=build
```

3. **Custom Domain (Optional)**
   - Go to Domain settings
   - Add custom domain
   - Configure DNS (A record or CNAME)
   - Enable HTTPS (automatic)

### Backend on Heroku

1. **Install Heroku CLI**
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

2. **Login and Create App**
```bash
heroku login
cd backend
heroku create cv-maker-api
```

3. **Add MongoDB**
```bash
# Option A: Use existing MongoDB Atlas
heroku config:set MONGODB_URI="mongodb+srv://..."

# Option B: Add MongoDB addon
heroku addons:create mongolab:sandbox
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your_secret_key"
heroku config:set CORS_ORIGIN="https://your-netlify-site.netlify.app"
```

5. **Create Procfile**
```bash
echo "web: node server.js" > Procfile
```

6. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

7. **Check logs**
```bash
heroku logs --tail
```

---

## Option 2: Vercel (Frontend) + Railway (Backend)

### Frontend on Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel --prod
```

3. **Configure**
   - Framework: Create React App
   - Output directory: `build`
   - Environment variables in Vercel dashboard

### Backend on Railway

1. **Sign up at [railway.app](https://railway.app)**
2. **New Project → Deploy from GitHub**
3. **Configure**
   - Root directory: `backend`
   - Start command: `node server.js`
4. **Add MongoDB plugin** (or use external MongoDB Atlas)
5. **Set environment variables**
6. **Deploy**

---

## Option 3: AWS (Full Stack)

### Frontend on S3 + CloudFront

1. **Create S3 Bucket**
```bash
aws s3 mb s3://cv-maker-pro
```

2. **Build and Upload**
```bash
cd frontend
npm run build
aws s3 sync build/ s3://cv-maker-pro --delete
```

3. **Enable Static Website Hosting**
   - Index document: `index.html`
   - Error document: `index.html`

4. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Default root object: `index.html`
   - Custom error responses: 403 → /index.html, 404 → /index.html

5. **Configure Route 53** (Custom domain)

### Backend on EC2 or Elastic Beanstalk

**EC2 Setup:**
```bash
# Connect to EC2 instance
ssh -i "your-key.pem" ubuntu@your-ec2-ip

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/username/cv-maker-pro.git
cd cv-maker-pro/backend

# Install dependencies
npm install

# Set environment variables
echo "MONGODB_URI=..." >> .env
echo "JWT_SECRET=..." >> .env
echo "NODE_ENV=production" >> .env

# Start with PM2
pm2 start server.js --name cv-maker-api
pm2 startup
pm2 save

# Configure Nginx reverse proxy
sudo apt-get install nginx
```

**Nginx Configuration** (`/etc/nginx/sites-available/cv-maker`):
```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/cv-maker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**SSL with Let's Encrypt:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com
```

---

## Option 4: DigitalOcean (Full Stack)

### 1. Create Droplet
- Ubuntu 20.04
- 1GB RAM minimum
- Enable backups

### 2. Initial Server Setup
```bash
# Connect
ssh root@your-droplet-ip

# Update
apt update && apt upgrade -y

# Create user
adduser cvmaker
usermod -aG sudo cvmaker

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
```

### 3. Deploy Application
```bash
# Clone
cd /var/www
git clone https://github.com/username/cv-maker-pro.git
cd cv-maker-pro

# Backend
cd backend
npm install
nano .env  # Add environment variables

# Install PM2
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save

# Frontend
cd ../frontend
npm install
npm run build
```

### 4. Configure Nginx
```bash
apt install nginx

# Frontend config
nano /etc/nginx/sites-available/cv-maker
```

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/cv-maker-pro/frontend/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/cv-maker /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# SSL
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## Option 5: Docker Deployment

### 1. Create Dockerfiles

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Frontend nginx.conf**:
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
    }
}
```

### 2. Docker Compose

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/cvmaker?authSource=admin
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

### 3. Deploy
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 📊 Post-Deployment

### 1. Monitoring

**Uptime Monitoring:**
- [UptimeRobot](https://uptimerobot.com/) (Free)
- [Pingdom](https://www.pingdom.com/)

**Error Tracking:**
```bash
npm install @sentry/react @sentry/node
```

**Analytics:**
- Add Google Analytics tracking ID
- Set up Google Search Console

### 2. Performance

**Frontend:**
- Enable Cloudflare or CloudFront CDN
- Compress images
- Lazy load components
- Enable service worker for PWA

**Backend:**
- Add Redis for caching
- Use PM2 cluster mode
- Enable gzip compression
- Add database indexing

### 3. Backup Strategy

**Database:**
```bash
# MongoDB backup
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)

# Automated daily backups
crontab -e
0 2 * * * /path/to/backup-script.sh
```

### 4. CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Your deployment script
```

---

## 🔧 Troubleshooting

**Common Issues:**

1. **Build fails:**
   - Check Node version compatibility
   - Clear node_modules and reinstall
   - Verify all dependencies installed

2. **API not connecting:**
   - Check CORS configuration
   - Verify API URL in frontend .env
   - Check firewall rules

3. **Database connection fails:**
   - Verify MongoDB URI format
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

4. **White screen after deployment:**
   - Check browser console for errors
   - Verify build directory is correct
   - Check router basename configuration

---

## 📞 Support

For deployment issues:
- Check logs: `heroku logs --tail` or `pm2 logs`
- Review documentation for your hosting provider
- Contact support@cvmaker-pro.com

---

**Deployment completed? ✅**

Next steps:
1. Set up monitoring
2. Configure backups
3. Add custom domain
4. Enable SSL
5. Set up analytics
6. Launch! 🚀
