#!/bin/bash
# Quick update script for EzyCV - Run this for updates after initial deployment
# Run as: bash update.sh

set -e

echo "=========================================="
echo "EzyCV Quick Update"
echo "=========================================="

cd /home/ubuntu/ezycv-prod

# Pull latest changes
echo "1. Pulling latest code from GitHub..."
git pull origin main

# Update backend
echo "2. Updating backend..."
cd backend
npm install
pm2 restart ezycv-backend

# Update frontend
echo "3. Updating frontend..."
cd ../frontend
npm install
npm run build

# Reload Nginx
echo "4. Reloading Nginx..."
sudo systemctl reload nginx

echo "=========================================="
echo "Update Complete!"
echo "=========================================="
echo "View logs: pm2 logs ezycv-backend"
