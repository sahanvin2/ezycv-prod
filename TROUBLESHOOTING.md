# 🔧 Deployment Troubleshooting Guide

Common issues and solutions when deploying Ezy CV to DigitalOcean.

---

## 🚨 Backend Issues

### Issue: Backend Won't Start

**Symptoms**: PM2 shows "errored" or "stopped" status

**Diagnosis**:
```bash
pm2 logs ezycv-backend --lines 50
```

**Common Causes & Solutions**:

#### 1. Port Already in Use
```bash
# Check what's using port 5000
sudo lsof -i :5000

# Kill the process (replace PID with actual process ID)
sudo kill -9 PID

# Or change port in .env
nano /home/ezycv/ezycv-website/backend/.env
# Change PORT=5000 to PORT=5001
pm2 restart ezycv-backend
```

#### 2. MongoDB Connection Failed
```bash
# Check connection string
cd /home/ezycv/ezycv-website/backend
cat .env | grep MONGODB_URI

# Test connection
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(err => console.log('❌ Error:', err.message))"
```

**Solutions**:
- Verify MongoDB Atlas connection string is correct
- Check MongoDB Atlas IP whitelist includes your droplet IP or 0.0.0.0/0
- Verify database username and password
- Check if password has special characters (URL encode them)
- Ensure network access is configured in MongoDB Atlas

#### 3. Missing Dependencies
```bash
cd /home/ezycv/ezycv-website/backend
npm install
pm2 restart ezycv-backend
```

#### 4. Environment Variables Missing
```bash
# Check if .env exists
ls -la /home/ezycv/ezycv-website/backend/.env

# If missing, create it
nano /home/ezycv/ezycv-website/backend/.env
```

---

## 🚨 Frontend Issues

### Issue: Frontend Shows Blank Page

**Symptoms**: Website loads but shows nothing or white screen

**Diagnosis**:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

**Common Causes & Solutions**:

#### 1. Build Not Created/Updated
```bash
cd /home/ezycv/ezycv-website/frontend
npm run build
sudo systemctl reload nginx
```

#### 2. Wrong API URL in .env
```bash
# Check frontend .env
cat /home/ezycv/ezycv-website/frontend/.env

# Should be:
REACT_APP_API_URL=http://your-ip-address/api
# or
REACT_APP_API_URL=https://your-domain.com/api
```

**Fix and rebuild**:
```bash
nano /home/ezycv/ezycv-website/frontend/.env
npm run build
```

#### 3. React Router Not Working (404 on refresh)
**Solution**: Already configured in Nginx with `try_files $uri /index.html`

If still issues:
```bash
sudo nano /etc/nginx/sites-available/ezycv
# Ensure this is present in location /:
#   try_files $uri $uri/ /index.html;

sudo nginx -t
sudo systemctl reload nginx
```

---

## 🚨 Nginx Issues

### Issue: Nginx Won't Start

**Diagnosis**:
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

**Common Causes & Solutions**:

#### 1. Configuration Syntax Error
```bash
sudo nginx -t
# Will show exact line with error

# Edit and fix
sudo nano /etc/nginx/sites-available/ezycv

# Test again
sudo nginx -t

# Restart
sudo systemctl restart nginx
```

#### 2. Port 80/443 Already in Use
```bash
# Check what's using port 80
sudo lsof -i :80

# Usually Apache or another web server
sudo systemctl stop apache2
sudo systemctl disable apache2

# Start Nginx
sudo systemctl start nginx
```

#### 3. Permission Denied
```bash
# Check frontend build folder permissions
ls -la /home/ezycv/ezycv-website/frontend/build/

# Fix permissions if needed
sudo chmod -R 755 /home/ezycv/ezycv-website/frontend/build/
sudo chown -R ezycv:ezycv /home/ezycv/ezycv-website/

sudo systemctl restart nginx
```

### Issue: 502 Bad Gateway

**Symptoms**: Nginx shows "502 Bad Gateway" error

**Cause**: Backend is not running or not accessible

**Solution**:
```bash
# Check if backend is running
pm2 status

# If not running, start it
pm2 start /home/ezycv/ezycv-website/backend/server.js --name ezycv-backend

# Check backend logs
pm2 logs ezycv-backend

# Verify backend is listening on correct port
sudo netstat -tlnp | grep node
```

### Issue: Static Files Not Loading (CSS, JS, Images)

