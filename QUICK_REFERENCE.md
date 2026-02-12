# 🚀 Quick Deployment Reference Card

## SSH Connection
```bash
ssh ezycv@your-droplet-ip
```

## Directory Structure
```
/home/ezycv/ezycv-website/
├── backend/          # Node.js API
│   ├── .env         # Backend environment variables
│   └── server.js    # Main server file
└── frontend/        # React app
    ├── .env         # Frontend environment variables
    └── build/       # Production build (served by Nginx)
```

## Quick Deploy (After Git Push)
```bash
ssh ezycv@your-droplet-ip
cd /home/ezycv/ezycv-website
./deploy-helper.sh
```

## Manual Deploy Steps
```bash
# 1. Pull latest code
cd /home/ezycv/ezycv-website
git pull origin main

# 2. Update backend
cd backend
npm install
pm2 restart ezycv-backend

# 3. Update frontend
cd ../frontend
npm install
npm run build
```

## PM2 Commands
```bash
pm2 list                    # List all processes
pm2 logs ezycv-backend      # View backend logs
pm2 logs ezycv-backend --lines 100  # Last 100 lines
pm2 monit                   # Monitor all processes
pm2 restart ezycv-backend   # Restart backend
pm2 stop ezycv-backend      # Stop backend
pm2 delete ezycv-backend    # Delete process
pm2 save                    # Save current processes
```

## Nginx Commands
```bash
sudo systemctl status nginx       # Check status
sudo systemctl restart nginx      # Restart
sudo systemctl reload nginx       # Reload config
sudo nginx -t                     # Test configuration
sudo tail -f /var/log/nginx/error.log   # View error logs
sudo tail -f /var/log/nginx/access.log  # View access logs
```

## Edit Configuration Files
```bash
# Backend environment
nano /home/ezycv/ezycv-website/backend/.env

# Frontend environment
nano /home/ezycv/ezycv-website/frontend/.env

# Nginx configuration
sudo nano /etc/nginx/sites-available/ezycv
sudo nginx -t && sudo systemctl reload nginx
```

## View Logs
```bash
# Backend logs
pm2 logs ezycv-backend

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

## MongoDB Commands
```bash
# Connection string in .env:
# mongodb+srv://username:password@cluster.mongodb.net/database

# Test connection from backend:
cd /home/ezycv/ezycv-website/backend
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

## SSL Certificate (Let's Encrypt)
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run
```

## System Monitoring
```bash
# Disk space
df -h

# Memory usage
free -h

# Running processes
top
htop  # If installed

# Network connections
sudo netstat -tlnp | grep node  # Find Node process
```

## Firewall (UFW)
```bash
sudo ufw status                # Check status
sudo ufw allow 80/tcp          # Allow HTTP
sudo ufw allow 443/tcp         # Allow HTTPS
sudo ufw allow 22/tcp          # Allow SSH
sudo ufw enable                # Enable firewall
```

## Git Commands
```bash
# Pull latest changes
git pull origin main

# Check current branch
git branch

# View recent commits
git log --oneline -5

# View changes
git status

# Stash local changes
git stash
git pull
git stash pop
```

## Environment Variables
### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PORT` - Backend port (5000)
- `MAIL_USERNAME` - Brevo SMTP username
- `MAIL_PASSWORD` - Brevo SMTP password

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_FIREBASE_*` - Firebase config

## Troubleshooting

### Backend won't start
```bash
pm2 logs ezycv-backend        # Check logs
sudo lsof -i :5000            # Check if port is in use
pm2 restart ezycv-backend     # Restart
```

### Frontend shows old version
```bash
cd /home/ezycv/ezycv-website/frontend
npm run build                 # Rebuild
sudo systemctl restart nginx  # Restart Nginx
```

### Website not accessible
```bash
sudo systemctl status nginx   # Check Nginx
pm2 status                    # Check backend
sudo ufw status               # Check firewall
```

### MongoDB connection error
- Check `.env` has correct `MONGODB_URI`
- Verify MongoDB Atlas IP whitelist
- Check username/password

### SSL certificate expired
```bash
sudo certbot renew
sudo systemctl reload nginx
```

## Important File Locations
```
Backend env:     /home/ezycv/ezycv-website/backend/.env
Frontend env:    /home/ezycv/ezycv-website/frontend/.env
Frontend build:  /home/ezycv/ezycv-website/frontend/build/
Nginx config:    /etc/nginx/sites-available/ezycv
Nginx logs:      /var/log/nginx/
PM2 logs:        /home/ezycv/.pm2/logs/
SSL certs:       /etc/letsencrypt/live/yourdomain.com/
```

## Performance Tips
```bash
# Enable PM2 monitoring
pm2 install pm2-logrotate

# Optimize Nginx
sudo nano /etc/nginx/nginx.conf
# Increase worker_processes to match CPU cores

# Monitor memory
free -h
pm2 monit
```

## Backup Important Files
```bash
# Backup .env files
cp /home/ezycv/ezycv-website/backend/.env ~/backend-env-backup.txt
cp /home/ezycv/ezycv-website/frontend/.env ~/frontend-env-backup.txt

# Backup Nginx config
sudo cp /etc/nginx/sites-available/ezycv ~/nginx-ezycv-backup.conf
```

## VS Code Remote SSH
```
Host ezycv-droplet
    HostName your-droplet-ip
    User ezycv
    Port 22
```

Connect: `F1` → `Remote-SSH: Connect to Host` → `ezycv-droplet`

---

## URLs
- **Website**: https://your-domain.com
- **API**: https://your-domain.com/api
- **MongoDB**: MongoDB Atlas Dashboard

## Support
- Email: ezycv22@gmail.com
- Location: Rambukkana, Sri Lanka

---

**🎉 Happy Deploying!**
