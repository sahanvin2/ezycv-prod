# Ezy CV - MERN Stack Website

A comprehensive MERN stack website featuring a **CV Builder** (main feature), **Wallpapers Gallery**, and **Stock Photos** with strategic ad integration.

## Features

### 🎯 CV Builder (Main Feature)
- Multi-step form (6 steps): Personal Info, Summary, Experience, Education, Skills, Finalize
- **6 Professional Templates**: Modern, Classic, Creative, Minimal, Professional, Elegant
- Live CV preview while editing
- PDF export functionality
- Save CVs to your account

### 🖼️ Wallpapers
- Browse PC and Mobile wallpapers
- Filter by category and device type
- Modal preview with download
- Multiple resolution options

### 📷 Stock Photos
- Search functionality
- Filter by categories
- Free download with license info
- High-quality images

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected dashboard

### 📊 Ad Integration
- Native banner ads
- Large banner ads (728x90)
- Medium banner ads (468x60)
- Pop-under ads
- Interstitial ads before downloads

---

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React 18** with React Router 6
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **html2canvas + jspdf** for PDF generation
- **React Hot Toast** for notifications

---

## Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account

### 1. Clone and Setup

```bash
cd d:\MERN\CV
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (already created with defaults):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cv-builder
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

---

## Project Structure

```
CV/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── CV.js
│   │   ├── Wallpaper.js
│   │   └── Photo.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cv.js
│   │   ├── wallpapers.js
│   │   └── photos.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── manifest.json
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   ├── CVPreview.js
        │   └── Ads/
        │       └── AdComponents.js
        ├── pages/
        │   ├── Home.js
        │   ├── CVBuilder.js
        │   ├── CVTemplates.js
        │   ├── Wallpapers.js
        │   ├── StockPhotos.js
        │   ├── Dashboard.js
        │   ├── Login.js
        │   └── Register.js
        ├── store/
        │   └── store.js
        ├── services/
        │   └── api.js
        ├── App.js
        ├── index.js
        └── index.css
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### CVs
- `GET /api/cv` - Get user's CVs
- `POST /api/cv` - Create new CV
- `PUT /api/cv/:id` - Update CV
- `DELETE /api/cv/:id` - Delete CV
- `GET /api/cv/templates` - Get available templates

### Wallpapers
- `GET /api/wallpapers` - Get wallpapers (with filters)
- `POST /api/wallpapers/:id/download` - Track download
- `POST /api/wallpapers/seed` - Seed sample data

### Photos
- `GET /api/photos` - Get photos (with filters)
- `GET /api/photos/search?q=query` - Search photos
- `POST /api/photos/:id/download` - Track download
- `POST /api/photos/seed` - Seed sample data

---

## Ad Placements

Ads are strategically placed for optimal visibility without disrupting user experience:

| Location | Ad Type | Purpose |
|----------|---------|---------|
| Page load | Pop-under | Initial engagement |
| After hero sections | Large Banner | High visibility |
| Mid-content | Native Banner | Contextual |
| Sidebar | Native Banner | Persistent visibility |
| Before downloads | Interstitial | Monetization gate |
| Footer | Medium Banner | Exit engagement |

---

## CV Templates

1. **Modern** - Clean, contemporary design with accent colors
2. **Classic** - Traditional, professional layout
3. **Creative** - Bold colors and unique sections
4. **Minimal** - Simple, whitespace-focused
5. **Professional** - Corporate-friendly design
6. **Elegant** - Sophisticated with refined typography

---

## Development

### Running in Development Mode

Backend (with nodemon):
```bash
cd backend
npm run dev
```

Frontend (with hot reload):
```bash
cd frontend
npm start
```

### Building for Production

```bash
cd frontend
npm run build
```

---

## 🚀 Deployment

### Quick Deploy Options

#### 1. DigitalOcean Droplet (Recommended)
Complete step-by-step guide with MongoDB Atlas, PM2, Nginx, SSL, and VS Code remote development.

👉 **[Full DigitalOcean Deployment Guide](./DIGITALOCEAN_DEPLOYMENT.md)**

#### 2. Other Platforms
- **Netlify + Heroku**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **AWS**: See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)

#### Quick Reference
- **[Quick Deployment Commands](./QUICK_REFERENCE.md)** - Essential commands and troubleshooting
- **Deploy Helper Script**: `./deploy-helper.sh` (run on server after git pull)
- **PM2 Ecosystem**: `ecosystem.config.js` for advanced deployments

---

## Environment Variables

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/cv-builder |
| JWT_SECRET | Secret for JWT signing | (set a strong secret) |
| NODE_ENV | Environment | development |

---

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Made with ❤️ using MERN Stack