**Diagnosis**:
- Open browser DevTools → Network tab
- Look for 404 errors on static files

**Solution**:
```bash
# Check Nginx config for correct root path
sudo nano /etc/nginx/sites-available/ezycv

# Should be:
root /home/ezycv/ezycv-website/frontend/build;

# Rebuild frontend just in case
cd /home/ezycv/ezycv-website/frontend
npm run build

sudo systemctl reload nginx
```

---

## 🚨 Database Issues

### Issue: MongoDB Connection Timeout

**Symptoms**: Backend logs show "MongoNetworkError" or "connection timeout"

**Solutions**:

#### 1. Check Network Access in MongoDB Atlas
1. Go to MongoDB Atlas → Network Access
2. Ensure your droplet IP is whitelisted OR
3. Whitelist `0.0.0.0/0` (allow from anywhere)
4. Wait 1-2 minutes for changes to apply

#### 2. Check Connection String
```bash
# Test connection from droplet
cd /home/ezycv/ezycv-website/backend
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {console.log('✅ Connected'); process.exit(0)}).catch(err => {console.log('❌ Error:', err.message); process.exit(1)})"
```

#### 3. Special Characters in Password
If your MongoDB password has special characters:
- URL encode them: `#` → `%23`, `@` → `%40`, etc.
- Or regenerate password without special characters

---

## 🚨 SSL Certificate Issues

### Issue: SSL Certificate Not Working

**Diagnosis**:
```bash
sudo certbot certificates
```

**Common Causes & Solutions**:

#### 1. Domain Not Pointing to Droplet
```bash
# Check DNS resolution
nslookup your-domain.com

# Should return your droplet IP
```

**Solution**: Wait for DNS propagation (5-30 minutes)

#### 2. Certificate Expired
```bash
# Renew certificate
sudo certbot renew

# Force renewal if needed
sudo certbot renew --force-renewal

# Reload Nginx
sudo systemctl reload nginx
```

#### 3. Certificate Installed but HTTPS Not Working
```bash
# Check Nginx is listening on 443
sudo netstat -tlnp | grep :443

# Check SSL configuration
sudo nano /etc/nginx/sites-available/ezycv

# Should have:
listen 443 ssl;
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

---

## 🚨 Authentication Issues

### Issue: Google Login Not Working

**Symptoms**: "Unauthorized domain" error or popup doesn't open

**Solutions**:

#### 1. Add Authorized Domain in Firebase
1. Go to Firebase Console → Authentication → Settings
2. Click "Authorized domains"
3. Add your production domain: `your-domain.com`
4. Wait 5 minutes for changes to propagate

#### 2. Check Frontend Environment Variables
```bash
cd /home/ezycv/ezycv-website/frontend
cat .env | grep FIREBASE

# All Firebase variables should be present
```

#### 3. CORS Issues
```bash
# Check backend CORS configuration
cd /home/ezycv/ezycv-website/backend
nano server.js

# Ensure CORS allows your domain:
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### Issue: JWT Token Errors

**Symptoms**: "Invalid token" or "Token expired" errors

**Solutions**:

#### 1. Check JWT Secret
```bash
cd /home/ezycv/ezycv-website/backend
cat .env | grep JWT_SECRET

# Should be a long random string (32+ characters)
```

#### 2. Regenerate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy output and update .env
nano .env
# Update JWT_SECRET=...

pm2 restart ezycv-backend
```

---

## 🚨 Email Issues

### Issue: Emails Not Being Sent

**Symptoms**: Welcome emails or contact forms not arriving

**Diagnosis**:
```bash
pm2 logs ezycv-backend | grep -i email
```

**Common Causes & Solutions**:

#### 1. Wrong Brevo Credentials
```bash
cd /home/ezycv/ezycv-website/backend
cat .env | grep MAIL

# Verify:
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your_smtp_username
MAIL_PASSWORD=your_smtp_password
```

#### 2. Brevo Account Issues
- Check Brevo account is active
- Verify sender email is verified in Brevo
- Check sending limits haven't been exceeded

#### 3. Test Email Connection
```bash
cd /home/ezycv/ezycv-website/backend
node -e "
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});
transporter.verify().then(() => console.log('✅ Email service ready')).catch(err => console.log('❌ Error:', err.message));
"
```

---

## 🚨 PM2 Issues

### Issue: PM2 Process Keeps Crashing

**Diagnosis**:
```bash
pm2 logs ezycv-backend --lines 100
pm2 describe ezycv-backend
```

**Common Causes & Solutions**:

#### 1. Too Many Restarts
```bash
# Delete and recreate process
pm2 delete ezycv-backend
cd /home/ezycv/ezycv-website/backend
pm2 start server.js --name ezycv-backend
pm2 save
```

#### 2. Out of Memory
```bash
# Check memory usage
free -h
pm2 monit

