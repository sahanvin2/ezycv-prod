# Maintenance Mode Setup Guide

## Overview
The Ezy CV site now has a beautiful maintenance page that you can enable when performing updates or maintenance work.

## How to Enable Maintenance Mode

### Method 1: Using .env file (Recommended)
1. Open `frontend/.env` file
2. Change `REACT_APP_MAINTENANCE_MODE=false` to `REACT_APP_MAINTENANCE_MODE=true`
3. Save the file
4. Restart your React development server (Ctrl+C then `npm start`)

### Method 2: Direct code modification (Quick Test)
1. Open `frontend/src/App.js`
2. Find the line: `const isMaintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === 'true';`
3. Change it to: `const isMaintenanceMode = true;`
4. Save the file (React will hot-reload automatically)

## How to Disable Maintenance Mode

### Method 1: Using .env file
1. Open `frontend/.env` file
2. Change `REACT_APP_MAINTENANCE_MODE=true` to `REACT_APP_MAINTENANCE_MODE=false`
3. Save the file
4. Restart your React development server

### Method 2: Direct code modification
1. Open `frontend/src/App.js`
2. Find the line: `const isMaintenanceMode = true;`
3. Change it back to: `const isMaintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === 'true';`
4. Save the file

## Customizing the Maintenance Page

The maintenance page is located at `frontend/src/pages/Maintenance.js`

### Changing the Return Time
Find this line in the component:
```javascript
returnTime.setHours(returnTime.getHours() + 2); // 2 hours from now
```
Change `+ 2` to any number of hours you expect the maintenance to last.

### Changing the Features List
Find the "What we're working on:" section and modify the list items:
```javascript
<span className="text-white/90">Your feature here</span>
```

### Changing Colors/Design
The page uses Tailwind CSS classes. You can modify:
- Background gradient: `from-blue-600 via-purple-600 to-pink-500`
- Card colors: `bg-white/10`
- Border colors: `border-white/20`

### Changing Contact Email
Find this line:
```javascript
<a href="mailto:support@ezycv.com" className="text-white font-semibold hover:underline">
  support@ezycv.com
</a>
```
Replace `support@ezycv.com` with your preferred contact email.

### Changing Social Media Links
Find the social links section and update the URLs:
```javascript
<a href="https://x.com" target="_blank" rel="noopener noreferrer">
```

## Features of the Maintenance Page

✅ Beautiful animated gradient background
✅ Live countdown timer showing estimated return time
✅ Rotating gear icon animation
✅ List of features being worked on
✅ Social media links (X, LinkedIn, GitHub)
✅ Contact email for urgent matters
✅ Fully responsive design
✅ Smooth animations using Framer Motion
✅ Glassmorphism design style

## Production Deployment

When deploying to production with maintenance mode:

1. Build with maintenance mode enabled:
   ```bash
   cd frontend
   REACT_APP_MAINTENANCE_MODE=true npm run build
   ```

2. Or set the environment variable in your hosting platform:
   - Vercel: Add `REACT_APP_MAINTENANCE_MODE=true` in Environment Variables
   - Netlify: Add to Site Settings > Build & Deploy > Environment
   - Custom Server: Set in your `.env` file before building

## Testing

To test the maintenance page:
1. Enable maintenance mode using Method 1 or 2 above
2. Visit any route on your site
3. You should see the maintenance page instead of normal content
4. Disable maintenance mode to return to normal operation

## Notes

- When maintenance mode is active, ALL routes will show the maintenance page
- Users will not be able to access any part of the site
- The maintenance page is a standalone component with no navigation
- The countdown timer starts from when the page loads
- Remember to disable maintenance mode when work is complete!

## Troubleshooting

**Issue:** Maintenance page not showing after enabling
**Solution:** Make sure you restarted the development server after changing .env

**Issue:** Changes to countdown time not reflecting
**Solution:** Clear browser cache and hard reload (Ctrl+Shift+R)

**Issue:** Maintenance page showing in production when it shouldn't
**Solution:** Check your hosting platform's environment variables and ensure REACT_APP_MAINTENANCE_MODE is set to false or removed

---

Created for Ezy CV
Last Updated: 2024
