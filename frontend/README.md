# CV Maker Pro 🚀

A professional, full-featured CV Builder and Creative Suite built with the MERN stack. Create stunning resumes, presentations, and access thousands of wallpapers and stock photos.

![CV Maker Pro](public/og-image.png)

## ✨ Features

### 📄 CV Builder
- **10 Professional Templates** - Modern, Elegant, Creative, Professional, Minimalist, Bold, Academic, Tech, Compact, Classic
- **Real-time Preview** - See changes instantly as you type
- **Export to PDF** - Download your CV in high-quality PDF format
- **Customizable Colors** - Personalize your CV with your brand colors
- **Photo Upload** - Add your professional photo
- **Multiple Sections** - Personal info, Summary, Experience, Education, Skills, Languages, Certifications, Projects

### 🎨 Presentation Maker
- **8 Beautiful Templates** - Professional, Modern, Creative, Minimalist, Bold, Gradient, Dark, Light
- **Drag & Drop Interface** - Intuitive slide creation
- **Rich Elements** - Text, Images, Shapes (10 types), Backgrounds
- **Color Palette System** - 6 categories with 60+ colors
- **Resize & Edit** - Mouse-based resize handles on all elements
- **Export Options** - Save as JSON or export slides as PNG images
- **Slide Management** - Add, delete, duplicate slides

### 🖼️ Wallpapers & Stock Photos
- **4K & HD Quality** - High-resolution images
- **Multiple Categories** - Nature, Abstract, Technology, Space, Animals, Architecture
- **Direct Downloads** - One-click download without redirects
- **Search Functionality** - Find exactly what you need
- **Curated Collections** - Hand-picked quality content

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **html2canvas** - Canvas-based screenshot
- **jsPDF** - PDF generation
- **React Hot Toast** - Beautiful notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cv-maker-pro.git
cd cv-maker-pro
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

4. **Environment Variables**

Create `.env` in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cvmaker
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Create `.env` in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GA_ID=G-XXXXXXXXXX
```

5. **Start Development Servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`

## 🚀 Production Deployment

### Build for Production

```bash
cd frontend
npm run build
```

The optimized build will be in the `frontend/build` directory.

### Deploy Options

#### Option 1: Netlify (Frontend)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod
```

#### Option 2: Heroku (Full Stack)
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Add MongoDB Atlas
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main
```

#### Option 3: Vercel (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Option 4: AWS / Digital Ocean / VPS
1. Set up MongoDB (MongoDB Atlas recommended)
2. Deploy backend on server with PM2
3. Build frontend and serve with Nginx
4. Configure SSL with Let's Encrypt

### Production Checklist

- [ ] Update `package.json` with proper name and version
- [ ] Set environment variables for production
- [ ] Configure MongoDB connection string
- [ ] Add Google Analytics tracking ID
- [ ] Update API endpoints in frontend
- [ ] Enable HTTPS/SSL
- [ ] Set up CDN for static assets
- [ ] Configure CORS properly
- [ ] Add rate limiting to API
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Create database backups
- [ ] Add 404 and error pages
- [ ] Test on multiple devices and browsers

## 📁 Project Structure

```
cv-maker-pro/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── favicon-*.png (multiple sizes)
│   │   ├── og-image.png
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   └── .htaccess
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── CVPreview.js
│   │   │   ├── ErrorBoundary.js
│   │   │   └── LoadingScreen.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── CVBuilder.js
│   │   │   ├── PresentationMaker.js
│   │   │   ├── Wallpapers.js
│   │   │   └── StockPhotos.js
│   │   ├── utils/
│   │   │   ├── analytics.js
│   │   │   └── performance.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   └── package.json
└── README.md
```

## 🎨 Features Breakdown

### CV Builder
- **Template Selection** - Choose from 10 professionally designed templates
- **Personal Information** - Name, title, contact details, photo
- **Professional Summary** - Brief overview of your experience
- **Work Experience** - Company, position, dates, achievements
- **Education** - Degree, institution, dates
- **Skills** - Technical and soft skills with proficiency levels
- **Languages** - Multiple languages with proficiency
- **Certifications** - Professional certifications
- **Projects** - Portfolio projects with descriptions

### Presentation Maker
- **Template System** - 8 pre-designed templates with color variants
- **Element Types**:
  - Text boxes with rich formatting
  - Images with upload support
  - Shapes: Rectangle, Circle, Triangle, Diamond, Star, Hexagon, Arrows, Line
  - Background images and colors
- **Editing Tools**:
  - Drag and drop positioning
  - 8-point resize handles
  - Color palette (60+ colors in 6 categories)
  - Font customization
  - Z-index management
  - Element deletion
- **Export**:
  - Save project as JSON
  - Export slides as PNG images
  - Load saved projects

### Wallpapers
- **Categories**: Nature, Abstract, Technology, Space, Animals, Architecture, Minimal, Urban
- **Resolutions**: 4K (3840×2160), FHD (1920×1080), HD (1280×720)
- **Search**: Filter by keyword
- **Preview**: Full-size image preview
- **Download**: Direct download with resolution in filename

### Stock Photos
- **Categories**: Business, Technology, Nature, People, Food, Travel, Fashion, Sports
- **Quality**: High-resolution photos
- **Attribution**: Photographer credits
- **Direct Download**: One-click download
- **Search**: Find specific images

## 🔧 Configuration

### Customization

**Update Branding**:
- Edit `public/manifest.json` - App name, description
- Replace `public/favicon.svg` - Your logo
- Update `public/og-image.png` - Social sharing image
- Modify colors in `tailwind.config.js`

**Add Features**:
- New CV templates in `components/CVPreview.js`
- Additional presentation templates in `pages/PresentationMaker.js`
- More shapes/elements in presentation editor

**API Integration**:
- Connect to real image APIs (Unsplash, Pexels)
- Add authentication with JWT
- Implement cloud storage (AWS S3, Cloudinary)

## 🔐 Security

- Input sanitization
- XSS protection
- CSRF tokens
- Rate limiting
- Secure headers
- Environment variables for secrets
- HTTPS only in production

## ⚡ Performance

- Code splitting with React.lazy
- Image optimization
- Lazy loading
- Service worker for PWA
- Gzip compression
- Browser caching
- CDN for assets

## 🧪 Testing

```bash
# Run tests
npm test

# Test coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- Website: [yourwebsite.com](https://yourwebsite.com)
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Icons by [Heroicons](https://heroicons.com/)
- Images from [Unsplash](https://unsplash.com/) and [Pexels](https://pexels.com/)
- Inspired by modern CV builders and presentation tools

## 📞 Support

For support, email support@ezycv.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] User authentication and saved projects
- [ ] Cloud storage integration
- [ ] Real-time collaboration
- [ ] AI-powered content suggestions
- [ ] More export formats (DOCX, PPTX)
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations
- [ ] Premium templates marketplace
- [ ] Multi-language support
- [ ] Dark mode throughout app

---

Made with ❤️ by Your Team