# Increase memory limit
pm2 delete ezycv-backend
pm2 start server.js --name ezycv-backend --max-memory-restart 500M
pm2 save
```

#### 3. Process Not Starting on Boot
```bash
# Setup PM2 startup script
pm2 startup
# Copy and run the command it outputs

pm2 save
```

---

## 🚨 Performance Issues

### Issue: Website Loading Slowly

**Diagnosis**:
1. Open browser DevTools → Network tab
2. Check loading times
3. Use GTmetrix or PageSpeed Insights

**Solutions**:

#### 1. Enable Gzip in Nginx
Already configured in the provided Nginx config. Verify:
```bash
sudo nano /etc/nginx/sites-available/ezycv

# Should have gzip settings
```

#### 2. Optimize Images
- Use WebP format for images
- Compress images before uploading
- Use CDN for static assets (optional)

#### 3. Database Query Optimization
- Add indexes to frequently queried fields
- Use pagination for large datasets
- Cache frequently accessed data

#### 4. Enable Browser Caching
Already configured in Nginx for static assets.

#### 5. Upgrade Droplet
If consistently seeing high CPU/memory:
```bash
# Check resource usage
htop  # or top

# Consider upgrading to $12/month plan (2GB RAM)
```

---

## 🚨 Git Issues

### Issue: Git Pull Fails

**Symptoms**: "Permission denied" or "Authentication failed"

**Solutions**:

#### 1. Private Repository - Use Personal Access Token
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/ezycv-website.git
```

#### 2. SSH Key Authentication
```bash
# Generate SSH key on droplet
ssh-keygen -t ed25519 -C "ezycv22@gmail.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH Keys → New SSH key

# Update remote URL
git remote set-url origin git@github.com:YOUR_USERNAME/ezycv-website.git
```

#### 3. Merge Conflicts
```bash
# Stash local changes
git stash

# Pull
git pull origin main

# Apply stashed changes
git stash pop

# Resolve conflicts manually
```

---

## 🚨 Firewall Issues

### Issue: Can't Access Website

**Diagnosis**:
```bash
sudo ufw status
```

**Solution**:
```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

---

## 🆘 Emergency Commands

### Complete Service Restart
```bash
# Restart everything
pm2 restart all
sudo systemctl restart nginx
```

### View All Logs
```bash
# Backend logs
pm2 logs ezycv-backend

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# System logs
sudo journalctl -xe
```

### Clean Rebuild
```bash
cd /home/ezycv/ezycv-website

# Pull latest
git pull origin main

# Backend
cd backend
rm -rf node_modules
npm install
pm2 restart ezycv-backend

# Frontend
cd ../frontend
rm -rf node_modules build
npm install
npm run build

sudo systemctl reload nginx
```

---

## 📞 Still Having Issues?

### Diagnostic Information to Collect:

```bash
# System info
uname -a
df -h
free -h

# Service status
pm2 status
sudo systemctl status nginx
sudo systemctl status mongodb || echo "MongoDB not running locally"

# Network info
curl -I localhost:5000/api
curl -I http://your-domain.com

# Process info
ps aux | grep node
sudo netstat -tlnp

# Logs
pm2 logs ezycv-backend --lines 50 --nostream
sudo tail -50 /var/log/nginx/error.log
```

**Send diagnostic info to**: ezycv22@gmail.com

---

## 📚 Additional Resources

- [DigitalOcean Deployment Guide](./DIGITALOCEAN_DEPLOYMENT.md)
- [Quick Reference Card](./QUICK_REFERENCE.md)
- [Pre-Deployment Checklist](./PRE_DEPLOYMENT_CHECKLIST.md)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

**Remember**: Most issues can be resolved by checking logs first!

```bash
pm2 logs ezycv-backend --lines 100
```

**Made with ❤️ in Rambukkana, Sri Lanka**
