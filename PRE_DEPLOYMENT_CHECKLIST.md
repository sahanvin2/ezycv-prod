# 📋 Pre-Deployment Checklist for Ezy CV

Use this checklist before deploying to DigitalOcean to ensure everything is ready.

---

## ✅ Code Preparation

- [ ] All features tested locally
- [ ] No console.log statements in production code
- [ ] All UI/UX testing completed
- [ ] Mobile responsiveness verified
- [ ] All error boundaries working
- [ ] Loading states implemented everywhere
- [ ] Toast notifications working correctly

---

## ✅ Environment Configuration

### Backend .env
- [ ] `MONGODB_URI` - MongoDB Atlas connection string ready
- [ ] `JWT_SECRET` - Strong secret generated (32+ characters)
- [ ] `NODE_ENV` set to `production`
- [ ] `PORT` set to correct port (5000)
- [ ] Email service credentials verified:
  - [ ] `MAIL_HOST` - smtp-relay.brevo.com
  - [ ] `MAIL_USERNAME` - Your Brevo username
  - [ ] `MAIL_PASSWORD` - Your Brevo password
  - [ ] `MAIL_FROM_NAME` - EzyCV
  - [ ] `MAIL_FROM_ADDRESS` - no-reply@ezycv.com
- [ ] Backblaze B2 credentials:
  - [ ] `B2_ENDPOINT`
  - [ ] `B2_ACCESS_KEY_ID`
  - [ ] `B2_SECRET_ACCESS_KEY`
  - [ ] `B2_BUCKET`
  - [ ] `B2_PUBLIC_BASE`
- [ ] Firebase Admin SDK configured:
  - [ ] `FIREBASE_PROJECT_ID`

