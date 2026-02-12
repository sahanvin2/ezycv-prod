#!/bin/bash
# Ezy CV - Quick Deployment Helper Script
# Run this on your DigitalOcean droplet after pulling latest code

echo "🚀 Ezy CV Deployment Helper"
echo "================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Change to project directory
cd /home/ezycv/ezycv-website || exit

echo -e "${BLUE}📥 Pulling latest code from GitHub...${NC}"
git pull origin main

echo ""
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
npm install

echo ""
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd ../frontend
npm install

echo ""
echo -e "${BLUE}🏗️  Building frontend...${NC}"
npm run build

echo ""
echo -e "${BLUE}🔄 Restarting backend with PM2...${NC}"
pm2 restart ezycv-backend

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Useful commands:"
echo "  pm2 logs ezycv-backend - View backend logs"
echo "  pm2 monit - Monitor processes"
echo "  sudo systemctl status nginx - Check Nginx status"
echo ""
echo -e "${GREEN}Your website is now updated! 🎉${NC}"