### Frontend .env
- [ ] `REACT_APP_API_URL` pointing to production backend
- [ ] Firebase client configuration:
  - [ ] `REACT_APP_FIREBASE_API_KEY`
  - [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN`
  - [ ] `REACT_APP_FIREBASE_PROJECT_ID`
  - [ ] `REACT_APP_FIREBASE_STORAGE_BUCKET`
  - [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `REACT_APP_FIREBASE_APP_ID`

---

## ✅ Security

- [ ] Strong JWT secret generated (not default)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Database user with strong password created
- [ ] No sensitive data in code (all in .env)
- [ ] .gitignore includes all sensitive files
- [ ] Firebase rules configured properly
- [ ] CORS configured for specific domain (not *)
- [ ] Rate limiting implemented on sensitive endpoints

---

## ✅ Database

- [ ] MongoDB Atlas account created
- [ ] Cluster created (M0 free tier or paid)
- [ ] Database user created with password
- [ ] IP whitelist configured
- [ ] Connection string tested locally
- [ ] Database name decided (e.g., `ezycv`)

---

## ✅ Email Service (Brevo)

- [ ] Brevo account created at sendinblue.com
- [ ] Sender email verified (ezycv22@gmail.com or domain email)
- [ ] SMTP credentials obtained
- [ ] Test email sent successfully
- [ ] Welcome email template tested
- [ ] Contact form email tested
- [ ] Newsletter subscription email tested

---

## ✅ Storage (Backblaze B2)

- [ ] B2 account created
- [ ] Bucket created and configured
- [ ] Access keys generated
- [ ] Public URL tested
- [ ] Files accessible via public URL

---

## ✅ Firebase

- [ ] Firebase project created (ezycv-84859)
- [ ] Authentication enabled (Google, Facebook)
- [ ] Authorized domains added (your domain)
- [ ] Firebase Admin SDK configured
- [ ] Test authentication working

---

## ✅ Domain & DNS (if using custom domain)

- [ ] Domain purchased
- [ ] DNS A records configured pointing to droplet IP
- [ ] DNS propagation verified (can take 5-30 minutes)
- [ ] www subdomain configured
- [ ] Domain accessible in browser

---

## ✅ Git & GitHub

- [ ] GitHub repository created
- [ ] .gitignore configured properly
- [ ] All .env files excluded from git
- [ ] Initial commit pushed to main branch
- [ ] Repository access verified
- [ ] Personal access token created (for private repos)

---

## ✅ DigitalOcean Droplet

- [ ] Droplet created with Ubuntu 22.04 LTS
- [ ] Minimum: 1GB RAM, 1 vCPU ($6/month)
- [ ] SSH access configured
- [ ] Droplet IP address noted
- [ ] Root password set (if using password auth)
- [ ] SSH key added (if using key auth)

---

## ✅ Local Testing

- [ ] Backend runs without errors: `npm run dev`
- [ ] Frontend builds successfully: `npm run build`
- [ ] All API endpoints tested
- [ ] Authentication flow tested (email, Google, Facebook)
- [ ] CV builder creates and downloads PDFs
- [ ] Wallpapers download correctly
- [ ] Stock photos download correctly
- [ ] Contact form sends emails
- [ ] Newsletter subscription sends emails
- [ ] All navigation links working
- [ ] Footer links working
- [ ] Mobile responsive tested

---

## ✅ Build Verification

```bash
# Test backend syntax
cd backend
node -c server.js

# Test frontend build
cd frontend
npm run build
```

- [ ] Backend has no syntax errors
- [ ] Frontend builds without errors
- [ ] Build size reasonable (< 5MB)

---

## ✅ Documentation

- [ ] README.md updated with project info
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Deployment guide reviewed
- [ ] Quick reference card reviewed

---

## ✅ Backup Important Information

Create a secure document with:
- [ ] MongoDB Atlas connection string
- [ ] MongoDB username & password
- [ ] JWT secret
- [ ] Brevo SMTP credentials
- [ ] Backblaze B2 credentials
- [ ] Firebase credentials
- [ ] DigitalOcean droplet IP & password
- [ ] GitHub repository URL & access token
- [ ] Domain registrar login (if applicable)

**Store this in a password manager (LastPass, 1Password, Bitwarden)**

---

## ✅ SSL Certificate (After Domain Setup)

- [ ] Domain configured and propagated
- [ ] Certbot installed on droplet
- [ ] SSL certificate obtained
- [ ] Auto-renewal configured
- [ ] HTTPS working in browser
- [ ] HTTP redirects to HTTPS

---

## ✅ Post-Deployment Verification

After deployment, verify:
- [ ] Website accessible via domain/IP
- [ ] Backend API responding
- [ ] Database connections working
- [ ] User registration works
- [ ] User login works (email)
- [ ] Google login works
- [ ] Facebook login works
- [ ] CV builder creates CVs
- [ ] PDF download works
- [ ] Wallpapers load and download
- [ ] Stock photos load and download
- [ ] Contact form sends email
- [ ] Newsletter subscription works
- [ ] Welcome emails received
- [ ] All pages load correctly
- [ ] Mobile version works
- [ ] No console errors in browser
- [ ] All images loading
- [ ] Footer displays correctly

---

## ✅ Monitoring & Maintenance

- [ ] PM2 auto-restart configured
- [ ] PM2 startup script enabled
- [ ] Nginx configured correctly
- [ ] Firewall (UFW) configured
- [ ] Regular backup plan established
- [ ] Monitoring tool setup (optional):
  - [ ] UptimeRobot for uptime monitoring
  - [ ] Google Analytics for traffic
  - [ ] LogRocket for error tracking (optional)

---

## ✅ Final Steps

- [ ] Review full deployment guide: [DIGITALOCEAN_DEPLOYMENT.md](./DIGITALOCEAN_DEPLOYMENT.md)
- [ ] Have Quick Reference card handy: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- [ ] Deploy helper script ready: `deploy-helper.sh`
- [ ] VS Code Remote SSH configured (optional)
- [ ] Team members notified (if applicable)
- [ ] Social media accounts ready to announce (optional)

---

## 🚀 Ready to Deploy!

If all boxes are checked, you're ready to follow the [DigitalOcean Deployment Guide](./DIGITALOCEAN_DEPLOYMENT.md)!

**Good luck! 🎉**

---

## 📞 Support Contacts

- **Email**: ezycv22@gmail.com
- **Location**: Rambukkana, Sri Lanka
- **GitHub**: Your repository issues page

---

## 🆘 Emergency Rollback Plan

If deployment fails:

1. **Access droplet via SSH**
2. **Check logs**: `pm2 logs ezycv-backend`
3. **Check Nginx**: `sudo systemctl status nginx`
4. **Revert code**: `git checkout previous-commit-hash`
5. **Rebuild**: `cd frontend && npm run build`
6. **Restart**: `pm2 restart ezycv-backend`

**Important**: Keep your local code as backup until deployment is verified!

---

**Last Updated**: February 12, 2026
**Made with ❤️ in Rambukkana, Sri Lanka**
